import './styles/app.css';
import { loadCampaign } from './data/campaign.js';
import { mountScene } from './scene/renderer.js';
import { createDonateSheet } from './ui/donorSheet.js';
import { createFloorBar } from './ui/floorBar.js';
import { createHeader } from './ui/header.js';

function bootstrap() {
  const campaign = loadCampaign();

  const root = document.getElementById('app');
  const shell = document.createElement('div');
  shell.className = 'app-shell';

  const donateSheet = createDonateSheet();
  const header = createHeader(campaign);

  const stage = document.createElement('main');
  stage.className = 'stage';
  stage.innerHTML = `
    <div class="canvas-wrap">
      <canvas aria-label="Immeuble en pixel art : plus la collecte avance, plus l'ascenseur monte."></canvas>
    </div>
  `;

  const floorBar = createFloorBar(campaign, {
    onDonate: () => donateSheet.open()
  });

  shell.appendChild(header);
  shell.appendChild(stage);
  shell.appendChild(floorBar.el);

  root.appendChild(shell);
  root.appendChild(donateSheet.el);

  mountScene({
    canvasEl: stage.querySelector('canvas'),
    campaign
  });
}

bootstrap();
