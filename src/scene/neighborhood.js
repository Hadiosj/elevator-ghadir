import { GROUND_Y } from './config.js';
import { rect } from './sprites.js';

function drawSkylineSilhouette(ctx, day, bounds) {
  const sil = day > 0.5 ? '#b3d4ee' : '#18254c';
  const silDark = day > 0.5 ? '#9ec6e6' : '#141f42';

  // Distant muted Parisian skyline silhouettes on left and right horizons
  const blocks = [
    [-460, 120, 90],
    [-368, 104, 72],
    [-294, 136, 78],
    [-214, 114, 86],
    [-126, 98, 68],
    [296, 108, 76],
    [374, 130, 88],
    [464, 98, 66],
    [532, 122, 92],
    [626, 106, 80]
  ];

  for (const [bx, bh, bw] of blocks) {
    if (bx + bw < bounds.minX - 20 || bx > bounds.maxX + 20) continue;
    rect(ctx, bx, GROUND_Y - bh, bw, bh, sil);
    rect(ctx, bx + 4, GROUND_Y - bh - 4, bw - 8, 4, silDark);
    rect(ctx, bx + 12, GROUND_Y - bh - 12, 6, 8, silDark);
    rect(ctx, bx + bw - 20, GROUND_Y - bh - 10, 5, 6, silDark);
  }

  // Distant Eiffel Tower silhouette in the far-left horizon on wide viewports
  if (bounds.minX < -200) {
    const ex = -238;
    const ey = GROUND_Y;
    rect(ctx, ex - 18, ey - 16, 10, 16, silDark);
    rect(ctx, ex + 8, ey - 16, 10, 16, silDark);
    rect(ctx, ex - 15, ey - 38, 30, 22, sil);
    rect(ctx, ex - 11, ey - 28, 22, 14, day > 0.5 ? '#c6e1f5' : '#1d2b59');
    rect(ctx, ex - 10, ey - 78, 20, 40, sil);
    rect(ctx, ex - 6, ey - 122, 12, 44, sil);
    rect(ctx, ex - 3, ey - 156, 6, 34, sil);
    rect(ctx, ex - 1, ey - 170, 2, 14, silDark);
  }
}

function drawStreetLamp(ctx, x, day) {
  const fy = GROUND_Y;
  // Iron base & post
  rect(ctx, x - 2, fy - 12, 5, 12, '#222831');
  rect(ctx, x - 1, fy - 62, 3, 50, '#2c3440');
  rect(ctx, x - 3, fy - 64, 7, 2, '#222831');
  // Lantern housing & glass
  rect(ctx, x - 4, fy - 72, 9, 8, '#222831');
  rect(ctx, x - 2, fy - 70, 5, 5, day < 0.55 ? '#ffe388' : '#d6ecf7');
  rect(ctx, x - 2, fy - 75, 5, 3, '#222831');
  rect(ctx, x, fy - 77, 1, 2, '#222831');

  // Warm ambient glow halo at dusk/night
  if (day < 0.55) {
    ctx.globalAlpha = 0.16;
    rect(ctx, x - 10, fy - 76, 21, 18, '#ffd86b');
    ctx.globalAlpha = 0.08;
    rect(ctx, x - 16, fy - 80, 33, 28, '#ffd86b');
    ctx.globalAlpha = 1;
  }
}

function drawTree(ctx, x, variant = 0) {
  const fy = GROUND_Y;
  // Tree grate + trunk
  rect(ctx, x - 6, fy - 2, 12, 2, '#4a4e58');
  rect(ctx, x - 2, fy - 26, 4, 24, '#6b4423');
  rect(ctx, x - 1, fy - 26, 1, 24, '#855832');

  const leafDark = variant % 2 === 0 ? '#277043' : '#2e7d4f';
  const leafMid = variant % 2 === 0 ? '#379458' : '#3fa367';
  const leafLight = variant % 2 === 0 ? '#57b875' : '#65c782';

  // Lush pixel canopy
  rect(ctx, x - 13, fy - 52, 26, 26, leafDark);
  rect(ctx, x - 9, fy - 60, 18, 8, leafDark);
  rect(ctx, x - 11, fy - 50, 22, 20, leafMid);
  rect(ctx, x - 7, fy - 57, 14, 7, leafMid);
  rect(ctx, x - 8, fy - 54, 10, 8, leafLight);
  rect(ctx, x + 2, fy - 44, 7, 7, leafLight);
}

