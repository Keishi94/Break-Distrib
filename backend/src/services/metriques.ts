import { HTTPException } from 'hono/http-exception'
import { and, count, desc, eq, gte, lte, type SQL } from 'drizzle-orm'
import { db } from '../db/client'
import { metriques, type Metrique, type NewMetrique } from '../db/schema/index'
import { buildMeta, paginate, type PaginationParams } from '../lib/query'

export type ListMetriquesParams = PaginationParams & {
  distributeurId?: string
  type?: string
  since?: Date
  until?: Date
  alerteOnly?: boolean
}

export async function listMetriques(params: ListMetriquesParams) {
  const conds: SQL[] = []
  if (params.distributeurId) conds.push(eq(metriques.distributeurId, params.distributeurId))
  if (params.type) conds.push(eq(metriques.type, params.type))
  if (params.since) conds.push(gte(metriques.timestamp, params.since))
  if (params.until) conds.push(lte(metriques.timestamp, params.until))
  if (params.alerteOnly) conds.push(eq(metriques.alerte, true))

  const where = conds.length ? and(...conds) : undefined
  const { limit, offset } = paginate(params)

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(metriques)
      .where(where)
      .orderBy(desc(metriques.timestamp))
      .limit(limit)
      .offset(offset),
    db.select({ n: count() }).from(metriques).where(where)
  ])

  return { data: rows, meta: buildMeta(params, totalRow[0]?.n ?? 0) }
}

export async function ingestMetriques(batch: NewMetrique[]): Promise<Metrique[]> {
  if (batch.length === 0) throw new HTTPException(400, { message: 'Batch vide' })
  return db.insert(metriques).values(batch).returning()
}
