import { HTTPException } from 'hono/http-exception'
import { and, count, eq, ilike, or, type SQL } from 'drizzle-orm'
import { db } from '../db/client'
import { contacts, type Contact, type NewContact } from '../db/schema/index'
import { buildMeta, paginate, parseSort, type PaginationParams } from '../lib/query'

const SORTABLE = {
  nom: contacts.nom,
  createdAt: contacts.createdAt,
  updatedAt: contacts.updatedAt
} as const

export type ListContactsParams = PaginationParams & {
  clientId?: string
}

export async function listContacts(params: ListContactsParams) {
  const conds: SQL[] = []
  if (params.q) {
    const pattern = `%${params.q}%`
    const searchCond = or(
      ilike(contacts.nom, pattern),
      ilike(contacts.email, pattern)
    )
    if (searchCond) conds.push(searchCond)
  }
  if (params.clientId) conds.push(eq(contacts.clientId, params.clientId))

  const where = conds.length ? and(...conds) : undefined
  const { limit, offset } = paginate(params)

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(contacts)
      .where(where)
      .orderBy(parseSort(params.sort, SORTABLE, 'createdAt'))
      .limit(limit)
      .offset(offset),
    db.select({ n: count() }).from(contacts).where(where)
  ])

  return { data: rows, meta: buildMeta(params, totalRow[0]?.n ?? 0) }
}

export async function getContact(id: string): Promise<Contact> {
  const [row] = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1)
  if (!row) throw new HTTPException(404, { message: 'Contact introuvable' })
  return row
}

export async function createContact(data: NewContact): Promise<Contact> {
  const [row] = await db.insert(contacts).values(data).returning()
  if (!row) throw new HTTPException(500, { message: 'Échec de création' })
  return row
}

export async function updateContact(
  id: string,
  patch: Partial<NewContact>
): Promise<Contact> {
  const [row] = await db
    .update(contacts)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(contacts.id, id))
    .returning()
  if (!row) throw new HTTPException(404, { message: 'Contact introuvable' })
  return row
}

export async function deleteContact(id: string): Promise<void> {
  const [row] = await db
    .delete(contacts)
    .where(eq(contacts.id, id))
    .returning({ id: contacts.id })
  if (!row) throw new HTTPException(404, { message: 'Contact introuvable' })
}
