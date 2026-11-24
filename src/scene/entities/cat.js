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
      if (((tt * 1.5) | 0) % 2) {
        rect(ctx, x + 10, y - 18, 4, 2, '#ffffff');
      }
      return;
    }

    rect(ctx, x - 8, y - 8, 16, 6, '#e08a3c');
    rect(ctx, x - 6, y - 2, 2, 2, '#c8702a');
    rect(ctx, x + 4, y - 2, 2, 2, '#c8702a');
    const hx = d > 0 ? x + 6 : x - 10;
    rect(ctx, hx, y - 12, 6, 6, '#e08a3c');
    rect(ctx, hx, y - 14, 2, 2, '#e08a3c');
    rect(ctx, hx + 4, y - 14, 2, 2, '#e08a3c');
    rect(ctx, d > 0 ? x - 10 : x + 8, y - 14, 2, 8, '#c8702a');
  };

  return { update, draw };
}
