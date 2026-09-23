import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../App.css'

function ReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Cada campo do formulário vira seu próprio estado. Começam com
  // valores padrão razoáveis, iguais ao que já mostramos no mockup.
  const [nivelEspera, setNivelEspera] = useState('baixa')
  const [tempoMin, setTempoMin] = useState(40)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  // Essa função roda quando o formulário é enviado (botão clicado).
  async function handleSubmit(e: React.FormEvent) {
    // preventDefault evita o comportamento padrão do navegador, que
    // seria recarregar a página inteira ao enviar um formulário.
    e.preventDefault()
    setEnviando(true)
    setErro('')

    try {
      const resposta = await fetch(`http://localhost:8080/hospitais/${id}/relatos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nivel_espera: nivelEspera,
          tempo_min: tempoMin,
          comentario: comentario,
        }),
      })

      if (!resposta.ok) {
        throw new Error('Falha ao enviar relato')
      }

      // Depois de salvar com sucesso, volta para a tela de detalhe.
      navigate(`/hospital/${id}`)
    } catch (err) {
      setErro('Não foi possível enviar. Tente novamente.')
      console.error(err)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="app">
      <Link to={`/hospital/${id}`}>← Cancelar</Link>
      <h1>Relatar situação</h1>

      <form onSubmit={handleSubmit}>
        <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
          Como está a espera agora?
        </p>

        {/* Cada label vira um botão de opção. O "checked" compara o
            estado atual com o valor da própria opção — só uma fica marcada. */}
        <label style={{ display: 'block', marginBottom: '8px' }}>
          <input
            type="radio"
            name="nivel"
            checked={nivelEspera === 'baixa'}
            onChange={() => setNivelEspera('baixa')}
          />{' '}
          Rápida, quase sem fila
        </label>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          <input
            type="radio"
            name="nivel"
            checked={nivelEspera === 'media'}
            onChange={() => setNivelEspera('media')}
          />{' '}
          Fila moderada, mas anda
        </label>
        <label style={{ display: 'block', marginBottom: '16px' }}>
          <input
            type="radio"
            name="nivel"
            checked={nivelEspera === 'alta'}
            onChange={() => setNivelEspera('alta')}
          />{' '}
          Muito cheio, espera longa
        </label>

        <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
          Quanto tempo você esperou? {tempoMin} min
        </p>
        <input
          type="range"
          min={0}
          max={180}
          step={5}
          value={tempoMin}
          // e.target.value sempre vem como texto, mesmo em um input numérico —
          // por isso o Number(...) para converter antes de guardar no estado.
          onChange={(e) => setTempoMin(Number(e.target.value))}
          style={{ width: '100%', marginBottom: '16px' }}
        />

        <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
          Comentário (opcional)
        </p>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Ex: triagem rápida, mas poucos médicos"
          style={{ width: '100%', minHeight: '60px', padding: '10px', borderRadius: '8px', border: '1px solid #D3DBD6', marginBottom: '16px' }}
        />

        {erro && <p style={{ color: '#B23A24', fontSize: '13px' }}>{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          style={{ width: '100%', padding: '11px', fontWeight: 600, background: '#0F5C4F', color: '#fff', border: 'none', borderRadius: '8px' }}
        >
          {enviando ? 'Enviando...' : 'Enviar relato'}
        </button>
      </form>
    </div>
  )
}

export default ReportPage