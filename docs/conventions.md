# Conventions de code — Break'Distrib

> À lire avant toute PR. Ces conventions sont **non négociables** : elles existent pour qu'un agent puisse copier le pattern plutôt que réinventer à chaque fois.

---

## Nommage

### Fichiers et dossiers
- **`kebab-case`** partout : `entreprises.ts`, `contrat-signature.ts`, `use-theme.ts`
- Un module backend = un dossier minimum : `routes/entreprises.ts` + `services/entreprises.ts`
- Tests à côté du code : `entreprises.ts` + `entreprises.test.ts` OU dans `tests/` miroir

### Variables et fonctions TS
- **`camelCase`** : `entrepriseId`, `findByStatut`
- Booléens préfixés : `isActive`, `hasContract`, `canSign`
- Handlers : `handleSubmit`, `handleClick`

### Base de données
- Tables : `snake_case` pluriel : `entreprises`, `demandes_contrat`, `arrets_tournee`
- Colonnes : `snake_case` : `siren`, `created_at`, `entreprise_id`
- Enums : `snake_case` pour le type, valeurs en snake_case : `entreprise_statut` avec `lead`, `client_actif`…
- FK : toujours suffixées `_id` : `entreprise_id`, `contrat_id`
- Timestamps : toujours `created_at`, `updated_at`, `*_at`. Toujours `timestamp with time zone`, UTC côté DB.

Drizzle convertit `created_at` → `createdAt` côté TS automatiquement. On laisse faire, on ne surcharge pas.

### Routes HTTP
- Préfixe `/api/` pour les routes privées, `/api/public/` pour les publiques
- Ressources au **pluriel, kebab-case** : `/api/entreprises`, `/api/demandes-contrat`
- Actions sur une ressource en sous-path : `POST /api/entreprises/:id/convertir`, `POST /api/contrats/:id/emettre`
- Verbes HTTP respectés : `GET` liste/détail, `POST` création/action, `PATCH` màj partielle, `PUT` remplacement complet (rare), `DELETE` suppression

### Commits
Conventional Commits :
```
feat(entreprises): ajout endpoint conversion
fix(contrats): signature idempotente
chore(ci): upgrade bun to 1.2
docs(archi): adr-007 sur le stockage pdf
test(contrats): happy path signature
refactor(schemas): déplacement vers packages/schemas
```

---

## Structure d'un module backend

Exemple pour `entreprises` :

```
backend/src/
├── routes/entreprises.ts       # Routing Hono + validation Zod via @break-distrib/schemas
├── services/entreprises.ts     # Logique métier, seul endroit qui touche la DB
└── db/schema/entreprises.ts    # Table Drizzle
```

**Règle d'or :** les routes **n'accèdent jamais à la DB directement**. Elles valident l'input, appellent un service, formattent la réponse.

### Template d'une route

```ts
// backend/src/routes/entreprises.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createEntrepriseInput, paginationQuery } from '@break-distrib/schemas';
import * as service from '../services/entreprises';
import { ok, fail } from '../lib/response';

export const entreprisesRoutes = new Hono()
  .get('/', zValidator('query', paginationQuery), async (c) => {
    const { page, pageSize } = c.req.valid('query');
    const { items, total } = await service.list({ page, pageSize });
    return c.json(ok(items, { total, page, pageSize }));
  })
  .get('/:id', async (c) => {
    const entreprise = await service.findById(c.req.param('id'));
    if (!entreprise) return c.json(fail('NOT_FOUND', 'Entreprise introuvable'), 404);
    return c.json(ok(entreprise));
  })
  .post('/', zValidator('json', createEntrepriseInput), async (c) => {
    const input = c.req.valid('json');
    const entreprise = await service.create(input);
    return c.json(ok(entreprise), 201);
  });
```

### Template d'un service

```ts
// backend/src/services/entreprises.ts
import { db } from '../db/client';
import { entreprises } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { CreateEntrepriseInput } from '@break-distrib/schemas';

export async function list({ page, pageSize }: { page: number; pageSize: number }) {
  const [items, [{ total }]] = await Promise.all([
    db.select().from(entreprises).limit(pageSize).offset((page - 1) * pageSize),
    db.select({ total: sql<number>`count(*)::int` }).from(entreprises),
  ]);
  return { items, total };
}

export async function findById(id: string) {
  const [row] = await db.select().from(entreprises).where(eq(entreprises.id, id));
  return row ?? null;
}

export async function create(input: CreateEntrepriseInput) {
  const [row] = await db.insert(entreprises).values(input).returning();
  return row;
}
```

---

## Schémas Zod (`@break-distrib/schemas`)

**Ne jamais écrire un Zod dans `backend/src/routes/`.** Tout vit dans le package partagé.

### Structure d'un fichier schéma

```ts
// packages/schemas/src/entreprises.ts
import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { entreprises } from '@break-distrib/backend/db/schema'; // import type-only

// Dérivé de Drizzle
export const entrepriseSelectSchema = createSelectSchema(entreprises);
export const entrepriseInsertSchema = createInsertSchema(entreprises);

// Inputs métier (ce que l'API accepte réellement)
export const createEntrepriseInput = entrepriseInsertSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    nom: z.string().min(2).max(200),
  });

export const updateEntrepriseInput = createEntrepriseInput.partial();

// Query params
export const entrepriseListQuery = paginationQuery.extend({
  statut: z.enum(['lead', 'prospect_qualifie', 'client_actif', 'client_churn', 'perdu']).optional(),
});

// Types
export type Entreprise = z.infer<typeof entrepriseSelectSchema>;
export type CreateEntrepriseInput = z.infer<typeof createEntrepriseInput>;
export type UpdateEntrepriseInput = z.infer<typeof updateEntrepriseInput>;
```

