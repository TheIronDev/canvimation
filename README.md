# Canvimation

## Performance Considerations


In the Globe example, the following provided poor performance:

```javascript
points.forEach(point => {
  ctx.beginPath();
  ctx.globalAlpha = Math.abs(1 - this.z / this.width);
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
});
```

There were a few ways to improve performance.

**Put into an worker thread with offscreen canvas**:

I moved the canvas rendering to a worker, using an offscreen canvas.
Ultimately it did not resolve the performance issues... but it did free
up the main thread, which is an overall plus.

**Reduce fill() calls**:

```javascript
ctx.beginPath();
points.forEach(point => {
  ctx.globalAlpha = Math.abs(1 - this.z / this.width);
  ctx.moveTo(x, y);
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
});
ctx.fill();
```

This solution almost worked great! But the changing alpha channel made it not viable.
What ends up happening is the last point's alpha carries the alpha channel for
all of the other points. I am currently using the alpha channel to show depth on
the z-axis.

**Draw rectangles instead**:

```javascript
points.forEach(point => {
  ctx.beginPath();
  ctx.globalAlpha = Math.abs(1 - this.z / this.width);
  ctx.fillRect(x, y, radius);
});
```

This produces the fastest result, jumping back up to 60fps even with 16000
particles. The (major) problem is that it looks ugly. Like, really-really
ugly. So while this solution crushes it in terms of speed, the round particles
should continue being round, not rectangular.

**Copy from an offscreen canvas**

```javascript
// Draw the particle once
const particle = new OffscreenCanvas(10, 10);
const particleCtx = particle.getContext('2d');
particleCtx.beginPath();
particleCtx.arc(5, 5, 5, 0, 2 * Math.PI);
particleCtx.fill();
canvas.particle = particle;

points.forEach(point => {
  // Copy/paste the particle over
  this.ctx.drawImage(this.ctx.canvas.particle, x, y, radius, radius);
});
```

Apparently copy/pasting an image of a particle is wayyyy faster than drawing a circle.
Doing this jumps the fps up from 15 to 40ish (for 2000 particles), which is great! :)

This is ultimately the solution I landed on.

