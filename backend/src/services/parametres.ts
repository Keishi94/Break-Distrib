import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import {
  parametresEntreprise,
  type NewParametresEntreprise,
  type ParametresEntreprise
} from '../db/schema/index'

const SINGLETON_ID = 1

export async function getParametres(): Promise<ParametresEntreprise> {
  const [row] = await db
    .select()
    .from(parametresEntreprise)
    .where(eq(parametresEntreprise.id, SINGLETON_ID))
    .limit(1)
  if (row) return row
  const [created] = await db
    .insert(parametresEntreprise)
    .values({ id: SINGLETON_ID })
    .returning()
  return created!
}

export async function updateParametres(
  patch: Partial<Omit<NewParametresEntreprise, 'id'>>
): Promise<ParametresEntreprise> {
  await getParametres()
  const [row] = await db
    .update(parametresEntreprise)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(parametresEntreprise.id, SINGLETON_ID))
    .returning()
  return row!
}
