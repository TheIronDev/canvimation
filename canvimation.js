/**
 * Class that represents a thing rendered.
 */
class RenderObject {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = 5;
    this.height = height;
    this.width = width;
  }

  /**
   * Renders the object onto the canvas
   */
  draw() {
    this.ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  /**
   * Resize the object based on the new width/height
   * @param height
   * @param width
   */
  resizeUpdate(height, width) {
    this.height = height;
    this.width = width;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
  }

  update() {}
}

/**
 * Class that handles rendering a scene onto a canvas
 */
class CanvasScene {
  constructor(
      window,
      document,
      canvasId = 'canvas',
      renderObjectCount = 100,
      renderObjectClass = RenderObject
  ) {
    this.window = window;
    this.document = document;

    this.canvas = this.document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.width = this.canvas.offsetWidth; // Width of the scene
    this.height = this.canvas.offsetHeight; // Height of the scene

    this.renderObjectCount = renderObjectCount;
    this.RenderObjectClass = renderObjectClass;

    this.renderObjects = [];

    this.bindResize();
    this.resize(); // Get appropriate canvas constraints
    this.init();
  }

  /**
   * Animates all the renderingObjects by updating their new locations,
   * clearing the canvas, and drawing the renderingObjects in their new
   * locations.
   */
  animate() {
    this.window.requestAnimationFrame(() => this.animate());
    this.update();
    this.clear();
    this.draw();
  }

  /**
   * Binds an event listener for handling window resize.
   */
  bindResize() {
    this.window.addEventListener('resize', () => this.resize());
  }

  /**
   * Clears the canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Draws each of the render objects onto the canvas.
   */
  draw() {
    this.renderObjects.forEach(renderObject => renderObject.draw());
  }

  /**
   * Initializes the renderObjects to render.
   */
  init() {
    let i = this.renderObjectCount;
    while (i--) this.renderObjects.push(
        new this.RenderObjectClass(this.ctx, this.width, this.height));
  }

  /**
   * Updates the canvas and height/width.
   */
  resize() {
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;

    if (window.devicePixelRatio > 1) {
      this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
      this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    } else {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    this.renderObjects.forEach(
        renderObject => renderObject.resizeUpdate(this.height, this.width));
  }

  /**
   * Starts the game-loop.
   */
  start() {
    this.window.requestAnimationFrame(() => this.animate())
  }

  /**
   * Calls the update method of each of the renderObjects.
   */
  update() {
    this.renderObjects.forEach(
        renderObject => renderObject.update());
  }
}

const test = new CanvasScene(window, document, 'canvas', 200, RenderObject);
test.start();

