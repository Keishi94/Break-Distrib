import { sql } from 'drizzle-orm';
import { db } from '../db/client';
import * as schema from '../db/schema';

export async function resetDb() {
  await db.execute(
    sql`TRUNCATE TABLE prospects, clients, contacts, distributeurs, metriques, opportunites, contrats, relances, tournees, arrets_tournee, interventions, demandes_contrat, parametres_entreprise, "user", session, account, verification CASCADE;`
  );
}

export async function seedMinimal() {
  const p1Id = '00000000-0000-0000-0000-000000000001';
  const p2Id = '00000000-0000-0000-0000-000000000002';
  const p3Id = '00000000-0000-0000-0000-000000000003';
  const c1Id = '10000000-0000-0000-0000-000000000001';
  const c2Id = '10000000-0000-0000-0000-000000000002';

  await db.insert(schema.prospects).values([
    { id: p1Id, nom: 'Prospect 1', entreprise: 'Ent 1', email: 'p1@test.com', statut: 'nouveau' },
    { id: p2Id, nom: 'Prospect 2', entreprise: 'Ent 2', email: 'p2@test.com', statut: 'contacte' },
    { id: p3Id, nom: 'Prospect 3', entreprise: 'Ent 3', email: 'p3@test.com', statut: 'en_cours' },
  ]);

  await db.insert(schema.clients).values([
    { id: c1Id, raisonSociale: 'Client 1', adresseSiege: 'Paris', statut: 'actif', email: 'c1@test.com', prospectOrigineId: p1Id },
    { id: c2Id, raisonSociale: 'Client 2', adresseSiege: 'Lyon', statut: 'actif', email: 'c2@test.com', prospectOrigineId: p2Id },
  ]);

  const d1Id = '20000000-0000-0000-0000-000000000001';
  const d2Id = '20000000-0000-0000-0000-000000000002';

  await db.insert(schema.distributeurs).values([
    { id: d1Id, nom: 'Distributeur 1', adresse: 'Paris', latitude: 48.8, longitude: 2.3, clientId: c1Id },
    { id: d2Id, nom: 'Distributeur 2', adresse: 'Lyon', latitude: 45.7, longitude: 4.8, clientId: c2Id },
  ]);

  await db.insert(schema.contrats).values([
    { id: '30000000-0000-0000-0000-000000000001', clientId: c1Id, type: 'location_courte', statut: 'brouillon', dateDebut: new Date() },
  ]);
}
