import { HTTPException } from 'hono/http-exception'
import { and, count, eq, type SQL } from 'drizzle-orm'
import { db } from '../db/client'
import {
  arretsTournee,
  tournees,
  type ArretTournee,
  type NewArretTournee,
  type NewTournee,
  type Tournee
} from '../db/schema/index'
import { buildMeta, paginate, parseSort, type PaginationParams } from '../lib/query'

const SORTABLE = {
  date: tournees.date,
  statut: tournees.statut,
  createdAt: tournees.createdAt
} as const

export type ListTourneesParams = PaginationParams & {
  statut?: Tournee['statut']
  technicienId?: string
}

export async function listTournees(params: ListTourneesParams) {
  const conds: SQL[] = []
  if (params.statut) conds.push(eq(tournees.statut, params.statut))
  if (params.technicienId) conds.push(eq(tournees.technicienId, params.technicienId))

  const where = conds.length ? and(...conds) : undefined
  const { limit, offset } = paginate(params)

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(tournees)
      .where(where)
      .orderBy(parseSort(params.sort, SORTABLE, 'date'))
      .limit(limit)
      .offset(offset),
    db.select({ n: count() }).from(tournees).where(where)
  ])

  return { data: rows, meta: buildMeta(params, totalRow[0]?.n ?? 0) }
}

export async function getTournee(
  id: string
): Promise<{ tournee: Tournee; arrets: ArretTournee[] }> {
  const [tournee] = await db.select().from(tournees).where(eq(tournees.id, id)).limit(1)
  if (!tournee) throw new HTTPException(404, { message: 'Tournée introuvable' })
  const arrets = await db
    .select()
    .from(arretsTournee)
    .where(eq(arretsTournee.tourneeId, id))
    .orderBy(arretsTournee.ordre)
  return { tournee, arrets }
}

export async function createTournee(data: NewTournee): Promise<Tournee> {
  const [row] = await db.insert(tournees).values(data).returning()
  if (!row) throw new HTTPException(500, { message: 'Échec de création' })
  return row
}

export async function updateTournee(
  id: string,
  patch: Partial<NewTournee>
): Promise<Tournee> {
  const [row] = await db
    .update(tournees)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(tournees.id, id))
    .returning()
  if (!row) throw new HTTPException(404, { message: 'Tournée introuvable' })
  return row
}

export async function deleteTournee(id: string): Promise<void> {
  const [row] = await db
    .delete(tournees)
    .where(eq(tournees.id, id))
    .returning({ id: tournees.id })
  if (!row) throw new HTTPException(404, { message: 'Tournée introuvable' })
}

export async function addArret(data: NewArretTournee): Promise<ArretTournee> {
  const [row] = await db.insert(arretsTournee).values(data).returning()
  if (!row) throw new HTTPException(500, { message: 'Échec de création arrêt' })
  return row
}

export async function updateArret(
  id: string,
  patch: Partial<NewArretTournee>
): Promise<ArretTournee> {
  const [row] = await db
    .update(arretsTournee)
    .set(patch)
    .where(eq(arretsTournee.id, id))
    .returning()
  if (!row) throw new HTTPException(404, { message: 'Arrêt introuvable' })
  return row
}

export async function deleteArret(id: string): Promise<void> {
  const [row] = await db
    .delete(arretsTournee)
    .where(eq(arretsTournee.id, id))
    .returning({ id: arretsTournee.id })
  if (!row) throw new HTTPException(404, { message: 'Arrêt introuvable' })
}
