import { CANVAS_W, GROUND_Y, pickRandom, randRange } from '../config.js';
import { rect } from '../sprites.js';

const TRAFFIC_CAR_COLORS = ['#e5e9f0', '#2c3e50', '#7f8c8d', '#8e2438', '#2e7d5b'];
const SCOOTER_COLORS = ['#d63031', '#0984e3', '#2d3436', '#e17055'];
const HELMET_COLORS = ['#f5f6fa', '#2f3640', '#e84118', '#00a8ff', '#fbc531'];

function drawCar(ctx, x, fy, color, day, facing) {
  rect(ctx, x, fy - 14, 44, 10, color);
  rect(ctx, x + 8, fy - 22, 24, 8, color);
  rect(ctx, x + 12, fy - 20, 6, 6, '#bfe6ff');
  rect(ctx, x + 22, fy - 20, 6, 6, '#bfe6ff');

  // Headlight on front side, red taillight on rear side
  const frontX = facing >= 0 ? x + 42 : x;
  const rearX = facing >= 0 ? x : x + 42;
  rect(ctx, rearX, fy - 11, 2, 3, '#e74c3c');
  if (day < 0.5) {
    rect(ctx, frontX, fy - 11, 2, 3, '#ffeaa7');
    ctx.globalAlpha = 0.22;
    rect(ctx, facing >= 0 ? x + 44 : x - 12, fy - 12, 12, 5, '#ffeaa7');
    ctx.globalAlpha = 1;
  } else {
    rect(ctx, frontX, fy - 11, 2, 3, '#f7f1e3');
  }

  // Wheels + rims
  rect(ctx, x + 6, fy - 6, 8, 6, '#1b1b1b');
  rect(ctx, x + 8, fy - 4, 4, 2, '#9aa0a6');
  rect(ctx, x + 30, fy - 6, 8, 6, '#1b1b1b');
  rect(ctx, x + 32, fy - 4, 4, 2, '#9aa0a6');
}

function drawFrenchBus(ctx, x, fy, day, facing) {
  // Classic French RATP-inspired mint-jade & white city bus (86px wide)
  rect(ctx, x, fy - 30, 86, 25, '#f4f7f8');
  rect(ctx, x, fy - 14, 86, 9, '#2bb69c');
  rect(ctx, x, fy - 28, 86, 2, '#2bb69c');

  // Panoramic side windows
  for (let i = 0; i < 5; i++) {
    const wx = x + 6 + i * 15;
    rect(ctx, wx, fy - 25, 12, 9, day > 0.5 ? '#2d3a4b' : '#ffe394');
    rect(ctx, wx + 1, fy - 24, 4, 3, day > 0.5 ? '#546a82' : '#fff7d6');
  }

  // Front windshield + amber LED line display
  const frontWinX = facing >= 0 ? x + 78 : x + 2;
  rect(ctx, frontWinX, fy - 26, 6, 12, '#34495e');
  rect(ctx, facing >= 0 ? x + 79 : x + 3, fy - 25, 4, 2, '#f39c12');

  // Headlight & taillight
  const frontX = facing >= 0 ? x + 84 : x;
  const rearX = facing >= 0 ? x : x + 84;
  rect(ctx, rearX, fy - 10, 2, 4, '#e74c3c');
  rect(ctx, frontX, fy - 10, 2, 4, day < 0.5 ? '#ffeaa7' : '#ffffff');
  if (day < 0.5) {
    ctx.globalAlpha = 0.22;
    rect(ctx, facing >= 0 ? x + 86 : x - 16, fy - 12, 16, 7, '#ffeaa7');
    ctx.globalAlpha = 1;
  }

  // Wheels
  rect(ctx, x + 12, fy - 7, 10, 7, '#1b1b1b');
  rect(ctx, x + 15, fy - 5, 4, 3, '#9aa0a6');
  rect(ctx, x + 62, fy - 7, 10, 7, '#1b1b1b');
  rect(ctx, x + 65, fy - 5, 4, 3, '#9aa0a6');
}

function drawScooterTwoRiders(ctx, x, fy, vehicle, day) {
  const { facing, col, helmet1, helmet2, jacket1, jacket2 } = vehicle;

  // Two riders: driver at front, passenger right behind
  const driverX = facing >= 0 ? x + 15 : x + 9;
  const passX = facing >= 0 ? x + 6 : x + 18;

  // Passenger (behind driver)
  rect(ctx, passX, fy - 24, 5, 5, helmet2);
  rect(ctx, facing >= 0 ? passX + 3 : passX, fy - 22, 2, 2, '#1b1e24'); // visor
  rect(ctx, passX - 1, fy - 19, 6, 7, jacket2);
  rect(ctx, passX, fy - 12, 5, 5, '#2c3e50');

  // Driver (front)
  rect(ctx, driverX, fy - 25, 5, 5, helmet1);
  rect(ctx, facing >= 0 ? driverX + 3 : driverX, fy - 23, 2, 2, '#1b1e24'); // visor
  rect(ctx, driverX - 1, fy - 20, 6, 7, jacket1);
  rect(ctx, driverX, fy - 13, 5, 5, '#34495e');

  // Scooter body, seat & handlebars
  rect(ctx, x + 4, fy - 11, 20, 5, col);
  rect(ctx, x + 6, fy - 13, 12, 2, '#22262c');
  const stemX = facing >= 0 ? x + 21 : x + 5;
  rect(ctx, stemX, fy - 18, 2, 9, col);
  rect(ctx, stemX - 1, fy - 19, 4, 2, '#22262c');

  // Headlight & taillight
  const frontX = facing >= 0 ? x + 23 : x + 3;
  const rearX = facing >= 0 ? x + 3 : x + 23;
  rect(ctx, rearX, fy - 10, 2, 2, '#e74c3c');
  rect(ctx, frontX, fy - 16, 2, 2, day < 0.5 ? '#ffeaa7' : '#ffffff');
  if (day < 0.5) {
    ctx.globalAlpha = 0.22;
    rect(ctx, facing >= 0 ? x + 25 : x - 9, fy - 17, 10, 4, '#ffeaa7');
    ctx.globalAlpha = 1;
  }

  // Wheels
  rect(ctx, x + 4, fy - 6, 6, 6, '#1b1b1b');
  rect(ctx, x + 6, fy - 4, 2, 2, '#9aa0a6');
  rect(ctx, x + 18, fy - 6, 6, 6, '#1b1b1b');
  rect(ctx, x + 20, fy - 4, 2, 2, '#9aa0a6');
}

