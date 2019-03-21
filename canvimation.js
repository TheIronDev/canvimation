
class RenderObject {
  constructor(ctx) {
    this.ctx = ctx;
  }
  draw() {}
  update() {}
}

class CanvasScene {
  constructor(window, document, dotCount = 100, dotClass = RenderObject) {
    this.window = window;
    this.document = document;

    this.canvas = this.document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.width = this.canvas.offsetWidth; // Width of the scene
    this.height = this.canvas.offsetHeight; // Height of the scene

    this.dotCount = dotCount;
    this.DotClass = dotClass;

    this.dots = [];

    this.bindResize();
    this.init();
  }
  animate() {
    this.window.requestAnimationFrame(() => this.animate());
    this.dots.forEach(dot => dot.draw(this.ctx));
  }
  bindResize() {
    this.window.addEventListener('resize', () => this.resize());
  }
  init() {
    let i = this.dotCount;
    while (i--) this.dots.push(new this.DotClass());
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
    this.dots.forEach(dot => dot.update());
  }
}

const test = new CanvasScene(window, document);
test.start();

