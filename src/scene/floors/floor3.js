import { BOOK_COLORS } from '../config.js';
import { rect } from '../sprites.js';

export function drawThirdFloor(ctx, fy) {
  // Warm ceiling pendant lights across the library & classroom
  for (const lx of [84, 154, 212]) {
    rect(ctx, lx, fy - 86, 2, 10, '#5a6070');
    rect(ctx, lx - 5, fy - 76, 12, 4, '#ffe599');
    rect(ctx, lx - 3, fy - 75, 8, 2, '#fff9db');
  }

  // Left side: library bookshelf + reading armchair
  rect(ctx, 56, fy - 60, 38, 60, '#6b4423');
  rect(ctx, 58, fy - 58, 34, 54, '#3d2615');

  for (let row = 0; row < 4; row++) {
    const y = fy - 58 + row * 13;
    rect(ctx, 58, y + 11, 34, 2, '#6b4423');
    for (let i = 0; i < 8; i++) {
      const color = BOOK_COLORS[(i + row) % BOOK_COLORS.length];
      rect(ctx, 60 + i * 4, y + 2, 3, 9, color);
    }
  }

  // Red reading armchair beside the bookshelf
  rect(ctx, 98, fy - 14, 16, 14, '#c0392b');
  rect(ctx, 98, fy - 22, 4, 8, '#c0392b');
  rect(ctx, 102, fy - 14, 10, 3, '#e74c3c');

  // Classroom chalkboard behind teacher & front of class
  rect(ctx, 124, fy - 58, 62, 4, '#8a5a2b');
  rect(ctx, 126, fy - 54, 58, 28, '#2b4a3a');
  rect(ctx, 131, fy - 48, 24, 2, '#ffffff');
  rect(ctx, 131, fy - 42, 18, 2, '#ffffff');
  rect(ctx, 131, fy - 36, 32, 2, '#ffd86b');
  rect(ctx, 126, fy - 26, 58, 2, '#8a5a2b');
  rect(ctx, 132, fy - 27, 4, 1, '#ffffff');

  // Educational wall chart / poster
  rect(ctx, 192, fy - 54, 14, 14, '#ffffff');
  rect(ctx, 194, fy - 52, 10, 10, '#74b9ff');
  rect(ctx, 195, fy - 49, 8, 2, '#ffffff');
  rect(ctx, 195, fy - 45, 5, 3, '#ffeaa7');

  // 3 student desks + chairs facing left toward the teacher & chalkboard
  for (const dx of [152, 180, 208]) {
    // Desk + open notebook
    rect(ctx, dx, fy - 12, 14, 2, '#9c6b3a');
    rect(ctx, dx + 1, fy - 10, 2, 10, '#7a5230');
    rect(ctx, dx + 11, fy - 10, 2, 10, '#7a5230');
    rect(ctx, dx + 3, fy - 14, 7, 2, '#f5f6fa');

    // Chair behind student (seat at fy - 7, backrest on right)
    rect(ctx, dx + 14, fy - 7, 9, 2, '#8a5a2b');
    rect(ctx, dx + 15, fy - 5, 2, 5, '#6b4423');
    rect(ctx, dx + 21, fy - 16, 2, 16, '#6b4423');
  }
}