function drawBench(ctx, x) {
  const fy = GROUND_Y;
  rect(ctx, x, fy - 12, 24, 3, '#8a5a2b');
  rect(ctx, x, fy - 8, 24, 2, '#a36d38');
  rect(ctx, x + 2, fy - 6, 2, 6, '#2b2d42');
  rect(ctx, x + 20, fy - 6, 2, 6, '#2b2d42');
  rect(ctx, x + 2, fy - 14, 2, 3, '#2b2d42');
  rect(ctx, x + 20, fy - 14, 2, 3, '#2b2d42');
}

function drawFrenchWindow(ctx, x, y, day, lit, balcony = true, shutterCol = null) {
  if (shutterCol) {
    rect(ctx, x - 4, y, 4, 22, shutterCol);
    rect(ctx, x + 12, y, 4, 22, shutterCol);
  }
  rect(ctx, x - 1, y - 1, 14, 24, '#434a59');
  const glass = day > 0.5 ? '#b3daf2' : lit ? '#ffd86b' : '#24304d';
  rect(ctx, x, y, 12, 22, glass);
  if (day <= 0.5 && lit) {
    rect(ctx, x + 2, y + 3, 4, 6, '#fff0ad');
  }
  rect(ctx, x + 5, y, 2, 22, '#434a59');
  rect(ctx, x, y + 10, 12, 2, '#434a59');
  if (balcony) {
    rect(ctx, x - 2, y + 16, 16, 2, '#222831');
    for (let bx = x - 1; bx <= x + 12; bx += 3) {
      rect(ctx, bx, y + 17, 1, 5, '#222831');
    }
    rect(ctx, x - 2, y + 22, 16, 2, '#222831');
  }
}

function drawMansardRoof(ctx, x, w, topY) {
  rect(ctx, x - 2, topY + 20, w + 4, 4, '#b8b09f');
  rect(ctx, x + 2, topY + 4, w - 4, 16, '#394252');
  rect(ctx, x + 6, topY, w - 12, 4, '#4a5568');
  // Zinc chimneys
  rect(ctx, x + 12, topY - 12, 8, 12, '#7d8594');
  rect(ctx, x + 11, topY - 14, 10, 2, '#9aa3b2');
  rect(ctx, x + w - 22, topY - 10, 8, 10, '#7d8594');
  rect(ctx, x + w - 23, topY - 12, 10, 2, '#9aa3b2');
  // Dormer windows
  for (const dx of [x + 18, x + w - 30]) {
    rect(ctx, dx, topY + 7, 12, 12, '#5a6375');
    rect(ctx, dx + 2, topY + 9, 8, 9, '#2b354a');
  }
}

function drawBoulangerieBuilding(ctx, day) {
  const x = -146;
  const w = 96;
  const fy = GROUND_Y;
  const roofTop = fy - 266; // shorter than Al Ghadir

  drawMansardRoof(ctx, x, w, roofTop);

  // Stone facade
  rect(ctx, x, roofTop + 24, w, fy - (roofTop + 24), '#dfd5c2');
  rect(ctx, x, roofTop + 24, 2, fy - (roofTop + 24), '#bfb49f');
  rect(ctx, x + w - 2, roofTop + 24, 2, fy - (roofTop + 24), '#bfb49f');
  // Stone cornice bands
  rect(ctx, x, fy - 156, w, 3, '#c8bea9');
  rect(ctx, x, fy - 76, w, 4, '#c8bea9');

  // Upper floor windows (deterministic lit pattern)
  const litPattern = [true, false, true, false, true, true];
  for (let row = 0; row < 2; row++) {
    const wy = row === 0 ? fy - 226 : fy - 138;
    for (let col = 0; col < 3; col++) {
      drawFrenchWindow(ctx, x + 12 + col * 30, wy, day, litPattern[row * 3 + col], true);
    }
  }

  // Ground-floor Boulangerie storefront
  rect(ctx, x + 6, fy - 66, w - 12, 66, '#7a2729');
  // Striped burgundy & cream awning
  for (let i = 0; i < 14; i++) {
    rect(ctx, x + 4 + i * 6, fy - 68, 6, 10, i % 2 === 0 ? '#9e2a2b' : '#f5efe6');
  }
  rect(ctx, x + 4, fy - 58, w - 8, 2, '#6d1d1f');

  // Warm bakery display window
  const shopGlow = day > 0.5 ? '#f5e6c8' : '#ffd97d';
  rect(ctx, x + 12, fy - 50, 46, 32, shopGlow);
  rect(ctx, x + 14, fy - 26, 42, 4, '#b88452');
  // Tiny pixel bread loaves & pastries inside
  for (let lx = x + 16; lx < x + 52; lx += 8) {
    rect(ctx, lx, fy - 30, 5, 4, '#c87e34');
    rect(ctx, lx + 1, fy - 31, 3, 1, '#e6a85c');
  }
  // Entrance door
  rect(ctx, x + 64, fy - 50, 20, 50, '#4a231d');
  rect(ctx, x + 67, fy - 46, 14, 24, shopGlow);
  rect(ctx, x + 66, fy - 20, 2, 6, '#f1c40f');
}

