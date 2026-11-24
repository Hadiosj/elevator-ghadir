import {
  FLOOR_H,
  GROUND_Y,
  HAIR_COLORS,
  PANT_COLORS,
  SHIRT_COLORS,
  SKIN_TONES,
  pickRandom,
  randRange
} from '../config.js';
import { rect } from '../sprites.js';

const HIJAB_COLORS = ['#1b1e24', '#6b1d2f', '#ece6da', '#243b6b', '#4d3b32', '#1f5442'];

const SPOTS = {
  1: [
    { x: 102, p: 'read', b: '#1e7a4a', d: 1 },
    { x: 118, p: 'pray', d: 1 },
    { x: 132, p: 'read', b: '#1e7a4a', d: 1 }
  ],
  2: [
    { x: 64, p: 'sit' },
    { x: 135, p: 'sit', d: -1 },
    { x: 152, p: 'sit' },
    { x: 186, p: 'sit', d: -1 }
  ],
  3: [
    { x: 106, oy: -4, p: 'read', b: '#c0392b', d: 1 },
    { x: 118, p: 'read', b: '#2e8b57', d: -1 }
  ]
};

export function createAmbientCharacters() {
  return [
    // 1st floor: Sheikh + Jamaa
    { n: 'Sheikh', lv: 1, x: 204, p: 'stand', jamaa: true, sheikh: true, sh: '#17181d', hr: '#d8d8d8', pt: '#17181d', sk: '#f2c9a0', d: 1 },
    { n: 'Fidèle', lv: 1, x: 184, p: 'stand', jamaa: true, sh: '#2c3e50', hr: '#2b1b12', pt: '#1f2937', d: 1 },
    { n: 'Fidèle', lv: 1, x: 164, p: 'stand', jamaa: true, sh: '#1f242b', hr: '#5a3825', pt: '#2c3e50', d: 1 },
    { n: 'Fidèle', lv: 1, x: 144, p: 'stand', jamaa: true, sh: '#3b4252', hr: '#141414', pt: '#1f2937', d: 1 },

    // 2nd floor: Scout blue room (active even before elevator reaches floor 2)
    { n: 'Chef au pupitre', lv: 2, x: 101, p: 'stand', oy: -9, behindDesk: true, sh: '#d9c9a0', nk: '#1c3278', hr: '#2b1b12', d: 1, fidget: true },
    { n: 'Éclaireuse', lv: 2, x: 146, p: 'stand', sh: '#d9c9a0', nk: '#c81e1e', hijab: true, hj: '#6b1d2f', d: -1, roamMin: 132, roamMax: 188, tx: 172, t: 3 },
    { n: 'Éclaireur', lv: 2, x: 186, p: 'sit', sh: '#d9c9a0', nk: '#0e6b2f', hr: '#2b1b12', d: -1, roamMin: 60, roamMax: 192, tx: 66, t: 4 },

    // 3rd floor: Tall teacher at chalkboard + 3 students seated lower in chairs at their desks
    { n: 'La professeure', lv: 3, x: 134, p: 'stand', tall: true, sh: '#8e44ad', hijab: true, hj: '#ece6da', d: 1, teachClass: true, roamMin: 126, roamMax: 144, tx: 142, t: 2 },
    { n: 'Élève 1', lv: 3, x: 168, oy: -3, p: 'sit', sh: '#3498db', hr: '#2b1b12', d: -1, seatSlot: 0 },
    { n: 'Élève 2', lv: 3, x: 196, oy: -3, p: 'sit', sh: '#16a085', hijab: true, hj: '#1b1e24', d: -1, seatSlot: 1 },
    { n: 'Élève 3', lv: 3, x: 224, oy: -3, p: 'sit', sh: '#e67e22', hijab: true, hj: '#6b1d2f', d: -1, seatSlot: 2 }
  ].map((o) => ({
    sk: pickRandom(SKIN_TONES),
    pt: '#34495e',
    a2: Math.random() * 6,
    mvg: 0,
    ...o
  }));
}

export function getJamaaState(tt) {
  const phase = tt % 28;
  if (phase < 14) {
    let pose = 'sit';
    if (phase < 4) pose = 'stand';
    else if (phase < 6.5) pose = 'bow';
    else if (phase < 8) pose = 'stand';
    else if (phase < 11.5) pose = 'pray';
    return { mode: 'pray', pose };
  }
  return { mode: 'speech', pose: 'sit', gesture: ((tt * 3) | 0) % 2 };
}

