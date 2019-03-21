
class RenderObject {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.height = height;
    this.width = width;
  }
  draw() {
    this.ctx.fillRect(this.x, this.y, 5, 5);
  }
  update(width, height) {
    if (width === this.width && this.height === height) return;
    this.height = height;
    this.width = width;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
  }
}

class CanvasScene {
  constructor(window, document, canvasId = 'canvas',renderObjectCount = 100, renderObjectClass = RenderObject) {
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
  animate() {
    this.window.requestAnimationFrame(() => this.animate());
    this.update();
    this.clear();
    this.draw();
  }
  bindResize() {
    this.window.addEventListener('resize', () => this.resize());
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  draw() {
    this.renderObjects.forEach(dot =>  dot.draw());
  }
  init() {
    let i = this.renderObjectCount;
    while (i--) this.renderObjects.push(new this.RenderObjectClass(this.ctx, this.width, this.height));
  }
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
  }
  start() {
    this.window.requestAnimationFrame(() => this.animate())
  }
  update() {
    this.renderObjects.forEach((dot) => dot.update(this.width, this.height));
  }
}

const test = new CanvasScene(window, document);
test.start();

