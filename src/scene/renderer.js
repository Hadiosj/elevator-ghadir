import { getCampaignMetrics } from '../data/campaign.js';
import { buildStaticScene } from './building.js';
import {
  CANVAS_H,
  CANVAS_W,
  FLOOR_H,
  GROUND_Y,
  SHAFT_X,
  TOP_OFFSET,
  getDayFactor
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
import { rect } from './sprites.js';

export function mountScene({ canvasEl, campaign }) {
  let { progress, unlockedLevel } = getCampaignMetrics(campaign);
  let reach = progress * TOP_OFFSET;
  const day = getDayFactor();

  canvasEl.width = CANVAS_W;
  canvasEl.height = CANVAS_H;
  const ctx = canvasEl.getContext('2d');

  let bgCanvas = buildStaticScene(day, progress);
  const elevator = createElevator(unlockedLevel);
  const peopleMgr = createPeopleManager(campaign.donors, unlockedLevel);
  const ambient = createAmbientCharacters();
  const carsMgr = createCarsManager();
  const cat = createCat();

  const updateCampaign = (nextCampaign) => {
    const metrics = getCampaignMetrics(nextCampaign);
    progress = metrics.progress;
    unlockedLevel = metrics.unlockedLevel;
    reach = progress * TOP_OFFSET;
    bgCanvas = buildStaticScene(day, progress);
    elevator.setUnlockedLevel(unlockedLevel);
    peopleMgr.setUnlockedLevel(unlockedLevel);
  };

  let tt = 0;
  let lastTs = 0;
  let rafId = 0;

  const frame = (ts) => {
    const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0);
    lastTs = ts;
    tt += dt;

    peopleMgr.update(dt, tt, elevator);
    updateAmbientCharacters(ambient, dt, tt);
    elevator.update(dt, peopleMgr);
    carsMgr.update(dt, peopleMgr);
    cat.update(dt);

    ctx.drawImage(bgCanvas, 0, 0);

    // Subtle animated construction spark on barrier
    if (progress < 1) {
      rect(ctx, SHAFT_X + (((tt * 20) | 0) % 28), GROUND_Y - reach, 4, 2, '#ffffff');
    }

    drawSecondFloorAnimated(ctx, GROUND_Y - 2 * FLOOR_H, tt);

    carsMgr.draw(ctx, day);
    cat.draw(ctx, tt);

    for (const amb of ambient) {
      drawPerson(ctx, amb, amb.x, GROUND_Y - FLOOR_H * amb.lv);
    }

    drawSecondFloorForeground(ctx, GROUND_Y - 2 * FLOOR_H);
    elevator.draw(ctx);
    peopleMgr.draw(ctx);
    drawPigeon(ctx, tt);

    rafId = requestAnimationFrame(frame);
  };

  rafId = requestAnimationFrame(frame);

  return {
    updateCampaign,
    destroy: () => {
      cancelAnimationFrame(rafId);
    }
  };
}
