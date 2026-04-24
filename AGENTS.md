# AGENTS.md — Break'Distrib

> **Point d'entrée unique pour tout agent IA (ou humain) qui intervient sur ce repo.**
> Cette page tient en une lecture. Si tu as besoin de plus de contexte, les pointeurs sont en bas.

---

## Ce que fait le projet

Plateforme B2B pour la distribution de produits de pause en entreprise : **acquisition prospects, cycle commercial, parc de distributeurs connectés, tournées terrain, facturation**.

Monorepo : **site public** (`frontend/`) + **admin interne** (`admin/`) + **API REST** (`backend/`) + **schémas partagés** (`packages/schemas/`).

---

## Stack en 10 lignes

| Couche | Techno |
|--------|--------|
| Runtime | **Bun** 1.x |
| API | **Hono 4** + **Zod** + **Better Auth** |
| ORM | **Drizzle** |
| DB | **PostgreSQL** (Supabase prod, Docker local) |
| Admin | **React 19** + Vite + Tailwind v4 + shadcn/ui |
| Frontend public | HTML + Tailwind v4 + Alpine.js |
| Emails | **Resend** + React Email |
| Jobs planifiés | `pg_cron` (pas de worker séparé pour le moment) |
| Stockage binaires | NAS interne (PDFs contrats) |
| Tests | `bun test` + `hono/testing` |

---

## Commandes à connaître

```bash
# Installation
bun install
docker compose up -d                # Postgres local
cp .env.example backend/.env        # puis éditer

# Schéma DB + seed
cd backend
bun run db:push                     # Sync schéma (dev uniquement)
bun run seed                        # Super-admin + données démo

# Développement
bun run dev                         # Tout en parallèle (racine)
bun run dev:backend                 # http://localhost:3000
bun run dev:admin                   # http://localhost:5174
bun run dev:frontend                # http://localhost:5173

# Qualité
cd backend
bun test                            # Tests complets (nécessite Postgres local Docker)
bun run typecheck                   # Types (OBLIGATOIRE avant PR)

# DB
bun run db:generate                 # Génère migration SQL
bun run db:migrate                  # Applique migrations (prod)
bun run db:studio                   # UI Drizzle

# Emails (preview en dev)
bun run email:dev                   # http://localhost:3333
```

---

## Arborescence (simplifiée)

```
break-distrib/
├── AGENTS.md                       ← tu es ici
├── TODO.md                         ← backlog micro-tâches
├── docs/
│   ├── archi-decisions.md          ← le "pourquoi" du design
│   ├── conventions.md              ← comment coder ici
│   └── contrat-signature.md        ← spec du flux signature
│
├── packages/
│   └── schemas/                    ← source de vérité Zod + types TS
│
├── backend/
│   └── src/
│       ├── routes/                 ← routing Hono, validation Zod
│       ├── services/               ← logique métier, seuls à toucher la DB
│       ├── db/schema/              ← tables Drizzle
│       ├── emails/                 ← templates React Email
│       ├── middlewares/
│       ├── lib/                    ← auth, response helpers, errors
│       └── index.ts
│
├── admin/src/
│   ├── pages/                      ← dashboard, pipeline, parc, tournées, clients…
│   ├── components/bd/              ← design system maison
│   ├── components/ui/              ← shadcn/ui
│   └── lib/api.ts                  ← client API typé
│
├── frontend/src/                   ← site public
├── docker-compose.yml              ← Postgres local
└── Contrat.md                      ← template contrat officiel
```

---

## Règles d'or

Ces règles ne sont pas négociables. Dévier = PR rejetée.

1. **Avant toute PR : `bun test` et `bun run typecheck` passent.** Pas d'exception.
2. **Toute route privée est sous `/api/`, toute route publique sous `/api/public/`.** Réponses en enveloppe `{ data, meta? }`, erreurs en `{ error: { code, message, fields? } }`. Codes d'erreur = liste fermée (voir `conventions.md`).
3. **Les routes ne touchent jamais la DB directement.** Elles valident, appellent un service, formattent. Le service est le seul à faire du Drizzle.
4. **Tous les schémas Zod vivent dans `packages/schemas`.** Jamais de Zod inline dans `routes/`. L'admin consomme ce même package.
5. **Jamais de `db:push` en prod.** Migration = `db:generate` + relecture du SQL + commit + `db:migrate`.
6. **Jamais de `any` TypeScript.** Utiliser `unknown` + narrow, ou dériver depuis Zod.
7. **Jamais de secret en dur.** Tout dans `backend/.env` (gitignored).
8. **Jamais de modif d'une migration déjà commitée sur `main`.** Nouvelle migration corrective.
9. **Conventional Commits obligatoires** : `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
10. **Si tu veux dévier d'une ADR (`docs/archi-decisions.md`), ouvre une discussion.** Ne décide pas seul.

---

## Workflow standard pour une tâche

1. Ouvrir `TODO.md`, prendre une tâche en Priorité 1.
2. Lire l'ADR associée dans `docs/archi-decisions.md` si la tâche touche un sujet décidé.
3. Lire `docs/conventions.md` pour les patterns à copier (routes, services, tests).
4. Créer une branche `feat/xxx` ou `fix/xxx`.
5. Écrire le schéma Zod dans `packages/schemas/` **avant** le code.
6. Écrire le service **avant** la route.
7. Écrire un test happy path **avant** de considérer la tâche terminée.
8. `bun test && bun run typecheck` → vert.
9. PR avec description claire, lien vers la tâche du TODO, référence ADR si pertinent.

---

## Rôles dans l'app

Défini par Better Auth, enforced par middleware `middlewares/auth.ts` :

- **admin** — accès complet (tout)
- **direction** — lecture tout, écriture sur `entreprises`, `contrats`, `parametres`
- **commercial** — CRUD `entreprises` (sauf champs légaux finaux), `opportunites`, `relances`, `contacts`, `contrats`
- **technique** — CRUD `distributeurs`, `tournees`, `interventions`, lecture `entreprises`

Pour tester un rôle dans un test : `testClient({ role: 'commercial' })`.

---

## Décisions d'archi prises (résumé)

Le détail et le pourquoi sont dans `docs/archi-decisions.md`.

- **ADR-001** — Une seule table `entreprises` (pas de séparation prospect/client)
- **ADR-002** — API en enveloppe `{data, meta}`, erreurs `{error: {code, message, fields}}`
- **ADR-003** — Schémas Zod partagés dans `@break-distrib/schemas`
- **ADR-004** — Relances = tâches humaines, job `pg_cron`, pas de worker
- **ADR-005** — Métriques IoT en Postgres classique, migration Timescale au seuil
- **ADR-006** — Contrats self-service : UUID v4 en base, signature `typed_name` (eIDAS simple)

---

## Pointeurs

- **Pourquoi tel choix ?** → `docs/archi-decisions.md`
- **Comment coder ici ?** → `docs/conventions.md`
- **Spec du flux signature** → `docs/contrat-signature.md`
- **Quoi faire maintenant ?** → `TODO.md`
- **Documentation Drive (côté métier)** → `BreakDistrib_Documentation_Drive.docx`
- **Template contrat officiel** → `Contrat.md`

---

*Dernière mise à jour : avril 2026. Quand tu modifies cette page, mets la date à jour et garde-la ≤ 1 page.*
