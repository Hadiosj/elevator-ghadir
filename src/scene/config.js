export const CANVAS_W = 256;
export const CANVAS_H = 448;
export const FLOOR_H = 92;
export const GROUND_Y = 424;
export const TOP_OFFSET = 3 * FLOOR_H;

export const SHAFT_X = 20;
export const SHAFT_W = 32;
export const WALL_LEFT = 16;
export const WALL_RIGHT = 240;
export const ROOM_MID_X = 146;

export const SKIN_TONES = ['#f2c9a0', '#d9a066', '#a86b3c', '#7a4a2a'];
export const HAIR_COLORS = ['#2b1b12', '#5a3825', '#c9a227', '#141414'];
export const SHIRT_COLORS = [
  '#e74c3c',
  '#3498db',
  '#2ecc71',
  '#9b59b6',
  '#f39c12',
  '#1abc9c',
  '#e84393',
  '#34495e'
];
export const PANT_COLORS = ['#34495e', '#2c3e50', '#6c7a89', '#5d4037'];
export const BOOK_COLORS = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6'];

export const FLOOR_WALLS_LEFT = ['#d8dfe4', '#ebe5d5', '#f4f6f8', '#efe5d0'];
export const FLOOR_WALLS_RIGHT = ['#d8dfe4', '#ebe5d5', '#f4f6f8', '#efe5d0'];

export function mixColor(hexA, hexB, t) {
  const parse = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const a = parse(hexA);
  const b = parse(hexB);
  return (
    '#' +
    a
      .map((v, i) =>
        Math.round(v + (b[i] - v) * t)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}

export function getDayFactor(search = window.location.search) {
  const params = new URLSearchParams(search);
  const now = new Date();
  const hour = params.has('h')
    ? Number(params.get('h'))
    : now.getHours() + now.getMinutes() / 60;
  const safeHour = Number.isFinite(hour) ? hour : 12;
  return Math.max(0, Math.min(1, (6.5 - Math.abs(safeHour - 13)) / 2.5));
}

export const clamp01 = (v) => Math.max(0, Math.min(1, v));
export const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const randRange = (a, b) => a + Math.random() * (b - a);
