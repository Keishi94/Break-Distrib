import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  integer,
  real,
  boolean
} from 'drizzle-orm/pg-core'

export const statutProspectEnum = pgEnum('statut_prospect', [
  'nouveau',
  'contacte',
  'en_cours',
  'converti',
  'perdu'
])

export const typeContratEnum = pgEnum('type_contrat', [
  'location_courte',
  'mise_a_disposition'
])

export const statutContratEnum = pgEnum('statut_contrat', [
  'brouillon',
  'envoye',
  'signe',
  'resilie'
])

// ─── Prospects ─────────────────────────────────────────────────
export const prospects = pgTable('prospects', {
  id: uuid('id').defaultRandom().primaryKey(),
  nom: text('nom').notNull(),
  email: text('email').notNull().unique(),
  telephone: text('telephone'),
  entreprise: text('entreprise').notNull(),
  adresse: text('adresse'),
  effectif: integer('effectif'),
  statut: statutProspectEnum('statut').default('nouveau').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// ─── Distributeurs ─────────────────────────────────────────────
export const distributeurs = pgTable('distributeurs', {
  id: uuid('id').defaultRandom().primaryKey(),
  nom: text('nom').notNull(),
  adresse: text('adresse').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  prospectId: uuid('prospect_id').references(() => prospects.id),
  statut: text('statut').default('actif').notNull(),
  actif: boolean('actif').default(true).notNull(),
  installeLe: timestamp('installe_le').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// ─── Métriques ─────────────────────────────────────────────────
export const metriques = pgTable('metriques', {
  id: uuid('id').defaultRandom().primaryKey(),
  distributeurId: uuid('distributeur_id')
    .references(() => distributeurs.id)
    .notNull(),
  type: text('type').notNull(), // 'stock', 'temperature', 'erreur', 'vente'
  valeur: real('valeur').notNull(),
  unite: text('unite'),
  alerte: boolean('alerte').default(false).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull()
})

// ─── Contrats ──────────────────────────────────────────────────
export const contrats = pgTable('contrats', {
  id: uuid('id').defaultRandom().primaryKey(),
  prospectId: uuid('prospect_id')
    .references(() => prospects.id)
    .notNull(),
  distributeurId: uuid('distributeur_id').references(() => distributeurs.id),
  type: typeContratEnum('type').notNull(),
  statut: statutContratEnum('statut').default('brouillon').notNull(),
  dateDebut: timestamp('date_debut').notNull(),
  dateFin: timestamp('date_fin'),
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// ─── Relances ──────────────────────────────────────────────────
export const relances = pgTable('relances', {
  id: uuid('id').defaultRandom().primaryKey(),
  prospectId: uuid('prospect_id')
    .references(() => prospects.id)
    .notNull(),
  type: text('type').notNull(), // 'email', 'appel', 'visite'
  statut: text('statut').default('planifie').notNull(),
  datePlanifiee: timestamp('date_planifiee').notNull(),
  dateRealisee: timestamp('date_realisee'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// ─── Types exportés ────────────────────────────────────────────
export type Prospect = typeof prospects.$inferSelect
export type NewProspect = typeof prospects.$inferInsert
export type Distributeur = typeof distributeurs.$inferSelect
export type NewDistributeur = typeof distributeurs.$inferInsert
export type Metrique = typeof metriques.$inferSelect
export type NewMetrique = typeof metriques.$inferInsert
export type Contrat = typeof contrats.$inferSelect
export type NewContrat = typeof contrats.$inferInsert
export type Relance = typeof relances.$inferSelect
export type NewRelance = typeof relances.$inferInsert
