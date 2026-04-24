import { HTTPException } from 'hono/http-exception'
import { and, count, eq, ilike, or, type SQL } from 'drizzle-orm'
import { db } from '../db/client'
import { prospects, type NewProspect, type Prospect } from '../db/schema/index'
import { buildMeta, paginate, parseSort, type PaginationParams } from '../lib/query'

const SORTABLE = {
  nom: prospects.nom,
  entreprise: prospects.entreprise,
  statut: prospects.statut,
  createdAt: prospects.createdAt,
  updatedAt: prospects.updatedAt
} as const

export type ListProspectsParams = PaginationParams & {
  statut?: Prospect['statut']
}

export async function listProspects(params: ListProspectsParams) {
  const conds: SQL[] = []
  if (params.q) {
    const pattern = `%${params.q}%`
    const searchCond = or(
      ilike(prospects.nom, pattern),
      ilike(prospects.entreprise, pattern),
      ilike(prospects.email, pattern)
    )
    if (searchCond) conds.push(searchCond)
  }
  if (params.statut) conds.push(eq(prospects.statut, params.statut))

  const where = conds.length ? and(...conds) : undefined
  const { limit, offset } = paginate(params)

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(prospects)
      .where(where)
      .orderBy(parseSort(params.sort, SORTABLE, 'createdAt'))
      .limit(limit)
      .offset(offset),
    db.select({ n: count() }).from(prospects).where(where)
  ])

  return { data: rows, meta: buildMeta(params, totalRow[0]?.n ?? 0) }
}

export async function getProspect(id: string): Promise<Prospect> {
  const [row] = await db.select().from(prospects).where(eq(prospects.id, id)).limit(1)
  if (!row) throw new HTTPException(404, { message: 'Prospect introuvable' })
  return row
}

export async function createProspect(data: NewProspect): Promise<Prospect> {
  const [row] = await db.insert(prospects).values(data).returning()
  if (!row) throw new HTTPException(500, { message: 'Échec de création' })
  return row
}

export async function updateProspect(
  id: string,
  patch: Partial<NewProspect>
): Promise<Prospect> {
  const [row] = await db
    .update(prospects)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(prospects.id, id))
    .returning()
  if (!row) throw new HTTPException(404, { message: 'Prospect introuvable' })
  return row
}

export async function deleteProspect(id: string): Promise<void> {
  const [row] = await db
    .delete(prospects)
    .where(eq(prospects.id, id))
    .returning({ id: prospects.id })
  if (!row) throw new HTTPException(404, { message: 'Prospect introuvable' })
}
