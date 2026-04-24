import { sql } from 'drizzle-orm';
import { db } from '../db/client';
import * as schema from '../db/schema';

export async function resetDb() {
  await db.execute(
    sql`TRUNCATE TABLE prospects, distributeurs, metriques, contrats, relances, "user", session, account, verification CASCADE;`
  );
}

export async function seedMinimal() {
  const p1Id = '00000000-0000-0000-0000-000000000001';
  const p2Id = '00000000-0000-0000-0000-000000000002';
  const p3Id = '00000000-0000-0000-0000-000000000003';

  await db.insert(schema.prospects).values([
    { id: p1Id, nom: 'Prospect 1', entreprise: 'Ent 1', email: 'p1@test.com', statut: 'nouveau' },
    { id: p2Id, nom: 'Prospect 2', entreprise: 'Ent 2', email: 'p2@test.com', statut: 'contacte' },
    { id: p3Id, nom: 'Prospect 3', entreprise: 'Ent 3', email: 'p3@test.com', statut: 'en_cours' },
  ]);

  const d1Id = '20000000-0000-0000-0000-000000000001';
  const d2Id = '20000000-0000-0000-0000-000000000002';

  await db.insert(schema.distributeurs).values([
    { id: d1Id, nom: 'Distributeur 1', adresse: 'Paris', latitude: 48.8, longitude: 2.3, prospectId: p1Id },
    { id: d2Id, nom: 'Distributeur 2', adresse: 'Lyon', latitude: 45.7, longitude: 4.8, prospectId: p2Id },
  ]);

  await db.insert(schema.contrats).values([
    {
      id: '30000000-0000-0000-0000-000000000001',
      prospectId: p1Id,
      type: 'location_courte',
      statut: 'brouillon',
      dateDebut: new Date(),
    },
  ]);
}
