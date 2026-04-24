import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth, requireRole, type AuthVariables } from '../middlewares/auth'
import { paginationSchema } from '../lib/query'
import * as svc from '../services/metriques'

const metriqueSchema = z.object({
  distributeurId: z.string().uuid(),
  type: z.string().min(1),
  valeur: z.number(),
  unite: z.string().optional().nullable(),
  alerte: z.boolean().optional(),
  timestamp: z.coerce.date().optional()
})

const querySchema = paginationSchema.extend({
  distributeurId: z.string().uuid().optional(),
  type: z.string().optional(),
  since: z.coerce.date().optional(),
  until: z.coerce.date().optional(),
  alerteOnly: z.coerce.boolean().optional()
})

const INGEST_ROLES = ['admin', 'technique'] as const

export const metriquesRoutes = new Hono<{ Variables: AuthVariables }>()
  .use('*', requireAuth)
  .get('/', zValidator('query', querySchema), async (c) => {
    return c.json(await svc.listMetriques(c.req.valid('query')))
  })
  .post(
    '/',
    requireRole(...INGEST_ROLES),
    zValidator('json', metriqueSchema),
    async (c) => {
      const [row] = await svc.ingestMetriques([c.req.valid('json')])
      return c.json({ data: row }, 201)
    }
  )
  .post(
    '/batch',
    requireRole(...INGEST_ROLES),
    zValidator('json', z.object({ data: z.array(metriqueSchema).min(1).max(1000) })),
    async (c) => {
      const created = await svc.ingestMetriques(c.req.valid('json').data)
      return c.json({ data: created, count: created.length }, 201)
    }
  )
