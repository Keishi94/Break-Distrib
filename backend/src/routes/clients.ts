import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth, requireRole, type AuthVariables } from '../middlewares/auth'
import { paginationSchema } from '../lib/query'
import * as svc from '../services/clients'

const statutClient = z.enum(['actif', 'suspendu', 'archive'])

const baseClient = z.object({
  raisonSociale: z.string().min(1),
  formeJuridique: z.string().optional().nullable(),
  siren: z.string().optional().nullable(),
  tvaIntra: z.string().optional().nullable(),
  capital: z.number().int().nonnegative().optional().nullable(),
  adresseSiege: z.string().min(1),
  email: z.string().email().optional().nullable(),
  telephone: z.string().optional().nullable(),
  effectif: z.number().int().nonnegative().optional().nullable(),
  statut: statutClient.optional(),
  notes: z.string().optional().nullable()
})

const createSchema = baseClient.extend({
  prospectOrigineId: z.string().uuid().optional().nullable()
})

const updateSchema = createSchema.partial()

const convertSchema = baseClient

const querySchema = paginationSchema.extend({
  statut: statutClient.optional()
})

const COMMERCIAUX = ['admin', 'direction', 'commercial'] as const

export const clientsRoutes = new Hono<{ Variables: AuthVariables }>()
  .use('*', requireAuth)
  .get('/', zValidator('query', querySchema), async (c) => {
    return c.json(await svc.listClients(c.req.valid('query')))
  })
  .get('/:id', async (c) => {
    return c.json({ data: await svc.getClient(c.req.param('id')) })
  })
  .post('/', requireRole(...COMMERCIAUX), zValidator('json', createSchema), async (c) => {
    return c.json({ data: await svc.createClient(c.req.valid('json')) }, 201)
  })
  .post(
    '/from-prospect/:prospectId',
    requireRole(...COMMERCIAUX),
    zValidator('json', convertSchema),
    async (c) => {
      const result = await svc.convertProspectToClient(
        c.req.param('prospectId'),
        c.req.valid('json')
      )
      return c.json({ data: result }, 201)
    }
  )
  .put('/:id', requireRole(...COMMERCIAUX), zValidator('json', updateSchema), async (c) => {
    return c.json({ data: await svc.updateClient(c.req.param('id'), c.req.valid('json')) })
  })
  .delete('/:id', requireRole('admin', 'direction'), async (c) => {
    await svc.deleteClient(c.req.param('id'))
    return c.json({ success: true })
  })
