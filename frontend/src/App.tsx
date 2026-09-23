import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import HospitalDetail from './pages/HospitalDetail'
import ReportPage from './pages/ReportPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hospital/:id" element={<HospitalDetail />} />
      <Route path="/hospital/:id/relatar" element={<ReportPage />} />
    </Routes>
  )
}

export default App