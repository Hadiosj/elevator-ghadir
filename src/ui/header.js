import { FLOOR_NAMES, formatEur, getCampaignMetrics } from '../data/campaign.js';

export function createHeader(campaign) {
  const { progress, percent, nextLevel, milestoneAmount } = getCampaignMetrics(campaign);

  const el = document.createElement('header');
  el.className = 'hdr';

  const nextText =
    nextLevel < 0
      ? 'Objectif atteint — merci à tous !'
      : `Prochain palier : <strong>${FLOOR_NAMES[nextLevel]}</strong> (${formatEur(
          milestoneAmount(nextLevel)
        )}) · encore ${formatEur(milestoneAmount(nextLevel) - campaign.raised)}`;

  el.innerHTML = `
    <div class="hdr-top">
      <h1 class="hdr-title">L'Ascenseur</h1>
      <span class="pct-badge">${percent}\u00a0%</span>
    </div>
    <div class="amt-row">
      <div>
        <span class="amt-main">${formatEur(campaign.raised)}</span>
        <span class="amt-goal">sur ${formatEur(campaign.goal)}</span>
      </div>
    </div>
    <div class="progress-track" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-fill" style="width: ${(progress * 100).toFixed(2)}%"></div>
      <div class="progress-tick" style="left: 33.33%"></div>
      <div class="progress-tick" style="left: 66.66%"></div>
    </div>
    <div class="nxt-line">${nextText}</div>
  `;

  return el;
}
