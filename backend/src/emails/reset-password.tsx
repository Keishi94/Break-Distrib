import { Button, Heading, Section, Text } from '@react-email/components'
import { Layout } from './_layout'

type Props = {
  nom: string
  resetUrl: string
  expiresInMinutes?: number
}

export const ResetPasswordEmail = ({
  nom,
  resetUrl,
  expiresInMinutes = 60
}: Props) => (
  <Layout preview="Réinitialisez votre mot de passe Break'Distrib">
    <Heading className="text-3xl font-bold italic tracking-tighter text-ink m-0 leading-[1.1]">
      Réinitialisation du<br />
      <span className="text-brand">mot de passe</span>.
    </Heading>

    <Text className="text-muted text-base leading-relaxed mt-6 mb-0">
      Bonjour {nom}, vous avez demandé à réinitialiser votre mot de passe. Pour
      continuer, cliquez sur le bouton ci-dessous.
    </Text>

    <Section className="text-center mt-8">
      <Button
        href={resetUrl}
        className="bg-brand text-white rounded-full px-8 py-4 font-bold italic no-underline"
      >
        Réinitialiser mon mot de passe
      </Button>
    </Section>

    <Text className="text-sm text-muted mt-8 mb-0 leading-relaxed">
      Ce lien est valable pendant{' '}
      <span className="font-semibold text-ink">{expiresInMinutes} minutes</span>.
      Passé ce délai, vous devrez refaire une demande.
    </Text>

    <Section className="bg-beige rounded-2xl p-5 mt-6">
      <Text className="text-xs text-muted m-0 leading-relaxed">
        Vous n&apos;êtes pas à l&apos;origine de cette demande ? Ignorez
        simplement cet email — votre mot de passe restera inchangé.
      </Text>
    </Section>
  </Layout>
)

export default ResetPasswordEmail
