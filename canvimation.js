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
 * Demo RenderObject that displays a dot on a circle
 */
class CircleDot extends RenderObject {
  constructor(ctx, width, height) {
    super(ctx, width, height);

    this.x = 0;
    this.y = 0;
    this.angle = Math.floor(Math.random() * 360);
    this.radius = width / 4;
  }
  update() {
    this.angle += 1;
  }
  project() {
    const theta = this.angle * Math.PI / 180;

    this.x = this.radius * Math.cos(theta) + this.width / 2;
    this.y = this.radius * Math.sin(theta) + this.height / 2;
  }
  draw() {
    this.project();

    this.ctx.beginPath();
    const arc = [
      this.x,
      this.y,
      3,
      0,
      2 * Math.PI
    ];
    this.ctx.arc(...arc);
    this.ctx.fill();
  }
}

/**
 * Demo RenderObject that displays a dot on a globe
 */
class GlobeDot extends RenderObject {
  constructor(ctx, width, height) {
    super(ctx, width, height);

    this.x = (Math.random() - 0.5) * width;
    this.y = (Math.random() - 0.5) * height;
    this.z = (Math.random() - 0.5) * height;

    this.perspective = this.width * 0.8;
    this.projection_center_x = this.width / 2;
    this.projection_center_y = this.height / 2;

    this.scaleProjected = 0;
    this.xProjected = 0;
    this.yProjected = 0;

    this.theta = Math.random() * 2 * Math.PI; // Random value between [0, 2Pi]
    this.phi = Math.acos((Math.random() * 2) - 1); // Random value between [0, Pi]
  }
  resizeUpdate(height, width) {
    super.resizeUpdate(height, width);

    this.perspective = this.width * 0.8;
    this.projection_center_x = this.width / 2;
    this.projection_center_y = this.height / 2;
  }
  update() {
    this.theta += .01;
  }
  project() {
    // Calculate the x, y, z coordinates in the 3D world
    this.x = this.width / 3 * Math.sin(this.phi) * Math.cos(this.theta);
    this.y = this.width / 3 * Math.cos(this.phi);
    this.z = this.width / 3 * Math.sin(this.phi) * Math.sin(this.theta) + this.width / 3;
    this.perspective = this.width * 0.8;

    this.scaleProjected = this.perspective / (this.perspective + this.z); // distance from user
    this.xProjected = (this.x * this.scaleProjected) + this.projection_center_x; // x position on 2d plane
    this.yProjected = (this.y * this.scaleProjected) + this.projection_center_y; // y pos. on 2d plane
  }
  draw() {
    this.project();
    this.ctx.globalAlpha = Math.abs(1 - this.z / this.width);

    this.ctx.beginPath();
    const arc = [
      this.xProjected,
      this.yProjected,
      5 * this.scaleProjected,
      0,
      2 * Math.PI
    ];
    this.ctx.arc(...arc);
    this.ctx.fill();
  }
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
    this.init();
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

// TODO(tystark) Remove these when I am in a more finished state.
const circleTest = new CanvasScene(window, document, 'canvas', 80, CircleDot);
const globetest = new CanvasScene(window, document, 'canvas', 200, GlobeDot);

const test = circleTest;
test.start();


