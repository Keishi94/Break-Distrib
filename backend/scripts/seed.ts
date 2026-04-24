import { randomBytes } from 'node:crypto'
import { existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { eq } from 'drizzle-orm'
import { db } from '../src/db/client'
import { auth } from '../src/lib/auth'
import {
  clients,
  distributeurs,
  parametresEntreprise,
  prospects,
  user
} from '../src/db/schema/index'

const CREDS_FILE = resolve(import.meta.dir, '..', '.super-admin-credentials.txt')
const SUPERADMIN_EMAIL =
  process.env.SEED_SUPERADMIN_EMAIL ?? 'ayoub.slimani.pro94@gmail.com'
const SUPERADMIN_NAME = 'Super Admin'

const CLIENTS_IDF = [
  { raisonSociale: 'Groupe Lumen', adresseSiege: '12 rue de la Boétie, 75008 Paris', effectif: 180 },
  { raisonSociale: 'Atelier Moreau', adresseSiege: '48 rue Oberkampf, 75011 Paris', effectif: 42 },
  { raisonSociale: 'Novatek Industries', adresseSiege: "Parc d'activités, 92400 Courbevoie", effectif: 320 },
  { raisonSociale: 'Clinique du Parc', adresseSiege: "3 av. de l'Europe, 94300 Vincennes", effectif: 110 },
  { raisonSociale: 'Sodexo La Défense', adresseSiege: 'Tour Cœur Défense, 92800 Puteaux', effectif: 640 },
  { raisonSociale: 'Éditions Kairos', adresseSiege: '18 quai de Jemmapes, 75010 Paris', effectif: 60 },
  { raisonSociale: 'Lycée Saint-Exupéry', adresseSiege: 'Bd Voltaire, 93100 Montreuil', effectif: 1200 },
  { raisonSociale: 'Studio Orbite', adresseSiege: '5 rue Bichat, 75010 Paris', effectif: 28 },
  { raisonSociale: 'BioPole Saclay', adresseSiege: 'Campus Paris-Saclay, 91190 Gif-sur-Yvette', effectif: 220 },
  { raisonSociale: 'Mairie de Versailles', adresseSiege: '4 av. de Paris, 78000 Versailles', effectif: 340 },
  { raisonSociale: 'Transports Véga', adresseSiege: 'ZI Nord, 93200 Saint-Denis', effectif: 210 },
  { raisonSociale: 'Cabinet Aldebert', adresseSiege: '22 av. Victor Hugo, 75016 Paris', effectif: 34 }
] as const

const DISTRIBUTEURS_IDF = [
  { nom: 'BD-0142', modele: 'Snack Compact S2', place: 'Accueil RDC', client: 'Atelier Moreau', adresse: '48 rue Oberkampf, 75011 Paris', latitude: 48.8639, longitude: 2.3771, statut: 'actif' as const, stockActuel: 82, tempActuelle: 6.2 },
  { nom: 'BD-0155', modele: 'Café Pro X3', place: 'Étage 4 — Open Space', client: 'Groupe Lumen', adresse: '12 rue de la Boétie, 75008 Paris', latitude: 48.8719, longitude: 2.3130, statut: 'maintenance' as const, stockActuel: 28, tempActuelle: 5.8 },
  { nom: 'BD-0161', modele: 'Boissons Fresh F4', place: 'Tour Cœur Défense T1', client: 'Sodexo La Défense', adresse: 'Tour Cœur Défense, 92800 Puteaux', latitude: 48.8918, longitude: 2.2390, statut: 'actif' as const, stockActuel: 64, tempActuelle: 4.9 },
  { nom: 'BD-0167', modele: 'Snack Compact S2', place: 'Cafétéria niv. -1', client: 'Sodexo La Défense', adresse: 'Tour Cœur Défense, 92800 Puteaux', latitude: 48.8921, longitude: 2.2395, statut: 'panne' as const, stockActuel: 18, tempActuelle: 7.8 },
  { nom: 'BD-0173', modele: 'Café Pro X3', place: "Hall d'accueil", client: 'Novatek Industries', adresse: "Parc d'activités, 92400 Courbevoie", latitude: 48.8969, longitude: 2.2528, statut: 'actif' as const, stockActuel: 91, tempActuelle: 5.4 },
  { nom: 'BD-0178', modele: 'Boissons Fresh F4', place: 'Salle pause 2e étage', client: 'Clinique du Parc', adresse: "3 av. de l'Europe, 94300 Vincennes", latitude: 48.8457, longitude: 2.4391, statut: 'maintenance' as const, stockActuel: 34, tempActuelle: 5.1 },
  { nom: 'BD-0184', modele: 'Café Pro X3', place: 'Salle de réunion A', client: 'Éditions Kairos', adresse: '18 quai de Jemmapes, 75010 Paris', latitude: 48.8722, longitude: 2.3684, statut: 'actif' as const, stockActuel: 76, tempActuelle: 5.2 },
  { nom: 'BD-0189', modele: 'Snack Compact S2', place: 'Réfectoire', client: 'Lycée Saint-Exupéry', adresse: 'Bd Voltaire, 93100 Montreuil', latitude: 48.8638, longitude: 2.4477, statut: 'actif' as const, stockActuel: 57, tempActuelle: 6.0 },
  { nom: 'BD-0194', modele: 'Boissons Fresh F4', place: 'Bâtiment C — RDC', client: 'BioPole Saclay', adresse: 'Campus Paris-Saclay, 91190 Gif-sur-Yvette', latitude: 48.7107, longitude: 2.1700, statut: 'actif' as const, stockActuel: 68, tempActuelle: 4.7 },
  { nom: 'BD-0201', modele: 'Snack Compact S2', place: 'Annexe Montreuil', client: 'Mairie de Versailles', adresse: '4 av. de Paris, 78000 Versailles', latitude: 48.8014, longitude: 2.1301, statut: 'panne' as const, stockActuel: 12, tempActuelle: 9.4 },
  { nom: 'BD-0208', modele: 'Café Pro X3', place: 'Quai de chargement', client: 'Transports Véga', adresse: 'ZI Nord, 93200 Saint-Denis', latitude: 48.9362, longitude: 2.3574, statut: 'actif' as const, stockActuel: 88, tempActuelle: 5.7 },
  { nom: 'BD-0214', modele: 'Boissons Fresh F4', place: 'Salle de pause', client: 'Cabinet Aldebert', adresse: '22 av. Victor Hugo, 75016 Paris', latitude: 48.8722, longitude: 2.2809, statut: 'maintenance' as const, stockActuel: 31, tempActuelle: 6.1 }
]

const PROSPECTS_IDF = [
  { nom: 'Camille Riou', email: 'camille.riou@agence-nord.fr', entreprise: 'Agence Nord', telephone: '+33 1 42 55 89 10', adresse: '7 rue de Douai, 75009 Paris', effectif: 45, statut: 'contacte' as const },
  { nom: 'Hugo Meyer', email: 'h.meyer@startup-vibes.io', entreprise: 'Startup Vibes', telephone: '+33 1 45 67 23 18', adresse: '12 rue Paul Bert, 93400 Saint-Ouen', effectif: 22, statut: 'en_cours' as const },
  { nom: 'Laetitia Berger', email: 'l.berger@cabinet-praxis.fr', entreprise: 'Cabinet Praxis', telephone: '+33 1 56 78 44 90', adresse: '3 place Vendôme, 75001 Paris', effectif: 88, statut: 'nouveau' as const },
  { nom: 'Youssef Benali', email: 'ybenali@institut-pasteur-alumni.org', entreprise: 'Institut Alumni', telephone: '+33 1 40 61 32 85', adresse: '25 rue du Docteur Roux, 75015 Paris', effectif: 150, statut: 'nouveau' as const },
  { nom: 'Sophie Lefèvre', email: 's.lefevre@groupe-epsilon.com', entreprise: 'Groupe Epsilon', telephone: '+33 1 73 22 18 04', adresse: '48 bd Haussmann, 75009 Paris', effectif: 260, statut: 'en_cours' as const }
]

async function ensureSuperAdmin() {
  const [existing] = await db
    .select()
    .from(user)
    .where(eq(user.email, SUPERADMIN_EMAIL))
    .limit(1)

  if (existing) {
    if (existing.role !== 'admin') {
      await db.update(user).set({ role: 'admin' }).where(eq(user.id, existing.id))
      console.log(`↻ super-admin promu (role=admin) : ${SUPERADMIN_EMAIL}`)
    } else {
      console.log(`✓ super-admin déjà présent : ${SUPERADMIN_EMAIL}`)
    }
    return
  }

  const password = randomBytes(12).toString('base64url').slice(0, 20)

  const result = await auth.api.signUpEmail({
    body: { email: SUPERADMIN_EMAIL, password, name: SUPERADMIN_NAME }
  })
  if (!result.user?.id) {
    throw new Error('Échec création super-admin')
  }
  await db.update(user).set({ role: 'admin' }).where(eq(user.id, result.user.id))

  if (existsSync(CREDS_FILE)) {
    console.log(`⚠️  ${CREDS_FILE} existe déjà — mot de passe NON écrit (création précédente ?).`)
  } else {
    writeFileSync(
      CREDS_FILE,
      [
        "Break'Distrib — Super-admin credentials",
        'Généré par seed.ts',
        `Date: ${new Date().toISOString()}`,
        '',
        `Email    : ${SUPERADMIN_EMAIL}`,
        `Password : ${password}`,
        '',
        'Gardez ce fichier secret. Il est gitignored.'
      ].join('\n') + '\n',
      { mode: 0o600 }
    )
    console.log(`✓ super-admin créé. Credentials → ${CREDS_FILE}`)
  }
}

async function ensureParametres() {
  const [row] = await db
    .select()
    .from(parametresEntreprise)
    .where(eq(parametresEntreprise.id, 1))
    .limit(1)
  if (row) {
    console.log('✓ parametres_entreprise déjà présent')
    return
  }
  await db.insert(parametresEntreprise).values({ id: 1 })
  console.log('✓ parametres_entreprise initialisé (à compléter via /parametres)')
}

async function seedClients(): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  for (const c of CLIENTS_IDF) {
    const [existing] = await db
      .select()
      .from(clients)
      .where(eq(clients.raisonSociale, c.raisonSociale))
      .limit(1)
    if (existing) {
      map.set(c.raisonSociale, existing.id)
      continue
    }
    const [created] = await db
      .insert(clients)
      .values({
        raisonSociale: c.raisonSociale,
        adresseSiege: c.adresseSiege,
        effectif: c.effectif,
        statut: 'actif'
      })
      .returning()
    if (created) map.set(c.raisonSociale, created.id)
  }
  console.log(`✓ ${map.size} clients`)
  return map
}

