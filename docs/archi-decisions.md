# Décisions d'architecture — Break'Distrib

> Format inspiré des ADR (Architecture Decision Records). Chaque décision liste le **contexte**, la **décision prise**, et le **pourquoi**. Les alternatives rejetées sont mentionnées brièvement pour éviter qu'elles reviennent en boucle.
>
> **Règle d'or pour les agents :** si tu veux dévier d'une décision ici, ouvre une discussion, ne décide pas seul.

---

## ADR-001 — Modèle `entreprises` unifié (pas de séparation prospect/client)

**Contexte**
Le cycle commercial va d'une entrée formulaire d'audit (lead) jusqu'à un contrat signé (client). Historiquement, séparer `prospects` et `clients` en deux tables est une approche classique mais crée de la duplication sur les tables liées (contacts, relances, opportunités).

**Décision**
Une seule table **`entreprises`** avec un enum `statut` :

```
lead → prospect_qualifie → client_actif → client_churn
                         ↘ perdu
```

- Les champs légaux (`siren`, `numero_tva`, `capital`, `effectif`) sont **nullables**, remplis au fil du cycle.
- Les autres tables (`contacts`, `relances`, `opportunites`, `contrats`, `distributeurs`) pointent sur `entreprise_id`.
- **Contrainte de création d'un contrat :** validée en Zod côté backend (`statut IN ('client_actif', 'client_churn')` + `siren NOT NULL`). Pas de CHECK SQL pour garder la souplesse.

**Pourquoi**
- Zéro migration au moment de la "conversion" : un `UPDATE statut` suffit.
- Une seule FK à connaître pour les agents → pas de question "je l'ajoute où ?".
- En MVP, on minimise le nombre de lignes à maintenir.

**Alternatives rejetées**
- Deux tables + vue UNION : surcomplexité pour un bénéfice nul à ce stade.
- Deux tables strictes : duplication de logique sur 4 tables liées.

---

## ADR-002 — Format de réponse API : enveloppe `{ data, meta? }`

**Contexte**
Format unique pour toutes les routes, facile à consommer côté admin et pour l'OpenAPI.

**Décision**

Succès :
```json
GET /api/entreprises/123
→ 200 { "data": { "id": "...", "nom": "Acme" } }

GET /api/entreprises?page=1
→ 200 { "data": [...], "meta": { "total": 147, "page": 1, "pageSize": 20 } }
```

