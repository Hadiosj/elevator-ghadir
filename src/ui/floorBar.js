import { FLOOR_NAMES, FLOOR_SHORT, formatEur, getCampaignMetrics } from '../data/campaign.js';

export function createFloorBar(campaign, { onDonate }) {
  const { unlockedLevel, milestoneAmount } = getCampaignMetrics(campaign);

  const wrapper = document.createElement('section');
  wrapper.className = 'controls';

  const bar = document.createElement('div');
  bar.className = 'floor-bar';

  FLOOR_NAMES.forEach((label, level) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'floor-btn' + (level > unlockedLevel ? ' is-locked' : '');
    tile.setAttribute('aria-label', label);

    const subLabel = level > unlockedLevel ? formatEur(milestoneAmount(level)) : label;
    tile.innerHTML = `
      <span>${level > unlockedLevel ? '🔒 ' : ''}${FLOOR_SHORT[level]}</span>
      <span class="floor-sub">${subLabel}</span>
    `;

    bar.appendChild(tile);
  });

  const donateBtn = document.createElement('button');
  donateBtn.type = 'button';
  donateBtn.className = 'donate-btn';
  donateBtn.textContent = 'Donner';
  donateBtn.addEventListener('click', onDonate);

  wrapper.appendChild(bar);
  wrapper.appendChild(donateBtn);

  return { el: wrapper };
}
