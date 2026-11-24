import { FLOOR_H, GROUND_Y, SHAFT_W, SHAFT_X, clamp01 } from '../config.js';
import { rect } from '../sprites.js';
import { drawPerson } from './people.js';

export function createElevator(unlockedLevel) {
  const car = {
    off: 0,
    tgt: null,
    open: 0,
    wait: 0,
    riders: []
  };

  const levelAt = (offset) => {
    const k = Math.round(offset / FLOOR_H);
    return Math.abs(offset - k * FLOOR_H) < 2 && k <= unlockedLevel ? k : -1;
  };

  car.levelAt = levelAt;

  const update = (dt, peopleMgr) => {
    const { people, afterExit } = peopleMgr;

    if (car.tgt != null) {
      if (car.open > 0.02) {
        car.open = clamp01(car.open - dt * 3);
        return;
      }
      const dx = car.tgt - car.off;
      const step = 48 * dt;
      if (Math.abs(dx) <= step) {
        car.off = car.tgt;
        car.tgt = null;
        car.wait = 0.35;
      } else {
        car.off += Math.sign(dx) * step;
      }
      return;
    }

    const level = levelAt(car.off);
    const exitingHere = level >= 0 && car.riders.some((q) => q.dest === level);
    const boardingHere = level >= 0 && people.some((q) => q.s === 'board' && q.lv === level);
    const canTakeWaiter =
      level >= 0 && car.riders.length < 3 && people.some((q) => q.s === 'wait' && q.lv === level);
    const needsDoors = exitingHere || boardingHere || canTakeWaiter;

    if (needsDoors) {
      car.open = clamp01(car.open + dt * 3);
      if (car.open > 0.9) {
        car.riders = car.riders.filter((q) => {
          if (q.dest !== level) return true;
          afterExit(q, level);
          car.wait = Math.max(car.wait, 0.35);
          return false;
        });

        let count =
          car.riders.length + people.filter((q) => q.s === 'board' && q.lv === level).length;

        for (const q of people
          .filter((o) => o.s === 'wait' && o.lv === level)
          .sort((a, b) => a.wt - b.wt)) {
          if (count >= 3) break;
          const usedSlots = [
            ...car.riders,
            ...people.filter((o) => o.s === 'board')
          ].map((o) => o.slot);
          let slot = 0;
          while (usedSlots.includes(slot)) slot++;
          q.slot = slot;
          q.s = 'board';
          q.tx = 28 + 8 * slot;
          count++;
        }
      }
      return;
    }

    if (car.wait > 0) {
      car.wait = Math.max(0, car.wait - dt);
      return;
    }

    car.open = clamp01(car.open - dt * 3);
    if (car.open > 0.02) {
      return;
    }

    let target = null;
    if (car.riders.length) {
      target = FLOOR_H * car.riders[0].dest;
    } else {
      const waiting = people.filter((q) => q.s === 'wait');
      if (waiting.length) {
        target =
          FLOOR_H *
          waiting.sort(
            (a, b) => Math.abs(FLOOR_H * a.lv - car.off) - Math.abs(FLOOR_H * b.lv - car.off)
          )[0].lv;
      }
    }

    if (target != null && Math.abs(target - car.off) >= 2) {
      car.tgt = target;
    }
  };

  const draw = (ctx) => {
    const by = GROUND_Y - car.off;
    const y = by - 32;

    // Steel hoist cable
    rect(ctx, SHAFT_X + 14, 68, 4, y - 68, '#8a93a3');

    // Cab housing & warm interior
    rect(ctx, SHAFT_X, y, SHAFT_W, 32, '#7f8c9a');
    rect(ctx, SHAFT_X + 2, y + 2, SHAFT_W - 4, 30, '#fff3c4');
    rect(ctx, SHAFT_X + 8, y, 16, 2, '#ffe066');

    for (const rider of car.riders) {
      drawPerson(
        ctx,
        { ...rider, pose: 'stand', mvg: 0 },
        SHAFT_X + 8 + 8 * rider.slot,
        by - 2
      );
    }

    // Sliding doors
    const doorW = 2 + Math.round(12 * (1 - car.open));
    rect(ctx, SHAFT_X + 2, y + 2, doorW, 30, '#9aa7b4');
    rect(ctx, SHAFT_X + SHAFT_W - 2 - doorW, y + 2, doorW, 30, '#9aa7b4');
  };

  return { car, update, draw };
}
