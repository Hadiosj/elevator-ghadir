export function createDonateSheet() {
  const backdrop = document.createElement('div');
  backdrop.className = 'sheet-backdrop';
  backdrop.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true">
      <div class="sheet-header">
        <h2 class="sheet-title">Soutenir L’Ascenseur</h2>
        <button type="button" class="icon-btn" data-close aria-label="Fermer">✕</button>
      </div>
      <div class="sheet-body"></div>
    </div>
  `;

  const bodyEl = backdrop.querySelector('.sheet-body');
  const close = () => backdrop.classList.remove('is-open');

  backdrop.querySelector('[data-close]').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  const open = () => {
    let selected = 50;
    const presets = [10, 20, 50, 100];
    bodyEl.innerHTML = `
      <p>Choisissez un montant indicatif — le paiement en ligne sera connecté dans la prochaine étape.</p>
      <div class="preset-grid">
        ${presets
          .map(
            (amt) =>
              `<button type="button" class="preset-chip ${
                amt === selected ? 'is-selected' : ''
              }" data-amt="${amt}">${amt}\u00a0€</button>`
          )
          .join('')}
      </div>
      <div class="sheet-note">
        Bientôt disponible : paiement mobile rapide (Apple Pay, Google Pay, carte bancaire) et prise en compte automatique dans l'ascenseur.
      </div>
    `;

    bodyEl.querySelectorAll('.preset-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        selected = Number(chip.dataset.amt);
        bodyEl.querySelectorAll('.preset-chip').forEach((c) => {
          c.classList.toggle('is-selected', Number(c.dataset.amt) === selected);
        });
      });
    });

    backdrop.classList.add('is-open');
  };

  return { el: backdrop, open, close };
}
