import { Hono } from 'hono'
import { db } from '../db/client'
import { contrats } from '../db/schema/index'
import { eq } from 'drizzle-orm'

export const contratsRoutes = new Hono()
  .get('/', async (c) => {
    const data = await db.select().from(contrats).orderBy(contrats.createdAt)
    return c.json({ data })
  })
  .post('/', async (c) => {
    const body = await c.req.json()
    const [created] = await db.insert(contrats).values(body).returning()
    return c.json({ data: created }, 201)
  })
  .get('/:id', async (c) => {
    const [data] = await db
      .select()
      .from(contrats)
      .where(eq(contrats.id, c.req.param('id')))
    if (!data) return c.json({ error: 'Not found' }, 404)
    return c.json({ data })
  })
  .put('/:id', async (c) => {
    const body = await c.req.json()
    const [updated] = await db
      .update(contrats)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(contrats.id, c.req.param('id')))
      .returning()
    if (!updated) return c.json({ error: 'Not found' }, 404)
    return c.json({ data: updated })
  })
