import { HTTPException } from 'hono/http-exception'
import { and, count, eq, type SQL } from 'drizzle-orm'
import { db } from '../db/client'
import { contrats, type Contrat, type NewContrat } from '../db/schema/index'
import { buildMeta, paginate, parseSort, type PaginationParams } from '../lib/query'

const SORTABLE = {
  statut: contrats.statut,
  dateDebut: contrats.dateDebut,
  createdAt: contrats.createdAt
} as const

export type ListContratsParams = PaginationParams & {
  statut?: Contrat['statut']
  type?: Contrat['type']
  clientId?: string
  prospectId?: string
}

export async function listContrats(params: ListContratsParams) {
  const conds: SQL[] = []
  if (params.statut) conds.push(eq(contrats.statut, params.statut))
  if (params.type) conds.push(eq(contrats.type, params.type))
  if (params.clientId) conds.push(eq(contrats.clientId, params.clientId))
  if (params.prospectId) conds.push(eq(contrats.prospectId, params.prospectId))

  const where = conds.length ? and(...conds) : undefined
  const { limit, offset } = paginate(params)

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(contrats)
      .where(where)
      .orderBy(parseSort(params.sort, SORTABLE, 'createdAt'))
      .limit(limit)
      .offset(offset),
    db.select({ n: count() }).from(contrats).where(where)
  ])

  return { data: rows, meta: buildMeta(params, totalRow[0]?.n ?? 0) }
}

export async function getContrat(id: string): Promise<Contrat> {
  const [row] = await db.select().from(contrats).where(eq(contrats.id, id)).limit(1)
  if (!row) throw new HTTPException(404, { message: 'Contrat introuvable' })
  return row
}

export async function createContrat(data: NewContrat): Promise<Contrat> {
  const [row] = await db.insert(contrats).values(data).returning()
  if (!row) throw new HTTPException(500, { message: 'Échec de création' })
  return row
}

export async function updateContrat(
  id: string,
  patch: Partial<NewContrat>
): Promise<Contrat> {
  const [row] = await db
    .update(contrats)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(contrats.id, id))
    .returning()
  if (!row) throw new HTTPException(404, { message: 'Contrat introuvable' })
  return row
}
