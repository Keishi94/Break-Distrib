import { Button, Heading, Section, Text } from '@react-email/components'
import { Layout } from './_layout'

type Props = {
  nom: string
  verificationUrl: string
}

export const VerificationEmail = ({ nom, verificationUrl }: Props) => (
  <Layout preview="Confirmez votre adresse email Break'Distrib">
    <Heading className="text-3xl font-bold italic tracking-tighter text-ink m-0 leading-[1.1]">
      Bienvenue <span className="text-brand">{nom}</span>,<br />
      confirmez votre email.
    </Heading>

    <Text className="text-muted text-base leading-relaxed mt-6 mb-0">
      Votre compte Break&apos;Distrib a bien été créé. Il ne reste plus
      qu&apos;une étape : confirmer votre adresse email pour activer l&apos;accès
      au dashboard.
    </Text>

    <Section className="text-center mt-8">
      <Button
        href={verificationUrl}
        className="bg-brand text-white rounded-full px-8 py-4 font-bold italic no-underline"
      >
        Confirmer mon email
      </Button>
    </Section>

    <Text className="text-sm text-muted mt-8 mb-0 leading-relaxed">
      Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre
      navigateur :
    </Text>
    <Text className="text-xs text-muted break-all mt-2 mb-0">
      {verificationUrl}
    </Text>

    <Section className="bg-beige rounded-2xl p-5 mt-6">
      <Text className="text-xs text-muted m-0 leading-relaxed">
        Vous n&apos;êtes pas à l&apos;origine de cette inscription ? Ignorez
        simplement cet email.
      </Text>
    </Section>
  </Layout>
)

export default VerificationEmail
