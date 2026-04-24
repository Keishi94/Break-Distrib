import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth, requireRole, type AuthVariables } from '../middlewares/auth'
import { paginationSchema } from '../lib/query'
import * as svc from '../services/interventions'

const typeIntervention = z.enum([
  'maintenance',
  'reparation',
  'reassort',
  'installation',
  'retrait'
])

const createSchema = z.object({
  distributeurId: z.string().uuid(),
  technicienId: z.string().min(1),
  tourneeId: z.string().uuid().optional().nullable(),
  type: typeIntervention,
  notes: z.string().optional().nullable(),
  realiseeLe: z.coerce.date().optional()
})

const updateSchema = createSchema.partial()

const querySchema = paginationSchema.extend({
  distributeurId: z.string().uuid().optional(),
  technicienId: z.string().optional(),
  tourneeId: z.string().uuid().optional(),
  type: typeIntervention.optional()
})

const TECH = ['admin', 'direction', 'technique'] as const

export const interventionsRoutes = new Hono<{ Variables: AuthVariables }>()
  .use('*', requireAuth)
  .get('/', zValidator('query', querySchema), async (c) => {
    return c.json(await svc.listInterventions(c.req.valid('query')))
  })
  .get('/:id', async (c) => {
    return c.json({ data: await svc.getIntervention(c.req.param('id')) })
  })
  .post('/', requireRole(...TECH), zValidator('json', createSchema), async (c) => {
    return c.json({ data: await svc.createIntervention(c.req.valid('json')) }, 201)
  })
  .put('/:id', requireRole(...TECH), zValidator('json', updateSchema), async (c) => {
    return c.json({ data: await svc.updateIntervention(c.req.param('id'), c.req.valid('json')) })
  })
  .delete('/:id', requireRole('admin', 'direction'), async (c) => {
    await svc.deleteIntervention(c.req.param('id'))
    return c.json({ success: true })
  })
