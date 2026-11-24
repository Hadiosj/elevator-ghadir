import { formatEur, getCampaignMetrics } from '../data/campaign.js';

export function createDonateSheet({ getCampaign, onAddAmount, onSetAmount }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'sheet-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="donate-sheet-title" tabindex="-1">
      <div class="sheet-header">
        <h2 class="sheet-title" id="donate-sheet-title">Simuler la collecte (démo)</h2>
        <button type="button" class="icon-btn" data-close aria-label="Fermer">✕</button>
      </div>
      <div class="sheet-body"></div>
    </div>
  `;

  const sheetEl = backdrop.querySelector('.sheet');
  const closeBtn = backdrop.querySelector('[data-close]');
  const bodyEl = backdrop.querySelector('.sheet-body');
  let previousFocus = null;

  const isOpen = () => backdrop.classList.contains('is-open');

  const close = () => {
    if (!isOpen()) return;
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
    previousFocus = null;
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      close();
    }
  };

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener('keydown', onKeyDown);

  const open = () => {
    previousFocus = document.activeElement;
    const campaign = getCampaign();
    const { milestoneAmount } = getCampaignMetrics(campaign);
    const addPresets = [50, 500, 2000, 5000];
    const stagePresets = [
      { label: '0\u00a0€', sub: 'Parking', value: 0 },
      { label: formatEur(milestoneAmount(1)), sub: '1er étage', value: milestoneAmount(1) },
      { label: formatEur(milestoneAmount(2)), sub: '2e étage', value: milestoneAmount(2) },
      { label: formatEur(campaign.goal), sub: '3e étage', value: campaign.goal }
    ];

    bodyEl.innerHTML = `
      <div class="demo-section">
        <div class="demo-label">Ajouter un don</div>
        <div class="preset-grid">
          ${addPresets
            .map(
              (amt) =>
                `<button type="button" class="preset-chip" data-add="${amt}">+${amt.toLocaleString('fr-FR')}\u00a0€</button>`
            )
            .join('')}
        </div>
        <form class="input-row" data-form="add">
          <input type="number" class="num-input" name="amount" min="1" step="1" inputmode="numeric" placeholder="Montant à ajouter (€)" />
          <button type="submit" class="apply-btn">Ajouter</button>
        </form>
      </div>

      <div class="demo-section">
        <div class="demo-label">Définir le total collecté</div>
        <form class="input-row" data-form="set">
          <input type="number" class="num-input" name="total" min="0" step="1" inputmode="numeric" value="${Math.round(campaign.raised)}" />
          <button type="submit" class="apply-btn">Définir</button>
        </form>
        <div class="preset-grid">
          ${stagePresets
            .map(
              (p) =>
                `<button type="button" class="preset-chip stage-chip" data-set="${p.value}">
                  <span>${p.label}</span>
                  <span class="chip-sub">${p.sub}</span>
                </button>`
            )
            .join('')}
        </div>
      </div>

      <div class="sheet-note">
        Mode démo pour tester les différents paliers sur mobile — le vrai paiement sera connecté ensuite.
      </div>
    `;

    bodyEl.querySelectorAll('[data-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        onAddAmount(Number(btn.dataset.add));
        close();
      });
    });

    bodyEl.querySelectorAll('[data-set]').forEach((btn) => {
      btn.addEventListener('click', () => {
        onSetAmount(Number(btn.dataset.set));
        close();
      });
    });

    bodyEl.querySelector('[data-form="add"]').addEventListener('submit', (e) => {
      e.preventDefault();
      const val = Number(e.target.amount.value);
      if (Number.isFinite(val) && val > 0) {
        onAddAmount(val);
        close();
      }
    });

    bodyEl.querySelector('[data-form="set"]').addEventListener('submit', (e) => {
      e.preventDefault();
      const val = Number(e.target.total.value);
      if (Number.isFinite(val) && val >= 0) {
        onSetAmount(val);
        close();
      }
    });

    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    sheetEl.focus();
  };

  return { el: backdrop, open, close };
}
