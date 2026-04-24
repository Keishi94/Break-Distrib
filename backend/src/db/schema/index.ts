import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  integer,
  real,
  boolean,
  jsonb,
  index,
  uniqueIndex,
  check
} from 'drizzle-orm/pg-core'
import { desc, sql } from 'drizzle-orm'

// ─── Enums ─────────────────────────────────────────────────────
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

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'direction',
  'commercial',
  'technique'
])

export const statutClientEnum = pgEnum('statut_client', [
  'actif',
  'suspendu',
  'archive'
])

export const stageOpportuniteEnum = pgEnum('stage_opportunite', [
  'decouverte',
  'qualification',
  'proposition',
  'negociation',
  'signe',
  'perdu'
])

export const statutTourneeEnum = pgEnum('statut_tournee', [
  'planifiee',
  'en_cours',
  'terminee',
  'annulee'
])

export const statutArretEnum = pgEnum('statut_arret', [
  'a_faire',
  'en_cours',
  'fait',
  'ignore'
])

export const typeInterventionEnum = pgEnum('type_intervention', [
  'maintenance',
  'reparation',
  'reassort',
  'installation',
  'retrait'
])

export const statutDistributeurEnum = pgEnum('statut_distributeur', [
  'actif',
  'maintenance',
  'panne',
  'inactif'
])

