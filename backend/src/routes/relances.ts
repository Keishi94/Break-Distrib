import { Hono } from 'hono'
import { db } from '../db/client'
import { relances } from '../db/schema/index'
import { eq } from 'drizzle-orm'

export const relancesRoutes = new Hono()
  .get('/', async (c) => {
    const data = await db.select().from(relances).orderBy(relances.datePlanifiee)
    return c.json({ data })
  })
  .post('/', async (c) => {
    const body = await c.req.json()
    const [created] = await db.insert(relances).values(body).returning()
    return c.json({ data: created }, 201)
  })
  .get('/prospect/:prospectId', async (c) => {
    const data = await db
      .select()
      .from(relances)
      .where(eq(relances.prospectId, c.req.param('prospectId')))
      .orderBy(relances.datePlanifiee)
    return c.json({ data })
  })
  .put('/:id', async (c) => {
    const body = await c.req.json()
    const [updated] = await db
      .update(relances)
      .set(body)
      .where(eq(relances.id, c.req.param('id')))
      .returning()
    if (!updated) return c.json({ error: 'Not found' }, 404)
    return c.json({ data: updated })
  })
