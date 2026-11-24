import {
  CANVAS_H,
  CANVAS_W,
  FLOOR_H,
  FLOOR_WALLS,
  GROUND_Y,
  SHAFT_W,
  SHAFT_X,
  TOP_OFFSET,
  WALL_LEFT,
  WALL_RIGHT,
  mixColor
} from './config.js';
import { drawGridSprite, rect } from './sprites.js';
import { drawParkingFloor } from './floors/parking.js';
import { drawFirstFloor } from './floors/floor1.js';
import { drawSecondFloor } from './floors/floor2.js';
import { drawThirdFloor } from './floors/floor3.js';

const FLOOR_DRAWERS = [drawParkingFloor, drawFirstFloor, drawSecondFloor, drawThirdFloor];

const MOON_SPRITE = [
  '...xxxx..',
  '.xxxxxx..',
  'xxxx.....',
  'xxx......',
  'xxx......',
  'xxxx.....',
  '.xxxxxx..',
  '...xxxx..'
];

const STARS = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 53 + 11) % CANVAS_W,
  y: (i * 29 + 7) % 140,
  phase: i * 0.9,
  big: i % 5 === 0
}));

const CLOUDS = [
  { baseX: 24, y: 20, w: 28, speed: 3.2 },
  { baseX: 132, y: 14, w: 22, speed: 2.1 },
  { baseX: 208, y: 30, w: 30, speed: 2.7 }
];

function drawWindow(ctx, x, y, day) {
  rect(ctx, x - 2, y - 2, 16, 20, '#2b2d42');
  rect(ctx, x, y, 12, 16, day > 0.5 ? '#bfe6ff' : '#ffd86b');
  rect(ctx, x + 5, y, 2, 16, '#2b2d42');
  rect(ctx, x, y + 7, 12, 2, '#2b2d42');
}

export function buildStaticScene(day, completed) {
  const bg = document.createElement('canvas');
  bg.width = CANVAS_W;
  bg.height = CANVAS_H;
  const ctx = bg.getContext('2d');

  // Sky gradient
  const topSky = mixColor('#0e1633', '#6cb8ff', day);
  const botSky = mixColor('#2b3a7a', '#d8f0ff', day);
  for (let y = 0; y < GROUND_Y; y += 6) {
    rect(ctx, 0, y, CANVAS_W, 6, mixColor(topSky, botSky, y / GROUND_Y));
  }

  // Crescent moon at dusk/night
  if (day < 0.55) {
    drawGridSprite(ctx, 218, 12, MOON_SPRITE, { x: '#fff3b0' }, 2);
  }

  // Sidewalk & asphalt ground
  rect(ctx, 0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y, '#3a3d46');
  rect(ctx, 0, GROUND_Y, CANVAS_W, 4, '#6b6f7a');
  // Subtle road dashes
  for (let x = 10; x < CANVAS_W; x += 28) {
    rect(ctx, x, GROUND_Y + 13, 14, 2, '#5a5e6b');
  }

  // Building outer shell & cornice
  rect(ctx, WALL_LEFT - 2, 48, WALL_RIGHT - WALL_LEFT + 4, GROUND_Y - 48, '#2b2d42');
  rect(ctx, WALL_LEFT, 56, WALL_RIGHT - WALL_LEFT, GROUND_Y - 56, '#f3efe6');
  rect(ctx, WALL_LEFT - 4, 50, WALL_RIGHT - WALL_LEFT + 8, 12, '#cfc8b8');
  rect(ctx, WALL_LEFT - 4, 50, WALL_RIGHT - WALL_LEFT + 8, 2, '#e8e2d5');

  // Rooms, ceiling drop-shadows & floor slabs
  for (let k = 0; k < 4; k++) {
    const fy = GROUND_Y - FLOOR_H * k;
    rect(ctx, 52, fy - 86, WALL_RIGHT - 52, 86, FLOOR_WALLS[k]);
    // Subtle ceiling shadow strip under slab
    rect(ctx, 52, fy - 86, WALL_RIGHT - 52, 2, 'rgba(43, 45, 66, 0.08)');
    if (k > 0) {
      rect(ctx, WALL_LEFT, fy, WALL_RIGHT - WALL_LEFT, 6, '#cfc8b8');
      rect(ctx, WALL_LEFT, fy, WALL_RIGHT - WALL_LEFT, 2, '#e4ded0');
    }
  }

  // Elevator shaft structure + vertical steel guide rails
  rect(ctx, SHAFT_X - 2, 62, SHAFT_W + 4, GROUND_Y - 62, '#2b2d42');
  rect(ctx, SHAFT_X, 62, SHAFT_W, GROUND_Y - 62, '#ffe08a');
  rect(ctx, SHAFT_X, 62, 2, GROUND_Y - 62, '#c9a227');
  rect(ctx, SHAFT_X + SHAFT_W - 2, 62, 2, GROUND_Y - 62, '#c9a227');
  rect(ctx, SHAFT_X + 4, 68, 1, GROUND_Y - 68, '#d9b54a');
  rect(ctx, SHAFT_X + SHAFT_W - 5, 68, 1, GROUND_Y - 68, '#d9b54a');

  // Floor details & windows
  for (let k = 0; k < 4; k++) {
    const fy = GROUND_Y - FLOOR_H * k;
    FLOOR_DRAWERS[k](ctx, fy, day);
    rect(ctx, SHAFT_X, fy, SHAFT_W, 2, '#8d99a6');
    if (k === 3) {
      drawWindow(ctx, 208, fy - 80, day);
    }
  }

  // Shaft pulley block at top
  rect(ctx, SHAFT_X + 4, 62, SHAFT_W - 8, 6, '#555555');
  rect(ctx, SHAFT_X + 8, 64, SHAFT_W - 16, 2, '#888888');

  if (completed) {
    // Celebratory rooftop bunting when 100% funded
    const flagColors = ['#ff7a1a', '#2ecc71', '#f1c40f', '#3498db', '#e74c3c'];
    rect(ctx, 28, 30, 2, 20, '#6b6f7a');
    rect(ctx, 226, 30, 2, 20, '#6b6f7a');
    rect(ctx, 30, 32, 196, 1, '#2b2d42');
    for (let i = 0; i < 16; i++) {
      const fx = 34 + i * 12;
      const dip = Math.round(Math.sin((i / 15) * Math.PI) * 5);
      const col = flagColors[i % flagColors.length];
      rect(ctx, fx, 33 + dip, 6, 4, col);
      rect(ctx, fx + 1, 37 + dip, 4, 2, col);
    }
  } else {
    // Roof crane tower & jib (hook is drawn animated in renderer)
    rect(ctx, 208, 10, 6, 40, '#f1c40f');
    rect(ctx, 209, 14, 4, 2, '#c99700');
    rect(ctx, 209, 24, 4, 2, '#c99700');
    rect(ctx, 209, 34, 4, 2, '#c99700');
    rect(ctx, 156, 10, 64, 4, '#f1c40f');
    rect(ctx, 216, 8, 12, 8, '#777777');
  }

  return bg;
}

