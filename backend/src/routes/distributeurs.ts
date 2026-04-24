import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth, requireRole, type AuthVariables } from '../middlewares/auth'
import { paginationSchema } from '../lib/query'
import * as svc from '../services/distributeurs'

const statutDistributeur = z.enum(['actif', 'maintenance', 'panne', 'inactif'])

const createSchema = z.object({
  nom: z.string().min(1),
  modele: z.string().optional().nullable(),
  place: z.string().optional().nullable(),
  adresse: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  prospectId: z.string().uuid().optional().nullable(),
  clientId: z.string().uuid().optional().nullable(),
  statut: statutDistributeur.optional(),
  actif: z.boolean().optional(),
  stockActuel: z.number().int().optional().nullable(),
  tempActuelle: z.number().optional().nullable(),
  installeLe: z.coerce.date().optional()
})

const updateSchema = createSchema.partial()

const querySchema = paginationSchema.extend({
  statut: statutDistributeur.optional(),
  clientId: z.string().uuid().optional()
})

const TECH = ['admin', 'direction', 'technique'] as const

export const distributeursRoutes = new Hono<{ Variables: AuthVariables }>()
  .use('*', requireAuth)
  .get('/', zValidator('query', querySchema), async (c) => {
    return c.json(await svc.listDistributeurs(c.req.valid('query')))
  })
  .get('/:id', async (c) => {
    return c.json({ data: await svc.getDistributeur(c.req.param('id')) })
  })
  .post('/', requireRole(...TECH), zValidator('json', createSchema), async (c) => {
    return c.json({ data: await svc.createDistributeur(c.req.valid('json')) }, 201)
  })
  .put('/:id', requireRole(...TECH), zValidator('json', updateSchema), async (c) => {
    return c.json({ data: await svc.updateDistributeur(c.req.param('id'), c.req.valid('json')) })
  })
  .delete('/:id', requireRole('admin', 'direction'), async (c) => {
    await svc.deleteDistributeur(c.req.param('id'))
    return c.json({ success: true })
  })
