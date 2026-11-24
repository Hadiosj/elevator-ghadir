export const FLOOR_SHORT = ['P', '1', '2', '3'];
export const FLOOR_NAMES = ['Parking', '1er étage', '2e étage', '3e étage'];

export const DEFAULT_CAMPAIGN = {
  goal: 20000,
  raised: 7350,
  donors: [
    { n: 'Chef Elie', a: 1000 },
    { n: 'Famille Haddad', a: 500 },
    { n: 'Famille Khoury', a: 400 },
    { n: 'Tante Rita', a: 300 },
    { n: 'Anonyme', a: 250, anon: true },
    { n: 'Georges', a: 200 },
    { n: 'Joe', a: 150 },
    { n: 'Karim', a: 120 },
    { n: 'Marie', a: 100 },
    { n: 'Cheftaine Lara', a: 80 },
    { n: 'Sami', a: 60 },
    { n: 'Nour', a: 50 },
    { n: 'Yara', a: 40 }
  ]
};

export function loadCampaign(search = window.location.search) {
  const params = new URLSearchParams(search);
  const data = {
    ...DEFAULT_CAMPAIGN,
    donors: DEFAULT_CAMPAIGN.donors.map((d) => ({ ...d }))
  };
  if (params.has('raised')) {
    const parsed = Number(params.get('raised'));
    if (Number.isFinite(parsed) && parsed >= 0) {
      data.raised = parsed;
    }
  }
  return data;
}

export function formatEur(value) {
  return (
    Math.round(value)
      .toLocaleString('fr-FR')
      .replace(/\u202f/g, '\u00a0') + '\u00a0€'
  );
}

export function getCampaignMetrics(data) {
  const progress = Math.min(1, Math.max(0, data.raised / data.goal));
  const unlockedLevel = progress >= 1 ? 3 : Math.min(3, Math.floor(progress * 3 + 1e-6));
  const nextLevel = unlockedLevel >= 3 ? -1 : unlockedLevel + 1;
  const milestoneAmount = (level) => Math.round((data.goal * level) / 3);
  return {
    progress,
    percent: Math.round(progress * 100),
    unlockedLevel,
    nextLevel,
    milestoneAmount
  };
}
