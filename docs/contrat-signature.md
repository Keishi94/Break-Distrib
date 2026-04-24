# Spec — Flux de signature self-service des contrats

> Ce document décrit **précisément** le flux de signature électronique des contrats Break'Distrib. Il est normatif : en cas d'ambiguïté, le code doit être aligné avec cette spec, pas l'inverse.
>
> **Décision référence : ADR-006** (`docs/archi-decisions.md`).

---

## Vue d'ensemble

```
[Commercial admin]                [Client]
        │                             │
        │ émet un contrat             │
        ▼                             │
   [Backend]                          │
        │ crée demande_contrat        │
        │ (UUID, TTL 14j, statut=envoye)
        │                             │
        │ email avec lien unique ────────▶
        │                             │
        │                   ouvre le lien
        │                             │
        │ ◀────────── GET /api/public/contrat/:token
        │ statut=ouvert                │
        │ enregistre ip/ua/horodatage  │
        │                             │
        │                   signe (tape son nom)
        │                             │
        │ ◀────────── POST /api/public/contrat/:token/signer
        │ UPDATE ... WHERE statut IN ('envoye','ouvert')
        │ si 0 ligne → erreur CONFLICT
        │ sinon :                      │
        │   - statut=signe             │
        │   - enregistre signature     │
        │   - génère PDF               │
        │   - upload NAS               │
        │   - contrats.statut=signe    │
        │   - emails confirmation      │
        │                             │
```

---

## Modèle de données

### Table `demandes_contrat`

```ts
// packages/schemas dérive, mais pour référence :
{
  token: uuid primary key default gen_random_uuid(),
  contrat_id: uuid references contrats(id) on delete cascade,

  statut: enum('envoye', 'ouvert', 'signe', 'expire', 'revoque'),
  expires_at: timestamptz not null,  // created_at + 14 jours par défaut

  // Ouverture
  first_opened_at: timestamptz,
  first_opened_ip: inet,
  first_opened_ua: text,
  open_count: integer not null default 0,

  // Signature
  signed_at: timestamptz,
  signature_ip: inet,
  signature_ua: text,
  signature_name: text,
  signature_method: enum('typed_name'),  // plus tard : 'drawn', 'docusign'

  // Révocation
  revoked_at: timestamptz,
  revoked_by: uuid references user(id),
  revoke_reason: text,

  created_at: timestamptz not null default now(),
  created_by: uuid references user(id) not null,  // commercial émetteur
}
```

