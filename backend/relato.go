package main

// Relato representa o que o formulário do app envia.
// Repare que NÃO tem HospitalID aqui — esse valor vem da URL
// (/hospitais/3/relatos), não do corpo da mensagem.
type Relato struct {
	ID          int    `json:"id"`
	HospitalID  int    `json:"hospital_id"`
	NivelEspera string `json:"nivel_espera"`
	TempoMin    int    `json:"tempo_min"`
	Comentario  string `json:"comentario"`
}
