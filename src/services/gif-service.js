import { EventEmitter } from 'events';

const fs = require('fs');
// eslint-disable-next-line no-sync
const gifJsWorker = fs.readFileSync('./src/vendor/gif.worker.js', 'utf8');
const gifJsWorkerBlob = new Blob([gifJsWorker], {
  type: 'application/javascript'
});

// Seek through <video> frames asynchronously
function asyncSeek (video, time, callback) {
  function doneSeeking () {
    video.removeEventListener('seeked', doneSeeking);
    return setTimeout(() => {
      if (callback) {
        return callback();
      }
    }, 10);
  }
  video.addEventListener('seeked', doneSeeking);
  video.currentTime = time;
}

class GifService extends EventEmitter {
  constructor () {
    super();

    this.gif = null;
    this.aborted = false;
    this.framesComplete = 0;

    const canvasElement = this.canvasElement = document.createElement('canvas');
    canvasElement.style.imageRendering = 'crisp-edges';
    this.context = this.canvasElement.getContext('2d');
  }

  createGif (config, videoElement) {
    // Clear abort token
    this.aborted = false;

    // Process config data
    const quality = 31 - (config.quality * 3);

    // Prepare canvas
    this.canvasElement.setAttribute('width', config.width);
    this.canvasElement.setAttribute('height', config.height);
    this.canvasElement.style.width = `${config.width}px`;
    this.canvasElement.style.height = `${config.height}px`;

    // Pause video to prevent crazy audio artifacts
    if (!videoElement.paused) {
      videoElement.pause();
    }

    // Initialize GIF maker
    this.gif = new window.GIF({
      workers: 4,
      quality,
      repeat: 0,
      width: config.width,
      height: config.height,
      dither: 'FalseFloydSteinberg-serpentine',
      workerScript: URL.createObjectURL(gifJsWorkerBlob)
    });

    this.gif.on('finished', (imageBlob) => {
      const imageAttributes = {
        blob: imageBlob,
        width: config.width,
        height: config.height
      };
      this.emit('complete', imageAttributes);
      this.gif = null;
    });

    this.gif.on('progress', (progressRatio) => {
      this.emit('progress', progressRatio);
    });

    // Run frames through GIF maker
    this.framesComplete = 0;
    asyncSeek(videoElement, (config.start / 1000), () => {
      this.addFrame(config, videoElement);
    });
  }

  addFrame (config, videoElement) {
    if (this.aborted) {
      return;
    }

    const currentTime = videoElement.currentTime * 1000;

    if (currentTime >= config.end) {
      this.emit('frames complete');
      // render the GIF
      this.gif.render();
      return;
    }

    const frameInterval = 1000 / config.fps;
    // To properly indicate progress we need a point of comparison locked to the frame rate
    const gifDuration = config.end - config.start;
    const trueGifDuration = (gifDuration - (gifDuration % frameInterval));

    // Draw current frame on canvas, then transfer that to gif.js
    this.context.drawImage(
      videoElement,
      0, 0, videoElement.videoWidth, videoElement.videoHeight,
      0, 0, config.width, config.height
    );
    this.gif.addFrame(this.canvasElement, {
      delay: frameInterval,
      dispose: 1,
      copy: true
    });
    const frameGatheringProgress = (currentTime - config.start) / trueGifDuration;
    this.framesComplete++;
    this.emit('frames progress', frameGatheringProgress, this.framesComplete);

    const nextFrameTime = currentTime + frameInterval;

    asyncSeek(videoElement, (nextFrameTime / 1000), () => {
      this.addFrame(config, videoElement);
    });
  }

  abort () {
    if (!this.gif) {
      return;
    }
    this.aborted = true;
    this.gif.abort();
    this.gif = null;
    this.emit('abort');
  }

  destroy () {

  }
}

export default GifService;
