import { FLOOR_NAMES, formatEur, getCampaignMetrics } from '../data/campaign.js';

export function createHeader(campaign, { onDonate }) {
  const el = document.createElement('header');
  el.className = 'hdr';

  const render = (data) => {
    const { progress, percent, nextLevel, milestoneAmount } = getCampaignMetrics(data);
    const nextText =
      nextLevel < 0
        ? 'Objectif atteint — merci à tous !'
        : `Prochain palier : <strong>${FLOOR_NAMES[nextLevel]}</strong> (${formatEur(
            milestoneAmount(nextLevel)
          )}) · encore ${formatEur(Math.max(0, milestoneAmount(nextLevel) - data.raised))}`;

    el.innerHTML = `
      <h1 class="hdr-title">Contribuer à l'ascenseur de votre centre</h1>
      <div class="hdr-mid">
        <div class="amt-block">
          <div class="amt-row">
            <span class="amt-main">${formatEur(data.raised)}</span>
            <span class="amt-goal">sur ${formatEur(data.goal)}</span>
            <span class="pct-badge">${percent}\u00a0%</span>
          </div>
          <div class="progress-track" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-fill" style="width: ${(progress * 100).toFixed(2)}%"></div>
            <div class="progress-tick" style="left: 33.33%"></div>
            <div class="progress-tick" style="left: 66.66%"></div>
          </div>
        </div>
        <button type="button" class="donate-btn">Donner</button>
      </div>
      <div class="nxt-line">${nextText}</div>
    `;

    el.querySelector('.donate-btn').addEventListener('click', onDonate);
  };

  render(campaign);

  return { el, update: render };
}
