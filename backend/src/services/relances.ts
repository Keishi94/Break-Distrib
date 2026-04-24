import { HTTPException } from 'hono/http-exception'
import { and, count, eq, type SQL } from 'drizzle-orm'
import { db } from '../db/client'
import { relances, type NewRelance, type Relance } from '../db/schema/index'
import { buildMeta, paginate, parseSort, type PaginationParams } from '../lib/query'

const SORTABLE = {
  datePlanifiee: relances.datePlanifiee,
  dateRealisee: relances.dateRealisee,
  createdAt: relances.createdAt
} as const

export type ListRelancesParams = PaginationParams & {
  prospectId?: string
  statut?: string
}

export async function listRelances(params: ListRelancesParams) {
  const conds: SQL[] = []
  if (params.prospectId) conds.push(eq(relances.prospectId, params.prospectId))
  if (params.statut) conds.push(eq(relances.statut, params.statut))

  const where = conds.length ? and(...conds) : undefined
  const { limit, offset } = paginate(params)

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(relances)
      .where(where)
      .orderBy(parseSort(params.sort, SORTABLE, 'datePlanifiee'))
      .limit(limit)
      .offset(offset),
    db.select({ n: count() }).from(relances).where(where)
  ])

  return { data: rows, meta: buildMeta(params, totalRow[0]?.n ?? 0) }
}

export async function createRelance(data: NewRelance): Promise<Relance> {
  const [row] = await db.insert(relances).values(data).returning()
  if (!row) throw new HTTPException(500, { message: 'Échec de création' })
  return row
}

export async function updateRelance(id: string, patch: Partial<NewRelance>): Promise<Relance> {
  const [row] = await db
    .update(relances)
    .set(patch)
    .where(eq(relances.id, id))
    .returning()
  if (!row) throw new HTTPException(404, { message: 'Relance introuvable' })
  return row
}

export async function deleteRelance(id: string): Promise<void> {
  const [row] = await db
    .delete(relances)
    .where(eq(relances.id, id))
    .returning({ id: relances.id })
  if (!row) throw new HTTPException(404, { message: 'Relance introuvable' })
}
