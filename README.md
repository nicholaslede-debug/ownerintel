# OwnerIntel — Building-Ownership Intelligence (MVP + Agent)

This is a ready-to-run starter for a web app that aggregates building ownership from public records and powers outreach. It includes:

- Next.js App Router UI (search + CSV export)
- Postgres (Prisma) schema for properties/owners/deeds/mortgages
- Agentic worker skeleton (BullMQ + Playwright) to crawl, extract, normalize, and compute signals

## Quick Start

1) **Install** (Node 18+ recommended)
```bash
npm i
```

2) **Environment**
Copy `.env.example` to `.env.local` and set values.
```bash
cp .env.example .env.local
```

3) **DB Migrate**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

4) **Run dev**
```bash
npm run dev
```

Open http://localhost:3000 and try the **Search** + **Export CSV**.

5) **Run worker (agent loop)**
```bash
npm run worker
# Kick a demo job
npm run job:crawl:onondaga -- "SMITH"
```

> Crawlers are skeletons with TOS guardrails. They parse public index pages only by default. Add your credentials & confirm local legal/usage policies before fetching document images.

---

## Structure

```
app/                   # Next.js UI + API routes
  api/
    export/route.ts
    search/route.ts
  layout.tsx
  page.tsx
prisma/
  schema.prisma
  seed.ts
src/
  lib/db.ts
  agent/
    index.ts
    queues.ts
  connectors/
    cott/
      onondaga.ts
    assessor/
      imagemate.ts
scripts/
  start-worker.ts
```

---

## Notes

- You can replace the mocked search with a Prisma query once you seed real data.
- The worker uses BullMQ + Playwright with polite throttling and feature flags.
- For parcel boundaries and better maps, wire a parcel API (e.g., Regrid) and add a map component.
