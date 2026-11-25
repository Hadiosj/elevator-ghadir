import { FLOOR_H, GROUND_Y, SHAFT_W, SHAFT_X, clamp01 } from '../config.js';
import { rect } from '../sprites.js';
import { drawPerson } from './people.js';

const MAX_FLOOR = 3;

export function createElevator() {
  const car = {
    off: 0,
    tgt: null,
    vel: 0,
    dir: 0,
    open: 0,
    wait: 0,
    riders: []
  };

  const levelAt = (offset) => {
    const k = Math.round(offset / FLOOR_H);
    return Math.abs(offset - k * FLOOR_H) < 2 && k >= 0 && k <= MAX_FLOOR ? k : -1;
  };

  car.levelAt = levelAt;

  const inspectLevel = (level) => {
    const clamped = Math.max(0, Math.min(MAX_FLOOR, level));
    const target = FLOOR_H * clamped;
    if (Math.abs(target - car.off) >= 2 && car.riders.length === 0) {
      car.tgt = target;
      car.wait = 0;
    }
  };

  const update = (dt, peopleMgr) => {
    const { people, afterExit } = peopleMgr;

    if (car.tgt != null) {
      if (car.open > 0.02) {
        car.open = clamp01(car.open - dt * 3);
        car.vel = 0;
        return;
      }
      const dx = car.tgt - car.off;
      const dist = Math.abs(dx);
      const sign = Math.sign(dx);
      car.dir = sign;

      // Smooth ease-in / ease-out velocity curve
      const maxSpeed = 62;
      const decelLimit = Math.max(14, Math.sqrt(2 * 95 * dist));
      const desiredSpeed = Math.min(maxSpeed, decelLimit);
      const accel = 110 * dt;
      if (car.vel < desiredSpeed) {
        car.vel = Math.min(desiredSpeed, car.vel + accel);
      } else {
        car.vel = desiredSpeed;
      }

      const step = car.vel * dt;
      if (dist <= step || dist < 0.8) {
        car.off = car.tgt;
        car.tgt = null;
        car.vel = 0;
        car.dir = 0;
        car.wait = 0.35;
      } else {
        car.off += sign * step;
      }
      return;
    }

    car.vel = 0;
    car.dir = 0;

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
    const cableH = Math.max(0, y - 68);
    if (cableH > 0) {
      rect(ctx, SHAFT_X + 14, 68, 4, cableH, '#8a93a3');
      rect(ctx, SHAFT_X + 15, 68, 1, cableH, '#b8c2d1');
    }

    // Cab housing & warm interior
    rect(ctx, SHAFT_X, y, SHAFT_W, 32, '#7f8c9a');
    rect(ctx, SHAFT_X + 2, y + 2, SHAFT_W - 4, 29, '#fff3c4');
    // Interior ceiling lamp
    rect(ctx, SHAFT_X + 8, y + 2, 16, 2, '#ffe066');

    // Top direction indicator light when moving
    if (car.dir !== 0) {
      const col = car.dir > 0 ? '#2ecc71' : '#ff7a1a';
      rect(ctx, SHAFT_X + 13, y - 2, 6, 2, '#2b2d42');
      rect(ctx, SHAFT_X + 15, y - 2, 2, 2, col);
    }

    for (const rider of car.riders) {
      drawPerson(
        ctx,
        { ...rider, pose: 'stand', mvg: 0 },
        SHAFT_X + 8 + 8 * rider.slot,
        by - 2
      );
    }

    // Sliding doors with center seam & frosted glass window
    const doorW = 2 + Math.round(12 * (1 - car.open));
    const leftDoorX = SHAFT_X + 2;
    const rightDoorX = SHAFT_X + SHAFT_W - 2 - doorW;
    rect(ctx, leftDoorX, y + 2, doorW, 29, '#9aa7b4');
    rect(ctx, rightDoorX, y + 2, doorW, 29, '#9aa7b4');
    // Subtle inner bevel & glass slits when doors are mostly closed
    if (doorW >= 7) {
      rect(ctx, leftDoorX + doorW - 1, y + 2, 1, 29, '#6c7a89');
      rect(ctx, rightDoorX, y + 2, 1, 29, '#6c7a89');
      rect(ctx, leftDoorX + 2, y + 7, doorW - 5, 10, '#c8d6e5');
      rect(ctx, rightDoorX + 3, y + 7, doorW - 5, 10, '#c8d6e5');
    }
  };

  return { car, update, draw, inspectLevel };
}
