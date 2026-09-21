import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter precisa envolver todo o app para que
        Link, useParams e as rotas funcionem em qualquer lugar. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)