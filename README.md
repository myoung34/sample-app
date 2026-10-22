# sample-app

A demo frontend and backend, deployed the way a Meanwhile app would be on EKS:
built here, promoted by Kargo from staging to prod through `meanwhile/argocd`.

| Part | What | Like |
| ---- | ---- | ---- |
| `api/` | FastAPI on uv, port 8096. `/api/visits` records a visit in Postgres | `applications/grcapp` |
| `api/supabase/` | Schema migrations, applied with `supabase db push` | `infra/coredb/supabase` |
| `web/` | Next.js standalone, port 3008. Shows which build and environment answered | `web/apps/client` |
| `e2e/` | Playwright checks that a deployed environment serves the expected release | `build-meanwhile.yml` E2E Tests, but after deploy |

## Release flow

1. A merge to `main` runs `.github/workflows/build.yml`, which pushes
   `ghcr.io/myoung34/sample-app-{api,web,e2e}` tagged `<sha7>` and `rc-NNNNNNN`.
1. Kargo (`meanwhile/argocd`, `apps/sample-app/core`) sees the new `rc-*` tags
   and promotes them to staging on its own: a PR on `meanwhile/argocd` that the
   approve bot approves and Kargo merges.
1. Argo CD syncs `sample-app-staging`. Before the Deployments roll, a Job runs
   the migrations with the new API image.
1. Kargo verifies staging: a Job runs the `e2e` image of the same release
   against `https://sample-app.meanwhilestaging.io`. Freight that fails can't
   go to prod.
1. Promoting to prod is a click in Kargo, and its PR needs a person's approval.

The API reads `POSTGRES_DB_URL` (the Supabase transaction pooler), `APP_ENV`
and `VERSION_RELEASE`.

## Run locally

```bash
docker run -d --name pg -p 5432:5432 -e POSTGRES_PASSWORD=pw postgres:17
cat api/supabase/migrations/*.sql | docker exec -i pg psql -U postgres
(cd api && POSTGRES_DB_URL=postgresql://postgres:pw@localhost:5432/postgres \
  uv run uvicorn sample_api.main:app --port 8096 --app-dir src)
(cd web && npm install && API_URL=http://localhost:8096 npm run dev)
```

Then open `http://localhost:3008`. Run the e2e against any environment:

```bash
(cd e2e && npm ci && npx playwright install chromium && BASE_URL=http://localhost:3008 EXPECTED_ENV=local \
  EXPECTED_RELEASE=local npx playwright test)
```
