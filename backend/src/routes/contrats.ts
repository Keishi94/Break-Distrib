import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth, requireRole, type AuthVariables } from '../middlewares/auth'
import { paginationSchema } from '../lib/query'
import * as svc from '../services/contrats'

const typeContrat = z.enum(['location_courte', 'mise_a_disposition'])
const statutContrat = z.enum(['brouillon', 'envoye', 'signe', 'resilie'])

const createSchema = z.object({
  prospectId: z.string().uuid().optional().nullable(),
  clientId: z.string().uuid().optional().nullable(),
  distributeurId: z.string().uuid().optional().nullable(),
  type: typeContrat,
  statut: statutContrat.optional(),
  dateDebut: z.coerce.date(),
  dateFin: z.coerce.date().optional().nullable(),
  montantMensuel: z.number().nonnegative().optional().nullable(),
  pdfUrl: z.string().optional().nullable(),
  signataireNom: z.string().optional().nullable(),
  signataireEmail: z.string().email().optional().nullable()
})

const updateSchema = createSchema.partial()

const querySchema = paginationSchema.extend({
  statut: statutContrat.optional(),
  type: typeContrat.optional(),
  clientId: z.string().uuid().optional(),
  prospectId: z.string().uuid().optional()
})

const MANAGERS = ['admin', 'direction'] as const

export const contratsRoutes = new Hono<{ Variables: AuthVariables }>()
  .use('*', requireAuth)
  .get('/', zValidator('query', querySchema), async (c) => {
    return c.json(await svc.listContrats(c.req.valid('query')))
  })
  .get('/:id', async (c) => {
    return c.json({ data: await svc.getContrat(c.req.param('id')) })
  })
  .post('/', requireRole(...MANAGERS), zValidator('json', createSchema), async (c) => {
    return c.json({ data: await svc.createContrat(c.req.valid('json')) }, 201)
  })
  .put('/:id', requireRole(...MANAGERS), zValidator('json', updateSchema), async (c) => {
    return c.json({ data: await svc.updateContrat(c.req.param('id'), c.req.valid('json')) })
  })
