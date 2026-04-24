import { HTTPException } from 'hono/http-exception'
import { and, count, eq, ilike, type SQL } from 'drizzle-orm'
import { db } from '../db/client'
import {
  opportunites,
  type NewOpportunite,
  type Opportunite
} from '../db/schema/index'
import { buildMeta, paginate, parseSort, type PaginationParams } from '../lib/query'

const SORTABLE = {
  titre: opportunites.titre,
  stage: opportunites.stage,
  montant: opportunites.montant,
  createdAt: opportunites.createdAt,
  updatedAt: opportunites.updatedAt
} as const

export type ListOpportunitesParams = PaginationParams & {
  stage?: Opportunite['stage']
  prospectId?: string
  clientId?: string
}

export async function listOpportunites(params: ListOpportunitesParams) {
  const conds: SQL[] = []
  if (params.q) conds.push(ilike(opportunites.titre, `%${params.q}%`))
  if (params.stage) conds.push(eq(opportunites.stage, params.stage))
  if (params.prospectId) conds.push(eq(opportunites.prospectId, params.prospectId))
  if (params.clientId) conds.push(eq(opportunites.clientId, params.clientId))

  const where = conds.length ? and(...conds) : undefined
  const { limit, offset } = paginate(params)

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(opportunites)
      .where(where)
      .orderBy(parseSort(params.sort, SORTABLE, 'createdAt'))
      .limit(limit)
      .offset(offset),
    db.select({ n: count() }).from(opportunites).where(where)
  ])

  return { data: rows, meta: buildMeta(params, totalRow[0]?.n ?? 0) }
}

export async function getOpportunite(id: string): Promise<Opportunite> {
  const [row] = await db
    .select()
    .from(opportunites)
    .where(eq(opportunites.id, id))
    .limit(1)
  if (!row) throw new HTTPException(404, { message: 'Opportunité introuvable' })
  return row
}

export async function createOpportunite(data: NewOpportunite): Promise<Opportunite> {
  if (!data.prospectId && !data.clientId) {
    throw new HTTPException(400, {
      message: 'prospectId ou clientId est obligatoire'
    })
  }
  const [row] = await db.insert(opportunites).values(data).returning()
  if (!row) throw new HTTPException(500, { message: 'Échec de création' })
  return row
}

export async function updateOpportunite(
  id: string,
  patch: Partial<NewOpportunite>
): Promise<Opportunite> {
  const [row] = await db
    .update(opportunites)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(opportunites.id, id))
    .returning()
  if (!row) throw new HTTPException(404, { message: 'Opportunité introuvable' })
  return row
}

export async function deleteOpportunite(id: string): Promise<void> {
  const [row] = await db
    .delete(opportunites)
    .where(eq(opportunites.id, id))
    .returning({ id: opportunites.id })
  if (!row) throw new HTTPException(404, { message: 'Opportunité introuvable' })
}
