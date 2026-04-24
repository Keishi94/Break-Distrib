import { emails } from '../src/services/email'

const to = 'ayoub.slimani.94470@gmail.com'

const sends: Array<[string, () => Promise<{ data: { id: string } | null; error: unknown }>]> = [
  [
    'prospectConfirmation',
    () =>
      emails.prospectConfirmation(to, {
        nom: 'Ayoub',
        entreprise: "Break'Distrib"
      })
  ],
  [
    'relance',
    () =>
      emails.relance(to, {
        nom: 'Ayoub',
        messagePersonnalise:
          "Nous avons remarqué que vous consultiez nos offres il y a quelques semaines.",
        ctaUrl: 'https://break-distrib.fr/contact'
      })
  ],
  [
    'contratEnvoi',
    () =>
      emails.contratEnvoi(to, {
        nom: 'Ayoub',
        entreprise: "Break'Distrib",
        typeContrat: 'location_courte',
        pdfUrl: 'https://break-distrib.fr/contrats/demo.pdf',
        dateDebut: '2026-05-01'
      })
  ],
  [
    'alerteDistributeur',
    () =>
      emails.alerteDistributeur(to, {
        distributeurNom: 'Distributeur #A12',
        distributeurAdresse: '12 rue de la Pause, 75011 Paris',
        typeAlerte: 'stock_bas',
        message:
          'Le niveau de stock café est inférieur à 15%. Un réapprovisionnement est recommandé dans les 24h.',
        dashboardUrl: 'https://admin.break-distrib.fr/distributeurs/A12'
      })
  ],
  [
    'resetPassword',
    () =>
      emails.resetPassword(to, {
        nom: 'Ayoub',
        resetUrl: 'https://break-distrib.fr/reset?token=demo-token',
        expiresInMinutes: 60
      })
  ],
  [
    'verification',
    () =>
      emails.verification(to, {
        nom: 'Ayoub',
        verificationUrl: 'https://break-distrib.fr/verify?token=demo-token'
      })
  ]
]

let failed = false

for (const [name, fn] of sends) {
  try {
    const result = await fn()
    if (result.error) {
      console.log(`❌ ${name} →`, result.error)
      failed = true
    } else {
      console.log(`✅ ${name} → ${result.data?.id}`)
    }
  } catch (err) {
    console.log(`❌ ${name} threw →`, err)
    failed = true
  }
  // Resend free tier: 2 req/s — throttle a bit
  await new Promise((r) => setTimeout(r, 600))
}

if (failed) process.exit(1)
