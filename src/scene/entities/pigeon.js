import { rect } from '../sprites.js';

export function drawPigeon(ctx, tt) {
  const px = 60 + Math.sin(tt * 0.3) * 32;
  const pd = Math.cos(tt * 0.3) > 0 ? 1 : -1;
  const pb = ((tt * 2) | 0) % 2 ? 2 : 0;

  rect(ctx, px - 6, 40 + pb, 12, 8, '#9aa0a6');
  rect(ctx, pd > 0 ? px + 4 : px - 8, 36 + pb, 6, 6, '#7f868c');
  rect(ctx, pd > 0 ? px + 10 : px - 10, 38 + pb, 2, 2, '#f1c40f');
  rect(ctx, pd > 0 ? px + 6 : px - 6, 38 + pb, 2, 2, '#000000');
  rect(ctx, px - 2, 48, 2, 2, '#e67e22');
}