async function seedDistributeurs(clientMap: Map<string, string>) {
  let inserted = 0
  for (const d of DISTRIBUTEURS_IDF) {
    const [existing] = await db
      .select()
      .from(distributeurs)
      .where(eq(distributeurs.nom, d.nom))
      .limit(1)
    if (existing) continue
    const clientId = clientMap.get(d.client)
    if (!clientId) {
      console.warn(`⚠ client introuvable pour ${d.nom}: ${d.client}`)
      continue
    }
    await db.insert(distributeurs).values({
      nom: d.nom,
      modele: d.modele,
      place: d.place,
      adresse: d.adresse,
      latitude: d.latitude,
      longitude: d.longitude,
      clientId,
      statut: d.statut,
      stockActuel: d.stockActuel,
      tempActuelle: d.tempActuelle,
      derniereSync: new Date()
    })
    inserted++
  }
  console.log(`✓ ${inserted} distributeurs`)
}

async function seedProspects() {
  let inserted = 0
  for (const p of PROSPECTS_IDF) {
    const [existing] = await db
      .select()
      .from(prospects)
      .where(eq(prospects.email, p.email))
      .limit(1)
    if (existing) continue
    await db.insert(prospects).values(p)
    inserted++
  }
  console.log(`✓ ${inserted} prospects`)
}

async function main() {
  console.log("Break'Distrib — seed\n")
  await ensureSuperAdmin()
  await ensureParametres()
  const clientMap = await seedClients()
  await seedDistributeurs(clientMap)
  await seedProspects()
  console.log('\nTerminé.')
  process.exit(0)
}

main().catch((e) => {
  console.error('✗ seed a échoué:', e)
  process.exit(1)
})
