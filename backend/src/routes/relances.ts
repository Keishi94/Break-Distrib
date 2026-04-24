import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth, requireRole, type AuthVariables } from '../middlewares/auth'
import { paginationSchema } from '../lib/query'
import * as svc from '../services/relances'

const typeRelance = z.enum(['email', 'appel', 'visite'])

const createSchema = z.object({
  prospectId: z.string().uuid(),
  type: typeRelance,
  statut: z.string().optional(),
  datePlanifiee: z.coerce.date(),
  dateRealisee: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable()
})

const updateSchema = createSchema.partial()

const querySchema = paginationSchema.extend({
  prospectId: z.string().uuid().optional(),
  statut: z.string().optional()
})

const COMMERCIAUX = ['admin', 'direction', 'commercial'] as const

export const relancesRoutes = new Hono<{ Variables: AuthVariables }>()
  .use('*', requireAuth)
  .get('/', zValidator('query', querySchema), async (c) => {
    return c.json(await svc.listRelances(c.req.valid('query')))
  })
  .post('/', requireRole(...COMMERCIAUX), zValidator('json', createSchema), async (c) => {
    return c.json({ data: await svc.createRelance(c.req.valid('json')) }, 201)
  })
  .put('/:id', requireRole(...COMMERCIAUX), zValidator('json', updateSchema), async (c) => {
    return c.json({ data: await svc.updateRelance(c.req.param('id'), c.req.valid('json')) })
  })
  .delete('/:id', requireRole(...COMMERCIAUX), async (c) => {
    await svc.deleteRelance(c.req.param('id'))
    return c.json({ success: true })
  })
