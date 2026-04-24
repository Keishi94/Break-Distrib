import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth, requireRole, type AuthVariables } from '../middlewares/auth'
import { paginationSchema } from '../lib/query'
import * as svc from '../services/prospects'

const statutProspect = z.enum(['nouveau', 'contacte', 'en_cours', 'converti', 'perdu'])

const createSchema = z.object({
  nom: z.string().min(1),
  email: z.string().email(),
  telephone: z.string().optional().nullable(),
  entreprise: z.string().min(1),
  adresse: z.string().optional().nullable(),
  effectif: z.number().int().nonnegative().optional().nullable(),
  statut: statutProspect.optional(),
  notes: z.string().optional().nullable()
})

const updateSchema = createSchema.partial()

const querySchema = paginationSchema.extend({
  statut: statutProspect.optional()
})

const COMMERCIAUX = ['admin', 'direction', 'commercial'] as const

export const prospectsRoutes = new Hono<{ Variables: AuthVariables }>()
  .use('*', requireAuth)
  .get('/', zValidator('query', querySchema), async (c) => {
    return c.json(await svc.listProspects(c.req.valid('query')))
  })
  .get('/:id', async (c) => {
    return c.json({ data: await svc.getProspect(c.req.param('id')) })
  })
  .post('/', requireRole(...COMMERCIAUX), zValidator('json', createSchema), async (c) => {
    return c.json({ data: await svc.createProspect(c.req.valid('json')) }, 201)
  })
  .put('/:id', requireRole(...COMMERCIAUX), zValidator('json', updateSchema), async (c) => {
    return c.json({ data: await svc.updateProspect(c.req.param('id'), c.req.valid('json')) })
  })
  .delete('/:id', requireRole('admin', 'direction'), async (c) => {
    await svc.deleteProspect(c.req.param('id'))
    return c.json({ success: true })
  })
