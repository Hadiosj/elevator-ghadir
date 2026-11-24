# elevator-ghadir — L'Ascenseur

A fundraising monitor and donation web app for gathering money to build an elevator (`L'Ascenseur`), part of the `sudev-ai-server` ecosystem.

## Context

- **Purpose**: Give community members a live, engaging way to track how much money has been raised toward the elevator goal (currently `20 000 €` in the prototype) and make donations directly from their phone.
- **Metaphor**: A pixel-art cross-section of a 4-level building (`Parking`, `1er étage`, `2e étage`, `3e étage`). As donations grow, the elevator shaft is constructed higher, unlocking floors and bringing donors into the building as pixel characters.
- **Current status**: Modular Vite frontend (`256×448` pixel-art `<canvas>` + mobile-first UI) using mock campaign data in [`src/data/campaign.js`](src/data/campaign.js); original single-file prototype kept at [`elevator.html`](elevator.html) for reference.

## Local Development

```bash
npm install
npm run dev      # http://localhost:5173/ascenseur/
npm run lint     # oxlint src
npm run build    # outputs dist/
```

---

## Rules & Principles

1. **Mobile-first, Desktop-compatible**
   - Most users will open the link on a phone (shared via WhatsApp/SMS/QR code). Design layout, typography, spacing, and donation flows for portrait mobile screens (`360px–430px`) first, then adapt gracefully to desktop (e.g., constrained container or split layout so controls do not stretch across wide screens).
   - Keep touch targets `>= 44×44px`, respect `env(safe-area-inset-*)`, use `100dvh` / flexible sizing so the scene and primary CTA (`Donner`) stay visible without awkward scrolling.
   - Keep bundle size and runtime lightweight on mobile devices.

2. **Pixel Scene + Readable Modern UI**
   - Keep the building, characters, rooms, and animations in crisp pixel art — at a higher sprite resolution (e.g. `256×448` instead of `128×224`) so real-life details (flags, room furniture, building facade, signage) are clearly recognizable rather than overly blocky.
   - Use real-life reference photos provided incrementally to craft accurate pixel-art sprites and room layouts.
   - Keep all interface chrome, numbers, amounts, navigation buttons, and future donation forms in a clean, readable UI font (reserving pixel typography at most for display accents/badges).

3. **Clean, Minimal Interactions**
   - Keep the UI as simple and distraction-free as possible (no donor list/wall, no manual light/dark toggle — follow the OS theme automatically).
   - Do **not** show intrusive pop-up messages/toasts when tapping ambient sprites (e.g., people or the cat).
   - Keep the scene calm and readable; reserve UI sheets for donating and floor controls.

4. **Payment Integrity & Privacy** *(deferred until UI & scene are solid)*
   - Never trust client-side state or URL parameters (`?raised=...`) for real fundraising totals in production.
   - Only credit online donations after **server-side verified webhooks** (with idempotency keys so retries never double-count).
   - Support offline donations (cash, bank transfer, check) via a protected admin mechanism, since community fundraisers rely on both online and offline contributions.
   - Respect donor anonymity (`Anonyme`) and never expose emails, payment IDs, or private metadata in public API responses.

5. **Infrastructure & Repo Conventions (`sudev-infra`)**
   - Target path prefix: `/ascenseur` (tentative, configurable via Vite `base` + Nginx/Caddy).
   - Follow [`../sudev-infra/docs/new-app.md`](../sudev-infra/docs/new-app.md):
     - Serve UI and API under the same prefix (`/ascenseur/` and `/ascenseur/api/`).
     - Run as its own Git repo and Docker Compose stack (Nginx on loopback port `8083`, private backend, named volume for SQLite).
     - Keep all payment keys, webhook secrets, and admin credentials in a server-side `.env` file (never in frontend code).

---

## Roadmap / What Needs to Be Done

### 1. UX & Mobile-First Refinements
- [x] Remove tap-to-toast messages on people, the cat, and the pigeon, as well as the intro hint toast.
- [x] Improve header readability on small phone screens (clean sans-serif UI font for numbers/controls, pixel font only for title).
- [x] Refine `.sg` / `.tg` canvas overlays so milestone badges and the current-amount tag never clip or collide on narrow viewports.
- [x] Keep floor tiles calm and static (do not summon/highlight the elevator; later tapping a tile can zoom into that floor for details).
- [x] Add a clean desktop layout without extra clutter (no donor list, no theme switch).

### 2. Payments & Donations
- [ ] Choose payment provider(s) (e.g., **Stripe Checkout** for Card / Apple Pay / Google Pay on mobile, and/or **HelloAsso** / bank transfer instructions).
- [ ] Build the `Donner` flow (mobile bottom sheet / modal):
  - Preset amounts (e.g., `10 €`, `20 €`, `50 €`, `100 €`) + custom amount.
  - Donor display name + `Rester anonyme` toggle + optional short message.
  - Seamless mobile checkout return state (thank-you confirmation + elevator animating to the updated total).
- [ ] Build backend API (Node + SQLite, matching `pixel-resto` conventions):
  - `GET /api/state` — current goal, total raised, unlocked level, public donor list.
  - `POST /api/donate` — creates a checkout/payment session.
  - `POST /api/webhook` — verifies provider signature and records completed donations idempotently.
  - Protected admin route/CLI for recording offline donations (`espèces`, `virement`, `chèque`) and adjusting goal/milestones.
- [ ] Update the UI automatically (polling or SSE) when new donations arrive.

### 3. Pixel Art & Animation Improvements
- [ ] Upgrade sprite detail and readability (people, poses, cat, cars, props) while keeping the cohesive pixel-art look.
- [ ] Visually distinguish locked vs. unlocked floors (e.g., dimmed/unfinished look on locked floors until reached, celebration animation when a milestone is crossed).
- [ ] Polish elevator mechanics (floor indicator display, smoother door/cable details, arrival chime/visual cue without toast clutter).
- [ ] Fix ambient character placement on locked floors (decide whether building characters should only appear once a floor is unlocked, or clearly represent who is waiting for the elevator).

### 4. Deployment
- [ ] Initialize standalone git repo and add `Dockerfile` / `docker-compose.yml` / Nginx config.
- [ ] Register port (`8083`) and path prefix in `sudev-infra` (`ports.md`, `Caddyfile`, root `README.md`).
- [ ] Set up GitHub Actions CI + deploy.
