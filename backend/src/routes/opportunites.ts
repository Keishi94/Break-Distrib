import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth, requireRole, type AuthVariables } from '../middlewares/auth'
import { paginationSchema } from '../lib/query'
import * as svc from '../services/opportunites'

const stage = z.enum([
  'decouverte',
  'qualification',
  'proposition',
  'negociation',
  'signe',
  'perdu'
])

const createSchema = z
  .object({
    prospectId: z.string().uuid().optional().nullable(),
    clientId: z.string().uuid().optional().nullable(),
    titre: z.string().min(1),
    stage: stage.optional(),
    montant: z.number().nonnegative().optional().nullable(),
    probabilite: z.number().int().min(0).max(100).optional(),
    dateClotureProbable: z.coerce.date().optional().nullable(),
    notes: z.string().optional().nullable()
  })
  .refine((d) => d.prospectId || d.clientId, {
    message: 'prospectId ou clientId est obligatoire',
    path: ['prospectId']
  })

const updateSchema = z.object({
  prospectId: z.string().uuid().optional().nullable(),
  clientId: z.string().uuid().optional().nullable(),
  titre: z.string().min(1).optional(),
  stage: stage.optional(),
  montant: z.number().nonnegative().optional().nullable(),
  probabilite: z.number().int().min(0).max(100).optional(),
  dateClotureProbable: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable()
})

const querySchema = paginationSchema.extend({
  stage: stage.optional(),
  prospectId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional()
})

const COMMERCIAUX = ['admin', 'direction', 'commercial'] as const

export const opportunitesRoutes = new Hono<{ Variables: AuthVariables }>()
  .use('*', requireAuth)
  .get('/', zValidator('query', querySchema), async (c) => {
    return c.json(await svc.listOpportunites(c.req.valid('query')))
  })
  .get('/:id', async (c) => {
    return c.json({ data: await svc.getOpportunite(c.req.param('id')) })
  })
  .post('/', requireRole(...COMMERCIAUX), zValidator('json', createSchema), async (c) => {
    return c.json({ data: await svc.createOpportunite(c.req.valid('json')) }, 201)
  })
  .put('/:id', requireRole(...COMMERCIAUX), zValidator('json', updateSchema), async (c) => {
    return c.json({ data: await svc.updateOpportunite(c.req.param('id'), c.req.valid('json')) })
  })
  .delete('/:id', requireRole('admin', 'direction'), async (c) => {
    await svc.deleteOpportunite(c.req.param('id'))
    return c.json({ success: true })
  })