export const statutDemandeContratEnum = pgEnum('statut_demande_contrat', [
  'envoye',
  'en_cours',
  'signe',
  'expire',
  'annule'
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

// ─── Clients (signés) ──────────────────────────────────────────
export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  prospectOrigineId: uuid('prospect_origine_id').references(() => prospects.id),
  raisonSociale: text('raison_sociale').notNull(),
  formeJuridique: text('forme_juridique'),
  siren: text('siren'),
  tvaIntra: text('tva_intra'),
  capital: integer('capital'),
  adresseSiege: text('adresse_siege').notNull(),
  email: text('email'),
  telephone: text('telephone'),
  effectif: integer('effectif'),
  statut: statutClientEnum('statut').default('actif').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// ─── Contacts (plusieurs par client) ───────────────────────────
export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: uuid('client_id')
    .references(() => clients.id, { onDelete: 'cascade' })
    .notNull(),
  nom: text('nom').notNull(),
  prenom: text('prenom'),
  email: text('email'),
  telephone: text('telephone'),
  fonction: text('fonction'),
  isPrincipal: boolean('is_principal').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// ─── Distributeurs ─────────────────────────────────────────────
export const distributeurs = pgTable('distributeurs', {
  id: uuid('id').defaultRandom().primaryKey(),
  nom: text('nom').notNull(),
  modele: text('modele'),
  place: text('place'),
  adresse: text('adresse').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  prospectId: uuid('prospect_id').references(() => prospects.id),
  clientId: uuid('client_id').references(() => clients.id),
  statut: statutDistributeurEnum('statut').default('actif').notNull(),
  actif: boolean('actif').default(true).notNull(),
  stockActuel: integer('stock_actuel'),
  tempActuelle: real('temp_actuelle'),
  derniereSync: timestamp('derniere_sync'),
  installeLe: timestamp('installe_le').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// ─── Métriques (time-series IoT) ───────────────────────────────
export const metriques = pgTable(
  'metriques',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    distributeurId: uuid('distributeur_id')
      .references(() => distributeurs.id, { onDelete: 'cascade' })
      .notNull(),
    type: text('type').notNull(),
    valeur: real('valeur').notNull(),
    unite: text('unite'),
    alerte: boolean('alerte').default(false).notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull()
  },
  (t) => ({
    distTimestampIdx: index('metriques_distributeur_timestamp_idx').on(
      t.distributeurId,
      desc(t.timestamp)
    )
  })
)

// ─── Opportunités (pipeline) ───────────────────────────────────
export const opportunites = pgTable(
  'opportunites',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    prospectId: uuid('prospect_id').references(() => prospects.id),
    clientId: uuid('client_id').references(() => clients.id),
    titre: text('titre').notNull(),
    stage: stageOpportuniteEnum('stage').default('decouverte').notNull(),
    montant: real('montant'),
    probabilite: integer('probabilite').default(0).notNull(),
    dateClotureProbable: timestamp('date_cloture_probable'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  },
  (t) => ({
    cibleCheck: check(
      'opportunites_cible_check',
      sql`${t.prospectId} IS NOT NULL OR ${t.clientId} IS NOT NULL`
    ),
    probabiliteCheck: check(
      'opportunites_probabilite_check',
      sql`${t.probabilite} BETWEEN 0 AND 100`
    )
  })
)

// ─── Contrats ──────────────────────────────────────────────────
export const contrats = pgTable('contrats', {
  id: uuid('id').defaultRandom().primaryKey(),
  prospectId: uuid('prospect_id').references(() => prospects.id),
  clientId: uuid('client_id').references(() => clients.id),
  distributeurId: uuid('distributeur_id').references(() => distributeurs.id),
  type: typeContratEnum('type').notNull(),
  statut: statutContratEnum('statut').default('brouillon').notNull(),
  dateDebut: timestamp('date_debut').notNull(),
  dateFin: timestamp('date_fin'),
  montantMensuel: real('montant_mensuel'),
  pdfUrl: text('pdf_url'),
  signatureBase64: text('signature_base64'),
  signataireNom: text('signataire_nom'),
  signataireEmail: text('signataire_email'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// ─── Relances ──────────────────────────────────────────────────
export const relances = pgTable('relances', {
  id: uuid('id').defaultRandom().primaryKey(),
  prospectId: uuid('prospect_id')
    .references(() => prospects.id, { onDelete: 'cascade' })
    .notNull(),
  type: text('type').notNull(),
  statut: text('statut').default('planifie').notNull(),
  datePlanifiee: timestamp('date_planifiee').notNull(),
  dateRealisee: timestamp('date_realisee'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// ─── Tournées ──────────────────────────────────────────────────
export const tournees = pgTable('tournees', {
  id: uuid('id').defaultRandom().primaryKey(),
  technicienId: text('technicien_id')
    .references(() => user.id)
    .notNull(),
  date: timestamp('date').notNull(),
  statut: statutTourneeEnum('statut').default('planifiee').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const arretsTournee = pgTable(
  'arrets_tournee',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tourneeId: uuid('tournee_id')
      .references(() => tournees.id, { onDelete: 'cascade' })
      .notNull(),
    distributeurId: uuid('distributeur_id')
      .references(() => distributeurs.id)
      .notNull(),
    ordre: integer('ordre').notNull(),
    statut: statutArretEnum('statut').default('a_faire').notNull(),
    notes: text('notes')
  },
  (t) => ({
    ordreUnique: uniqueIndex('arrets_tournee_ordre_unique').on(t.tourneeId, t.ordre)
  })
)

// ─── Interventions ─────────────────────────────────────────────
export const interventions = pgTable('interventions', {
  id: uuid('id').defaultRandom().primaryKey(),
  distributeurId: uuid('distributeur_id')
    .references(() => distributeurs.id)
    .notNull(),
  technicienId: text('technicien_id')
    .references(() => user.id)
    .notNull(),
  tourneeId: uuid('tournee_id').references(() => tournees.id),
  type: typeInterventionEnum('type').notNull(),
  notes: text('notes'),
  realiseeLe: timestamp('realisee_le').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// ─── Demandes de contrat (self-service public) ─────────────────
export const demandesContrat = pgTable('demandes_contrat', {
  id: uuid('id').defaultRandom().primaryKey(),
  token: text('token').notNull().unique(),
  prospectId: uuid('prospect_id')
    .references(() => prospects.id)
    .notNull(),
  statut: statutDemandeContratEnum('statut').default('envoye').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  payload: jsonb('payload'),
  pdfUrl: text('pdf_url'),
  signatureBase64: text('signature_base64'),
  signataireNom: text('signataire_nom'),
  signataireEmail: text('signataire_email'),
  villeSignature: text('ville_signature'),
  dateSignature: timestamp('date_signature'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// ─── Paramètres entreprise (singleton, éditable admin) ─────────
export const parametresEntreprise = pgTable(
  'parametres_entreprise',
  {
    id: integer('id').primaryKey().default(1),
    formeJuridique: text('forme_juridique'),
    capital: integer('capital'),
    adresseSiege: text('adresse_siege'),
    villeRcs: text('ville_rcs'),
    siren: text('siren'),
    tvaIntra: text('tva_intra'),
    nomDirigeant: text('nom_dirigeant'),
    qualiteDirigeant: text('qualite_dirigeant'),
    telephone: text('telephone'),
    villeJuridiction: text('ville_juridiction'),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  },
  (t) => ({
    singleton: check('parametres_entreprise_singleton', sql`${t.id} = 1`)
  })
)

// ─── Auth (Better Auth) ────────────────────────────────────────
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: userRoleEnum('role').default('commercial').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// ─── Types inférés ─────────────────────────────────────────────
export type Prospect = typeof prospects.$inferSelect
export type NewProspect = typeof prospects.$inferInsert
export type Client = typeof clients.$inferSelect
export type NewClient = typeof clients.$inferInsert
export type Contact = typeof contacts.$inferSelect
export type NewContact = typeof contacts.$inferInsert
export type Distributeur = typeof distributeurs.$inferSelect
export type NewDistributeur = typeof distributeurs.$inferInsert
export type Metrique = typeof metriques.$inferSelect
export type NewMetrique = typeof metriques.$inferInsert
export type Opportunite = typeof opportunites.$inferSelect
export type NewOpportunite = typeof opportunites.$inferInsert
export type Contrat = typeof contrats.$inferSelect
export type NewContrat = typeof contrats.$inferInsert
export type Relance = typeof relances.$inferSelect
export type NewRelance = typeof relances.$inferInsert
export type Tournee = typeof tournees.$inferSelect
export type NewTournee = typeof tournees.$inferInsert
export type ArretTournee = typeof arretsTournee.$inferSelect
export type NewArretTournee = typeof arretsTournee.$inferInsert
export type Intervention = typeof interventions.$inferSelect
export type NewIntervention = typeof interventions.$inferInsert
export type DemandeContrat = typeof demandesContrat.$inferSelect
export type NewDemandeContrat = typeof demandesContrat.$inferInsert
export type ParametresEntreprise = typeof parametresEntreprise.$inferSelect
export type NewParametresEntreprise = typeof parametresEntreprise.$inferInsert
export type User = typeof user.$inferSelect
export type Session = typeof session.$inferSelect
