import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import HospitalDetail from './pages/HospitalDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hospital/:id" element={<HospitalDetail />} />
    </Routes>
  )
}

export default App