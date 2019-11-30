import { inherits } from 'util';
import { EventEmitter } from 'events';

const fs = require('fs');
// eslint-disable-next-line no-sync
const gifJsWorker = fs.readFileSync('./src/vendor/gif.worker.js', 'utf8');
const gifJsWorkerBlob = new Blob([gifJsWorker], {
  type: 'application/javascript'
});

const GATHERING_FRAMES_STATUS = 'Gathering frames…';
const RENDERING_STATUS = 'Rendering GIF…';

// Return combined progress of frame gathering and GIF rendering as percent
function calculateProgress (frameGatheringProgress, renderingProgress) {
  return ((frameGatheringProgress * 0.7) + (renderingProgress * 0.3)) * 100;
}

// Seek through <video> frames asynchronously
function asyncSeek (video, time, callback) {
  function doneSeeking () {
    video.removeEventListener('seeked', doneSeeking);
    if (callback) {
      return callback();
    }
  }
  video.addEventListener('seeked', doneSeeking);
  video.currentTime = time;
}

function GifService () {
  EventEmitter.call(this);
  this._gif = null;
  this._aborted = false;
  const canvasElement = this._canvasElement = document.createElement('canvas');
  canvasElement.style.imageRendering = 'crisp-edges';
  this._canvasElementResized = document.createElement('canvas');
}

inherits(GifService, EventEmitter);

GifService.prototype.createGif = function (configuration, videoElement) {
  const gifService = this;
  const canvasElement = this._canvasElement;
  const canvasElementResized = this._canvasElementResized;
  const context = canvasElement.getContext('2d');
  const contextResized = canvasElementResized.getContext('2d');
  let frameGatheringProgress = 0;

  // Clear abort token
  this._aborted = false;

  // Process configuration data
  const framerate = configuration.framerate;
  const frameInterval = 1000 / framerate;
  const start = configuration.start;
  const end = configuration.end;
  const width = configuration.width;
  const height = configuration.height;
  const quality = 31 - (configuration.quality * 3);
  const gifDuration = configuration.end - configuration.start;
  // To properly indicate progress we need a point of comparison locked to the frame rate
  const trueGifDuration = (gifDuration - (gifDuration % frameInterval));

  // Prepare canvas
  const videoWidth = videoElement.getBoundingClientRect().width;
  const videoHeight = videoElement.getBoundingClientRect().height;
  canvasElement.setAttribute('width', videoWidth);
  canvasElement.setAttribute('height', videoHeight);
  canvasElement.style.width = `${width}px`;
  canvasElementResized.setAttribute('width', width);
  canvasElementResized.setAttribute('height', height);

  // Pause video to prevent crazy audio artifacts
  if (!videoElement.paused) {
    videoElement.pause();
  }

  // Initialize GIF maker
  const gif = this._gif = new window.GIF({
    workers: 8,
    quality,
    repeat: 0,
    width,
    height,
    workerScript: URL.createObjectURL(gifJsWorkerBlob)
  });

  gif.on('finished', function (imageBlob) {
    const imageAttributes = {
      blob: imageBlob,
      width,
      height
    };
    gifService.emit('complete', imageAttributes);
    gifService._gif = null;
  });

  gif.on('progress', function (progressRatio) {
    const overallProgress = calculateProgress(frameGatheringProgress, progressRatio);
    gifService.emit('progress', RENDERING_STATUS, overallProgress);
  });

  // Run frames through GIF maker
  asyncSeek(videoElement, (start / 1000), function () {
    function addFrame () {
      if (gifService._aborted) {
        return;
      }
      const currentTime = videoElement.currentTime * 1000;
      if (currentTime > end) {
        // render the GIF
        gif.render();
        return;
      }
      // Draw current frame on canvas, then transfer that to gif.js
      context.drawImage(videoElement, 0, 0, videoWidth, videoHeight);
      contextResized.drawImage(canvasElement, 0, 0, width, height);
      gif.addFrame(canvasElementResized, {
        delay: frameInterval,
        dispose: 1,
        copy: true
      });
      frameGatheringProgress = (currentTime - start) / trueGifDuration;
      const overallProgress = calculateProgress(frameGatheringProgress, 0);
      gifService.emit('progress', GATHERING_FRAMES_STATUS, overallProgress);
      const nextFrameTime = currentTime + (1000 / framerate);
      asyncSeek(videoElement, (nextFrameTime / 1000), addFrame);
    }
    addFrame();
  });
};

// Stop gathering frames / rendering GIF
GifService.prototype.abort = function () {
  if (!this._gif) {
    return;
  }
  this._aborted = true;
  this._gif.abort();
  this._gif = null;
  this.emit('abort');
};

GifService.prototype.destroy = function () {

};

export default GifService;
