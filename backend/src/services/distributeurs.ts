import { HTTPException } from 'hono/http-exception'
import { and, count, eq, ilike, or, type SQL } from 'drizzle-orm'
import { db } from '../db/client'
import { distributeurs, type Distributeur, type NewDistributeur } from '../db/schema/index'
import { buildMeta, paginate, parseSort, type PaginationParams } from '../lib/query'

const SORTABLE = {
  nom: distributeurs.nom,
  statut: distributeurs.statut,
  installeLe: distributeurs.installeLe,
  createdAt: distributeurs.createdAt
} as const

export type ListDistributeursParams = PaginationParams & {
  statut?: Distributeur['statut']
  clientId?: string
}

export async function listDistributeurs(params: ListDistributeursParams) {
  const conds: SQL[] = []
  if (params.q) {
    const pattern = `%${params.q}%`
    const searchCond = or(
      ilike(distributeurs.nom, pattern),
      ilike(distributeurs.adresse, pattern),
      ilike(distributeurs.modele, pattern)
    )
    if (searchCond) conds.push(searchCond)
  }
  if (params.statut) conds.push(eq(distributeurs.statut, params.statut))
  if (params.clientId) conds.push(eq(distributeurs.clientId, params.clientId))

  const where = conds.length ? and(...conds) : undefined
  const { limit, offset } = paginate(params)

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(distributeurs)
      .where(where)
      .orderBy(parseSort(params.sort, SORTABLE, 'createdAt'))
      .limit(limit)
      .offset(offset),
    db.select({ n: count() }).from(distributeurs).where(where)
  ])

  return { data: rows, meta: buildMeta(params, totalRow[0]?.n ?? 0) }
}

export async function getDistributeur(id: string): Promise<Distributeur> {
  const [row] = await db
    .select()
    .from(distributeurs)
    .where(eq(distributeurs.id, id))
    .limit(1)
  if (!row) throw new HTTPException(404, { message: 'Distributeur introuvable' })
  return row
}

export async function createDistributeur(data: NewDistributeur): Promise<Distributeur> {
  const [row] = await db.insert(distributeurs).values(data).returning()
  if (!row) throw new HTTPException(500, { message: 'Échec de création' })
  return row
}

export async function updateDistributeur(
  id: string,
  patch: Partial<NewDistributeur>
): Promise<Distributeur> {
  const [row] = await db
    .update(distributeurs)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(distributeurs.id, id))
    .returning()
  if (!row) throw new HTTPException(404, { message: 'Distributeur introuvable' })
  return row
}

export async function deleteDistributeur(id: string): Promise<void> {
  const [row] = await db
    .delete(distributeurs)
    .where(eq(distributeurs.id, id))
    .returning({ id: distributeurs.id })
  if (!row) throw new HTTPException(404, { message: 'Distributeur introuvable' })
}