export function updateAmbientCharacters(ambient, dt, tt) {
  const jamaa = getJamaaState(tt);
  for (const amb of ambient) {
    amb.a2 += dt * 7;

    if (amb.jamaa) {
      if (jamaa.mode === 'speech') {
        if (amb.sheikh) {
          amb.pose = 'stand';
          amb.d = -1;
          amb.speaking = true;
          amb.gesture = jamaa.gesture;
        } else {
          amb.pose = 'sit';
          amb.d = 1;
        }
      } else {
        amb.pose = jamaa.pose;
        amb.d = 1;
        amb.speaking = false;
      }
      amb.mvg = 0;
      continue;
    }

    if (amb.fidget) {
      amb.mvg = 0;
      amb.d = ((tt * 0.4) | 0) % 2 ? 1 : -1;
      continue;
    }

    if (amb.seatSlot != null) {
      // Students seated in chairs: alternate listening and occasionally raising a hand
      amb.pose = 'sit';
      amb.d = -1;
      amb.mvg = 0;
      const cycle = (tt + amb.seatSlot * 4.5) % 15;
      amb.handUp = cycle > 11.5;
      continue;
    }

    if (amb.roamMin != null) {
      if (amb.t > 0) {
        amb.t -= dt;
        amb.mvg = 0;
        if (amb.teachClass) {
          amb.d = 1;
          amb.speaking = ((tt * 3) | 0) % 2 === 0;
        }
        if (amb.t <= 0) {
          amb.pose = 'stand';
          amb.speaking = false;
          amb.tx = randRange(amb.roamMin, amb.roamMax);
        }
      } else {
        const dx = amb.tx - amb.x;
        if (Math.abs(dx) < 2) {
          amb.x = amb.tx;
          amb.mvg = 0;
          amb.t = randRange(3, 7);
          if (amb.teachClass) {
            amb.pose = 'stand';
            amb.d = 1;
          } else if (amb.lv === 2 && Math.random() < 0.5) {
            amb.pose = 'sit';
          } else {
            amb.pose = 'stand';
          }
        } else {
          amb.pose = 'stand';
          amb.d = Math.sign(dx);
          amb.x += amb.d * (amb.teachClass ? 12 : 20) * dt;
          amb.mvg = 1;
        }
      }
    }
  }
}

function drawSheikh(ctx, person, x, fy, pose) {
  const d = person.d || 1;

  if (pose === 'pray') {
    rect(ctx, x - 9, fy - 2, 20, 2, '#c9a86a');
    rect(ctx, x - 7, fy - 10, 11, 8, '#17181d');
    rect(ctx, x + 3, fy - 7, 5, 5, person.sk);
    rect(ctx, x + 2, fy - 10, 7, 4, '#f7f7f7');
    rect(ctx, x + 2, fy - 8, 7, 1, '#d8dee9');
    return;
  }

  if (pose === 'bow') {
    rect(ctx, x - 4, fy - 8, 9, 8, '#17181d');
    rect(ctx, x - 3, fy - 13, 10, 5, '#17181d');
    rect(ctx, x + 6, fy - 14, 5, 5, person.sk);
    rect(ctx, x + 5, fy - 17, 7, 4, '#f7f7f7');
    rect(ctx, x + 5, fy - 15, 7, 1, '#d8dee9');
    return;
  }

  if (pose === 'sit') {
    rect(ctx, x - 5, fy - 12, 11, 12, '#17181d');
    rect(ctx, d > 0 ? x + 1 : x - 2, fy - 12, 2, 12, '#2d313b');
    rect(ctx, x - 3, fy - 17, 6, 5, person.sk);
    rect(ctx, x - 3, fy - 14, 6, 2, person.hr);
    rect(ctx, x - 4, fy - 21, 9, 4, '#f7f7f7');
    rect(ctx, x - 3, fy - 22, 7, 1, '#ffffff');
    rect(ctx, x - 4, fy - 19, 9, 1, '#d8dee9');
    return;
  }

  rect(ctx, x - 5, fy - 14, 11, 14, '#17181d');
  rect(ctx, d > 0 ? x + 1 : x - 2, fy - 14, 2, 14, '#2d313b');
  rect(ctx, x - 3, fy - 19, 6, 5, person.sk);
  rect(ctx, x - 3, fy - 16, 6, 2, person.hr);
  rect(ctx, x - 4, fy - 23, 9, 4, '#f7f7f7');
  rect(ctx, x - 3, fy - 24, 7, 1, '#ffffff');
  rect(ctx, x - 4, fy - 21, 9, 1, '#d8dee9');

  if (person.speaking) {
    const handY = person.gesture ? fy - 13 : fy - 11;
    rect(ctx, x + d * 5, handY, 2, 2, person.sk);
  }
}

