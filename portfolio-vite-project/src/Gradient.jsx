/* Gradient.js 
  A lightweight WebGL mesh gradient engine.
*/
export class Gradient {
  constructor() {
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.time = Math.random() * 10;
  }

  initGradient(selector) {
    this.canvas = document.querySelector(selector);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    window.addEventListener('resize', () => this.resize());
    this.resize();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  // This simplified logic creates the "fluid" look
  animate() {
    this.time += 0.012;
    const { ctx, width, height, time } = this;

    // Get colors from CSS variables (set in your index.css)
    const computed = getComputedStyle(this.canvas);
    const c1 = computed.getPropertyValue('--gradient-color-1') || '#efd1ff';
    const c2 = computed.getPropertyValue('--gradient-color-2') || '#c3e1ff';
    const c3 = computed.getPropertyValue('--gradient-color-3') || '#b9f2ff';
    const c4 = computed.getPropertyValue('--gradient-color-4') || '#ffe0e0';

    ctx.clearRect(0, 0, width, height);

    // Create complex overlapping radial gradients to mimic the "Jitter" effect
    const x1 = width * (0.5 + 0.3 * Math.cos(time * 0.7));
    const y1 = height * (0.5 + 0.3 * Math.sin(time * 0.8));
    
    const x2 = width * (0.5 + 0.3 * Math.cos(time * 0.5 + 2));
    const y2 = height * (0.5 + 0.3 * Math.sin(time * 0.4 + 2));

    const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, width * 0.8);
    g1.addColorStop(0, c1);
    g1.addColorStop(1, 'transparent');

    const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, width * 0.8);
    g2.addColorStop(0, c2);
    g2.addColorStop(1, 'transparent');

    ctx.fillStyle = c3; // Base color
    ctx.fillRect(0, 0, width, height);
    
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, width, height);

    requestAnimationFrame(() => this.animate());
  }
}