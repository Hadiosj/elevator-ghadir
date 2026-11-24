import { drawGridSprite, rect } from '../sprites.js';

// Miniature pixel-art Al Ghadir hands emblem (emerald green & warm gold)
const AL_GHADIR_EMBLEM = [
  '....g......',
  '...gg......',
  '..ggg......',
  '..ggg...g..',
  '.gggg..gg..',
  '.gggg.gg...',
  '.gggggg....',
  'd.gggg.....',
  'd..gg..dd..',
  'dd....ddd..',
  'dddddddd...',
  'ddddddd....',
  '.dddddd....',
  '.dddddd....',
  '.dddd.gg...',
  '.ddd..ggg..'
];

export function drawParkingFloor(ctx, fy, day = 1) {
  // Left lobby / entrance zone (x: 52..126)
  rect(ctx, 52, fy - 6, 74, 6, '#c7bfb0');
  rect(ctx, 52, fy - 6, 74, 1, '#ded7ca');
  for (let x = 58; x < 124; x += 10) {
    rect(ctx, x, fy - 5, 1, 5, '#b0a796');
  }

  // Building glass entrance door frame + dark interior hallway (doors drawn animated)
  const glass = day > 0.5 ? '#b8e0f6' : '#ffe394';
  rect(ctx, 74, fy - 40, 26, 34, '#2b2d42');
  rect(ctx, 76, fy - 38, 22, 32, '#2c2832');
  rect(ctx, 78, fy - 36, 18, 8, day > 0.5 ? '#46414f' : '#6b5a42');
  // Entrance awning
  rect(ctx, 70, fy - 45, 34, 5, '#ff7a1a');
  rect(ctx, 70, fy - 42, 34, 2, '#c95206');

  // Framed Al Ghadir emblem plaque mounted above the entrance awning
  rect(ctx, 77, fy - 71, 20, 22, '#2b2d42');
  rect(ctx, 78, fy - 70, 18, 20, '#faf8f2');
  drawGridSprite(ctx, 82, fy - 68, AL_GHADIR_EMBLEM, { g: '#0e8f44', d: '#d4af4a' }, 1);

  // Potted shrubs flanking the entrance on the ground
  for (const px of [58, 106]) {
    rect(ctx, px, fy - 12, 10, 6, '#b85c2b');
    rect(ctx, px - 1, fy - 14, 12, 2, '#99471e');
    rect(ctx, px, fy - 22, 10, 8, '#3a9145');
    rect(ctx, px + 2, fy - 25, 6, 3, '#58b368');
    rect(ctx, px + 2, fy - 19, 2, 2, '#ff5d8f');
    rect(ctx, px + 6, fy - 21, 2, 2, '#ffd23f');
  }

  // Right concrete parking bay (x: 126..240)
  rect(ctx, 126, fy - 86, 114, 86, '#cfd4dc');
  // Support pillar separating lobby and parking
  rect(ctx, 124, fy - 86, 6, 86, '#9aa2ae');
  rect(ctx, 124, fy - 86, 2, 86, '#b4bcc8');
  rect(ctx, 124, fy - 14, 6, 4, '#f1c40f');
  rect(ctx, 124, fy - 10, 6, 4, '#2b2d42');

  // Parking ceiling fluorescent tubes
  rect(ctx, 152, fy - 82, 30, 3, '#eef5ff');
  rect(ctx, 200, fy - 82, 26, 3, '#eef5ff');

  // Two ground-floor windows on the right wall
  for (const wx of [146, 198]) {
    rect(ctx, wx - 2, fy - 66, 30, 18, '#2b2d42');
    rect(ctx, wx, fy - 64, 26, 14, glass);
    rect(ctx, wx + 12, fy - 64, 2, 14, '#2b2d42');
    rect(ctx, wx, fy - 58, 26, 2, '#2b2d42');
    rect(ctx, wx - 3, fy - 48, 32, 2, '#9aa2ae');
  }

  // Floor-level garden strip & low flowers along the base of the right wall
  rect(ctx, 130, fy - 10, 110, 6, '#3f9b4a');
  rect(ctx, 130, fy - 10, 110, 2, '#6cc070');
  const flowerColors = ['#ff5d8f', '#ffd23f', '#ffffff', '#b57bff'];
  for (let i = 0; i < 10; i++) {
    const fx = 135 + i * 10;
    rect(ctx, fx, fy - 12, 4, 2, '#4caf50');
    rect(ctx, fx + 1, fy - 13, 2, 2, flowerColors[i % flowerColors.length]);
  }

  // Parking floor & yellow line
  rect(ctx, 130, fy - 4, 110, 4, '#8d94a0');
  rect(ctx, 142, fy - 2, 92, 2, '#e8c547');
}

export function drawParkingDoorAnimated(ctx, fy, day, openAmount) {
  const glass = day > 0.5 ? '#b8e0f6' : '#ffe394';
  const reflection = day > 0.5 ? '#dff4ff' : '#fff2bf';
  // Each sliding glass leaf narrows from 10px (closed) to 2px (open) into the frame
  const leafW = Math.max(2, Math.round(10 - 8 * openAmount));
  const leftX = 76;
  const rightX = 98 - leafW;

  // Left glass leaf
  rect(ctx, leftX, fy - 38, leafW, 32, glass);
  if (leafW >= 5) {
    rect(ctx, leftX + 2, fy - 35, 2, 12, reflection);
  }
  rect(ctx, leftX + leafW - 1, fy - 24, 1, 5, '#555555');

  // Right glass leaf
  rect(ctx, rightX, fy - 38, leafW, 32, glass);
  if (leafW >= 5) {
    rect(ctx, rightX + leafW - 4, fy - 35, 2, 12, reflection);
  }
  rect(ctx, rightX, fy - 24, 1, 5, '#555555');
}
