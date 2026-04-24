import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth, requireRole, type AuthVariables } from '../middlewares/auth'
import { paginationSchema } from '../lib/query'
import * as svc from '../services/tournees'

const statutTournee = z.enum(['planifiee', 'en_cours', 'terminee', 'annulee'])
const statutArret = z.enum(['a_faire', 'en_cours', 'fait', 'ignore'])

const createTourneeSchema = z.object({
  technicienId: z.string().min(1),
  date: z.coerce.date(),
  statut: statutTournee.optional(),
  notes: z.string().optional().nullable()
})

const updateTourneeSchema = createTourneeSchema.partial()

const createArretSchema = z.object({
  distributeurId: z.string().uuid(),
  ordre: z.number().int().nonnegative(),
  statut: statutArret.optional(),
  notes: z.string().optional().nullable()
})

const updateArretSchema = z.object({
  distributeurId: z.string().uuid().optional(),
  ordre: z.number().int().nonnegative().optional(),
  statut: statutArret.optional(),
  notes: z.string().optional().nullable()
})

const querySchema = paginationSchema.extend({
  statut: statutTournee.optional(),
  technicienId: z.string().optional()
})

const TECH = ['admin', 'direction', 'technique'] as const

export const tourneesRoutes = new Hono<{ Variables: AuthVariables }>()
  .use('*', requireAuth)
  .get('/', zValidator('query', querySchema), async (c) => {
    return c.json(await svc.listTournees(c.req.valid('query')))
  })
  .get('/:id', async (c) => {
    return c.json({ data: await svc.getTournee(c.req.param('id')) })
  })
  .post('/', requireRole(...TECH), zValidator('json', createTourneeSchema), async (c) => {
    return c.json({ data: await svc.createTournee(c.req.valid('json')) }, 201)
  })
  .put('/:id', requireRole(...TECH), zValidator('json', updateTourneeSchema), async (c) => {
    return c.json({ data: await svc.updateTournee(c.req.param('id'), c.req.valid('json')) })
  })
  .delete('/:id', requireRole('admin', 'direction'), async (c) => {
    await svc.deleteTournee(c.req.param('id'))
    return c.json({ success: true })
  })
  .post(
    '/:id/arrets',
    requireRole(...TECH),
    zValidator('json', createArretSchema),
    async (c) => {
      const body = c.req.valid('json')
      const arret = await svc.addArret({ ...body, tourneeId: c.req.param('id') })
      return c.json({ data: arret }, 201)
    }
  )
  .put(
    '/arrets/:arretId',
    requireRole(...TECH),
    zValidator('json', updateArretSchema),
    async (c) => {
      return c.json({
        data: await svc.updateArret(c.req.param('arretId'), c.req.valid('json'))
      })
    }
  )
  .delete('/arrets/:arretId', requireRole(...TECH), async (c) => {
    await svc.deleteArret(c.req.param('arretId'))
    return c.json({ success: true })
  })
