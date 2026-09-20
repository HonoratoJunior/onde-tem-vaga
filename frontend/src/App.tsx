import { useEffect, useState } from 'react'
import './App.css'

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

function App() {
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
        <div className="card" key={h.id}>
          <div className="card-top">
            <div>
              <p className="card-nome">{h.nome}</p>
              <p className="card-endereco">{h.endereco}</p>
            </div>
            {/* Aqui a mágica: a classe CSS é montada dinamicamente,
                colando "tag-" com o valor de status que veio do banco.
                Se status for "baixa", a classe final vira "tag tag-baixa". */}
            <span className={`tag tag-${h.status}`}>{h.status}</span>
          </div>

          <div className="card-meta">
            <span>⏱ ~{h.tempo_espera_min} min</span>
            <span className="tag-tipo">{h.tipo === 'upa' ? 'UPA' : 'Hospital'}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App