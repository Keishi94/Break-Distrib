import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth, requireRole, type AuthVariables } from '../middlewares/auth'
import { paginationSchema } from '../lib/query'
import * as svc from '../services/contacts'

const createSchema = z.object({
  clientId: z.string().uuid(),
  nom: z.string().min(1),
  prenom: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  telephone: z.string().optional().nullable(),
  fonction: z.string().optional().nullable(),
  isPrincipal: z.boolean().optional()
})

const updateSchema = createSchema.partial()

const querySchema = paginationSchema.extend({
  clientId: z.string().uuid().optional()
})

const COMMERCIAUX = ['admin', 'direction', 'commercial'] as const

export const contactsRoutes = new Hono<{ Variables: AuthVariables }>()
  .use('*', requireAuth)
  .get('/', zValidator('query', querySchema), async (c) => {
    return c.json(await svc.listContacts(c.req.valid('query')))
  })
  .get('/:id', async (c) => {
    return c.json({ data: await svc.getContact(c.req.param('id')) })
  })
  .post('/', requireRole(...COMMERCIAUX), zValidator('json', createSchema), async (c) => {
    return c.json({ data: await svc.createContact(c.req.valid('json')) }, 201)
  })
  .put('/:id', requireRole(...COMMERCIAUX), zValidator('json', updateSchema), async (c) => {
    return c.json({ data: await svc.updateContact(c.req.param('id'), c.req.valid('json')) })
  })
  .delete('/:id', requireRole(...COMMERCIAUX), async (c) => {
    await svc.deleteContact(c.req.param('id'))
    return c.json({ success: true })
  })
