import { Hono } from 'hono'
import { db } from '../db/client'
import { distributeurs } from '../db/schema/index'
import { eq } from 'drizzle-orm'

export const distributeursRoutes = new Hono()
  .get('/', async (c) => {
    const data = await db.select().from(distributeurs).orderBy(distributeurs.createdAt)
    return c.json({ data })
  })
  .post('/', async (c) => {
    const body = await c.req.json()
    const [created] = await db.insert(distributeurs).values(body).returning()
    return c.json({ data: created }, 201)
  })
  .get('/:id', async (c) => {
    const [data] = await db
      .select()
      .from(distributeurs)
      .where(eq(distributeurs.id, c.req.param('id')))
    if (!data) return c.json({ error: 'Not found' }, 404)
    return c.json({ data })
  })
  .put('/:id', async (c) => {
    const body = await c.req.json()
    const [updated] = await db
      .update(distributeurs)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(distributeurs.id, c.req.param('id')))
      .returning()
    if (!updated) return c.json({ error: 'Not found' }, 404)
    return c.json({ data: updated })
  })
  .delete('/:id', async (c) => {
    await db.delete(distributeurs).where(eq(distributeurs.id, c.req.param('id')))
    return c.json({ success: true })
  })
