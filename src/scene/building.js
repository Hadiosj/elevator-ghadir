import {
  CANVAS_H,
  CANVAS_W,
  FLOOR_H,
  FLOOR_WALLS,
  GROUND_Y,
  SHAFT_W,
  SHAFT_X,
  WALL_LEFT,
  WALL_RIGHT
} from './config.js';
import { drawGridSprite, rect } from './sprites.js';
import { drawNeighborhood } from './neighborhood.js';
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

// Scattered stars strictly in the visible sky (above the roof y < 44, or wide side sky)
const BASE_STARS = [
  { x: 10, y: 14, phase: 0.2, big: false },
  { x: 48, y: 9, phase: 1.1, big: true },
  { x: 64, y: 24, phase: 2.3, big: false },
  { x: 82, y: 11, phase: 0.7, big: false },
  { x: 96, y: 28, phase: 3.1, big: true },
  { x: 114, y: 8, phase: 1.9, big: false },
  { x: 128, y: 20, phase: 4.2, big: false },
  { x: 142, y: 34, phase: 2.8, big: false },
  { x: 150, y: 12, phase: 0.4, big: true },
  { x: 184, y: 26, phase: 3.7, big: false },
  { x: 196, y: 6, phase: 1.5, big: false },
  { x: 238, y: 16, phase: 2.1, big: true },
  { x: 247, y: 32, phase: 0.9, big: false }
];

const FLANK_STARS = Array.from({ length: 46 }, (_, i) => {
  const onLeft = i % 2 === 0;
  const step = Math.floor(i / 2);
  const x = onLeft ? -20 - ((step * 37 + 13) % 520) : 272 + ((step * 41 + 19) % 520);
  const y = 8 + ((i * 29 + 17) % 136);
  return { x, y, phase: i * 0.75, big: i % 4 === 0 };
});

const STARS = [...BASE_STARS, ...FLANK_STARS];

const CLOUDS = [
  { baseX: 24, y: 16, w: 28, speed: 3.2 },
  { baseX: 132, y: 10, w: 22, speed: 2.1 },
  { baseX: 208, y: 24, w: 30, speed: 2.7 },
  { baseX: -140, y: 28, w: 34, speed: 2.4 },
  { baseX: 340, y: 18, w: 32, speed: 2.9 },
  { baseX: -320, y: 48, w: 28, speed: 1.9 },
  { baseX: 520, y: 44, w: 30, speed: 2.2 }
];

function drawWindow(ctx, x, y, day) {
  rect(ctx, x - 2, y - 2, 16, 20, '#2b2d42');
  rect(ctx, x, y, 12, 16, day > 0.5 ? '#bfe6ff' : '#ffd86b');
  rect(ctx, x + 5, y, 2, 16, '#2b2d42');
  rect(ctx, x, y + 7, 12, 2, '#2b2d42');
}

