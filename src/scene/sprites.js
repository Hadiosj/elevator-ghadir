export function rect(ctx, x, y, w, h, color, ox = 0) {
  ctx.fillStyle = color;
  ctx.fillRect((x + ox) | 0, y | 0, w | 0, h | 0);
}

export function drawGridSprite(ctx, x, y, rows, palette, pixelSize = 1, flipX = false) {
  const cols = rows[0]?.length || 0;
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < cols; c++) {
      const ch = row[c];
      const color = palette[ch];
      if (!color) continue;
      const drawCol = flipX ? cols - 1 - c : c;
      ctx.fillStyle = color;
      ctx.fillRect(
        (x + drawCol * pixelSize) | 0,
        (y + r * pixelSize) | 0,
        pixelSize,
        pixelSize
      );
    }
  }
}

const spriteCache = new Map();

export function loadSprite(src) {
  if (spriteCache.has(src)) {
    return spriteCache.get(src);
  }
  const entry = { img: new Image(), loaded: false };
  entry.img.onload = () => {
    entry.loaded = true;
  };
  entry.img.src = src;
  spriteCache.set(src, entry);
  return entry;
}

export function drawSprite(ctx, entry, x, y, w, h) {
  if (!entry?.loaded) return false;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(entry.img, x | 0, y | 0, w | 0, h | 0);
  return true;
}
