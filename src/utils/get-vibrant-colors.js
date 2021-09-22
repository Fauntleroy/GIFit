import _ from 'lodash';
import extractColors from 'extract-colors';

const DEFAULT_DIMENSIONS_MAX = 100;

function getCanvasDimensions (width, height, max = DEFAULT_DIMENSIONS_MAX) {
  const aspect = width / height;
  if (aspect >= 1) {
    return [max, max / aspect];
  }
  return [max / aspect, max];
}

async function getVibrantColors (videoEl) {
  const tempCanvasEl = document.createElement('canvas');
  const canvasDimensions = getCanvasDimensions(videoEl.videoWidth, videoEl.videoHeight);
  tempCanvasEl.width = canvasDimensions[0];
  tempCanvasEl.height = canvasDimensions[1];
  const tempContext = tempCanvasEl.getContext('2d');

  tempContext.drawImage(
    videoEl,
    0, 0, videoEl.videoWidth, videoEl.videoHeight,
    0, 0, tempCanvasEl.width, tempCanvasEl.height
  );
  const imageData = tempContext.getImageData(0, 0, tempCanvasEl.width, tempCanvasEl.height);
  const colors = await extractColors(imageData, { saturationImportance: 0.5 });
  const newVibrantColors = _.sortBy(colors, 'saturation').reverse();

  return newVibrantColors;
}

export default getVibrantColors;
