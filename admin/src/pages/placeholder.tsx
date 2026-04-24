import type { ReactNode } from 'react'
import { PageHeader } from '@/components/bd/page-header'
import { Card } from '@/components/ui/card'
import { BDLoader } from '@/components/bd/bd-loader'

interface PlaceholderProps {
  title: string
  subtitle?: string
  description?: ReactNode
}

export function Placeholder({ title, subtitle, description }: PlaceholderProps) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="px-8 py-6">
        <Card className="p-10 flex flex-col items-center gap-4 text-center">
          <BDLoader size={48} />
          <div className="label-caps">Écran en cours d'intégration</div>
          <p className="text-text-2 max-w-md">
            {description ??
              "Cet écran sera disponible dans la prochaine itération. Consulte le design handoff pour le détail."}
          </p>
        </Card>
      </div>
    </>
  )
}
