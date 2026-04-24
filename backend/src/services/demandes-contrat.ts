import { randomBytes } from 'node:crypto'
import { HTTPException } from 'hono/http-exception'
import { and, eq, gt } from 'drizzle-orm'
import { db } from '../db/client'
import {
  demandesContrat,
  type DemandeContrat,
  type NewDemandeContrat
} from '../db/schema/index'

const VALIDITE_JOURS = 7

function genererToken(): string {
  return randomBytes(32).toString('base64url')
}

export async function creerDemande(
  prospectId: string,
  payload?: unknown
): Promise<DemandeContrat> {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + VALIDITE_JOURS)

  const [row] = await db
    .insert(demandesContrat)
    .values({
      prospectId,
      token: genererToken(),
      expiresAt,
      payload: payload ?? null,
      statut: 'envoye'
    })
    .returning()
  if (!row) throw new HTTPException(500, { message: 'Échec de création' })
  return row
}

export async function getDemandeParToken(token: string): Promise<DemandeContrat> {
  const [row] = await db
    .select()
    .from(demandesContrat)
    .where(
      and(eq(demandesContrat.token, token), gt(demandesContrat.expiresAt, new Date()))
    )
    .limit(1)
  if (!row) {
    throw new HTTPException(404, { message: 'Demande introuvable ou expirée' })
  }
  if (row.statut === 'signe') {
    throw new HTTPException(409, { message: 'Demande déjà signée' })
  }
  if (row.statut === 'annule' || row.statut === 'expire') {
    throw new HTTPException(410, { message: 'Demande clôturée' })
  }
  return row
}

export async function soumettreDemande(
  token: string,
  payload: {
    signataireNom: string
    signataireEmail: string
    villeSignature: string
    signatureBase64: string
    formulaire: Record<string, unknown>
  }
): Promise<DemandeContrat> {
  const demande = await getDemandeParToken(token)
  const [row] = await db
    .update(demandesContrat)
    .set({
      statut: 'signe',
      payload: { ...(demande.payload as object | null), ...payload.formulaire },
      signataireNom: payload.signataireNom,
      signataireEmail: payload.signataireEmail,
      villeSignature: payload.villeSignature,
      signatureBase64: payload.signatureBase64,
      dateSignature: new Date(),
      updatedAt: new Date()
    })
    .where(eq(demandesContrat.id, demande.id))
    .returning()
  return row!
}
