import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth, requireRole, type AuthVariables } from '../middlewares/auth'
import * as svc from '../services/parametres'

const updateSchema = z.object({
  formeJuridique: z.string().optional().nullable(),
  capital: z.number().int().nonnegative().optional().nullable(),
  adresseSiege: z.string().optional().nullable(),
  villeRcs: z.string().optional().nullable(),
  siren: z.string().optional().nullable(),
  tvaIntra: z.string().optional().nullable(),
  nomDirigeant: z.string().optional().nullable(),
  qualiteDirigeant: z.string().optional().nullable(),
  telephone: z.string().optional().nullable(),
  villeJuridiction: z.string().optional().nullable()
})

export const parametresRoutes = new Hono<{ Variables: AuthVariables }>()
  .use('*', requireAuth)
  .get('/', async (c) => {
    return c.json({ data: await svc.getParametres() })
  })
  .put('/', requireRole('admin'), zValidator('json', updateSchema), async (c) => {
    return c.json({ data: await svc.updateParametres(c.req.valid('json')) })
  })
