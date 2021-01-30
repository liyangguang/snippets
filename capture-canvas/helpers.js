import GIF from 'gif.js';

export function captureGif(canvasElement, callback) {
  // Documentation: https://github.com/jnordberg/gif.js

  const gif = new GIF({
      workers: 4,
      workerScript: '/gif.worker.js',
  });

  let finishArgs = [];
  let finishResolver;
  const finishPromise = new Promise((resolve) => finishResolver = resolve);

  // For some reason, `on('finished)` can run multiple times. We only need it once.
  let hasFinishedRan = false;
  gif.on('finished', (blob) => {
    if (!hasFinishedRan) {
      Promise.resolve(callback(blob, ...finishArgs)).then(() => finishResolver());
      hasFinishedRan = true;
    }
  });
  
  const addFrame = (delay) => {
    // Debug helper: Copy the base64 url to a new tab to view the captured frame.
    gif.addFrame(canvasElement, {copy: true, delay});
  }
  
  return [addFrame, function() {  // Cannot use arrow-function here, we need to get `arguments`
    gif.render();
    finishArgs = arguments;
    return finishPromise;
  }];
}

export function capturePng(canvasElement) {
  return new Promise((resolve) => {
    canvasElement.toBlob(resolve, 'image/png');
  });
}
