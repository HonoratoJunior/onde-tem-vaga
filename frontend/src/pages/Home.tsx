import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

interface Hospital {
  id: number
  nome: string
  endereco: string
  latitude: number
  longitude: number
  tempo_espera_min: number
  status: string
  tipo: string
}

function Home() {
  const [hospitais, setHospitais] = useState<Hospital[]>([])

  useEffect(() => {
    fetch('http://localhost:8080/hospitais')
      .then((res) => res.json())
      .then((data) => setHospitais(data))
      .catch((err) => console.error('Erro ao buscar hospitais:', err))
  }, [])

  return (
    <div className="app">
      <h1>Onde tem vaga</h1>

      {hospitais.map((h) => (
        // Link troca de página sem recarregar o site inteiro — diferente
        // de um <a href> comum, que recarregaria tudo do zero.
        // "to" define pra qual URL ele leva quando clicado.
        <Link to={`/hospital/${h.id}`} className="card-link" key={h.id}>
          <div className="card">
            <div className="card-top">
              <div>
                <p className="card-nome">{h.nome}</p>
                <p className="card-endereco">{h.endereco}</p>
              </div>
              <span className={`tag tag-${h.status}`}>{h.status}</span>
            </div>
            <div className="card-meta">
              <span>⏱ ~{h.tempo_espera_min} min</span>
              <span className="tag-tipo">{h.tipo === 'upa' ? 'UPA' : 'Hospital'}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Home