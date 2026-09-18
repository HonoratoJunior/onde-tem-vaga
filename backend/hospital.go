package main

// Hospital representa uma linha da tabela `hospitais` no banco.
// As tags entre crases (`json:"..."`) dizem ao Go como transformar
// isso em JSON: o campo Go "Nome" vira a chave JSON "nome", por exemplo.
type Hospital struct {
	ID             int     `json:"id"`
	Nome           string  `json:"nome"`
	Endereco       string  `json:"endereco"`
	Latitude       float64 `json:"latitude"`
	Longitude      float64 `json:"longitude"`
	TempoEsperaMin int     `json:"tempo_espera_min"`
	Status         string  `json:"status"`
}
