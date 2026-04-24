import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout'
import DashboardPage from '@/pages/dashboard'
import PipelinePage from '@/pages/pipeline'
import ParcPage from '@/pages/parc'
import TourneesPage from '@/pages/tournees'
import ReportingPage from '@/pages/reporting'
import ClientsPage from '@/pages/clients'
import KitchenSinkPage from '@/pages/kitchen-sink'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="parc" element={<ParcPage />} />
          <Route path="tournees" element={<TourneesPage />} />
          <Route path="reporting" element={<ReportingPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="_kitchen-sink" element={<KitchenSinkPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
