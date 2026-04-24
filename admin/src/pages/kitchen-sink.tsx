import { Download, Plus } from 'lucide-react'
import { PageHeader } from '@/components/bd/page-header'
import { SectionHead } from '@/components/bd/section-head'
import { KPI } from '@/components/bd/kpi'
import { Bar } from '@/components/bd/bar'
import { StatusDot } from '@/components/bd/status-dot'
import { BDLoader } from '@/components/bd/bd-loader'
import { BDMark } from '@/components/bd/bd-mark'
import { Sparkline } from '@/components/bd/sparkline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const spark = [22, 24, 23, 26, 28, 27, 30, 29, 33, 35, 34, 38, 37, 41, 40, 44]

export default function KitchenSinkPage() {
  return (
    <>
      <PageHeader
        title="Kitchen sink"
        subtitle="Toutes les primitives UI Break'Distrib — validation design tokens"
        actions={
          <>
            <Button variant="ghost" size="sm">
              <Download size={14} /> Export
            </Button>
            <Button variant="primary" size="sm">
              <Plus size={14} /> Nouvelle action
            </Button>
          </>
        }
      />
      <div className="px-8 py-6 flex flex-col gap-6 max-w-[1400px]">
        <Card>
          <CardHeader>
            <CardTitle>Brand</CardTitle>
            <Badge tone="brand" mono>
              v0.1
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <BDMark size={40} />
              <div>
                <div className="font-semibold">BDMark</div>
                <div className="text-text-3 text-[12px]">Logo statique</div>
              </div>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="flex items-center gap-3">
              <BDLoader size={40} />
              <div>
                <div className="font-semibold">BDLoader</div>
                <div className="text-text-3 text-[12px]">Spinner animé</div>
              </div>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="flex items-center gap-2">
              <BDLoader size={14} inline />
              <BDLoader size={20} inline />
              <BDLoader size={28} inline />
              <BDLoader size={48} inline />
            </div>
          </CardContent>
        </Card>

        <div>
          <SectionHead title="KPIs" subtitle="Cartes de synthèse" />
          <div className="grid grid-cols-4 gap-4">
            <KPI
              label="CA mois"
              value="184"
              unit="k€"
              delta={12}
              deltaLabel="vs mois dernier"
              spark={spark}
              tone="brand"
            />
            <KPI
              label="Machines actives"
              value="142"
              unit="/ 142"
              delta={2}
              deltaLabel=""
              spark={spark}
              tone="ok"
            />
            <KPI
              label="Pipeline"
              value="432"
              unit="k€"
              delta={-4}
              deltaLabel="vs sem. dernière"
              spark={spark}
            />
            <KPI
              label="Taux de panne"
              value="2.1"
              unit="%"
              delta={-8}
              deltaLabel=""
              spark={spark}
              tone="ok"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Status dots & badges</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <StatusDot tone="ok" />
              <span className="text-[13px]">En ligne</span>
            </div>
            <div className="flex items-center gap-3">
              <StatusDot tone="warn" />
              <span className="text-[13px]">Stock faible</span>
            </div>
            <div className="flex items-center gap-3">
              <StatusDot tone="err" />
              <span className="text-[13px]">Panne</span>
            </div>
            <div className="flex items-center gap-3">
              <StatusDot tone="idle" pulse={false} />
              <span className="text-[13px]">À installer</span>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <Badge tone="ok" dot>
              Actif
            </Badge>
            <Badge tone="warn" dot>
              À surveiller
            </Badge>
            <Badge tone="err" dot>
              Impayé
            </Badge>
            <Badge tone="info">LCD</Badge>
            <Badge tone="brand" mono>
              BD-0167
            </Badge>
            <Badge tone="neutral">Secteur Services</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Boutons</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="primary">Action principale</Button>
            <Button variant="secondary">Secondaire</Button>
            <Button variant="ink">Ink</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Supprimer</Button>
            <Separator orientation="vertical" className="h-9" />
            <Button variant="primary" size="sm">
              sm
            </Button>
            <Button variant="primary" size="md">
              md
            </Button>
            <Button variant="primary" size="lg">
              lg
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress & sparklines</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-text-3 w-24">OK</span>
              <Bar value={82} tone="ok" className="flex-1" />
              <span className="font-mono tabular text-[12px] w-10 text-right">
                82%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-text-3 w-24">Warn</span>
              <Bar value={34} tone="warn" className="flex-1" />
              <span className="font-mono tabular text-[12px] w-10 text-right">
                34%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-text-3 w-24">Err</span>
              <Bar value={12} tone="err" className="flex-1" />
              <span className="font-mono tabular text-[12px] w-10 text-right">
                12%
              </span>
            </div>
            <Separator />
            <div className="flex items-center gap-4">
              <Sparkline data={spark} />
              <Sparkline
                data={spark}
                color="var(--color-ok)"
                width={160}
                height={40}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input & Tabs</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Input placeholder="Rechercher une machine, un client…" />
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="machines">
                  Machines
                  <span className="font-mono tabular text-[11px] text-text-3">
                    8
                  </span>
                </TabsTrigger>
                <TabsTrigger value="contracts">Contrats & factures</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-4 text-text-2">
                Contenu de l'onglet « Vue d'ensemble ».
              </TabsContent>
              <TabsContent value="machines" className="pt-4 text-text-2">
                Contenu de l'onglet « Machines ».
              </TabsContent>
              <TabsContent value="contracts" className="pt-4 text-text-2">
                Contenu de l'onglet « Contrats & factures ».
              </TabsContent>
              <TabsContent value="history" className="pt-4 text-text-2">
                Contenu de l'onglet « Historique ».
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
