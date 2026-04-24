import { Heading, Section, Text } from '@react-email/components'
import { Layout } from './_layout'

type Props = {
  nom: string
  entreprise: string
}

export const ProspectConfirmationEmail = ({ nom, entreprise }: Props) => (
  <Layout preview={`Merci ${nom}, votre demande d'audit est bien reçue`}>
    <Heading className="text-3xl font-bold italic tracking-tighter text-ink m-0 leading-[1.1]">
      Merci <span className="text-brand">{nom}</span>,<br />
      votre demande est bien reçue.
    </Heading>

    <Text className="text-muted text-base leading-relaxed mt-6 mb-0">
      Nous avons bien reçu votre demande d&apos;audit pour{' '}
      <span className="font-semibold text-ink">{entreprise}</span>. Un membre de notre
      équipe va étudier vos besoins et revenir vers vous sous{' '}
      <span className="font-semibold text-ink">48 heures ouvrées</span> avec une
      proposition adaptée.
    </Text>

    <Section className="bg-beige rounded-2xl p-6 mt-8">
      <Text className="text-xs uppercase tracking-[0.2em] font-bold text-brand m-0">
        Prochaines étapes
      </Text>
      <Text className="text-sm text-ink mt-3 mb-0 leading-relaxed">
        <span className="font-bold">01.</span> Analyse de vos besoins
        <br />
        <span className="font-bold">02.</span> Proposition personnalisée
        <br />
        <span className="font-bold">03.</span> Installation et mise en service
      </Text>
    </Section>

    <Text className="text-sm text-muted mt-8 mb-0 leading-relaxed">
      En attendant, n&apos;hésitez pas à nous contacter si vous avez la moindre
      question.
    </Text>

    <Text className="text-sm text-ink mt-6 mb-0 italic">
      — L&apos;équipe Break&apos;Distrib
    </Text>
  </Layout>
)

export default ProspectConfirmationEmail
