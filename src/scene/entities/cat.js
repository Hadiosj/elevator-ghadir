import { GROUND_Y } from '../config.js';
import { rect } from '../sprites.js';

export function createCat() {
  const cat = { x: 180, s: 'walk', tx: 60, t: 0, d: -1 };

  const update = (dt) => {
    if (cat.s === 'walk') {
      const dx = cat.tx - cat.x;
      if (Math.abs(dx) < 2) {
        cat.s = 'sleep';
        cat.t = 3 + Math.random() * 6;
      } else {
        cat.x += Math.sign(dx) * 20 * dt;
        cat.d = Math.sign(dx);
      }
    } else if ((cat.t -= dt) <= 0) {
      cat.s = 'walk';
      cat.tx = 68 + Math.random() * 160;
    }
  };

  const draw = (ctx, tt) => {
    const x = cat.x;
    const y = GROUND_Y;
    const d = cat.d;

    if (cat.s === 'sleep') {
      rect(ctx, x - 8, y - 6, 16, 6, '#e08a3c');
      rect(ctx, x + 4, y - 10, 6, 6, '#e08a3c');
      rect(ctx, x - 8, y - 2, 8, 2, '#c8702a');
      // Rising pixel Z animation
      const zPhase = (tt * 1.4) % 2;
      const zy = y - 15 - Math.floor(zPhase * 6);
      const zx = x + 10 + Math.floor(zPhase * 2);
      ctx.globalAlpha = Math.max(0.2, 1 - zPhase * 0.45);
      rect(ctx, zx, zy, 3, 1, '#ffffff');
      rect(ctx, zx + 1, zy + 1, 1, 1, '#ffffff');
      rect(ctx, zx, zy + 2, 3, 1, '#ffffff');
      ctx.globalAlpha = 1;
      return;
    }

    const step = ((tt * 8) | 0) % 2 ? 1 : -1;
    const tailWag = ((tt * 4) | 0) % 2 ? 1 : 0;

    rect(ctx, x - 8, y - 8, 16, 6, '#e08a3c');
    // Animated walking legs
    rect(ctx, x - 6 + step, y - 2, 2, 2, '#c8702a');
    rect(ctx, x + 4 - step, y - 2, 2, 2, '#c8702a');
    // Head & ears
    const hx = d > 0 ? x + 6 : x - 10;
    rect(ctx, hx, y - 12, 6, 6, '#e08a3c');
    rect(ctx, hx, y - 14, 2, 2, '#e08a3c');
    rect(ctx, hx + 4, y - 14, 2, 2, '#e08a3c');
    // Eye
    rect(ctx, d > 0 ? hx + 4 : hx + 1, y - 10, 1, 1, '#1b1e24');
    // Wagging tail
    rect(ctx, d > 0 ? x - 10 : x + 8, y - 14 + tailWag, 2, 7, '#c8702a');
  };

  return { update, draw };
}