### Schémas partagés (`packages/schemas/src/common.ts`)

```ts
export const idParam = z.object({ id: z.string().uuid() });

export const paginationQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const errorResponse = z.object({
  error: z.object({
    code: z.enum(['VALIDATION_ERROR', 'UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND', 'CONFLICT', 'RATE_LIMITED', 'INTERNAL_ERROR']),
    message: z.string(),
    fields: z.record(z.string()).optional(),
  }),
});
```

---

## Gestion d'erreurs

### Dans les services
Les services **throw** des erreurs typées :

```ts
// backend/src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: 'NOT_FOUND' | 'CONFLICT' | 'FORBIDDEN' | 'VALIDATION_ERROR',
    message: string,
    public fields?: Record<string, string>,
  ) { super(message); }
}

// Usage
if (entreprise.statut !== 'client_actif') {
  throw new AppError('CONFLICT', 'Seul un client actif peut recevoir un contrat');
}
```

### Middleware global (`backend/src/middlewares/error-handler.ts`)
- `ZodError` → `VALIDATION_ERROR` 400 avec `fields` formatés
- `AppError` → code/status correspondant
- Autre → `INTERNAL_ERROR` 500 + log avec request-id

**Jamais de `try/catch` dans une route** sauf cas exceptionnel. Le middleware gère.

---

## Frontend admin

### Structure d'une page

```
admin/src/pages/entreprises/
├── index.tsx             # Liste + routing
├── detail.tsx            # Fiche détail
├── components/
│   ├── entreprise-table.tsx
│   └── entreprise-form.tsx
└── hooks/
    └── use-entreprises.ts    # Appels API via TanStack Query
```

### Appels API
- **TanStack Query** uniquement (pas de `fetch` nu dans les composants)
- Clients centralisés dans `admin/src/lib/api.ts`
- Déballage automatique de l'enveloppe `{ data }` dans le client, les hooks retournent `data` directement

### Composants UI
- Primitives : `components/ui/` (shadcn/ui)
- Design system maison : `components/bd/` (KPI card, sparkline, etc.)
- Règle : si ça existe dans `bd/`, on l'utilise ; si ça existe dans `ui/`, on l'utilise ; on ne réinvente pas

### Formulaires
- **React Hook Form + zodResolver**, schéma importé de `@break-distrib/schemas`
- Pas de validation custom locale si un schéma existe déjà

---

## Tests

### Stack
- **Bun test** (pas Jest, pas Vitest)
- Client HTTP : `hono/testing` (pas besoin de supertest)

### Règles
- **Un happy path par route** minimum
- Les cas d'erreur critiques (401, 403, validation, 404) testés au moins une fois par module
- **Pas de mock de la DB** : on utilise une vraie DB de test (Docker Postgres dédié)
- Chaque test est indépendant : `beforeEach` reset les tables concernées via un helper

### Template de test

```ts
// backend/tests/entreprises.test.ts
import { describe, it, expect, beforeEach } from 'bun:test';
import { testClient } from '../src/test-utils/client';
import { resetDb, seedMinimal } from '../src/test-utils/db';

describe('entreprises', () => {
  beforeEach(async () => {
    await resetDb();
    await seedMinimal();
  });

  it('crée une entreprise', async () => {
    const client = await testClient({ role: 'commercial' });
    const res = await client.entreprises.$post({ json: { nom: 'Acme', statut: 'lead' } });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.nom).toBe('Acme');
  });

  it('refuse la création sans auth', async () => {
    const client = await testClient({ anonymous: true });
    const res = await client.entreprises.$post({ json: { nom: 'Acme' } });
    expect(res.status).toBe(401);
  });
});
```

---

## Migrations Drizzle

### Process obligatoire
1. Modifier le schéma dans `backend/src/db/schema/`
2. `bun run db:generate` → génère le SQL dans `backend/src/db/migrations/`
3. **Lire le SQL généré** avant de commit (Drizzle se trompe parfois)
4. Commit le fichier de schéma ET la migration ensemble
5. `bun run db:migrate` applique en prod

### Interdits
- **Jamais modifier un fichier de migration déjà commit** sur `main`. Si tu te trompes, nouvelle migration corrective.
- **Jamais de `db:push` en prod.** Uniquement en dev.
- **Jamais de SQL direct dans le code applicatif.** Passer par Drizzle. Exception : les triggers / extensions Postgres vont dans un fichier `*.sql` dédié.

---

## Logs et observabilité

- Logger : le logger Hono natif en dev, `pino` en prod (à câbler)
- Chaque requête a un `x-request-id` (généré si absent)
- Les logs de service incluent `{ requestId, userId?, action, entity, entityId? }`
- **Jamais de `console.log` en dehors des scripts.**

---

## À ne jamais faire

- Désactiver un test qui échoue : comprendre pourquoi, corriger ou documenter.
- `any` en TypeScript : passer par `unknown` + narrow, ou générer le type depuis Zod.
- Mettre des secrets en dur : tout passe par `backend/.env`.
- Ajouter une dépendance npm sans discussion (surtout côté admin qui bundle).
- Commit direct sur `main` : toujours une PR, même pour un agent.

---

*Dernière mise à jour : avril 2026*
