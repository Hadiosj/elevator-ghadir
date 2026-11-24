import { drawGridSprite, rect } from '../sprites.js';

// Right-to-left Arabic calligraphy: "يا حسين" (Ya Hussein)
const CALLIGRAPHY_YA_HUSSEIN = [
  '......................................',
  '.............................r........',
  '.............................r........',
  '....................rrr......r........',
  '...........r..r.r.r....r.....r....r...',
  '..r........r..r.r.r...r......r....r...',
  '..r..r..rrrrrrrrrrrrrr.......rrrrrr...',
  '..r.....r.............................',
  '...r...r..r.r..................r.r....',
  '....rrr...............................'
];

function drawWallSpeaker(ctx, x, y, facingRight) {
  rect(ctx, facingRight ? x - 2 : x + 7, y + 2, 2, 3, '#444a54');
  rect(ctx, x, y, 7, 9, '#1b1e24');
  rect(ctx, x + 1, y + 1, 5, 7, '#2d333d');
  rect(ctx, facingRight ? x + 4 : x + 1, y + 2, 2, 5, '#5b6370');
  rect(ctx, facingRight ? x + 5 : x + 1, y + 1, 1, 1, '#e74c3c');
}

export function drawFirstFloor(ctx, fy) {
  // Entry / shoe-rack tile zone right outside the elevator (x: 52..92)
  rect(ctx, 52, fy - 6, 40, 6, '#cfc6b4');
  rect(ctx, 52, fy - 6, 40, 1, '#dfd8c8');
  for (let x = 56; x < 90; x += 8) {
    rect(ctx, x, fy - 5, 1, 5, '#b8ae9b');
  }

  // Wooden shoe cubby at entry wall
  rect(ctx, 56, fy - 18, 20, 14, '#7a5230');
  rect(ctx, 57, fy - 17, 18, 12, '#54371e');
  rect(ctx, 58, fy - 16, 4, 2, '#2c3e50');
  rect(ctx, 64, fy - 16, 4, 2, '#7f8c8d');
  rect(ctx, 58, fy - 9, 4, 2, '#1f242b');
  rect(ctx, 64, fy - 9, 4, 2, '#5d4037');

  // Unified Prayer Carpet (x: 92..238) with subtle prayer-row (saff) stripes
  rect(ctx, 92, fy - 6, 146, 6, '#1f6e49');
  rect(ctx, 92, fy - 6, 146, 1, '#3fa171');
  rect(ctx, 92, fy - 2, 146, 1, '#144d32');
  for (let x = 104; x < 234; x += 22) {
    rect(ctx, x, fy - 5, 2, 4, '#e5d4a1');
  }

  // Single black Ashura flag on wall with red Arabic calligraphy ("يا حسين")
  const flagX = 131;
  const flagY = fy - 70;
  rect(ctx, flagX - 1, flagY - 2, 46, 2, '#3d2c1e');
  rect(ctx, flagX, flagY, 44, 18, '#14151a');
  drawGridSprite(ctx, flagX + 3, flagY + 4, CALLIGRAPHY_YA_HUSSEIN, { r: '#df2828' }, 1);

  // Hanging speakers on left and right ends of the prayer hall
  drawWallSpeaker(ctx, 96, fy - 66, true);
  drawWallSpeaker(ctx, 204, fy - 66, false);

  // Warm pendant lamps flanking the wall
  for (const lx of [116, 190]) {
    rect(ctx, lx, fy - 86, 2, 16, '#444444');
    rect(ctx, lx - 3, fy - 70, 8, 5, '#ffd86b');
    rect(ctx, lx - 1, fy - 69, 4, 2, '#fff7c2');
  }

  // Mihrab (Qibla niche) on the far right wall
  rect(ctx, 214, fy - 58, 24, 52, '#24593f');
  rect(ctx, 216, fy - 56, 20, 50, '#367d5b');
  rect(ctx, 218, fy - 54, 16, 48, '#e8dcc0');
  rect(ctx, 220, fy - 52, 12, 4, '#c9a86a');
}
