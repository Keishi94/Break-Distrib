import { HTTPException } from 'hono/http-exception'
import { and, count, eq, type SQL } from 'drizzle-orm'
import { db } from '../db/client'
import {
  interventions,
  type Intervention,
  type NewIntervention
} from '../db/schema/index'
import { buildMeta, paginate, parseSort, type PaginationParams } from '../lib/query'

const SORTABLE = {
  realiseeLe: interventions.realiseeLe,
  type: interventions.type,
  createdAt: interventions.createdAt
} as const

export type ListInterventionsParams = PaginationParams & {
  distributeurId?: string
  technicienId?: string
  tourneeId?: string
  type?: Intervention['type']
}

export async function listInterventions(params: ListInterventionsParams) {
  const conds: SQL[] = []
  if (params.distributeurId) conds.push(eq(interventions.distributeurId, params.distributeurId))
  if (params.technicienId) conds.push(eq(interventions.technicienId, params.technicienId))
  if (params.tourneeId) conds.push(eq(interventions.tourneeId, params.tourneeId))
  if (params.type) conds.push(eq(interventions.type, params.type))

  const where = conds.length ? and(...conds) : undefined
  const { limit, offset } = paginate(params)

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(interventions)
      .where(where)
      .orderBy(parseSort(params.sort, SORTABLE, 'realiseeLe'))
      .limit(limit)
      .offset(offset),
    db.select({ n: count() }).from(interventions).where(where)
  ])

  return { data: rows, meta: buildMeta(params, totalRow[0]?.n ?? 0) }
}

export async function getIntervention(id: string): Promise<Intervention> {
  const [row] = await db
    .select()
    .from(interventions)
    .where(eq(interventions.id, id))
    .limit(1)
  if (!row) throw new HTTPException(404, { message: 'Intervention introuvable' })
  return row
}

export async function createIntervention(data: NewIntervention): Promise<Intervention> {
  const [row] = await db.insert(interventions).values(data).returning()
  if (!row) throw new HTTPException(500, { message: 'Échec de création' })
  return row
}

export async function updateIntervention(
  id: string,
  patch: Partial<NewIntervention>
): Promise<Intervention> {
  const [row] = await db
    .update(interventions)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(interventions.id, id))
    .returning()
  if (!row) throw new HTTPException(404, { message: 'Intervention introuvable' })
  return row
}

export async function deleteIntervention(id: string): Promise<void> {
  const [row] = await db
    .delete(interventions)
    .where(eq(interventions.id, id))
    .returning({ id: interventions.id })
  if (!row) throw new HTTPException(404, { message: 'Intervention introuvable' })
}
