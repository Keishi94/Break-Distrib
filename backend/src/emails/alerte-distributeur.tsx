import { Button, Heading, Section, Text } from '@react-email/components'
import { Layout } from './_layout'

type Props = {
  distributeurNom: string
  distributeurAdresse: string
  typeAlerte: 'stock_bas' | 'erreur' | 'temperature'
  message: string
  dashboardUrl: string
}

const alerteLabel: Record<Props['typeAlerte'], string> = {
  stock_bas: 'Stock bas',
  erreur: 'Erreur machine',
  temperature: 'Anomalie de température'
}

export const AlerteDistributeurEmail = ({
  distributeurNom,
  distributeurAdresse,
  typeAlerte,
  message,
  dashboardUrl
}: Props) => (
  <Layout preview={`Alerte ${alerteLabel[typeAlerte]} — ${distributeurNom}`}>
    <Section className="bg-brand rounded-full inline-block px-4 py-1 mb-4">
      <Text className="text-xs uppercase tracking-[0.2em] font-bold text-white m-0">
        Alerte · {alerteLabel[typeAlerte]}
      </Text>
    </Section>

    <Heading className="text-3xl font-bold italic tracking-tighter text-ink m-0 leading-[1.1] mt-4">
      Un distributeur<br />
      <span className="text-brand">nécessite votre attention</span>.
    </Heading>

    <Section className="bg-beige rounded-2xl p-6 mt-8">
      <Text className="text-xs uppercase tracking-[0.2em] font-bold text-muted m-0">
        Distributeur concerné
      </Text>
      <Text className="text-base text-ink mt-3 mb-0 font-semibold">
        {distributeurNom}
      </Text>
      <Text className="text-sm text-muted mt-1 mb-0">
        {distributeurAdresse}
      </Text>
    </Section>

    <Section className="bg-orange-50 border-l-4 border-brand rounded-r-2xl p-6 mt-6">
      <Text className="text-xs uppercase tracking-[0.2em] font-bold text-brand m-0">
        Détail
      </Text>
      <Text className="text-sm text-ink mt-3 mb-0 leading-relaxed">
        {message}
      </Text>
    </Section>

    <Section className="text-center mt-8">
      <Button
        href={dashboardUrl}
        className="bg-brand text-white rounded-full px-8 py-4 font-bold italic no-underline"
      >
        Voir dans le dashboard
      </Button>
    </Section>

    <Text className="text-xs text-muted mt-8 mb-0 leading-relaxed italic">
      Cette alerte a été générée automatiquement. Vous pouvez configurer les
      seuils d&apos;alerte depuis votre dashboard.
    </Text>
  </Layout>
)

export default AlerteDistributeurEmail
