import { FLOOR_NAMES, formatEur, getCampaignMetrics } from '../data/campaign.js';

export function createHeader(campaign, { onDonate }) {
  const el = document.createElement('header');
  el.className = 'hdr';

  el.innerHTML = `
    <h1 class="hdr-title">Contribuer à l'ascenseur de votre centre</h1>
    <div class="hdr-mid">
      <div class="amt-block">
        <div class="amt-row">
          <span class="amt-main"></span>
          <span class="amt-goal"></span>
          <span class="pct-badge"></span>
        </div>
        <div class="progress-track" role="progressbar" aria-label="Progression de la collecte" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-fill"></div>
          <div class="progress-tick" style="left: 33.33%"></div>
          <div class="progress-tick" style="left: 66.66%"></div>
        </div>
      </div>
      <button type="button" class="donate-btn">Donner</button>
    </div>
    <div class="nxt-line"></div>
  `;

  const amtMainEl = el.querySelector('.amt-main');
  const amtGoalEl = el.querySelector('.amt-goal');
  const pctBadgeEl = el.querySelector('.pct-badge');
  const trackEl = el.querySelector('.progress-track');
  const fillEl = el.querySelector('.progress-fill');
  const nxtLineEl = el.querySelector('.nxt-line');
  const donateBtn = el.querySelector('.donate-btn');

  donateBtn.addEventListener('click', onDonate);

  const update = (data) => {
    const { progress, percent, nextLevel, milestoneAmount } = getCampaignMetrics(data);

    amtMainEl.textContent = formatEur(data.raised);
    amtGoalEl.textContent = `sur ${formatEur(data.goal)}`;
    pctBadgeEl.textContent = `${percent}\u00a0%`;
    trackEl.setAttribute('aria-valuenow', String(percent));
    fillEl.style.width = `${(progress * 100).toFixed(2)}%`;

    if (nextLevel < 0) {
      nxtLineEl.textContent = 'Objectif atteint — merci à tous !';
    } else {
      const remaining = Math.max(0, milestoneAmount(nextLevel) - data.raised);
      nxtLineEl.innerHTML = `Prochain palier : <strong>${FLOOR_NAMES[nextLevel]}</strong> (${formatEur(
        milestoneAmount(nextLevel)
      )}) · encore ${formatEur(remaining)}`;
    }
  };

  update(campaign);

  return { el, update };
}