export function createCarsManager() {
  // Both parked cars use the right-hand driveway so neither drives through the elevator shaft
  const cars = [
    { x: 140, slot: 140, facing: 1, col: '#c0392b', s: 'parked', t: randRange(12, 24) },
    { x: 192, slot: 192, facing: 1, col: '#3b82c4', s: 'parked', t: randRange(6, 16) }
  ];

  // Rare passing street traffic on the foreground road
  let traffic = null;
  let trafficTimer = randRange(10, 22);

  const spawnTraffic = (bounds) => {
    const roll = Math.random();
    const facing = Math.random() < 0.5 ? 1 : -1;
    if (roll < 0.3) {
      traffic = {
        kind: 'bus',
        w: 86,
        x: facing > 0 ? bounds.minX - 96 : bounds.maxX + 16,
        facing,
        speed: 54
      };
    } else if (roll < 0.56) {
      traffic = {
        kind: 'scooter',
        w: 28,
        x: facing > 0 ? bounds.minX - 36 : bounds.maxX + 12,
        facing,
        speed: 96,
        col: pickRandom(SCOOTER_COLORS),
        helmet1: pickRandom(HELMET_COLORS),
        helmet2: pickRandom(HELMET_COLORS),
        jacket1: pickRandom(TRAFFIC_CAR_COLORS),
        jacket2: pickRandom(TRAFFIC_CAR_COLORS)
      };
    } else {
      traffic = {
        kind: 'car',
        w: 44,
        x: facing > 0 ? bounds.minX - 54 : bounds.maxX + 14,
        facing,
        speed: 82,
        col: pickRandom(TRAFFIC_CAR_COLORS)
      };
    }
  };

  const isOuterBlocking = (car) => {
    if (car.slot !== 140) return false;
    const outer = cars[1];
    return outer.s !== 'gone' && outer.x < 248;
  };

  const update = (dt, peopleMgr, bounds = { minX: 0, maxX: CANVAS_W }) => {
    for (const c of cars) {
      if (c.s === 'parked') {
        if ((c.t -= dt) <= 0) {
          if (isOuterBlocking(c)) {
            c.t = 2;
          } else {
            c.s = 'out';
            c.facing = 1;
          }
        }
      } else if (c.s === 'out') {
        c.facing = 1;
        c.x += 64 * dt;
        if (c.x > bounds.maxX + 20) {
          c.s = 'gone';
          c.t = randRange(5, 14);
        }
      } else if (c.s === 'gone') {
        if ((c.t -= dt) <= 0) {
          if (isOuterBlocking(c)) {
            c.t = 2;
          } else {
            c.s = 'in';
            c.x = bounds.maxX + 20;
            c.facing = -1;
          }
        }
      } else {
        c.facing = -1;
        c.x -= 64 * dt;
        if (c.x <= c.slot) {
          c.x = c.slot;
          c.s = 'parked';
          c.facing = 1;
          c.t = randRange(14, 30);
          const newcomer = peopleMgr.people.find((o) => o.s === 'off');
          if (newcomer) {
            peopleMgr.spawn(newcomer, c.x + 22);
          }
        }
      }
    }

    if (traffic) {
      traffic.x += traffic.facing * traffic.speed * dt;
      if (
        (traffic.facing > 0 && traffic.x > bounds.maxX + 20) ||
        (traffic.facing < 0 && traffic.x + traffic.w < bounds.minX - 20)
      ) {
        traffic = null;
        const wide = bounds.maxX - bounds.minX > 400;
        trafficTimer = wide ? randRange(12, 26) : randRange(18, 38);
      }
    } else if ((trafficTimer -= dt) <= 0) {
      spawnTraffic(bounds);
    }
  };

  const draw = (ctx, day) => {
    for (const c of cars) {
      if (c.s !== 'gone') {
        drawCar(ctx, c.x, GROUND_Y, c.col, day, c.facing);
      }
    }
  };

  const drawTraffic = (ctx, day) => {
    if (!traffic) return;
    const roadY = GROUND_Y + 20;
    if (traffic.kind === 'bus') {
      drawFrenchBus(ctx, traffic.x, roadY, day, traffic.facing);
    } else if (traffic.kind === 'scooter') {
      drawScooterTwoRiders(ctx, traffic.x, roadY, traffic, day);
    } else {
      drawCar(ctx, traffic.x, roadY, traffic.col, day, traffic.facing);
    }
  };

  return { update, draw, drawTraffic };
}
