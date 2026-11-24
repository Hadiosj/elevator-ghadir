import {
  CANVAS_H,
  CANVAS_W,
  FLOOR_H,
  FLOOR_WALLS_LEFT,
  FLOOR_WALLS_RIGHT,
  GROUND_Y,
  ROOM_MID_X,
  SHAFT_W,
  SHAFT_X,
  TOP_OFFSET,
  WALL_LEFT,
  WALL_RIGHT,
  mixColor
} from './config.js';
import { rect } from './sprites.js';
import { drawParkingFloor } from './floors/parking.js';
import { drawFirstFloor } from './floors/floor1.js';
import { drawSecondFloor } from './floors/floor2.js';
import { drawThirdFloor } from './floors/floor3.js';

const FLOOR_DRAWERS = [drawParkingFloor, drawFirstFloor, drawSecondFloor, drawThirdFloor];

function drawWindow(ctx, x, y, day) {
  rect(ctx, x - 2, y - 2, 16, 20, '#2b2d42');
  rect(ctx, x, y, 12, 16, day > 0.5 ? '#bfe6ff' : '#ffd86b');
  rect(ctx, x + 5, y, 2, 16, '#2b2d42');
  rect(ctx, x, y + 7, 12, 2, '#2b2d42');
}

export function buildStaticScene(day, progress) {
  const bg = document.createElement('canvas');
  bg.width = CANVAS_W;
  bg.height = CANVAS_H;
  const ctx = bg.getContext('2d');

  const reach = progress * TOP_OFFSET;

  // Sky gradient
  const topSky = mixColor('#0e1633', '#6cb8ff', day);
  const botSky = mixColor('#2b3a7a', '#d8f0ff', day);
  for (let y = 0; y < GROUND_Y; y += 6) {
    rect(ctx, 0, y, CANVAS_W, 6, mixColor(topSky, botSky, y / GROUND_Y));
  }

  // Stars at dusk/night or soft pixel clouds during day
  if (day < 0.6) {
    for (let i = 0; i < 32; i++) {
      rect(ctx, (i * 53) % CANVAS_W, (i * 29) % 160, 2, 2, '#ffffff');
    }
  } else {
    const cloudColor = '#f4faff';
    for (const [cx, cy] of [
      [24, 24],
      [148, 18],
      [212, 34]
    ]) {
      rect(ctx, cx, cy, 24, 6, cloudColor);
      rect(ctx, cx + 4, cy - 4, 14, 4, cloudColor);
    }
  }

  // Sidewalk & asphalt ground
  rect(ctx, 0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y, '#3a3d46');
  rect(ctx, 0, GROUND_Y, CANVAS_W, 4, '#6b6f7a');

  // Building outer shell & cornice
  rect(ctx, WALL_LEFT - 2, 48, WALL_RIGHT - WALL_LEFT + 4, GROUND_Y - 48, '#2b2d42');
  rect(ctx, WALL_LEFT, 56, WALL_RIGHT - WALL_LEFT, GROUND_Y - 56, '#f3efe6');
  rect(ctx, WALL_LEFT - 4, 50, WALL_RIGHT - WALL_LEFT + 8, 12, '#cfc8b8');
  rect(ctx, WALL_LEFT - 4, 50, WALL_RIGHT - WALL_LEFT + 8, 2, '#e8e2d5');

  // Rooms & floor slabs
  for (let k = 0; k < 4; k++) {
    const fy = GROUND_Y - FLOOR_H * k;
    rect(ctx, 52, fy - 86, ROOM_MID_X - 52, 86, FLOOR_WALLS_LEFT[k]);
    rect(ctx, ROOM_MID_X, fy - 86, WALL_RIGHT - ROOM_MID_X, 86, FLOOR_WALLS_RIGHT[k]);
    if (k > 0) {
      rect(ctx, WALL_LEFT, fy, WALL_RIGHT - WALL_LEFT, 6, '#cfc8b8');
      rect(ctx, WALL_LEFT, fy, WALL_RIGHT - WALL_LEFT, 2, '#e4ded0');
    }
  }

  // Elevator shaft structure
  rect(ctx, SHAFT_X - 2, 62, SHAFT_W + 4, GROUND_Y - 62, '#2b2d42');
  rect(ctx, SHAFT_X, 62, SHAFT_W, GROUND_Y - 62, '#ffe08a');
  rect(ctx, SHAFT_X, 62, 2, GROUND_Y - 62, '#c9a227');
  rect(ctx, SHAFT_X + SHAFT_W - 2, 62, 2, GROUND_Y - 62, '#c9a227');

  // Floor details & windows
  for (let k = 0; k < 4; k++) {
    const fy = GROUND_Y - FLOOR_H * k;
    FLOOR_DRAWERS[k](ctx, fy, day);
    rect(ctx, SHAFT_X, fy, SHAFT_W, 2, '#8d99a6');
    if (k === 3) {
      drawWindow(ctx, 208, fy - 80, day);
    }
  }

  // Unbuilt blueprint section of the elevator shaft
  if (progress < 1) {
    const yLimit = GROUND_Y - reach;
    rect(ctx, SHAFT_X, 62, SHAFT_W, yLimit - 62, '#14305e');
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

    // Hazard stripe at exact reach height
    for (let x = SHAFT_X; x < SHAFT_X + SHAFT_W; x += 8) {
      rect(ctx, x, yLimit - 2, 4, 4, '#f1c40f');
      rect(ctx, x + 4, yLimit - 2, 4, 4, '#1b1b1b');
    }
  }

  // Shaft pulley block at top
  rect(ctx, SHAFT_X + 4, 62, SHAFT_W - 8, 6, '#555555');
  rect(ctx, SHAFT_X + 8, 64, SHAFT_W - 16, 2, '#888888');

  // Roof crane
  rect(ctx, 208, 10, 6, 40, '#f1c40f');
  rect(ctx, 156, 10, 64, 4, '#f1c40f');
  rect(ctx, 216, 8, 12, 8, '#777777');
  rect(ctx, 172, 14, 2, 18, '#555555');
  rect(ctx, 168, 32, 10, 4, '#555555');

  return bg;
}