export function drawAnimatedSky(ctx, day, tt, reducedMotion) {
  if (day < 0.6) {
    for (const s of STARS) {
      const alpha = reducedMotion ? 0.8 : 0.45 + 0.55 * Math.sin(tt * 2.2 + s.phase);
      ctx.globalAlpha = alpha;
      rect(ctx, s.x, s.y, s.big ? 2 : 1, s.big ? 2 : 1, '#ffffff');
    }
    ctx.globalAlpha = 1;
  } else {
    ctx.globalAlpha = 0.9;
    for (const c of CLOUDS) {
      const drift = reducedMotion ? 0 : tt * c.speed;
      const cx = ((c.baseX + drift) % (CANVAS_W + 40)) - 32;
      rect(ctx, cx, c.y, c.w, 6, '#f4faff');
      rect(ctx, cx + 4, c.y - 4, c.w - 10, 4, '#ffffff');
    }
    ctx.globalAlpha = 1;
  }
}

export function drawAnimatedCraneHook(ctx, completed, tt, reducedMotion) {
  if (completed) return;
  const sway = reducedMotion ? 0 : Math.round(Math.sin(tt * 1.4) * 2);
  rect(ctx, 172, 14, 2, 18, '#555555');
  rect(ctx, 168 + sway, 32, 10, 4, '#555555');
  rect(ctx, 172 + sway, 36, 2, 3, '#333333');
}

export function drawShaftBlueprint(ctx, reach, tt, reducedMotion) {
  if (reach >= TOP_OFFSET - 0.5) return;

  const yLimit = Math.min(GROUND_Y - 2, GROUND_Y - reach);
  const blueprintH = yLimit - 62;
  if (blueprintH > 0) {
    rect(ctx, SHAFT_X, 62, SHAFT_W, blueprintH, '#14305e');
    ctx.globalAlpha = 0.55;
    for (let x = SHAFT_X + 8; x < SHAFT_X + SHAFT_W; x += 8) {
      for (let y = yLimit - 2; y > 62; y -= 4) {
        rect(ctx, x, y, 2, 2, '#6aa3f0');
      }
    }
    for (let y = yLimit - 12; y > 62; y -= 16) {
      for (let x = SHAFT_X; x < SHAFT_X + SHAFT_W; x += 4) {
        rect(ctx, x, y, 2, 2, '#6aa3f0');
      }
    }
    ctx.globalAlpha = 1;
  }

  // Only draw hazard stripe & spark once progress is above ground floor sidewalk
  if (reach > 3) {
    const stripeY = Math.min(GROUND_Y - 4, Math.round(GROUND_Y - reach) - 2);
    for (let x = SHAFT_X; x < SHAFT_X + SHAFT_W; x += 8) {
      rect(ctx, x, stripeY, 4, 4, '#f1c40f');
      rect(ctx, x + 4, stripeY, 4, 4, '#1b1b1b');
    }
    if (!reducedMotion) {
      rect(ctx, SHAFT_X + (((tt * 20) | 0) % 28), stripeY + 1, 4, 2, '#ffffff');
    }
  }
}

export function drawFloorStatusOverlay(ctx, unlockedLevel, waitingFloors) {
  for (let k = 0; k < 4; k++) {
    const fy = GROUND_Y - FLOOR_H * k;
    const unlocked = k <= unlockedLevel;

    // Subtle cool dimming overlay on locked floors so unlocked progress reads clearly
    if (!unlocked) {
      ctx.fillStyle = 'rgba(18, 30, 62, 0.22)';
      ctx.fillRect(54, fy - 86, WALL_RIGHT - 54, 86);
    }

    // Subtle call indicator light beside the shaft doorway when someone is waiting
    if (unlocked && waitingFloors.has(k)) {
      const bx = SHAFT_X + SHAFT_W + 4;
      const by = fy - 28;
      rect(ctx, bx, by, 3, 3, '#ff7a1a');
      rect(ctx, bx + 1, by + 1, 1, 1, '#fff3c4');
    }
  }
}
