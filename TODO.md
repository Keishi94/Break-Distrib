# TODO — Break'Distrib

> Backlog orienté tâches-agent. Chaque case cochée = un PR mergé, des tests verts, une étape franchie.
>
> **Convention des tailles** (au doigt mouillé, une session d'agent) :
> - **XS** — <30 min, un fichier
> - **S** — 30 min–1 h, 1-3 fichiers, simple
> - **M** — 1-3 h, plusieurs fichiers + test
> - **L** — 3 h+, plusieurs modules, **à découper si possible**
>
> **Règle** : on ne passe pas à la priorité N+1 tant qu'on n'a pas terminé la N. Si une tâche P3 est critique, on la remonte explicitement en P0/P1.

---

## P0 — Fondations agents (bloquant tout le reste)

> Objectif : quand un agent arrive sur une tâche P1 ou suivante, il a **un harness de test qui marche**, **un package schemas à consommer**, et **des helpers qui lui évitent de réinventer les conventions**. Sans ça, chaque tâche coûte 2× plus.

### P0.1 — Package `@break-distrib/schemas`

- [x] **S** — Créer le workspace `packages/schemas` (package.json, tsconfig, entrée `src/index.ts` vide)
- [x] **S** — L'ajouter au `workspaces` du `package.json` racine, vérifier que `bun install` le résout
- [x] **XS** — Ajouter `drizzle-zod` et `zod` en dépendances du package
- [x] **S** — Créer `packages/schemas/src/common.ts` avec `paginationQuery`, `idParam`, `errorResponse`, types d'erreur (liste fermée des codes)
- [x] **XS** — Depuis `backend/package.json`, ajouter `@break-distrib/schemas` en workspace dep, vérifier import
- [x] **XS** — Pareil côté `admin/package.json`

### P0.2 — Helpers backend et middleware global

- [x] **S** — Créer `backend/src/lib/response.ts` avec `ok(data, meta?)` et `fail(code, message, fields?)` (inférés des types du package schemas)
- [x] **S** — Créer `backend/src/lib/errors.ts` avec la classe `AppError` (code, message, fields optionnels)
- [x] **M** — Créer `backend/src/middlewares/error-handler.ts` qui catche : `ZodError` → `VALIDATION_ERROR 400`, `AppError` → code/status correspondant, reste → `INTERNAL_ERROR 500` + log
- [x] **XS** — Brancher le middleware dans `backend/src/index.ts` (ordre : auth → autres → error-handler en dernier)

### P0.3 — Harness de tests

- [x] **M** — Créer `backend/src/test-utils/db.ts` : `resetDb()` (truncate + reseed), `seedMinimal()` (5 entreprises + 2 distributeurs + 1 contrat brouillon, fixtures déterministes)
- [x] **M** — Créer `backend/src/test-utils/client.ts` : `testClient({ role, anonymous? })` qui retourne un client Hono testing authentifié avec un user seedé au rôle voulu
- [x] **S** — Ajouter `bun test` au `.github/workflows/ci.yml` (avec un Postgres de service dans le workflow)
- [x] **S** — Écrire un test de référence `backend/tests/health.test.ts` (GET `/`, attend 200) pour valider que le harness tourne
- [x] **S** — Documenter dans `AGENTS.md` la commande de lancement des tests + comment seeder en local

### P0.4 — OpenAPI auto-généré

- [x] **S** — Ajouter `@hono/zod-openapi` en dépendance backend
- [x] **M** — Convertir le routeur principal Hono en `OpenAPIHono`, exposer `GET /openapi.json` et `GET /docs` (Scalar ou Swagger UI)
- [x] **S** — Vérifier que les routes existantes sont dans le spec (elles apparaissent même sans refactor complet, mais sans schémas précis tant qu'on n'a pas migré)

### P0.5 — Conventions d'accès DB

- [x] **S** — Linter custom (ESLint règle) ou script grep dans CI : interdit `import ... from "../db"` depuis `backend/src/routes/**`. Seuls `services/` peuvent importer la DB
- [x] **XS** — Ajouter cette vérif dans le workflow CI

---

## P1 — Refactor `prospects` + `clients` → `entreprises` (ADR-001)

> Objectif : aligner le code sur la décision d'archi **avant** que la dette se propage. Tout nouveau code doit être écrit directement sur le modèle unifié.
>
> **Attention** : on fait ça avec P0 déjà en place. Le harness de test est notre filet.

### P1.1 — Schéma DB

- [ ] **M** — Nouvelle migration Drizzle : créer la table `entreprises` (colonnes de `prospects` + `clients` fusionnées, statut enum, colonnes légales nullables)
- [ ] **S** — Migration de données : `INSERT INTO entreprises` depuis `prospects` (statut = `lead` ou `prospect_qualifie` selon l'état), puis depuis `clients` (statut = `client_actif`, conserver `entreprise_id = prospect_id` si lien trouvable, sinon nouveau UUID + mapping)
- [ ] **S** — Migration de données : renommer/recréer FK `contacts.client_id` → `contacts.entreprise_id` avec lookup du mapping
- [ ] **S** — Idem pour `relances.prospect_id` → `relances.entreprise_id`
- [ ] **S** — Idem pour `opportunites.prospect_id` → `opportunites.entreprise_id`
- [ ] **S** — Idem pour `contrats.client_id` → `contrats.entreprise_id`
- [ ] **S** — Idem pour `distributeurs` (deux FK à fusionner en une)
- [ ] **XS** — Drop des tables `prospects` et `clients` en fin de migration
- [ ] **XS** — Relire le SQL généré intégralement avant commit

### P1.2 — Schémas partagés

- [ ] **S** — Créer `packages/schemas/src/entreprises.ts` avec `entrepriseSelectSchema`, `createEntrepriseInput`, `updateEntrepriseInput`, `entrepriseListQuery`, types exportés
- [ ] **XS** — Supprimer les schémas `prospects` / `clients` du package (ou des routes s'ils y étaient encore)

### P1.3 — Services

- [ ] **M** — Créer `backend/src/services/entreprises.ts` : `list`, `findById`, `create`, `update`, `changerStatut(id, nouveauStatut)`, avec transitions autorisées validées (pas de `client_churn` → `lead`)
- [ ] **S** — Supprimer `backend/src/services/prospects.ts` et `clients.ts` (contenus déplacés / supprimés)

### P1.4 — Routes

- [ ] **M** — Créer `backend/src/routes/entreprises.ts` avec toutes les routes CRUD + `POST /:id/changer-statut`, validation via `@break-distrib/schemas`, helpers `ok`/`fail`
- [ ] **S** — Supprimer `backend/src/routes/prospects.ts` et `clients.ts`
- [ ] **XS** — Remonter le nouveau routeur dans `backend/src/index.ts`

### P1.5 — Tests

- [ ] **M** — `backend/tests/entreprises.test.ts` : CRUD happy path, création sans auth → 401, update d'une entreprise inexistante → 404, transition invalide → 409 CONFLICT
- [ ] **S** — Vérifier les tests existants des autres modules (contacts, relances, opportunités, contrats) : ils doivent tourner contre le nouveau modèle, pas être cassés

### P1.6 — Propagation aux autres modules

- [ ] **S** — Mettre à jour `services/contacts.ts` pour utiliser `entreprise_id`
- [ ] **S** — Idem `services/relances.ts`
- [ ] **S** — Idem `services/opportunites.ts`
- [ ] **S** — Idem `services/contrats.ts` (attention : la règle "contrat uniquement si statut = client_actif" est ici)
- [ ] **S** — Idem `services/distributeurs.ts`
- [ ] **S** — Update les schémas Zod associés dans `packages/schemas`

### P1.7 — Admin — adapter les pages qui consommaient prospects/clients

- [ ] **S** — Renommer les pages `admin/src/pages/prospects/` → `admin/src/pages/entreprises/` (ou garder "clients" selon UX ; décision : garder le terme **"Entreprises"** dans la nav admin pour éviter l'ambiguïté avec l'ancien sens)
- [ ] **S** — Mettre à jour la side-nav et le routing React Router
- [ ] **M** — Adapter les hooks `use-prospects`, `use-clients` → `use-entreprises` (TanStack Query, filtres par statut)

---

## P2 — Backend : finitions des modules existants (one-liners)

- [ ] Contrats : endpoint `POST /api/contrats/:id/emettre` + génération demande_contrat + envoi email
- [ ] Contrats : route publique `GET /api/public/contrat/:token` (voir `contrat-signature.md`)
- [ ] Contrats : route publique `POST /api/public/contrat/:token/signer`
- [ ] Contrats : route privée `POST /api/contrats/:id/demandes/:token/revoquer`
- [ ] Métriques : endpoint batch `POST /api/metriques` (tableau d'entrées)
- [ ] Métriques : endpoint lecture agrégée (par distributeur, par plage de temps, par type)
- [ ] Tournées : endpoint `POST /api/tournees/:id/reordonner-arrets`
- [ ] Interventions : endpoint `POST /api/interventions/:id/cloturer` avec upload PV (NAS)
- [ ] Paramètres : endpoint public sécurisé (token admin) pour export des infos entreprise
- [ ] Job `pg_cron` : expiration des demandes_contrat (migration SQL manuelle)
- [ ] Job `pg_cron` : passage des relances planifiées à "due"
- [ ] Templates email : relance commerciale, alerte stock bas, PV d'intervention

## P3 — Admin : branchement API module par module (one-liners)

- [ ] Page `dashboard` : brancher KPI (nb entreprises par statut, contrats en attente, distributeurs en panne)
- [ ] Page `pipeline` : lecture + drag-and-drop entre stages d'opportunités
- [ ] Page `entreprises` (ex-clients) : liste, filtres, fiche détail, édition
- [ ] Page `parc` : carte des distributeurs (choix carte : Leaflet + OpenStreetMap probable)
- [ ] Page `tournees` : planning technicien, création d'arrêts, assignation
- [ ] Page `reporting` : agrégats métriques, export CSV
- [ ] Page `contrats` : liste, émission, suivi de signature, PDF visible
- [ ] Page `relances` : to-do du commercial connecté, passage en "faite"
- [ ] Page `parametres` : édition des infos entreprise BD (singleton)
- [ ] Gestion des utilisateurs internes (invitation, rôles) — admin only

## P4 — Site public marketing (one-liners)

- [ ] Page d'accueil : hero + 3 piliers (zéro émission, smart, gratuit)
- [ ] Page "Nos formules" (gratuit / location / LCD)
- [ ] Page "Audit d'éligibilité" avec formulaire → `POST /api/public/prospects` (entrée en `lead`)
- [ ] Page "À propos" + engagement écoresponsable
- [ ] Page contact
- [ ] Mentions légales + CGV + politique de confidentialité (coord. RGPD)
- [ ] SEO : sitemap, robots.txt, meta tags, schema.org LocalBusiness
- [ ] Analytics (Plausible probable, pas Google Analytics)
- [ ] Responsive mobile + perf Lighthouse >90

## P5 — IoT + NAS + infra (one-liners)

- [ ] Intégration upload NAS (PDFs contrats + PV interventions)
- [ ] Protocole d'ingestion IoT : MQTT ou HTTP batch (à trancher dans ADR-007)
- [ ] Premier distributeur physique connecté (pilote)
- [ ] Dashboard alerts (stock bas, T° anormale, connectivité perdue)
- [ ] Monitoring API (Sentry ou équivalent)
- [ ] Backup DB automatisé (au-delà de Supabase natif) — Google Takeout mensuel ou script custom

---

## Backlog (pas prioritaire, idées à trier)

- [ ] Signature manuscrite dessinée (canvas) → ADR à écrire
- [ ] Intégration Yousign/DocuSign pour contrats à valeur plus élevée → ADR
- [ ] Renvoi automatique des contrats non signés à J+7
- [ ] Multi-tenant (si un jour on revend la plateforme à d'autres opérateurs)
- [ ] App mobile techniciens (Expo ?) pour les tournées
- [ ] Intégration comptable (Pennylane, Tiime ?)
- [ ] Paiement en ligne des factures (Stripe ?)
- [ ] Passage à pg-boss si besoin d'email auto ou génération PDF async
- [ ] Migration Timescale quand seuils atteints (voir ADR-005)
- [ ] Tests end-to-end (Playwright) sur les parcours critiques
- [ ] Audit accessibilité WCAG AA sur l'admin

---

## Journal des décisions prises "au fil de l'eau"

> À tenir pour traquer les micro-décisions qui ne méritent pas une ADR complète mais qu'on ne veut pas oublier.

- **2026-04-23** — Données en prod : aucune à préserver. P1.1 se fera en `db:push` + reseed, pas de migration INSERT avec mapping.
- **2026-04-23** — Lien de signature contrat : servi sur le **frontend public** (`break-distrib.fr/signer/{token}`), pas sur l'admin. Rationale : moindre surface d'attaque côté client externe, pas de sous-domaine ni CORS à provisionner.
- **2026-04-23** — Stack génération PDF contrat : **`@react-pdf/renderer`** (pas Puppeteer). Rationale : pure JS donc conteneur Railway léger et aucun moteur HTML qui exécute du JS. Cohérent avec React Email déjà utilisé côté `backend/src/emails/`. À formaliser en ADR-007 au moment d'implémenter P2.

---

*Dernière mise à jour : avril 2026. Quand tu coches une tâche, précise ça dans le message de commit : `feat(entreprises): routes CRUD — closes TODO P1.4.1`.*
