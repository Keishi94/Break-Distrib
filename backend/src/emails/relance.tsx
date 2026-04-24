import { Button, Heading, Section, Text } from '@react-email/components'
import { Layout } from './_layout'

type Props = {
  nom: string
  messagePersonnalise?: string
  ctaUrl: string
}

export const RelanceEmail = ({
  nom,
  messagePersonnalise,
  ctaUrl
}: Props) => (
  <Layout preview={`${nom}, votre pause vous attend chez Break'Distrib`}>
    <Heading className="text-3xl font-bold italic tracking-tighter text-ink m-0 leading-[1.1]">
      Bonjour <span className="text-brand">{nom}</span>,
    </Heading>

    <Text className="text-muted text-base leading-relaxed mt-6 mb-0">
      Nous revenons vers vous pour reparler de votre projet de distribution de
      pause. Depuis notre dernier échange, nos offres ont évolué et nous avons
      pensé que cela pourrait vous intéresser.
    </Text>

    {messagePersonnalise && (
      <Section className="bg-beige rounded-2xl p-6 mt-6 border-l-4 border-brand">
        <Text className="text-sm text-ink m-0 leading-relaxed italic">
          {messagePersonnalise}
        </Text>
      </Section>
    )}

    <Text className="text-muted text-base leading-relaxed mt-6 mb-0">
      En quelques clics, redécouvrez notre offre :{' '}
      <span className="font-semibold text-ink">
        livraison intelligente, écoresponsable, pilotée par la donnée
      </span>
      .
    </Text>

    <Section className="text-center mt-8">
      <Button
        href={ctaUrl}
        className="bg-brand text-white rounded-full px-8 py-4 font-bold italic no-underline"
      >
        Reprendre contact
      </Button>
    </Section>

    <Text className="text-sm text-muted mt-8 mb-0 leading-relaxed">
      Si ce n&apos;est plus d&apos;actualité pour vous, répondez simplement à
      cet email et nous arrêterons nos relances.
    </Text>

    <Text className="text-sm text-ink mt-6 mb-0 italic">
      — L&apos;équipe Break&apos;Distrib
    </Text>
  </Layout>
)

export default RelanceEmail
