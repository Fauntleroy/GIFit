const fs = require('fs');
const test = require('tape');

require('../../src/vendor/gif.js');

import GifService from '../../src/services/gif-service.js';

var gifConfiguration = {
  start: 0,
  end: 1,
  width: 320,
  height: 180,
  framerate: 10,
  quality: 5
};
var videoElement;

// Include a video source the really hard way.
test('Setup video', function (t) {
  const videoBase64 = fs.readFileSync(__dirname +'/../_fixtures/basara_eats_a_leaf.webm', 'base64');
  videoElement = document.createElement('video');
  videoElement.src = 'data:video/webm;base64,'+ videoBase64;
  videoElement.addEventListener('loadeddata', function () {
    t.end();
  });
});

test('Creates GIFs from videos', function (t) {
  t.plan(3);
  const gifService = new GifService();
  gifService.createGif(gifConfiguration, videoElement);
  gifService.on('complete', function (image) {
    t.ok(image.blob instanceof Blob, 'gifService emits "complete" event with image blob');
  });
  gifService.once('progress', function (status, percent) {
    t.ok(typeof status === 'string', 'gifService emits "progress" event with status string');
    t.ok(typeof percent === 'number', 'gifService emits "progress" event with percent as a number');
  });
});

test('Aborts GIF creation', function (t) {
  t.plan(1);
  const gifService = new GifService();
  gifService.createGif(gifConfiguration, videoElement);
  gifService.on('abort', function () {
    t.pass('gifService emits "abort" event');
  });
  gifService.abort();
});
