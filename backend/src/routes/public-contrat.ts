import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import * as svc from '../services/demandes-contrat'

const soumissionSchema = z.object({
  signataireNom: z.string().min(1),
  signataireEmail: z.string().email(),
  villeSignature: z.string().min(1),
  signatureBase64: z.string().min(1),
  formulaire: z.record(z.string(), z.unknown())
})

export const publicContratRoutes = new Hono()
  .get('/:token', async (c) => {
    const demande = await svc.getDemandeParToken(c.req.param('token'))
    return c.json({
      data: {
        id: demande.id,
        statut: demande.statut,
        expiresAt: demande.expiresAt,
        payload: demande.payload
      }
    })
  })
  .post('/:token', zValidator('json', soumissionSchema), async (c) => {
    const result = await svc.soumettreDemande(c.req.param('token'), c.req.valid('json'))
    return c.json({
      data: { id: result.id, statut: result.statut, dateSignature: result.dateSignature }
    })
  })
