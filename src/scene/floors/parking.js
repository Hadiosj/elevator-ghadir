import { rect } from '../sprites.js';

export function drawParkingFloor(ctx, fy) {
  // Single simple ground-level garden strip across the entire building (x: 52..238)
  rect(ctx, 52, fy - 6, 186, 6, '#3f9b4a');
  rect(ctx, 52, fy - 6, 186, 2, '#6cc070');
  rect(ctx, 52, fy - 1, 186, 1, '#2b6e33');

  // Low garden shrubs & flowers evenly spaced across the full width
  const flowerColors = ['#ff5d8f', '#ffd23f', '#ffffff', '#b57bff'];
  for (let i = 0; i < 18; i++) {
    const fx = 56 + i * 10;
    rect(ctx, fx, fy - 8, 4, 2, '#4caf50');
    rect(ctx, fx + 1, fy - 9, 2, 2, flowerColors[i % flowerColors.length]);
  }
}
