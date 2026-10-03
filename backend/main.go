package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/jackc/pgx/v5"
)

var conn *pgx.Conn

func main() {
	connString := os.Getenv("DATABASE_URL")
	if connString == "" {
		log.Fatal("A variável de ambiente DATABASE_URL não foi definida")
	}
	ctx := context.Background()
	var err error
	conn, err = pgx.Connect(ctx, connString)
	if err != nil {
		log.Fatal("Não consegui conectar ao banco: ", err)
	}
	defer conn.Close(ctx)

	// Repare no "GET" antes da rota: isso diz explicitamente que essa função
	// só responde a pedidos do tipo GET (buscar dado). O {id} entre chaves
	// é um "espaço reservado" — qualquer coisa colocada ali na URL de verdade
	// (como /hospitais/3) fica disponível dentro do handler.
	http.HandleFunc("GET /hospitais", enableCORS(listarHospitais))
	http.HandleFunc("GET /hospitais/{id}", enableCORS(buscarHospitalPorID))
	http.HandleFunc("/hospitais/{id}/relatos", enableCORS(criarRelato))

	log.Println("Servidor rodando em http://localhost:8080")

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Erro ao iniciar servidor: ", err)
	}
}

func criarRelato(w http.ResponseWriter, r *http.Request) {
	// O navegador manda um pedido OPTIONS antes do POST de verdade,
	// só perguntando "posso enviar?". Respondemos "pode" e paramos
	// por aqui — não tem dado nenhum pra processar nesse pedido.
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	idTexto := r.PathValue("id")
	hospitalID, err := strconv.Atoi(idTexto)
	if err != nil {
		http.Error(w, "ID de hospital inválido", http.StatusBadRequest)
		return
	}

	var relato Relato
	// Decode lê o corpo da requisição (que vem em JSON) e preenche
	// os campos da struct Relato automaticamente, casando pelos
	// nomes das tags json:"..." que definimos.
	err = json.NewDecoder(r.Body).Decode(&relato)
	if err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	// Exec é usado quando não esperamos nenhuma linha de volta —
	// diferente de Query e QueryRow, que servem para leitura.
	_, err = conn.Exec(ctx,
		"INSERT INTO relatos (hospital_id, nivel_espera, tempo_min, comentario) VALUES ($1, $2, $3, $4)",
		hospitalID, relato.NivelEspera, relato.TempoMin, relato.Comentario,
	)
	if err != nil {
		http.Error(w, "Erro ao salvar relato", http.StatusInternalServerError)
		log.Println("Erro no INSERT:", err)
		return
	}

	// 201 Created é o código HTTP correto para "algo novo foi criado com sucesso"
	// — diferente do 200 genérico que usamos nas buscas.
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`{"mensagem":"Relato salvo com sucesso"}`))
}

func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		next(w, r)
	}
}

func listarHospitais(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	rows, err := conn.Query(ctx, "SELECT id, nome, endereco, latitude, longitude, tempo_espera_min, status, tipo FROM hospitais")
	if err != nil {
		http.Error(w, "Erro ao consultar hospitais", http.StatusInternalServerError)
		log.Println("Erro na consulta:", err)
		return
	}
	defer rows.Close()

	hospitais := []Hospital{}

	for rows.Next() {
		var h Hospital
		err := rows.Scan(&h.ID, &h.Nome, &h.Endereco, &h.Latitude, &h.Longitude, &h.TempoEsperaMin, &h.Status, &h.Tipo)
		if err != nil {
			http.Error(w, "Erro ao ler hospital", http.StatusInternalServerError)
			log.Println("Erro no scan:", err)
			return
		}
		hospitais = append(hospitais, h)
	}

	if err := rows.Err(); err != nil {
		http.Error(w, "Erro na consulta", http.StatusInternalServerError)
		log.Println("Erro na consulta:", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(hospitais)
}

// buscarHospitalPorID é a nova função. Ela lê o {id} que veio na URL,
// converte de texto para número, e busca só aquela linha no banco.
func buscarHospitalPorID(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	// r.PathValue("id") pega o texto que estava no lugar de {id} na URL.
	// Por exemplo, em /hospitais/3, isso retorna a string "3".
	idTexto := r.PathValue("id")

	// URLs são sempre texto. Precisamos converter "3" para o número 3
	// antes de usar numa consulta que espera um inteiro.
	id, err := strconv.Atoi(idTexto)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var h Hospital
	// QueryRow (diferente de Query) espera exatamente UMA linha de volta —
	// ideal aqui, já que id é chave primária e nunca se repete.
	// O $1 é um "placeholder" seguro: o pgx troca ele pelo valor de id,
	// evitando um problema sério de segurança chamado SQL injection.
	err = conn.QueryRow(ctx,
		"SELECT id, nome, endereco, latitude, longitude, tempo_espera_min, status, tipo FROM hospitais WHERE id = $1",
		id,
	).Scan(&h.ID, &h.Nome, &h.Endereco, &h.Latitude, &h.Longitude, &h.TempoEsperaMin, &h.Status, &h.Tipo)

	if err != nil {
		// Se não achou nenhuma linha com esse id, respondemos 404 (não encontrado)
		// em vez de 500 (erro do servidor) — são situações diferentes.
		http.Error(w, "Hospital não encontrado", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(h)
}
