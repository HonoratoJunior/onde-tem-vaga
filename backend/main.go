package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5"
)

// conn fica acessível para qualquer função do pacote, não só a main.
// Isso é um atalho aceitável agora; mais pra frente aprendemos um jeito
// mais organizado de "passar" a conexão entre partes do código.
var conn *pgx.Conn

func main() {
	connString := "postgres://ondevaga_app:5857@localhost:5432/onde_tem_vaga"

	ctx := context.Background()
	var err error
	conn, err = pgx.Connect(ctx, connString)
	if err != nil {
		log.Fatal("Não consegui conectar ao banco: ", err)
	}
	defer conn.Close(ctx)

	// Registra: "quando chegar um pedido na rota /hospitais,
	// chame a função listarHospitais para responder."
	http.HandleFunc("/hospitais", listarHospitais)

	log.Println("Servidor rodando em http://localhost:8080")

	// ListenAndServe começa a "escutar" pedidos na porta 8080
	// e só retorna (encerra) se der algum erro grave.
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Erro ao iniciar servidor: ", err)
	}
}

// listarHospitais é um "handler": toda função que responde a uma rota HTTP
// em Go tem essa mesma assinatura — recebe um ResponseWriter (pra onde
// escrever a resposta) e um Request (o pedido que chegou).
func listarHospitais(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	rows, err := conn.Query(ctx, "SELECT id, nome, endereco, latitude, longitude, tempo_espera_min, status FROM hospitais")
	if err != nil {
		http.Error(w, "Erro ao consultar hospitais", http.StatusInternalServerError)
		log.Println("Erro na consulta:", err)
		return
	}
	defer rows.Close()

	// Começamos com uma lista vazia (não nula) para que, se não houver
	// hospitais, o JSON retorne [] em vez de null.
	hospitais := []Hospital{}

	for rows.Next() {
		var h Hospital
		err := rows.Scan(&h.ID, &h.Nome, &h.Endereco, &h.Latitude, &h.Longitude, &h.TempoEsperaMin, &h.Status)
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

	// Avisa ao navegador/cliente que a resposta é JSON.
	w.Header().Set("Content-Type", "application/json")

	// Transforma a lista de structs Go em JSON e escreve direto na resposta.
	err = json.NewEncoder(w).Encode(hospitais)
	if err != nil {
		log.Println("Erro ao gerar JSON:", err)
	}
}
