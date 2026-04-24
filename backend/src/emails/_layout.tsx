import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'
import type { ReactNode } from 'react'

type LayoutProps = {
  preview: string
  children: ReactNode
}

export const Layout = ({ preview, children }: LayoutProps) => (
  <Html lang="fr">
    <Head>
      <meta name="color-scheme" content="light" />
      <meta name="supported-color-schemes" content="light" />
    </Head>
    <Preview>{preview}</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: {
                DEFAULT: '#ff6b00',
                light: '#ff9e00',
                dark: '#e85a00'
              },
              beige: '#f5f5f7',
              ink: '#0f172a',
              muted: '#475569'
            },
            fontFamily: {
              sans: [
                'Inter',
                '-apple-system',
                'BlinkMacSystemFont',
                'Segoe UI',
                'Helvetica',
                'Arial',
                'sans-serif'
              ]
            }
          }
        }
      }}
    >
      <Body className="bg-beige font-sans m-0 p-0">
        <Container className="max-w-[600px] mx-auto py-10 px-5">
          {/* Logo header */}
          <Section className="text-center pb-8">
            <Text className="text-2xl font-extrabold italic tracking-tighter m-0 leading-none">
              <span className="text-ink">Break&apos;</span>
              <span className="text-brand">Distrib</span>
            </Text>
          </Section>

          {/* Main card */}
          <Section className="bg-white rounded-[32px] border border-white shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-10">
            {children}
          </Section>

          {/* Footer */}
          <Section className="text-center pt-8">
            <Text className="text-xs text-muted m-0 italic">
              La pause, <span className="text-brand font-semibold">réinventée</span>.
            </Text>
            <Text className="text-xs text-muted mt-3 mb-0">
              <Link href="https://break-distrib.fr" className="text-muted underline">
                break-distrib.fr
              </Link>
              {' · '}
              <Link
                href="mailto:contact@break-distrib.fr"
                className="text-muted underline"
              >
                contact@break-distrib.fr
              </Link>
            </Text>
            <Hr className="border-slate-200 my-4" />
            <Text className="text-[10px] text-muted m-0">
              © {new Date().getFullYear()} Break&apos;Distrib · Tous droits réservés
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)

export const button = {
  base: 'inline-block rounded-full px-8 py-4 font-bold italic text-white no-underline',
  primary:
    'bg-brand shadow-[0_10px_40px_rgba(255,107,0,0.25)]'
}
