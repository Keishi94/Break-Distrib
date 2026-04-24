import { render } from '@react-email/render'
import type { ComponentProps, ReactElement } from 'react'
import { Resend } from 'resend'
import { AlerteDistributeurEmail } from '../emails/alerte-distributeur'
import { ContratEnvoiEmail } from '../emails/contrat-envoi'
import { ProspectConfirmationEmail } from '../emails/prospect-confirmation'
import { RelanceEmail } from '../emails/relance'
import { ResetPasswordEmail } from '../emails/reset-password'
import { VerificationEmail } from '../emails/verification-email'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM ?? 'noreply@break-distrib.fr'

type SendArgs = {
  to: string
  subject: string
  react: ReactElement
}

async function send({ to, subject, react }: SendArgs) {
  const [html, text] = await Promise.all([
    render(react),
    render(react, { plainText: true })
  ])

  return resend.emails.send({
    from: `Break'Distrib <${FROM}>`,
    to,
    subject,
    html,
    text
  })
}

export const emails = {
  prospectConfirmation: (
    to: string,
    props: ComponentProps<typeof ProspectConfirmationEmail>
  ) =>
    send({
      to,
      subject: `Merci ${props.nom}, votre demande est bien reçue`,
      react: <ProspectConfirmationEmail {...props} />
    }),

  relance: (to: string, props: ComponentProps<typeof RelanceEmail>) =>
    send({
      to,
      subject: `${props.nom}, votre pause vous attend`,
      react: <RelanceEmail {...props} />
    }),

  contratEnvoi: (
    to: string,
    props: ComponentProps<typeof ContratEnvoiEmail>
  ) =>
    send({
      to,
      subject: `Votre contrat Break'Distrib est prêt à signer`,
      react: <ContratEnvoiEmail {...props} />
    }),

  alerteDistributeur: (
    to: string,
    props: ComponentProps<typeof AlerteDistributeurEmail>
  ) =>
    send({
      to,
      subject: `Alerte · ${props.distributeurNom}`,
      react: <AlerteDistributeurEmail {...props} />
    }),

  resetPassword: (
    to: string,
    props: ComponentProps<typeof ResetPasswordEmail>
  ) =>
    send({
      to,
      subject: `Réinitialisation de votre mot de passe`,
      react: <ResetPasswordEmail {...props} />
    }),

  verification: (
    to: string,
    props: ComponentProps<typeof VerificationEmail>
  ) =>
    send({
      to,
      subject: `Confirmez votre adresse email`,
      react: <VerificationEmail {...props} />
    })
}