Erreur :
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Données invalides", "fields": { "email": "format invalide" } } }
```

**Codes d'erreur autorisés (liste fermée)** :
- `VALIDATION_ERROR` (400) — données de requête invalides
- `UNAUTHORIZED` (401) — pas authentifié
- `FORBIDDEN` (403) — authentifié mais pas le droit
- `NOT_FOUND` (404) — ressource inexistante
- `CONFLICT` (409) — état incompatible (ex : signer un contrat déjà signé)
- `RATE_LIMITED` (429)
- `INTERNAL_ERROR` (500)

**Helpers à utiliser systématiquement** (`backend/src/lib/response.ts`) :
```ts
ok(data, meta?)
fail(code, message, fields?)
```

Un **middleware global** transforme automatiquement les `ZodError` en `VALIDATION_ERROR` avec les `fields`. L'agent qui écrit une nouvelle route n'a pas à y penser.

**Pourquoi**
- Format unique → l'admin n'a qu'un seul déballage à écrire.
- Code machine-readable → l'admin peut afficher une UI différente par type d'erreur.
- Pagination prête dès le jour 1 dans `meta`.

**Alternatives rejetées**
- Data brute : pas d'endroit pour la pagination.
- RFC 7807 Problem Details : trop verbeux pour un usage interne.
- Hybride (data brute + enveloppe) : deux formats = deux fois plus de code.

---

## ADR-003 — Schémas Zod partagés : `@break-distrib/schemas`

**Contexte**
Backend et admin ont besoin des mêmes schémas (validation + types TS). Les dupliquer manuellement = désync garantie au premier changement.

**Décision**
Un workspace `packages/schemas` dans le monorepo qui exporte :
- Schémas Zod dérivés de Drizzle via `drizzle-zod` (`selectXxxSchema`, `insertXxxSchema`)
- Schémas custom d'input (`createEntrepriseInput`, `updateEntrepriseInput`) qui restreignent/transforment les schémas auto-générés
- Types TS inférés de ces schémas

Consommé par :
- `backend/` pour la validation runtime des requêtes
- `admin/` pour typer les formulaires et valider côté client avant envoi

Les colonnes DB restent en `snake_case`. Les types TS exposés par le package sont en `camelCase` (Drizzle le fait nativement).

**Pourquoi**
- Source unique de vérité → zéro désync.
- Les agents ne réinventent pas les schémas à chaque module.
- Couplé avec `@hono/zod-openapi`, sert aussi à générer l'OpenAPI.

**Alternatives rejetées**
- tRPC : demanderait de remplacer Hono, on perd l'OpenAPI universel.
- Zod local à chaque route : désync inévitable.

---

## ADR-004 — Relances : tâches humaines, pas d'email auto (MVP)

**Contexte**
Les relances commerciales peuvent être des tâches (à faire par un humain) ou des emails automatiques. Choix produit qui impacte l'infra.

**Décision (produit)**
**Modèle A** : les relances sont des tâches humaines. Le système marque une relance comme "due", le commercial la voit dans son admin, l'exécute (appel, email manuel), la marque comme faite. **Pas d'email automatique sortant déclenché par relance.**

**Décision (infra)**
**`pg_cron`** (extension Supabase déjà activable) avec un seul job :

```sql
SELECT cron.schedule(
  'relances-due',
  '*/10 * * * *',
  $$UPDATE relances
    SET statut = 'due'
    WHERE statut = 'planifiee' AND date_prevue <= now()$$
);
```

**Zéro worker supplémentaire** à déployer.

**Pourquoi**
- pg-boss est overkill pour un simple `UPDATE` périodique.
- Pas de second process à monitorer en production.
- Migration vers pg-boss plus tard si besoin (email auto, PDF async…) = chantier d'une demi-journée, la forme des données ne bouge pas.

**Alternatives rejetées**
- pg-boss dès maintenant : complexité payée sans bénéfice.
- Cron externe Railway : pas de retry, pas de back-pressure.

---

## ADR-005 — Métriques IoT : Postgres classique + plan de migration Timescale

**Contexte**
Table `metriques` attendue pour ingérer les données temps réel des distributeurs (stock, T°, erreurs, ventes, connectivité). À terme : ~720k points/jour pour 100 distributeurs.

**Décision (aujourd'hui)**
Postgres classique avec :
- Enum fermé `type_metrique` : `stock_pourcent`, `temperature_c`, `erreur_count`, `ventes_unite`, `connectivite`
- Index composé **`(distributeur_id, timestamp DESC)`** dès le jour 1
- Tous les timestamps en `timestamp with time zone`, UTC
- **Endpoint d'ingestion batch** : `POST /api/metriques` accepte un tableau, jamais point par point

**Décision (plus tard)**
Migration vers **TimescaleDB** (extension Supabase) déclenchée dès qu'un des seuils est atteint :
- Taille de la table `metriques` > 10 Go
- P95 du temps de requête "dernières 24h d'un distributeur" > 200 ms

Étapes migration (~1 jour) :
1. `CREATE EXTENSION IF NOT EXISTS timescaledb;`
2. Script SQL manuel : `SELECT create_hypertable('metriques', 'timestamp', migrate_data => TRUE);`
3. Ajuster la PK en `(id, timestamp)` si besoin
4. Activer la compression sur chunks > 30 jours

**Pourquoi**
- Zéro distributeur physique branché aujourd'hui → pas de volume à gérer.
- Timescale tout de suite = complexité de Drizzle+hypertable + doc agents + Docker local à maintenir dès le jour 1.
- Les décisions "incassables plus tard" (enum, index, UTC, ingestion batch) sont prises dès aujourd'hui.

**Alternatives rejetées**
- Timescale direct : complexité injustifiée à ce stade.
- Partitioning Postgres natif : plus de code à maintenir pour moins de bénéfices que Timescale.
- TSDB externe (Influx, ClickHouse) : infra disproportionnée.

---

## ADR-006 — Contrats self-service : UUID v4 en base, signature typed_name

**Contexte**
Le commercial émet un contrat → lien unique envoyé au client par email → client ouvre, signe → PDF généré, archivé.

**Décision — format du token**
**UUID v4 en base**, table `demandes_contrat` avec :

```
token          uuid primary key default gen_random_uuid()
contrat_id     uuid references contrats(id)
statut         enum('envoye','ouvert','signe','expire','revoque')
expires_at     timestamptz  -- envoi + 14 jours
created_at     timestamptz
first_opened_at, first_opened_ip, first_opened_ua
signed_at, signature_ip, signature_ua, signature_name, signature_method
open_count     int default 0
```

**Décision — méthode de signature (MVP)**
`signature_method = 'typed_name'` : le client tape son nom complet, on enregistre IP + UA + timestamp serveur. Valeur juridique = **signature électronique simple eIDAS**, suffisante pour des contrats B2B de faible montant.

**Règles métier figées**

| Événement | Effet |
|-----------|-------|
| Émission commercial | Crée demande, statut `envoye`, envoie email |
| Premier `GET /api/public/contrat/:token` | Statut → `ouvert`, enregistre `first_opened_*`, `open_count += 1` |
| `GET` suivants | `open_count += 1`, statut inchangé |
| `POST /.../signer` (idempotent) | `UPDATE ... WHERE statut IN ('envoye','ouvert') RETURNING *`. Si 0 ligne → erreur `CONFLICT` avec code métier. Sinon : génère PDF, passe `contrats.statut = signe`, envoie emails (client + commercial émetteur) |
| `revoquer` (admin) | Statut → `revoque`, lien inutilisable |
| Cron horaire | `statut = expire` si `expires_at < now()` et `statut IN ('envoye','ouvert')` |

**Hors MVP (ne pas implémenter sans discussion produit)**
- Renvoi automatique si non signé à J+X
- Signature manuscrite dessinée (canvas)
- Intégration DocuSign / Yousign
- Vérification SMS
- Signature multi-parties

**Pourquoi**
- Auditable (on sait qui a ouvert, quand, combien de fois).
- Révocable (annulation propre si erreur d'émission).
- Table `demandes_contrat` déjà prévue dans le schéma initial.
- typed_name = suffisant pour la valeur juridique cible, pas de dépendance externe.

**Alternatives rejetées**
- JWT stateless : pas auditable, blacklist nécessaire pour révoquer.
- Token opaque 32 octets : UUID v4 a déjà 122 bits d'entropie, largement suffisant.

---

## Notes de conformité

- **RGPD** : les IPs des signataires sont des données personnelles → mentionner dans le registre des traitements (dossier Drive `01 — Administration & Juridique / RGPD`).
- **eIDAS** : `typed_name` est une signature simple. Si la typologie de contrat évolue vers des engagements plus lourds, réévaluer (Yousign, DocuSign).
- **Durée de conservation** : contrats signés conservés 10 ans minimum (obligation comptable). Demandes expirées/révoquées : 3 ans suffisent, à purger par job trimestriel.

---

*Dernière mise à jour : avril 2026*
