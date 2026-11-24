import { drawGridSprite, rect } from '../sprites.js';

const FLEUR_DE_LIS_17 = [
  '........w........',
  '.......www.......',
  '......ww.ww......',
  '......ww.ww......',
  '......ww.ww......',
  '......wwwww......',
  '..www..www..www..',
  '.wwwww.www.wwwww.',
  '.ww..wwwwwww..ww.',
  '.ww...ww.ww...ww.',
  '..ww..wwwww..ww..',
  '...www.www.www...',
  '......wwwww......',
  '......ww.ww......',
  '......ww.ww......',
  '.......www.......',
  '........w........'
];

const CARVED_CIRCLE_15 = [
  '....ddddddd....',
  '..ddddddddddd..',
  '.ddddddddddddd.',
  '.ddddddddddddd.',
  'ddddddddddddddd',
  'ddddddddddddddd',
  'ddddddddddddddd',
  'ddddddddddddddd',
  'ddddddddddddddd',
  'ddddddddddddddd',
  'ddddddddddddddd',
  '.ddddddddddddd.',
  '.ddddddddddddd.',
  '..ddddddddddd..',
  '....ddddddd....'
];

const FLEUR_DE_LIS_13 = [
  '......b......',
  '.....bbb.....',
  '....bb.bb....',
  '....bbbbb....',
  '.bb..bbb..bb.',
  'bbbb.bbb.bbbb',
  'bb..bbbbb..bb',
  '.b...b.b...b.',
  '..bb.bbb.bb..',
  '....bbbbb....',
  '....bb.bb....',
  '.....bbb.....',
  '......b......'
];

export function drawSecondFloor(ctx, fy, day = 1) {
  // Dark charcoal ceiling with linear LED strip lights
  rect(ctx, 52, fy - 86, 188, 6, '#23272c');
  for (const lx of [70, 108, 156, 198]) {
    rect(ctx, lx, fy - 82, 24, 2, '#eef5ff');
  }

  // Vivid turquoise-blue patterned carpet
  rect(ctx, 52, fy - 6, 188, 6, '#0496ca');
  rect(ctx, 52, fy - 6, 188, 1, '#26b9eb');
  rect(ctx, 52, fy - 1, 188, 1, '#06668f');
  for (let x = 56; x < 236; x += 10) {
    rect(ctx, x, fy - 4, 4, 2, '#7ce0fa');
    rect(ctx, x + 5, fy - 3, 2, 2, '#06668f');
  }

  // Left room: Vertical oak wood-slat accent wall behind the podium
  rect(ctx, 64, fy - 76, 74, 70, '#4f3824');
  for (let x = 65; x < 138; x += 3) {
    rect(ctx, x, fy - 76, 2, 70, '#d4ac7d');
    rect(ctx, x, fy - 76, 1, 70, '#e3c298');
  }

  // Right room: Horizontal 3-pane white-framed window
  const glass = day > 0.5 ? '#d8f2ff' : '#ffd86b';
  rect(ctx, 150, fy - 68, 42, 16, '#cdd6df');
  rect(ctx, 151, fy - 67, 40, 14, '#ffffff');
  for (let p = 0; p < 3; p++) {
    rect(ctx, 153 + p * 13, fy - 65, 10, 10, glass);
  }

  // Scout flag (red / navy blue / green + white fleur-de-lis) mounted on wall
  const fx = 205;
  const fyFlag = fy - 74;
  rect(ctx, fx - 1, fyFlag - 2, 23, 2, '#4a3520');
  rect(ctx, fx, fyFlag, 7, 21, '#c81e1e');
  rect(ctx, fx + 7, fyFlag, 7, 21, '#1c3278');
  rect(ctx, fx + 14, fyFlag, 7, 21, '#0e6b2f');
  drawGridSprite(ctx, fx + 2, fyFlag + 2, FLEUR_DE_LIS_17, { w: '#ffffff' }, 1);

  // Small orange scout activity cones & black floor fan
  rect(ctx, 152, fy - 15, 7, 7, '#1f242b');
  rect(ctx, 153, fy - 14, 5, 5, '#3b424d');
  rect(ctx, 154, fy - 8, 3, 2, '#111418');

  for (const cx of [164, 171]) {
    rect(ctx, cx, fy - 8, 4, 2, '#ff6a1a');
    rect(ctx, cx + 1, fy - 12, 2, 4, '#ff6a1a');
    rect(ctx, cx + 1, fy - 10, 2, 1, '#ffffff');
  }

  // Clean 3x3 light-oak cube shelf (Photo 5)
  const sx = 199;
  const sy = fy - 42;
  rect(ctx, sx, sy, 34, 36, '#d6af82');
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      rect(ctx, sx + 2 + c * 10, sy + 2 + r * 11, 8, 9, '#9c7750');
    }
  }
  // Tidy books in top-left cube
  rect(ctx, sx + 3, sy + 4, 2, 7, '#2e6b3e');
  rect(ctx, sx + 5, sy + 4, 2, 7, '#c9a227');
  rect(ctx, sx + 7, sy + 4, 2, 7, '#c0392b');
  // Two clean hanging foulards in middle cubes
  rect(ctx, sx + 14, sy + 13, 4, 8, '#c81e1e');
  rect(ctx, sx + 24, sy + 13, 4, 8, '#1c3278');
  rect(ctx, sx + 25, sy + 13, 2, 7, '#ffffff');
  // Navy floor cushion in front of shelf
  rect(ctx, 183, fy - 10, 12, 4, '#1d335c');
  rect(ctx, 184, fy - 11, 10, 1, '#2f4d85');
}

export function drawSecondFloorForeground(ctx, fy) {
  // Slatted wooden Scout podium/desk (drawn in front of seated leader)
  rect(ctx, 79, fy - 21, 44, 15, '#6e4928');
  for (let x = 80; x < 122; x += 3) {
    rect(ctx, x, fy - 21, 2, 15, '#b88452');
  }
  // Desk top counter
  rect(ctx, 77, fy - 23, 48, 3, '#d4a373');
  rect(ctx, 78, fy - 23, 46, 1, '#e8c199');

  // Carved circular wooden Scout logo centered on front of desk
  drawGridSprite(ctx, 94, fy - 20, CARVED_CIRCLE_15, { d: '#d9b384' }, 1);
  drawGridSprite(ctx, 95, fy - 19, FLEUR_DE_LIS_13, { b: '#8f5f34' }, 1);

  // Open book on wooden stand (rahle) + microphone stand on desk
  rect(ctx, 110, fy - 26, 6, 3, '#7a5230');
  rect(ctx, 109, fy - 28, 4, 3, '#fdf8ec');
  rect(ctx, 113, fy - 28, 4, 3, '#fdf8ec');
  rect(ctx, 88, fy - 30, 2, 7, '#22262c');
  rect(ctx, 88, fy - 31, 7, 1, '#22262c');
}

export function drawSecondFloorAnimated() {
  // Reserved for future animated 2nd-floor elements
}
