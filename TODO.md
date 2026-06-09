# TODO — Architecture upgrade

## Step 0: Baseline & constraints
- [x] Inspect current backend routes/services/nasa adapter and frontend orchestration.
- [x] Confirm API response shapes must remain compatible with existing web client.

## Step 1: Backend refactor (routes → controllers → use-cases)
- [x] Create controllers: geoController, skyController, awayController.

- [x] Create use-cases: buildSkyReport, findAwaySpot.

- [x] Slim down `apps/api/src/routes/index.ts` into wiring + standardized error handling.


## Step 2: NASA adapter hardening
- [ ] Add in-flight request dedupe per GIBS cache key in `apps/api/src/nasa/gibs.ts` (or via new client).
- [ ] Standardize timeout/abort and error mapping.

## Step 3: Domain extraction
- [ ] Extract timeline year logic into `apps/api/src/sky/timeline.ts`.
- [ ] Extract away-spot search policy into `apps/api/src/sky/awaySearchPolicy.ts`.
- [ ] Update `apps/api/src/services/sky.ts` or replace it with use-case helpers.

## Step 4: Shared error model consistency
- [ ] Ensure all endpoints use `{ ok: true }` / `{ ok: false, code, error }` consistently.
- [ ] Update `packages/shared/src/index.ts` only if needed.

## Step 5: Frontend refactor (orchestration hook)
- [ ] Create `apps/web/src/hooks/useSkyAnalysis.ts`.
- [ ] Update `apps/web/src/App.tsx` to use the hook.
- [ ] Keep UI behavior identical.

## Step 6: Docs
- [ ] Add `apps/api/ARCHITECTURE.md` and `apps/web/ARCHITECTURE.md`.

## Step 7: Run & verify
- [ ] `npm run dev:api` smoke test endpoints.
- [ ] `npm run dev:web` smoke test UI.
- [x] `npm run build` monorepo.