**Index** :
- `token` (PK, unique)
- `contrat_id` (pour chercher toutes les demandes d'un contrat)
- `statut, expires_at` (pour le job cron d'expiration)

### Table `contrats` — champs liés

```ts
{
  // ...
  statut: enum('brouillon', 'emis', 'signe', 'annule', 'expire'),
  signed_at: timestamptz,       // copié depuis demande au moment de la signature
  pdf_url: text,                // URL NAS du PDF signé
  // ...
}
```

---

## Machine à états

### États de `demandes_contrat.statut`

```
     [envoye]
        │
        │ ouverture (GET /api/public/contrat/:token)
        ▼
     [ouvert]
        │
        │ signature (POST .../signer)
        ▼
     [signe]  ← état terminal heureux

[envoye] ou [ouvert]
        │
        │ expires_at < now() (cron horaire)
        ▼
     [expire]  ← état terminal
        │
        │ OU révocation manuelle (admin)
        ▼
     [revoque]  ← état terminal

Interdits :
- signe  → *   (terminal)
- expire → *   (terminal)
- revoque → *  (terminal)
```

### Transitions autorisées

| Depuis | Vers | Déclencheur | Conditions |
|--------|------|-------------|------------|
| `envoye` | `ouvert` | `GET /api/public/contrat/:token` (première fois) | `now() < expires_at` |
| `envoye` | `expire` | Job cron horaire | `now() >= expires_at` |
| `envoye` | `revoque` | `POST /api/contrats/:id/demandes/:token/revoquer` | Auth admin/commercial émetteur |
| `ouvert` | `signe` | `POST /api/public/contrat/:token/signer` | `now() < expires_at`, payload valide |
| `ouvert` | `expire` | Job cron horaire | `now() >= expires_at` |
| `ouvert` | `revoque` | Admin | Auth admin/commercial émetteur |

Toute autre transition = bug. Tests d'intégration obligatoires sur ces chemins.

---

## Endpoints

### `POST /api/contrats/:id/emettre` (privé, auth requise)

Émet un contrat en créant une demande de signature et en envoyant l'email au contact principal du client.

**Input** : rien (le contrat existe déjà, le contact principal est lu depuis `contacts`).

**Règles**
- Le contrat doit exister et avoir `statut = 'brouillon'` ou `'emis'` (ré-émission possible).
- L'entreprise liée doit avoir `statut IN ('client_actif')` et `siren NOT NULL`.
- Si une demande `envoye`/`ouvert` existe déjà pour ce contrat, la **revoquer automatiquement** (statut `revoque`, reason = `'remplace_par_nouvelle_emission'`) avant d'en créer une nouvelle.
- Créer la demande avec `expires_at = now() + interval '14 days'`.
- Envoyer l'email `envoi-contrat` au contact principal avec le lien `https://admin.break-distrib.fr/contrat/signer/{token}` (URL côté **site public** frontend, pas admin — à confirmer selon routing final).

**Réponse** : `201` avec la demande créée (sans le token en clair, mais avec l'ID de la demande).

### `GET /api/public/contrat/:token` (public, pas d'auth)

Consultation du contrat pour signature.

**Règles**
- Lookup de la demande par `token`.
- Si introuvable → `404 NOT_FOUND`.
- Si `statut IN ('signe', 'revoque')` → `409 CONFLICT` avec message adapté ("déjà signé" / "lien annulé").
- Si `statut = 'expire'` ou `expires_at < now()` → `410 GONE` (code `GONE` à ajouter à la liste ? OU `CONFLICT` avec message "lien expiré"). **Décision : on reste sur la liste fermée existante, on renvoie `CONFLICT` avec message clair.**
- Sinon :
  - Si `statut = 'envoye'` : passer à `ouvert`, enregistrer `first_opened_at`, `first_opened_ip`, `first_opened_ua`.
  - Incrémenter `open_count`.
  - Retourner le contenu du contrat (rendu du template `Contrat.md` avec les variables remplies) + metadata (expires_at, nom du client, etc.).

**Réponse** : `200 { data: { contrat: {...}, demande: { expires_at, open_count } } }`.

### `POST /api/public/contrat/:token/signer` (public, pas d'auth)

Signature du contrat.

**Input**
```json
{
  "nom_signataire": "Jean Dupont",
  "accepte_cgv": true
}
```

**Règles**
- Le traitement est **idempotent et atomique**. Implémentation :
  ```sql
  UPDATE demandes_contrat
  SET statut = 'signe',
      signed_at = now(),
      signature_ip = $ip,
      signature_ua = $ua,
      signature_name = $nom,
      signature_method = 'typed_name'
  WHERE token = $token
    AND statut IN ('envoye', 'ouvert')
    AND expires_at > now()
  RETURNING *;
  ```
- Si `RETURNING` ne renvoie aucune ligne : la demande n'existe pas, est déjà signée, est expirée ou révoquée. Renvoyer `409 CONFLICT` avec message contextualisé (on peut faire un `SELECT` de lecture pour connaître le statut exact et donner un message précis).
- Si `accepte_cgv !== true` → `400 VALIDATION_ERROR`.
- `nom_signataire` : min 2 caractères, max 150, trim.

**Actions post-signature (dans la même transaction si possible, sinon outbox pattern à l'étape job async plus tard)**
1. `UPDATE contrats SET statut = 'signe', signed_at = now() WHERE id = $contrat_id`.
2. Génération du PDF depuis le template avec les infos du contrat + bloc signature.
3. Upload NAS (quand dispo — pour l'instant, fichier local ou skip).
4. `UPDATE contrats SET pdf_url = $url`.
5. Envoi email `contrat-signe-client` au signataire (confirmation + PDF en pièce jointe).
6. Envoi email `contrat-signe-commercial` au `created_by` de la demande.

**Réponse** : `200 { data: { signe: true, pdf_url: "..." } }`.

### `POST /api/contrats/:id/demandes/:token/revoquer` (privé, auth admin ou émetteur)

Révocation manuelle.

**Input**
```json
{ "reason": "Erreur de montant" }
```

**Règles**
- Seul l'admin ou le commercial qui a émis la demande (`demande.created_by === user.id`) peut révoquer.
- Interdit si `statut IN ('signe', 'expire', 'revoque')` → `409 CONFLICT`.
- `UPDATE demandes_contrat SET statut = 'revoque', revoked_at = now(), revoked_by = $user_id, revoke_reason = $reason`.

**Réponse** : `200`.

---

## Job `pg_cron` — expiration horaire

```sql
SELECT cron.schedule(
  'demandes-contrat-expirer',
  '0 * * * *',  -- toutes les heures à la minute 0
  $$UPDATE demandes_contrat
    SET statut = 'expire'
    WHERE statut IN ('envoye', 'ouvert')
      AND expires_at < now()$$
);
```

À créer dans une migration dédiée (fichier SQL manuel, pas Drizzle).

---

## Génération du PDF

### Contenu
- Le template `Contrat.md` (racine du repo) est rempli avec les variables du contrat et de l'entreprise.
- Bloc de signature ajouté en fin de document :
  ```
  Signé électroniquement le [signed_at] par [signature_name]
  depuis l'adresse IP [signature_ip]
  Méthode : Signature électronique simple (eIDAS)
  Référence de signature : [demande.token]
  ```

### Génération
- **Stack** : à figer — option probable `@react-pdf/renderer` (cohérent avec React Email) ou `puppeteer` (plus fiable, plus lourd). À trancher dans une ADR future.
- **Stockage** : NAS interne (décision existante). En attendant la connexion NAS, fallback local ou absence temporaire (PDF regénérable à la demande depuis les données de la demande).

### Conservation
- **10 ans minimum** après signature (obligation comptable FR).
- Inclut la demande liée (trace d'IP, UA, timestamps) pour preuve légale.

---

## Hors MVP (ne pas implémenter sans discussion produit)

Ces points sont **volontairement non faits**. Un agent qui les rencontre dans une tâche doit refuser et ouvrir une discussion produit.

- **Renvoi automatique** si non signé à J+X (J+7, J+12) → feature commerciale, à valider
- **Signature dessinée** sur canvas HTML → nécessite stockage image + méthode `'drawn'`
- **Intégration Yousign / DocuSign** → méthode `'yousign'` / `'docusign'`, flux différent, webhook à gérer
- **Vérification SMS / 2FA** → eIDAS avancé, pas nécessaire pour le type de contrat actuel
- **Signature multi-parties** (représentant Break'Distrib signe aussi) → pour l'instant, Break'Distrib signe "par défaut" via le template, seul le client signe explicitement
- **Consultation historique des versions** si contrat modifié avant signature → versionnement à figer séparément

---

## Considérations légales (rappel, non normatif)

- **Valeur juridique** : `typed_name` + IP + timestamp serveur = **signature électronique simple** au sens du règlement eIDAS. Suffisant pour des contrats B2B de distribution automatique de faible montant. Discutable pour des engagements plus lourds → considérer signature avancée (Yousign, DocuSign) si le type de contrat évolue.
- **RGPD** : IP et UA sont des données personnelles. Inscrire ce traitement dans le registre (dossier Drive `01 — Administration & Juridique / RGPD`), base légale : exécution du contrat.
- **Preuve en cas de litige** : la table `demandes_contrat` est la source de vérité. Ne **jamais** supprimer une ligne, même expirée/révoquée. Archivage oui, suppression non (sauf purge RGPD sur demande, et encore : à évaluer au cas par cas).
- **Horodatage** : les timestamps de signature ne sont pas certifiés (pas de TSA qualifiée). Pour de la signature qualifiée, passer par Yousign/DocuSign.

---

*Dernière mise à jour : avril 2026*