function drawHead(ctx, person, x, headTopY, d) {
  if (person.hijab) {
    const hj = person.hj || '#1b1e24';
    // Hijab wrap around crown, back of head, and shoulders
    rect(ctx, x - 4, headTopY - 1, 8, 7, hj);
    rect(ctx, d > 0 ? x - 1 : x - 3, headTopY + 1, 4, 4, person.sk);
    rect(ctx, d > 0 ? x + 1 : x - 2, headTopY + 2, 1, 1, '#1f242b');
    rect(ctx, x - 4, headTopY + 6, 8, 2, hj);
    return;
  }
  rect(ctx, x - 3, headTopY, 6, 6, person.sk);
  rect(ctx, x - 3, headTopY, 6, 2, person.hr);
  rect(ctx, d > 0 ? x + 1 : x - 2, headTopY + 3, 1, 1, '#1f242b');
}

export function drawPerson(ctx, person, x, fyBase) {
  const fy = fyBase + (person.oy || 0);
  const pose = person.pose || person.p || 'stand';

  if (person.sheikh) {
    drawSheikh(ctx, person, x, fy, pose);
    return;
  }

  const bob = person.mvg && ((person.a2 | 0) % 2) ? 2 : 0;
  const y = fy - bob;
  const d = person.d || 1;
  const hj = person.hj || '#1b1e24';

  const drawTierHat = (topY) => {
    if (person.a >= 500) {
      rect(ctx, x - 3, topY - 4, 7, 2, '#f1c40f');
      rect(ctx, x - 3, topY - 6, 2, 2, '#f1c40f');
      rect(ctx, x + 2, topY - 6, 2, 2, '#f1c40f');
    } else if (person.a >= 200) {
      rect(ctx, x - 4, topY - 2, 9, 2, person.sh);
    }
  };

  if (pose === 'pray') {
    rect(ctx, x - 8, fy - 2, 18, 2, '#c9a86a');
    if (d > 0) {
      rect(ctx, x - 6, fy - 9, 10, 4, person.sh);
      rect(ctx, x - 6, fy - 5, 11, 3, person.pt);
      rect(ctx, x + 3, fy - 7, 5, 5, person.hijab ? hj : person.sk);
      if (person.hijab) rect(ctx, x + 6, fy - 5, 2, 3, person.sk);
    } else {
      rect(ctx, x - 4, fy - 9, 10, 4, person.sh);
      rect(ctx, x - 5, fy - 5, 11, 3, person.pt);
      rect(ctx, x - 8, fy - 7, 5, 5, person.hijab ? hj : person.sk);
      if (person.hijab) rect(ctx, x - 8, fy - 5, 2, 3, person.sk);
    }
    return;
  }

  if (pose === 'bow') {
    rect(ctx, x - 3, fy - 6, 3, 6, person.pt);
    rect(ctx, x + 1, fy - 6, 3, 6, person.pt);
    if (d > 0) {
      rect(ctx, x - 3, fy - 11, 9, 5, person.sh);
      drawHead(ctx, person, x + 7, fy - 12, d);
    } else {
      rect(ctx, x - 6, fy - 11, 9, 5, person.sh);
      drawHead(ctx, person, x - 7, fy - 12, d);
    }
    return;
  }

  if (pose === 'sit' || pose === 'read') {
    rect(ctx, x - 4, fy - 10, 9, 6, person.sh);
    rect(ctx, d > 0 ? x - 4 : x - 6, fy - 4, 11, 4, person.pt);
    drawHead(ctx, person, x, fy - 16, d);
    if (person.nk) {
      rect(ctx, x - 3, fy - 10, 7, 2, person.nk);
    }
    if (person.handUp) {
      const hx = d > 0 ? x + 4 : x - 5;
      rect(ctx, hx, fy - 17, 2, 7, person.sh);
      rect(ctx, hx, fy - 19, 2, 2, person.sk);
    }
    drawTierHat(fy - 16);
    if (pose === 'read') {
      rect(ctx, x + d * 6 - 2, fy - 10, 6, 6, person.book || person.b || '#3498db');
      rect(ctx, x + d * 6, fy - 8, 2, 2, '#ffffff');
    }
    return;
  }

  // Standing / walking
  const tallExtra = person.tall ? 4 : 0;
  const stride = person.mvg ? (((person.a2 | 0) % 2) ? 1 : -1) : 0;
  if (person.hijab) {
    // Modest tunic/dress silhouette
    rect(ctx, x - 4, y - 12 - tallExtra, 9, 9 + tallExtra, person.sh);
    rect(ctx, x - 3 + stride, y - 3, 3, 2, person.pt);
    rect(ctx, x + 1 - stride, y - 3, 3, 2, person.pt);
    rect(ctx, x - 3 + stride, y - 1, 3, 1, '#1b1e24');
    rect(ctx, x + 1 - stride, y - 1, 3, 1, '#1b1e24');
  } else {
    const legH = 6 + Math.floor(tallExtra / 2);
    const legY = y - legH;
    rect(ctx, x - 4, y - 12 - tallExtra, 9, 6 + Math.ceil(tallExtra / 2), person.sh);
    rect(ctx, x - 3 + stride, legY, 3, legH - 1, person.pt);
    rect(ctx, x + 1 - stride, legY, 3, legH - 1, person.pt);
    rect(ctx, x - 3 + stride, y - 1, 3, 1, '#1b1e24');
    rect(ctx, x + 1 - stride, y - 1, 3, 1, '#1b1e24');
  }
  drawHead(ctx, person, x, y - 18 - tallExtra, d);
  if (person.nk) {
    rect(ctx, x - 3, y - 12 - tallExtra, 7, 2, person.nk);
  }
  if (person.speaking) {
    rect(ctx, x + d * 5, y - 12 - tallExtra, 2, 2, person.sk);
  }
  drawTierHat(y - 18 - tallExtra);
}

