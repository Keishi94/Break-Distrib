import { Hono } from 'hono'
import { db } from '../db/client'
import { metriques } from '../db/schema/index'
import { eq, desc } from 'drizzle-orm'

export const metriquesRoutes = new Hono()
  .get('/', async (c) => {
    const data = await db
      .select()
      .from(metriques)
      .orderBy(desc(metriques.timestamp))
      .limit(500)
    return c.json({ data })
  })
  .get('/distributeur/:distributeurId', async (c) => {
    const data = await db
      .select()
      .from(metriques)
      .where(eq(metriques.distributeurId, c.req.param('distributeurId')))
      .orderBy(desc(metriques.timestamp))
      .limit(100)
    return c.json({ data })
  })
  .post('/', async (c) => {
    const body = await c.req.json()
    const [created] = await db.insert(metriques).values(body).returning()
    return c.json({ data: created }, 201)
  })
  // Ingestion batch depuis les distributeurs
  .post('/batch', async (c) => {
    const { data: batch } = await c.req.json()
    const created = await db.insert(metriques).values(batch).returning()
    return c.json({ data: created, count: created.length }, 201)
  })
