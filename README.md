# Break'Distrib

Plateforme B2B de gestion pour la distribution de produits de pause en entreprise : acquisition prospects, cycle de vente, parc de distributeurs connectés, tournées terrain et facturation.

Monorepo versionné dans un seul dépôt Git — **site public** + **dashboard admin/interne** + **API REST**.

---

## Table des matières

- [Vue d'ensemble fonctionnelle](#vue-densemble-fonctionnelle)
- [État d'avancement](#état-davancement)
- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Modèle de données](#modèle-de-données)
- [API](#api)
- [Installation & configuration](#installation--configuration)
- [Développement](#développement)
- [Déploiement](#déploiement)

---

## Vue d'ensemble fonctionnelle

La plateforme couvre l'ensemble du cycle commercial et opérationnel :

| Domaine | Fonctionnalité |
|---------|----------------|
| **Acquisition** | Formulaire d'audit sur le site public → création prospect automatique + email de confirmation |
| **Commercial** | Pipeline d'opportunités multi-stages (découverte → signé), relances planifiées, notes |
| **Contractualisation** | Génération de contrats (location courte / mise à disposition) à partir du template officiel, envoi par email, **signature self-service** via lien unique + PDF généré |
| **Clients** | Conversion prospect → client, fiches entreprise (SIREN, TVA, effectif…), contacts multiples par client |
| **Parc** | Distributeurs géolocalisés (carte), statut (actif / maintenance / panne), rattachement client |
| **IoT / Métriques** | Ingestion temps réel (stock, température, erreurs, ventes) + alertes |
| **Terrain** | Tournées techniciens avec arrêts ordonnés, interventions (maintenance / réassort / installation / retrait) |
| **Reporting** | KPIs commerciaux et techniques (dashboard admin) |
| **Paramètres** | Infos légales de l'entreprise éditables via l'admin (utilisées dans les PDF contrats) |
| **Auth** | Comptes internes avec rôles (admin / direction / commercial / technique), reset password, vérif email |

---

## État d'avancement

> Mise à jour : avril 2026. Le projet est en **phase MVP — backend essentiellement terminé, admin en cours d'intégration UI**.

### ✅ Livré

- **Monorepo & CI** — workspaces Bun, GitHub Actions (build + typecheck).
- **Backend API** — Hono + Bun, 13 modules de routes connectés, logger, CORS.
- **Base de données** — schéma Drizzle complet (18 tables), migrations générées, Docker Compose pour Postgres local, Supabase en prod.
- **Auth** — Better Auth intégré (sessions, rôles, reset password, email verification), middleware d'auth sur toutes les routes privées.
- **Emails transactionnels** — 7 templates React-Email (confirmation prospect, relance, envoi contrat, alerte distributeur, reset password, vérif email, layout partagé). Resend opérationnel sur le domaine `break-distrib.fr` (SPF/DKIM verified).
- **Génération de contrats** — template officiel (`Contrat.md`) avec placeholders, flux self-service (token à usage unique, signature, PDF, expiration).
- **Paramètres entreprise** — singleton en base, éditable via l'admin, consommé par la génération de PDF.
- **Seed super-admin** — compte initial non-écrasant, credentials dans fichier gitignored.
- **Admin — coquille** — React 19 + Vite, routing React Router, layout (side-nav + top-bar), design system maison (`components/bd/`), shadcn/ui pour les primitives, thème clair/sombre.
- **Admin — pages créées** — `dashboard`, `pipeline`, `parc`, `tournées`, `reporting`, `clients`, `kitchen-sink` (référence UI).

### 🟡 En cours

- **Admin — branchement API** — les pages existent côté UI mais l'intégration aux endpoints backend reste à finaliser module par module.
- **Site public (`frontend/`)** — projet Vite + Tailwind + Alpine initialisé, pages marketing pas encore implémentées (dossier `pages/` vide).
- **Carte parc distributeurs** — schéma lat/lng prêt, composant carte non choisi.

### 🔴 Non démarré

- **Ingestion IoT réelle** — endpoint d'ingestion existe, pas encore de distributeur physique branché.
- **Upload des PDFs générés sur le NAS** — décision prise (NAS d'Ayoub plutôt que Supabase Storage), intégration à faire.
- **Tests automatisés** — pas encore de suite de tests.
- **Déploiement prod** — environnements Cloudflare Pages / Railway à provisionner.

---

## Architecture

```
┌─────────────────────┐     ┌─────────────────────┐
│   Site public        │     │   Dashboard Admin    │
│   frontend/          │     │   admin/             │
│   Tailwind + Alpine  │     │   React + shadcn/ui  │
│   → Cloudflare Pages │     │   → Cloudflare Pages │
└──────────┬──────────┘     └──────────┬──────────┘
           │ audit form                │ dashboard interne
           └──────────┬────────────────┘
                      │ HTTP / REST (CORS + cookies)
           ┌──────────▼──────────┐
           │   API REST           │
           │   backend/           │◄────── Resend (emails)
           │   Hono + Bun         │
           │   Better Auth        │◄────── NAS Ayoub (PDFs)
           └──────────┬──────────┘
                      │
           ┌──────────▼──────────┐
           │   PostgreSQL         │
           │   Drizzle ORM        │
           │   → Supabase (prod)  │
           │   → Docker (local)   │
           └─────────────────────┘
```

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Runtime | [Bun](https://bun.sh) 1.x |
| Site public | HTML + [Tailwind CSS v4](https://tailwindcss.com) + [Alpine.js](https://alpinejs.dev) + [Vite](https://vitejs.dev) |
| Dashboard admin | [React 19](https://react.dev) + Vite + Tailwind v4 + [shadcn/ui](https://ui.shadcn.com) + React Router |
| API REST | [Hono 4](https://hono.dev) + [Zod](https://zod.dev) (validation) |
| Auth | [Better Auth](https://www.better-auth.com) (sessions cookies, rôles) |
| ORM / migrations | [Drizzle ORM](https://orm.drizzle.team) + drizzle-kit |
| Base de données | PostgreSQL via [Supabase](https://supabase.com) (prod) / Docker Compose (local) |
| Emails | [Resend](https://resend.com) + [React Email](https://react.email) |
| Stockage binaires | NAS interne (PDFs contrats, PV d'intervention) |
| CI/CD | GitHub Actions |

---

## Structure du projet

```
break-distrib/
│
├── frontend/                       # Site public — break-distrib.fr
│   └── src/
│       ├── pages/                  # (à implémenter)
│       ├── components/
│       ├── js/main.js              # Alpine.js
│       ├── css/main.css
│       └── assets/
│
├── admin/                          # Dashboard interne
│   └── src/
│       ├── pages/                  # dashboard, pipeline, parc, tournees,
│       │                           #   reporting, clients, kitchen-sink
│       ├── components/
│       │   ├── bd/                 # Design system maison (KPI, sparkline…)
│       │   ├── layout/             # app-layout, side-nav, top-bar
│       │   └── ui/                 # Primitives shadcn/ui
│       ├── hooks/use-theme.ts
│       ├── lib/utils.ts
│       └── App.tsx
│
├── backend/                        # API REST
│   ├── src/
│   │   ├── routes/                 # 13 modules — cf. section API
│   │   ├── services/               # Logique métier par domaine
│   │   ├── middlewares/auth.ts     # Garde sur routes privées
│   │   ├── lib/
│   │   │   ├── auth.ts             # Config Better Auth
│   │   │   └── query.ts            # Helpers Drizzle
│   │   ├── emails/                 # 7 templates React-Email
│   │   ├── db/
│   │   │   ├── client.ts
│   │   │   ├── schema/index.ts     # 18 tables + types inférés
│   │   │   └── migrations/         # SQL générés par Drizzle
│   │   └── index.ts                # Entrée Hono
│   ├── scripts/
│   │   ├── seed.ts                 # Super-admin + données de démo
│   │   └── test-email.tsx          # Preview emails en dev
│   └── drizzle.config.ts
│
├── docs/                           # Notes & explications internes
├── design-handoff/                 # Maquettes / exports Figma
├── Contrat.md                      # Template contrat officiel v1.0
├── docker-compose.yml              # Postgres local
├── .github/workflows/ci.yml
└── package.json                    # Workspaces Bun
```

---

## Modèle de données

18 tables réparties en 4 groupes fonctionnels.

**Commercial & CRM**
- `prospects` — entrées du formulaire d'audit, statut (nouveau → converti / perdu)
- `clients` — prospects signés, infos légales (SIREN, TVA, capital…)
- `contacts` — N contacts par client, dont un principal
- `opportunites` — pipeline multi-stages avec montant et probabilité
- `relances` — planifiées et historiques, liées aux prospects

**Contractualisation**
- `contrats` — contrats émis (location courte / mise à disposition), signature, PDF
- `demandes_contrat` — flux self-service : token unique, expiration, payload, signature

**Parc & opérations terrain**
- `distributeurs` — machines installées, géoloc (lat/lng), statut, rattachement prospect/client
- `metriques` — time-series IoT (stock, T°, erreurs…) indexée par distributeur + timestamp
- `tournees` — planifiées par technicien
- `arrets_tournee` — arrêts ordonnés liés à une tournée et un distributeur
- `interventions` — maintenance / réparation / réassort / installation / retrait

**Auth & paramètres**
- `user`, `session`, `account`, `verification` — tables Better Auth
- `parametres_entreprise` — singleton des infos légales BD utilisées dans les PDFs

---

## API

Base URL : `http://localhost:3000/api` (prod : `https://api.break-distrib.fr`)

**Routes privées** (auth requis, montées sur `/api`) :

| Module | Préfixe | Commentaire |
|--------|---------|-------------|
| `me` | `/api/me` | Session courante, profil utilisateur |
| `prospects` | `/api/prospects` | CRUD + conversion en client |
| `clients` | `/api/clients` | CRUD |
| `contacts` | `/api/contacts` | CRUD, rattachés à un client |
| `distributeurs` | `/api/distributeurs` | CRUD + géoloc |
| `opportunites` | `/api/opportunites` | Pipeline commercial |
| `tournees` | `/api/tournees` | Planning technicien + arrêts |
| `interventions` | `/api/interventions` | Historique terrain |
| `metriques` | `/api/metriques` | Ingestion + lecture IoT (batch supporté) |
| `contrats` | `/api/contrats` | CRUD + émission |
| `relances` | `/api/relances` | Planification commerciale |
| `parametres` | `/api/parametres` | Infos légales entreprise (singleton) |

**Routes publiques** (montées sur `/api/public`) :

| Route | Commentaire |
|-------|-------------|
| `/api/public/contrat/:token` | Consultation + signature d'un contrat self-service |

**Auth** (gérée par Better Auth) :

| Route | Commentaire |
|-------|-------------|
| `/api/auth/*` | Sign in / sign up / sessions / reset password / verify email |

**Health** :
```bash
curl http://localhost:3000/
# → {"service":"Break'Distrib API","version":"1.0.0","status":"ok"}
```

---

## Installation & configuration

### Prérequis

- [Bun](https://bun.sh) ≥ 1.0
- Docker (pour Postgres local) **ou** un projet [Supabase](https://supabase.com)
- Un compte [Resend](https://resend.com) (domaine `break-distrib.fr` déjà configuré en prod)

### Premier lancement

```bash
git clone <repo>
cd break-distrib
bun install

# Postgres local
docker compose up -d

# Variables d'env
cp .env.example backend/.env   # puis éditer

# Schéma + seed super-admin
cd backend
bun run db:push
bun run seed
```

### Variables d'environnement (`backend/.env`)

```env
# Base de données
DATABASE_URL=postgresql://...

# Supabase (prod uniquement)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Auth
BETTER_AUTH_SECRET=           # 32 caractères min
BETTER_AUTH_URL=http://localhost:3000

# Emails (Resend)
RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@break-distrib.fr

# URLs (CORS)
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
PORT=3000
```

---

## Développement

```bash
# Tout lancer en parallèle
bun run dev

# Ou séparément
bun run dev:frontend   # http://localhost:5173
bun run dev:admin      # http://localhost:5174
bun run dev:backend    # http://localhost:3000

# Outils backend
cd backend
bun run db:studio      # Interface visuelle de la BDD
bun run email:dev      # Preview des emails → http://localhost:3333
bun run typecheck
```

### Commandes Drizzle

```bash
cd backend
bun run db:push         # Sync schéma direct (dev)
bun run db:generate     # Génère une migration SQL
bun run db:migrate      # Applique les migrations
```

---

## Déploiement

### Frontend & Admin → Cloudflare Pages

Deux projets distincts pointant sur `frontend/` et `admin/`, build `bun run build`, output `dist`. Le domaine `break-distrib.fr` est routé vers le frontend via les DNS OVH.

### Backend → Railway

Projet Railway pointant sur `backend/`, variables d'env copiées depuis `backend/.env`, commande de démarrage `bun run start` détectée automatiquement.

### Base de données → Supabase

Déjà hébergée. Application des migrations prod :

```bash
DATABASE_URL=<url_prod> bun run db:migrate
```

### Stockage binaires → NAS

Les PDFs de contrat et les PV d'intervention sont stockés sur le NAS interne (et **non** sur Supabase Storage). L'intégration reste à finaliser côté backend.

---

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) sur chaque push vers `main` ou `develop` :

1. Install Bun
2. Build `frontend`
3. Build `admin`
4. `typecheck` sur `backend`
