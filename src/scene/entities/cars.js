import { GROUND_Y, randRange } from '../config.js';
import { rect } from '../sprites.js';

function drawCar(ctx, x, fy, color, day) {
  rect(ctx, x, fy - 14, 44, 10, color);
  rect(ctx, x + 8, fy - 22, 24, 8, color);
  rect(ctx, x + 12, fy - 20, 6, 6, '#bfe6ff');
  rect(ctx, x + 22, fy - 20, 6, 6, '#bfe6ff');
  // Headlight glow at night
  if (day < 0.5) {
    rect(ctx, x + 42, fy - 11, 2, 3, '#ffeaa7');
  }
  // Wheels + rims
  rect(ctx, x + 6, fy - 6, 8, 6, '#1b1b1b');
  rect(ctx, x + 8, fy - 4, 4, 2, '#9aa0a6');
  rect(ctx, x + 30, fy - 6, 8, 6, '#1b1b1b');
  rect(ctx, x + 32, fy - 4, 4, 2, '#9aa0a6');
}

export function createCarsManager() {
  const cars = [
    { x: 152, slot: 152, dir: -1, col: '#c0392b', s: 'parked', t: randRange(6, 18) },
    { x: 196, slot: 196, dir: 1, col: '#3b82c4', s: 'parked', t: randRange(14, 30) }
  ];

  const update = (dt, peopleMgr) => {
    for (const c of cars) {
      if (c.s === 'parked') {
        if ((c.t -= dt) <= 0) c.s = 'out';
      } else if (c.s === 'out') {
        c.x += c.dir * 64 * dt;
        if (c.x < -60 || c.x > 280) {
          c.s = 'gone';
          c.t = randRange(5, 14);
        }
      } else if (c.s === 'gone') {
        if ((c.t -= dt) <= 0) {
          c.s = 'in';
          c.x = c.dir < 0 ? -60 : 280;
        }
      } else {
        c.x += (c.slot > c.x ? 1 : -1) * 64 * dt;
        if (Math.abs(c.x - c.slot) < 3) {
          c.x = c.slot;
          c.s = 'parked';
          c.t = randRange(14, 30);
          const newcomer = peopleMgr.people.find((o) => o.s === 'off');
          if (newcomer) {
            peopleMgr.spawn(newcomer, c.x + 22);
          }
        }
      }
    }
  };

  const draw = (ctx, day) => {
    for (const c of cars) {
      drawCar(ctx, c.x, GROUND_Y, c.col, day);
    }
  };

  return { update, draw };
}
