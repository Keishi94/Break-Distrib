import { HTTPException } from 'hono/http-exception'
import { and, count, eq, ilike, or, type SQL } from 'drizzle-orm'
import { db } from '../db/client'
import {
  clients,
  prospects,
  type Client,
  type NewClient,
  type Prospect
} from '../db/schema/index'
import { buildMeta, paginate, parseSort, type PaginationParams } from '../lib/query'

const SORTABLE = {
  raisonSociale: clients.raisonSociale,
  statut: clients.statut,
  createdAt: clients.createdAt,
  updatedAt: clients.updatedAt
} as const

export type ListClientsParams = PaginationParams & {
  statut?: Client['statut']
}

export async function listClients(params: ListClientsParams) {
  const conds: SQL[] = []
  if (params.q) {
    const pattern = `%${params.q}%`
    const searchCond = or(
      ilike(clients.raisonSociale, pattern),
      ilike(clients.email, pattern),
      ilike(clients.siren, pattern)
    )
    if (searchCond) conds.push(searchCond)
  }
  if (params.statut) conds.push(eq(clients.statut, params.statut))

  const where = conds.length ? and(...conds) : undefined
  const { limit, offset } = paginate(params)

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(clients)
      .where(where)
      .orderBy(parseSort(params.sort, SORTABLE, 'createdAt'))
      .limit(limit)
      .offset(offset),
    db.select({ n: count() }).from(clients).where(where)
  ])

  return { data: rows, meta: buildMeta(params, totalRow[0]?.n ?? 0) }
}

export async function getClient(id: string): Promise<Client> {
  const [row] = await db.select().from(clients).where(eq(clients.id, id)).limit(1)
  if (!row) throw new HTTPException(404, { message: 'Client introuvable' })
  return row
}

export async function createClient(data: NewClient): Promise<Client> {
  const [row] = await db.insert(clients).values(data).returning()
  if (!row) throw new HTTPException(500, { message: 'Échec de création' })
  return row
}

export async function updateClient(
  id: string,
  patch: Partial<NewClient>
): Promise<Client> {
  const [row] = await db
    .update(clients)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(clients.id, id))
    .returning()
  if (!row) throw new HTTPException(404, { message: 'Client introuvable' })
  return row
}

export async function deleteClient(id: string): Promise<void> {
  const [row] = await db
    .delete(clients)
    .where(eq(clients.id, id))
    .returning({ id: clients.id })
  if (!row) throw new HTTPException(404, { message: 'Client introuvable' })
}

export async function convertProspectToClient(
  prospectId: string,
  data: Omit<NewClient, 'prospectOrigineId'>
): Promise<{ prospect: Prospect; client: Client }> {
  return db.transaction(async (tx) => {
    const [prospect] = await tx
      .select()
      .from(prospects)
      .where(eq(prospects.id, prospectId))
      .limit(1)
    if (!prospect) throw new HTTPException(404, { message: 'Prospect introuvable' })

    const [client] = await tx
      .insert(clients)
      .values({ ...data, prospectOrigineId: prospectId })
      .returning()
    if (!client) throw new HTTPException(500, { message: 'Échec de conversion' })

    const [updated] = await tx
      .update(prospects)
      .set({ statut: 'converti', updatedAt: new Date() })
      .where(eq(prospects.id, prospectId))
      .returning()
    if (!updated) throw new HTTPException(500, { message: 'Échec mise à jour prospect' })

    return { prospect: updated, client }
  })
}