function drawBusStop(ctx, x, day) {
  const fy = GROUND_Y;
  // Shelter frame & glass back
  rect(ctx, x, fy - 46, 44, 4, '#1f5c4d');
  rect(ctx, x + 2, fy - 42, 3, 42, '#1f5c4d');
  rect(ctx, x + 39, fy - 42, 3, 42, '#1f5c4d');
  ctx.globalAlpha = 0.35;
  rect(ctx, x + 5, fy - 42, 34, 34, '#bfe6ff');
  ctx.globalAlpha = 1;
  // Route map panel + bench
  rect(ctx, x + 8, fy - 36, 12, 16, day < 0.55 ? '#fff3c4' : '#ffffff');
  rect(ctx, x + 10, fy - 32, 8, 2, '#2bb69c');
  rect(ctx, x + 10, fy - 27, 8, 2, '#ff7a1a');
  rect(ctx, x + 12, fy - 12, 24, 3, '#8a5a2b');
  rect(ctx, x + 15, fy - 9, 2, 9, '#2b2d42');
  rect(ctx, x + 31, fy - 9, 2, 9, '#2b2d42');
  // Bus stop pole & sign
  rect(ctx, x + 46, fy - 52, 2, 52, '#1f5c4d');
  rect(ctx, x + 43, fy - 58, 8, 8, '#2bb69c');
  rect(ctx, x + 45, fy - 56, 4, 4, '#ffffff');
}

function drawTownhouse(ctx, x, day, wallCol, shutterCol) {
  const w = 94;
  const fy = GROUND_Y;
  const roofTop = fy - 238;

  drawMansardRoof(ctx, x, w, roofTop);
  rect(ctx, x, roofTop + 24, w, fy - (roofTop + 24), wallCol);
  rect(ctx, x, roofTop + 24, 2, fy - (roofTop + 24), 'rgba(0,0,0,0.12)');
  rect(ctx, x + w - 2, roofTop + 24, 2, fy - (roofTop + 24), 'rgba(0,0,0,0.12)');
  rect(ctx, x, fy - 76, w, 3, 'rgba(0,0,0,0.1)');

  const lit = [false, true, true, false, true, false];
  for (let row = 0; row < 2; row++) {
    const wy = row === 0 ? fy - 196 : fy - 126;
    for (let col = 0; col < 3; col++) {
      drawFrenchWindow(ctx, x + 12 + col * 29, wy, day, lit[row * 3 + col], false, shutterCol);
    }
  }

  // Arched wooden porte-cochère entrance
  rect(ctx, x + 32, fy - 54, 30, 54, '#5a3825');
  rect(ctx, x + 36, fy - 50, 22, 50, '#734830');
  rect(ctx, x + 46, fy - 50, 2, 50, '#472b1c');
  rect(ctx, x + 34, fy - 58, 26, 4, '#a69d8b');
}

