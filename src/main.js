import './styles/app.css';
import { loadCampaign } from './data/campaign.js';
import { mountScene } from './scene/renderer.js';
import { createDonateSheet } from './ui/donorSheet.js';
import { createHeader } from './ui/header.js';

function bootstrap() {
  const campaign = loadCampaign();

  const root = document.getElementById('app');
  const shell = document.createElement('div');
  shell.className = 'app-shell';

  let header = null;
  let scene = null;

  const applyRaised = (nextAmount) => {
    campaign.raised = Math.max(0, Math.round(nextAmount));
    header.update(campaign);
    scene.updateCampaign(campaign);
  };

  const donateSheet = createDonateSheet({
    getCampaign: () => campaign,
    onAddAmount: (delta) => applyRaised(campaign.raised + delta),
    onSetAmount: (amount) => applyRaised(amount)
  });

  header = createHeader(campaign, {
    onDonate: () => donateSheet.open()
  });

  const stage = document.createElement('main');
  stage.className = 'stage';
  stage.innerHTML = `
    <div class="canvas-wrap">
      <canvas aria-label="Immeuble en pixel art : plus la collecte avance, plus l'ascenseur monte."></canvas>
    </div>
  `;

  shell.appendChild(header.el);
  shell.appendChild(stage);

  root.appendChild(shell);
  root.appendChild(donateSheet.el);

  scene = mountScene({
    canvasEl: stage.querySelector('canvas'),
    campaign
  });
}

bootstrap();
