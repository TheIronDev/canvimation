
/**
 * Class that handles rendering a scene onto a canvas
 */
class CanvasScene {
  constructor(
      window,
      document,
      canvasId = 'canvas',
      renderObjectCount = 100,
  ) {
    this.window = window;
    this.document = document;

    const canvas = this.document.getElementById(canvasId)
        .transferControlToOffscreen();
    this.worker = new Worker('./worker.js');

    // Initialize the worker
    this.worker.postMessage(
        {type: 'INIT', canvas, renderObjectCount},
        [canvas]);

    this.bindResize();
    this.resize();
  }

  /**
   * Binds an event listener for handling window resize.
   */
  bindResize() {
    this.window.addEventListener('resize', () => this.resize());
  }

  /**
   * Updates the canvas and height/width.
   */
  resize() {
    const {devicePixelRatio, innerHeight, innerWidth} = this.window;
    this.worker.postMessage(
        {type: 'RESIZE', devicePixelRatio, innerHeight, innerWidth});
  }

  /**
   * Starts the game-loop.
   */
  start() {
    this.worker.postMessage(
        {type: 'START'});
  }
}

const canvasScene = new CanvasScene(window, document, 'canvas', 5000);
canvasScene.start();