export function buildStaticScene(
  day,
  completed,
  bounds = { sceneW: CANVAS_W, offsetX: 0, minX: 0, maxX: CANVAS_W }
) {
  const bg = document.createElement('canvas');
  bg.width = bounds.sceneW;
  bg.height = CANVAS_H;
  const ctx = bg.getContext('2d');

  ctx.save();
  ctx.translate(bounds.offsetX, 0);

  // Crescent moon at dusk/night (clear of the roof crane and neighboring buildings)
  if (day < 0.55) {
    const moonX = bounds.offsetX >= 36 ? -48 : 22;
    const moonY = bounds.offsetX >= 36 ? 18 : 8;
    drawGridSprite(ctx, moonX, moonY, MOON_SPRITE, { x: '#fff3b0' }, 2);
  }

  // Full-width sidewalk & asphalt ground across the entire viewport
  rect(ctx, bounds.minX, GROUND_Y, bounds.sceneW, CANVAS_H - GROUND_Y, '#3a3d46');
  rect(ctx, bounds.minX, GROUND_Y, bounds.sceneW, 4, '#6b6f7a');
  const dashStart = Math.floor(bounds.minX / 28) * 28 + 10;
  for (let x = dashStart; x < bounds.maxX; x += 28) {
    rect(ctx, x, GROUND_Y + 13, 14, 2, '#5a5e6b');
  }

  // Desktop flanking neighborhood scenery (buildings, shops, lamps, trees, bus stop)
  drawNeighborhood(ctx, day, bounds);

  // Main building outer shell & cornice
  rect(ctx, WALL_LEFT - 2, 48, WALL_RIGHT - WALL_LEFT + 4, GROUND_Y - 48, '#2b2d42');
  rect(ctx, WALL_LEFT, 56, WALL_RIGHT - WALL_LEFT, GROUND_Y - 56, '#f3efe6');
  rect(ctx, WALL_LEFT - 4, 50, WALL_RIGHT - WALL_LEFT + 8, 12, '#cfc8b8');
  rect(ctx, WALL_LEFT - 4, 50, WALL_RIGHT - WALL_LEFT + 8, 2, '#e8e2d5');

  // Rooms, ceiling drop-shadows & floor slabs
  for (let k = 0; k < 4; k++) {
    const fy = GROUND_Y - FLOOR_H * k;
    rect(ctx, 52, fy - 86, WALL_RIGHT - 52, 86, FLOOR_WALLS[k]);
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

  ctx.restore();
  return bg;
}

export function drawAnimatedSky(
  ctx,
  day,
  tt,
  reducedMotion,
  bounds = { minX: 0, maxX: CANVAS_W }
) {
  if (day < 0.6) {
    for (const s of STARS) {
      if (s.x < bounds.minX || s.x > bounds.maxX) continue;
      const alpha = reducedMotion ? 0.8 : 0.45 + 0.55 * Math.sin(tt * 2.2 + s.phase);
      ctx.globalAlpha = alpha;
      rect(ctx, s.x, s.y, s.big ? 2 : 1, s.big ? 2 : 1, '#ffffff');
    }
    ctx.globalAlpha = 1;
  } else {
    ctx.globalAlpha = 0.9;
    const span = bounds.maxX - bounds.minX + 96;
    for (const c of CLOUDS) {
      if (c.y > 32 && c.baseX < 256 && c.baseX > 0) continue;
      const drift = reducedMotion ? 0 : tt * c.speed;
      const offset = (((c.baseX - bounds.minX + drift) % span) + span) % span;
      const cx = bounds.minX - 48 + offset;
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

export function drawShaftBlueprint(ctx, carOffset) {
  const yLimit = Math.max(68, Math.min(GROUND_Y, Math.round(GROUND_Y - carOffset - 16)));
  const blueprintH = yLimit - 68;
  if (blueprintH <= 0) return;

  rect(ctx, SHAFT_X, 68, SHAFT_W, blueprintH, '#14305e');
  ctx.globalAlpha = 0.55;
  for (let x = SHAFT_X + 8; x < SHAFT_X + SHAFT_W; x += 8) {
    for (let y = 70; y < yLimit - 1; y += 4) {
      rect(ctx, x, y, 2, 2, '#6aa3f0');
    }
  }
  for (let y = 74; y < yLimit - 1; y += 16) {
    for (let x = SHAFT_X; x < SHAFT_X + SHAFT_W; x += 4) {
      rect(ctx, x, y, 2, 2, '#6aa3f0');
    }
  }
  ctx.globalAlpha = 1;
}

export function drawFloorStatusOverlay(ctx, waitingFloors) {
  for (let k = 0; k < 4; k++) {
    const fy = GROUND_Y - FLOOR_H * k;

    // Subtle call indicator light beside the shaft doorway when someone is waiting
    if (waitingFloors.has(k)) {
      const bx = SHAFT_X + SHAFT_W + 4;
      const by = fy - 28;
      rect(ctx, bx, by, 3, 3, '#ff7a1a');
      rect(ctx, bx + 1, by + 1, 1, 1, '#fff3c4');
    }
  }
}
