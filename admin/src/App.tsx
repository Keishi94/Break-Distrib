import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="p-8 text-2xl font-bold">Break'Distrib Admin</div>} />
      </Routes>
    </BrowserRouter>
  )
}
