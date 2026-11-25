import { getCampaignMetrics } from '../data/campaign.js';
import {
  buildStaticScene,
  drawAnimatedCraneHook,
  drawAnimatedSky,
  drawFloorStatusOverlay,
  drawShaftBlueprint
} from './building.js';
import {
  CANVAS_H,
  CANVAS_W,
  FLOOR_H,
  GROUND_Y,
  SHAFT_W,
  SHAFT_X,
  clamp01,
  getDayFactor,
  mixColor,
  pickRandom,
  randRange
} from './config.js';
import { createCarsManager } from './entities/cars.js';
import { createCat } from './entities/cat.js';
import { createElevator } from './entities/elevator.js';
import {
  createAmbientCharacters,
  createPeopleManager,
  drawPerson,
  updateAmbientCharacters
} from './entities/people.js';
import { drawPigeon } from './entities/pigeon.js';
import { drawSecondFloorAnimated, drawSecondFloorForeground } from './floors/floor2.js';
import { drawParkingDoorAnimated } from './floors/parking.js';
import { rect } from './sprites.js';

const CONFETTI_COLORS = ['#ff7a1a', '#ffd23f', '#2ecc71', '#3498db', '#ff5d8f', '#ffffff'];
const MAX_SCENE_W = 1280;

export function mountScene({ canvasEl, campaign }) {
  const reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let reducedMotion = Boolean(reducedMotionQuery?.matches);
  const onMotionChange = (e) => {
    reducedMotion = e.matches;
  };
  reducedMotionQuery?.addEventListener?.('change', onMotionChange);

  let { progress, unlockedLevel } = getCampaignMetrics(campaign);
  let day = getDayFactor();
  let completed = progress >= 1;

  const bounds = {
    sceneW: CANVAS_W,
    offsetX: 0,
    minX: 0,
    maxX: CANVAS_W
  };

  const syncSkyTheme = (dayFactor) => {
    const topSky = mixColor('#0c1533', '#5baaf7', dayFactor);
    const botSky = mixColor('#263973', '#d4ecff', dayFactor);
    const rootEl = document.documentElement;
    rootEl.style.setProperty('--sky-top', topSky);
    rootEl.style.setProperty('--sky-bot', botSky);
    rootEl.dataset.sky = dayFactor >= 0.55 ? 'day' : 'night';
  };
  syncSkyTheme(day);

  canvasEl.width = bounds.sceneW;
  canvasEl.height = CANVAS_H;
  const ctx = canvasEl.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  let bgCanvas = buildStaticScene(day, completed, bounds);
  const elevator = createElevator();
  const peopleMgr = createPeopleManager(campaign.donors);
  const ambient = createAmbientCharacters();
  const carsMgr = createCarsManager();
  const cat = createCat();

  const wrapEl = canvasEl.parentElement;
  const stageEl = wrapEl?.parentElement || wrapEl;

  const updateViewportSize = () => {
    if (!stageEl || !wrapEl) return;
    const stageW = stageEl.clientWidth;
    const stageH = stageEl.clientHeight;
    if (stageW <= 0 || stageH <= 0) return;

    const stageRatio = stageW / stageH;
    const baseRatio = CANVAS_W / CANVAS_H;

    let nextW = CANVAS_W;
    if (stageRatio > baseRatio) {
      nextW = Math.min(MAX_SCENE_W, Math.max(CANVAS_W, Math.round(CANVAS_H * stageRatio)));
      if (nextW % 2 === 1) nextW += 1;
      wrapEl.style.width = `${stageW}px`;
      wrapEl.style.height = `${stageH}px`;
    } else {
      const fitH = Math.min(stageH, Math.round(stageW / baseRatio));
      const fitW = Math.round(fitH * baseRatio);
      wrapEl.style.width = `${fitW}px`;
      wrapEl.style.height = `${fitH}px`;
    }

    if (nextW !== bounds.sceneW) {
      bounds.sceneW = nextW;
      bounds.offsetX = Math.floor((nextW - CANVAS_W) / 2);
      bounds.minX = -bounds.offsetX;
      bounds.maxX = nextW - bounds.offsetX;
      canvasEl.width = bounds.sceneW;
      canvasEl.height = CANVAS_H;
      ctx.imageSmoothingEnabled = false;
      bgCanvas = buildStaticScene(day, completed, bounds);
    }
  };

  let resizeObserver = null;
  if (typeof ResizeObserver !== 'undefined' && stageEl) {
    resizeObserver = new ResizeObserver(updateViewportSize);
    resizeObserver.observe(stageEl);
  }
  updateViewportSize();

  const particles = [];

  const spawnMilestoneBurst = (level) => {
    if (reducedMotion) return;
    const fy = GROUND_Y - FLOOR_H * level;
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: SHAFT_X + SHAFT_W / 2 + randRange(-14, 24),
        y: fy - 24 + randRange(-10, 10),
        vx: randRange(-42, 68),
        vy: randRange(-85, -25),
        life: randRange(1.0, 2.0),
        color: pickRandom(CONFETTI_COLORS),
        size: Math.random() < 0.5 ? 2 : 3
      });
    }
  };

  const updateCampaign = (nextCampaign) => {
    const prevUnlocked = unlockedLevel;
    const metrics = getCampaignMetrics(nextCampaign);
    progress = metrics.progress;
    unlockedLevel = metrics.unlockedLevel;

    const nextCompleted = progress >= 1;
    if (nextCompleted !== completed) {
      completed = nextCompleted;
      bgCanvas = buildStaticScene(day, completed, bounds);
    }

    if (unlockedLevel > prevUnlocked) {
      for (let lv = prevUnlocked + 1; lv <= unlockedLevel; lv++) {
        spawnMilestoneBurst(lv);
      }
      elevator.inspectLevel(unlockedLevel);
    }
  };

  let tt = 0;
  let lastTs = 0;
  let lastDayCheck = 0;
  let doorOpen = 0;
  let rafId = 0;

  const frame = (ts) => {
    const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0);
    lastTs = ts;
    tt += dt;

    // Periodically refresh time-of-day sky every 60s for long-lived displays
    if (tt - lastDayCheck >= 60) {
      lastDayCheck = tt;
      const nextDay = getDayFactor();
      if (Math.abs(nextDay - day) > 0.03) {
        day = nextDay;
        syncSkyTheme(day);
        bgCanvas = buildStaticScene(day, completed, bounds);
      }
    }

    // Update entities
    peopleMgr.update(dt, tt, elevator, bounds);
    const doorWantOpen = peopleMgr.isDoorActive();
    if (reducedMotion) {
      doorOpen = doorWantOpen ? 1 : 0;
    } else {
      doorOpen = clamp01(doorOpen + (doorWantOpen ? dt * 3.8 : -dt * 3.0));
    }
    updateAmbientCharacters(ambient, dt, tt);
    elevator.update(dt, peopleMgr);
    carsMgr.update(dt, peopleMgr, bounds);
    cat.update(dt);

    // Update celebration & spark particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += 110 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    // Render scene (clear transparent sky first)
    ctx.clearRect(0, 0, bounds.sceneW, CANVAS_H);
    ctx.drawImage(bgCanvas, 0, 0);

    ctx.save();
    ctx.translate(bounds.offsetX, 0);

    drawAnimatedSky(ctx, day, tt, reducedMotion, bounds);
    drawAnimatedCraneHook(ctx, completed, tt, reducedMotion);
    drawShaftBlueprint(ctx, elevator.car.off);

    drawSecondFloorAnimated(ctx, GROUND_Y - 2 * FLOOR_H, tt, reducedMotion);
    drawParkingDoorAnimated(ctx, GROUND_Y, day, doorOpen);

    carsMgr.draw(ctx, day);
    cat.draw(ctx, tt);

    for (const amb of ambient) {
      if (amb.behindDesk) {
        drawPerson(ctx, amb, amb.x, GROUND_Y - FLOOR_H * amb.lv);
      }
    }

    drawSecondFloorForeground(ctx, GROUND_Y - 2 * FLOOR_H);

    for (const amb of ambient) {
      if (!amb.behindDesk) {
        drawPerson(ctx, amb, amb.x, GROUND_Y - FLOOR_H * amb.lv);
      }
    }

    elevator.draw(ctx);
    peopleMgr.draw(ctx);

    const waitingFloors = new Set();
    for (const q of peopleMgr.people) {
      if (q.s === 'wait') waitingFloors.add(q.lv);
    }
    drawFloorStatusOverlay(ctx, waitingFloors);

    carsMgr.drawTraffic(ctx, day);
    drawPigeon(ctx, tt);

    // Render particles on top
    for (const p of particles) {
      ctx.globalAlpha = Math.min(1, p.life * 2);
      rect(ctx, p.x, p.y, p.size, p.size, p.color);
    }
    ctx.globalAlpha = 1;

    ctx.restore();

    rafId = requestAnimationFrame(frame);
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (!rafId) {
      lastTs = performance.now();
      rafId = requestAnimationFrame(frame);
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  rafId = requestAnimationFrame(frame);

  return {
    updateCampaign,
    destroy: () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotionQuery?.removeEventListener?.('change', onMotionChange);
    }
  };
}
