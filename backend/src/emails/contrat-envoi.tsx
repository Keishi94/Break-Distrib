import { Button, Heading, Section, Text } from '@react-email/components'
import { Layout } from './_layout'

type Props = {
  nom: string
  entreprise: string
  typeContrat: 'location_courte' | 'mise_a_disposition'
  pdfUrl: string
  dateDebut: string
}

const typeLabel: Record<Props['typeContrat'], string> = {
  location_courte: 'Location courte durée',
  mise_a_disposition: 'Mise à disposition'
}

export const ContratEnvoiEmail = ({
  nom,
  entreprise,
  typeContrat,
  pdfUrl,
  dateDebut
}: Props) => (
  <Layout preview={`Votre contrat Break'Distrib est prêt à signer`}>
    <Heading className="text-3xl font-bold italic tracking-tighter text-ink m-0 leading-[1.1]">
      Bonjour <span className="text-brand">{nom}</span>,<br />
      votre contrat est prêt.
    </Heading>

    <Text className="text-muted text-base leading-relaxed mt-6 mb-0">
      Comme convenu, voici votre contrat pour{' '}
      <span className="font-semibold text-ink">{entreprise}</span>. Prenez le
      temps de le relire, puis signez-le directement depuis le lien ci-dessous.
    </Text>

    <Section className="bg-beige rounded-2xl p-6 mt-8">
      <Text className="text-xs uppercase tracking-[0.2em] font-bold text-brand m-0">
        Récapitulatif
      </Text>
      <Text className="text-sm text-ink mt-3 mb-0 leading-relaxed">
        <span className="font-bold">Type :</span> {typeLabel[typeContrat]}
        <br />
        <span className="font-bold">Entreprise :</span> {entreprise}
        <br />
        <span className="font-bold">Début :</span> {dateDebut}
      </Text>
    </Section>

    <Section className="text-center mt-8">
      <Button
        href={pdfUrl}
        className="bg-brand text-white rounded-full px-8 py-4 font-bold italic no-underline"
      >
        Consulter et signer
      </Button>
    </Section>

    <Text className="text-sm text-muted mt-8 mb-0 leading-relaxed">
      Une question sur le contrat ? Répondez simplement à cet email, nous vous
      répondons rapidement.
    </Text>

    <Text className="text-sm text-ink mt-6 mb-0 italic">
      — L&apos;équipe Break&apos;Distrib
    </Text>
  </Layout>
)

export default ContratEnvoiEmail
