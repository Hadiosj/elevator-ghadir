import { FLOOR_NAMES, formatEur, getCampaignMetrics } from '../data/campaign.js';

export function createHeader(campaign, { onDonate }) {
  const el = document.createElement('header');
  el.className = 'hdr';
  const iconSrc = `${import.meta.env.BASE_URL}al-ghadir-icon.png`;

  el.innerHTML = `
    <div class="hdr-top">
      <div class="hdr-brand">
        <div class="hdr-logo-wrap">
          <img class="hdr-logo" src="${iconSrc}" alt="Centre Al Ghadir" width="32" height="32" />
        </div>
        <div class="hdr-info">
          <div class="hdr-eyebrow">Centre Al Ghadir · L'ascenseur</div>
          <div class="amt-row">
            <span class="amt-main"></span>
            <span class="amt-goal"></span>
          </div>
        </div>
      </div>
      <button type="button" class="donate-btn">Donner</button>
    </div>
    <div class="progress-track" role="progressbar" aria-label="Progression de la collecte" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-fill"></div>
      <div class="progress-tick" style="left: 33.33%"></div>
      <div class="progress-tick" style="left: 66.66%"></div>
    </div>
    <div class="nxt-line"></div>
  `;

  const amtMainEl = el.querySelector('.amt-main');
  const amtGoalEl = el.querySelector('.amt-goal');
  const trackEl = el.querySelector('.progress-track');
  const fillEl = el.querySelector('.progress-fill');
  const nxtLineEl = el.querySelector('.nxt-line');
  const donateBtn = el.querySelector('.donate-btn');

  donateBtn.addEventListener('click', onDonate);

  const update = (data) => {
    const { progress, percent, nextLevel, milestoneAmount } = getCampaignMetrics(data);

    amtMainEl.textContent = formatEur(data.raised);
    amtGoalEl.textContent = `/ ${formatEur(data.goal)}`;
    trackEl.setAttribute('aria-valuenow', String(percent));
    fillEl.style.width = `${(progress * 100).toFixed(2)}%`;

    if (nextLevel < 0) {
      nxtLineEl.textContent = `${percent}\u00a0% · Objectif atteint — merci à tous !`;
    } else {
      const remaining = Math.max(0, milestoneAmount(nextLevel) - data.raised);
      nxtLineEl.innerHTML = `<span class="nxt-pct">${percent}\u00a0%</span> · <strong>${FLOOR_NAMES[nextLevel]}</strong> dans ${formatEur(remaining)}`;
    }
  };

  update(campaign);

  return { el, update };
}
