import { rect } from '../sprites.js';

export function drawPigeon(ctx, tt) {
  // Periodic brief peck pause every ~9 seconds
  const cycle = tt % 9;
  const isPecking = cycle > 7.6;
  const moveTime = isPecking ? Math.floor(tt / 9) * 7.6 + 7.6 : Math.floor(tt / 9) * 7.6 + cycle;

  const px = 64 + Math.sin(moveTime * 0.4) * 34;
  const pd = Math.cos(moveTime * 0.4) >= 0 ? 1 : -1;
  const step = isPecking ? 0 : ((tt * 5) | 0) % 2;
  const pb = step ? 1 : 0;
  const peckDip = isPecking && (((tt * 6) | 0) % 2) ? 4 : 0;

  // Body
  rect(ctx, px - 6, 40 + pb, 12, 7, '#9aa0a6');
  rect(ctx, px - 4, 42 + pb, 6, 3, '#7f868c');
  // Head & beak (dips when pecking)
  const hx = pd > 0 ? px + 4 : px - 8;
  rect(ctx, hx, 36 + pb + peckDip, 6, 6, '#7f868c');
  rect(ctx, pd > 0 ? px + 10 : px - 10, 38 + pb + peckDip, 2, 2, '#f1c40f');
  rect(ctx, pd > 0 ? px + 7 : px - 6, 38 + pb + peckDip, 1, 1, '#000000');
  // Two alternating legs
  rect(ctx, px - 2 + (step ? 1 : -1), 47, 2, 3, '#e67e22');
  rect(ctx, px + 1 - (step ? 1 : -1), 47, 2, 3, '#d35400');
}