export function createPeopleManager(donors, unlockedLevel) {
  let maxLevel = unlockedLevel;

  const people = donors.map((donor, idx) => {
    const isWoman = idx % 2 === 1;
    return {
      n: donor.anon ? 'Anonyme' : donor.n,
      a: donor.a,
      sk: pickRandom(SKIN_TONES),
      hr: pickRandom(HAIR_COLORS),
      sh: pickRandom(SHIRT_COLORS),
      pt: pickRandom(PANT_COLORS),
      hijab: isWoman,
      hj: isWoman ? pickRandom(HIJAB_COLORS) : null,
      s: 'off',
      t: randRange(0, 25),
      lv: 0,
      x: -40,
      tx: 0,
      d: 1,
      a2: Math.random() * 9,
      wt: 0,
      goal: 1,
      pose: 'stand',
      spot: null,
      book: null
    };
  });

  const goQueue = (q) => {
    const waitingCount = people.filter(
      (o) => o !== q && o.lv === q.lv && ['toq', 'wait', 'board'].includes(o.s)
    ).length;
    q.tx = Math.min(220, 62 + 8 * waitingCount);
    q.s = 'toq';
  };

  const DOOR_X = 87;

  const spawn = (q, x) => {
    q.lv = 0;
    q.oy = 0;
    q.pose = 'stand';
    q.x = x;
    if (maxLevel > 0) {
      if (Math.random() < 0.35) {
        q.tx = DOOR_X;
        q.s = 'todoor';
      } else {
        q.goal = 1 + Math.floor(Math.random() * maxLevel);
        goQueue(q);
      }
    } else if (Math.random() < 0.55) {
      q.tx = DOOR_X;
      q.s = 'todoor';
    } else {
      q.s = 'stroll';
      q.tx = randRange(68, 220);
    }
  };

  const pickSpot = (q, level) => {
    const free = (SPOTS[level] || []).filter(
      (spot) =>
        !people.some((o) => o !== q && o.spot === spot && (o.s === 'act' || o.s === 'toact'))
    );
    return free.length ? pickRandom(free) : null;
  };

  const startAct = (q, level, spot) => {
    q.lv = level;
    q.x = spot.x;
    q.oy = spot.oy || 0;
    q.spot = spot;
    q.pose = spot.p;
    q.book = spot.b;
    q.d = spot.d || 1;
    q.s = 'act';
    q.t = randRange(5, 25);
  };

  const afterExit = (q, level) => {
    q.lv = level;
    q.x = 28 + 8 * (q.slot || 0);
    q.oy = 0;
    q.pose = 'stand';
    if (level === 0) {
      q.s = 'leave';
      return;
    }
    const spot = pickSpot(q, level);
    if (spot) {
      q.spot = spot;
      q.tx = spot.x;
      q.s = 'toact';
    } else {
      goQueue(q);
    }
  };

  if (maxLevel > 0) {
    people.slice(0, 5).forEach((q) => {
      const level = 1 + Math.floor(Math.random() * maxLevel);
      const spot = pickSpot(q, level);
      if (spot) {
        startAct(q, level, spot);
        q.t = randRange(3, 14);
      }
    });
    people.slice(5, 7).forEach((q, idx) => {
      spawn(q, 76 + idx * 24);
    });
  }

  const setUnlockedLevel = (nextLevel) => {
    const prev = maxLevel;
    maxLevel = nextLevel;
    if (prev === 0 && maxLevel > 0) {
      for (const q of people) {
        if (q.s === 'stroll' || q.s === 'pause') {
          q.goal = 1 + Math.floor(Math.random() * maxLevel);
          goQueue(q);
        }
      }
    }
    for (const q of people) {
      if (q.goal > maxLevel) {
        q.goal = maxLevel > 0 ? 1 + Math.floor(Math.random() * maxLevel) : 0;
      }
      if (maxLevel === 0 && q.s !== 'off' && q.s !== 'ride' && q.s !== 'leave') {
        q.lv = 0;
        q.oy = 0;
        q.pose = 'stand';
        q.spot = null;
        q.s = 'stroll';
        q.tx = randRange(68, 220);
      } else if (q.lv > maxLevel) {
        q.lv = maxLevel;
        q.oy = 0;
        q.pose = 'stand';
        q.spot = null;
        goQueue(q);
      }
    }
  };

  const update = (dt, tt, elevator) => {
    for (const q of people) {
      q.a2 += dt * 8;
      q.mvg = 0;

      const moveTo = (speed) => {
        const dx = q.tx - q.x;
        if (Math.abs(dx) < 1.5) {
          q.x = q.tx;
          return true;
        }
        q.x += Math.sign(dx) * speed * dt;
        q.d = Math.sign(dx);
        q.mvg = 1;
        return false;
      };

      switch (q.s) {
        case 'off':
          if ((q.t -= dt) <= 0) {
            if (Math.random() < 0.28) {
              // Emerge directly from the ground-floor entrance door
              q.lv = 0;
              q.oy = 0;
              q.pose = 'stand';
              q.x = DOOR_X;
              q.fromDoor = true;
              q.s = 'leave';
            } else {
              spawn(q, Math.random() < 0.5 ? -12 : 268);
            }
          }
          break;
        case 'todoor':
          if (moveTo(28)) {
            q.s = 'indoor';
            q.t = randRange(6, 16);
          }
          break;
        case 'indoor':
          if ((q.t -= dt) <= 0) {
            q.lv = 0;
            q.oy = 0;
            q.x = DOOR_X;
            q.pose = 'stand';
            q.fromDoor = true;
            q.s = 'leave';
          }
          break;
        case 'stroll':
          if (moveTo(28)) {
            q.s = 'pause';
            q.t = randRange(3, 7);
          }
          break;
        case 'pause':
          if ((q.t -= dt) <= 0) {
            q.s = 'leave';
          }
          break;
        case 'toq':
          if (moveTo(28)) {
            q.s = 'wait';
            q.wt = tt;
          }
          break;
        case 'board':
          if (moveTo(36)) {
            const car = elevator.car;
            if (
              car.levelAt(car.off) === q.lv &&
              car.open > 0.5 &&
              car.riders.length < 3
            ) {
              q.s = 'ride';
              q.dest = q.lv === 0 ? q.goal : 0;
              car.riders.push(q);
            } else {
              goQueue(q);
            }
          }
          break;
        case 'toact':
          if (moveTo(28)) {
            q.s = 'act';
            q.oy = q.spot.oy || 0;
            q.pose = q.spot.p;
            q.book = q.spot.b;
            q.d = q.spot.d || 1;
            q.t = randRange(12, 32);
          }
          break;
        case 'act':
          if ((q.t -= dt) <= 0) {
            q.pose = 'stand';
            q.oy = 0;
            q.spot = null;
            goQueue(q);
          }
          break;
        case 'leave':
          q.tx = q.x < 128 ? -16 : 272;
          if (q.fromDoor && Math.abs(q.x - DOOR_X) > 20) {
            q.fromDoor = false;
          }
          if (moveTo(32)) {
            q.fromDoor = false;
            q.s = 'off';
            q.t = randRange(4, 14);
          }
          break;
        default:
          break;
      }
    }
  };

  const draw = (ctx) => {
    for (const q of people) {
      if (q.s !== 'ride' && q.s !== 'off' && q.s !== 'indoor') {
        drawPerson(ctx, q, q.x, GROUND_Y - FLOOR_H * q.lv);
      }
    }
  };

  const isDoorActive = () =>
    people.some(
      (q) =>
        q.lv === 0 &&
        Math.abs(q.x - DOOR_X) < 18 &&
        (q.s === 'todoor' || (q.s === 'leave' && q.fromDoor))
    );

  return { people, spawn, afterExit, update, draw, setUnlockedLevel, isDoorActive };
}