function drawCornerCafe(ctx, day) {
  const x = 326;
  const w = 96;
  const fy = GROUND_Y;
  const roofTop = fy - 252;

  drawMansardRoof(ctx, x, w, roofTop);
  rect(ctx, x, roofTop + 24, w, fy - (roofTop + 24), '#e2d7c5');
  rect(ctx, x, roofTop + 24, 2, fy - (roofTop + 24), '#c4b8a4');
  rect(ctx, x + w - 2, roofTop + 24, 2, fy - (roofTop + 24), '#c4b8a4');
  rect(ctx, x, fy - 148, w, 3, '#c8bea9');
  rect(ctx, x, fy - 74, w, 4, '#c8bea9');

  const lit = [true, true, false, false, true, true];
  for (let row = 0; row < 2; row++) {
    const wy = row === 0 ? fy - 214 : fy - 134;
    for (let col = 0; col < 3; col++) {
      drawFrenchWindow(ctx, x + 12 + col * 30, wy, day, lit[row * 3 + col], true);
    }
  }

  // Ground-floor café / épicerie
  rect(ctx, x + 6, fy - 64, w - 12, 64, '#1b4732');
  for (let i = 0; i < 14; i++) {
    rect(ctx, x + 4 + i * 6, fy - 66, 6, 10, i % 2 === 0 ? '#1e6b45' : '#f5efe6');
  }
  rect(ctx, x + 4, fy - 56, w - 8, 2, '#14442b');

  const shopGlow = day > 0.5 ? '#d9eef7' : '#ffe08a';
  rect(ctx, x + 12, fy - 48, 22, 48, '#3b2416');
  rect(ctx, x + 15, fy - 44, 16, 24, shopGlow);
  rect(ctx, x + 40, fy - 48, 44, 30, shopGlow);

  // Tiny sidewalk bistro table & chairs in front
  rect(ctx, x + 52, fy - 14, 16, 2, '#f5efe6');
  rect(ctx, x + 59, fy - 12, 2, 12, '#2b2d42');
  rect(ctx, x + 44, fy - 10, 6, 2, '#c0392b');
  rect(ctx, x + 44, fy - 16, 2, 16, '#2b2d42');
  rect(ctx, x + 70, fy - 10, 6, 2, '#c0392b');
  rect(ctx, x + 74, fy - 16, 2, 16, '#2b2d42');
}

function drawPocketPark(ctx, day) {
  const fy = GROUND_Y;
  // Wrought-iron low fence + flower bed between buildings
  rect(ctx, 430, fy - 4, 70, 4, '#3a8c47');
  const flowerColors = ['#ff5d8f', '#ffd23f', '#ffffff', '#b57bff'];
  for (let fx = 434; fx < 496; fx += 8) {
    rect(ctx, fx, fy - 6, 2, 2, flowerColors[(fx >> 3) % flowerColors.length]);
    rect(ctx, fx + 2, fy - 14, 2, 14, '#222831');
  }
  rect(ctx, 432, fy - 14, 66, 2, '#222831');

  drawStreetLamp(ctx, 438, day);
  drawTree(ctx, 458, 1);
  drawTree(ctx, 486, 0);
}

function drawLaPosteMailbox(ctx, x) {
  const fy = GROUND_Y;
  rect(ctx, x + 3, fy - 12, 4, 12, '#5a6070');
  rect(ctx, x, fy - 28, 10, 16, '#f1c40f');
  rect(ctx, x + 1, fy - 24, 8, 2, '#2b3d8f');
  rect(ctx, x + 2, fy - 20, 6, 2, '#1b1e24');
  rect(ctx, x + 1, fy - 30, 8, 2, '#d4ac0d');
}

export function drawNeighborhood(ctx, day, bounds) {
  if (bounds.offsetX <= 12) return;

  // Distant muted skyline silhouettes
  drawSkylineSilhouette(ctx, day, bounds);

  // Left neighborhood flank (x < 10)
  drawStreetLamp(ctx, -12, day);
  drawTree(ctx, -36, 0);
  drawBoulangerieBuilding(ctx, day);
  drawBusStop(ctx, -206, day);
  drawStreetLamp(ctx, -222, day);
  drawTree(ctx, -246, 1);
  drawTownhouse(ctx, -358, day, '#d8c2ae', '#4e6e58');

  // Ultrawide left repeating street props
  for (let x = -402; x > bounds.minX - 60; x -= 74) {
    drawTree(ctx, x, Math.abs(x) % 2);
    drawBench(ctx, x - 34);
    drawStreetLamp(ctx, x - 48, day);
  }

  // Right neighborhood flank (x > 250, leaving driveway clear at 240..254)
  drawLaPosteMailbox(ctx, 256);
  drawStreetLamp(ctx, 276, day);
  drawBench(ctx, 286);
  drawTree(ctx, 306, 0);
  drawCornerCafe(ctx, day);
  drawPocketPark(ctx, day);
  drawTownhouse(ctx, 506, day, '#cfc6ba', '#3e546e');

  // Ultrawide right repeating street props
  for (let x = 626; x < bounds.maxX + 60; x += 74) {
    drawStreetLamp(ctx, x, day);
    drawTree(ctx, x + 24, x % 2);
    drawBench(ctx, x + 42);
  }
}
