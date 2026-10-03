import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
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

function HospitalDetail() {
  // useParams lê os pedaços variáveis da URL atual. Como a rota vai se
  // chamar "/hospital/:id" (definimos isso no próximo passo), aqui
  // "id" vem preenchido com o valor real, tipo "3".
  const { id } = useParams()
  const [hospital, setHospital] = useState<Hospital | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/hospitais/${id}`)
      .then((res) => res.json())
      .then((data) => setHospital(data))
      .catch((err) => console.error('Erro ao buscar hospital:', err))
  }, [id])

  // Enquanto o fetch não termina, hospital ainda é null — mostramos
  // uma mensagem simples em vez de tentar ler campos que não existem ainda.
  if (!hospital) {
    return <div className="app">Carregando...</div>
  }

  return (
    <div className="app">
      <Link to="/">← Voltar</Link>
      <h1>{hospital.nome}</h1>
      <p className="card-endereco">{hospital.endereco}</p>

      <div className="card" style={{ marginTop: '16px' }}>
        <div className="card-meta">
          <span>⏱ ~{hospital.tempo_espera_min} min de espera</span>
        </div>
        <div style={{ marginTop: '10px' }}>
          <span className={`tag tag-${hospital.status}`}>{hospital.status}</span>{' '}
          <span className="tag-tipo">{hospital.tipo === 'upa' ? 'UPA' : 'Hospital'}</span>
                  <Link to={`/hospital/${hospital.id}/relatar`} style={{ display: 'block', marginTop: '16px', textAlign: 'center', background: '#0F5C4F', color: '#fff', padding: '11px', borderRadius: '8px', textDecoration: 'none' }}>
          Relatar situação
        </Link>
        </div>
      </div>
    </div>
  )
}

export default HospitalDetail