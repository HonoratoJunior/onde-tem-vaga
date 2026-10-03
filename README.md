# Onde tem vaga

Estou construindo esse projeto para resolver um problema que vejo de perto: quem depende do SUS geralmente escolhe para qual hospital ou UPA ir no escuro — sem saber se vai esperar vinte minutos ou três horas até ser atendido. Essa decisão, hoje, é um chute. Meu objetivo com esse app é reduzir esse chute, reunindo num só lugar as unidades de saúde mais próximas, o tempo de espera estimado de cada uma, e relatos de quem acabou de estar lá.

Esse não é (ainda) um produto pronto para produção — é um projeto em desenvolvimento ativo, construído por mim, aprendendo cada peça da stack do zero. Estou documentando aqui tanto o que já funciona quanto o que pretendo construir a seguir.

## O problema que estou tentando resolver

Duas pessoas com a mesma necessidade de saúde, em bairros vizinhos, podem ter experiências completamente diferentes — uma espera vinte minutos, a outra espera três horas — e nenhuma das duas sabia disso antes de sair de casa. A informação sobre ocupação dos hospitais, quando existe, fica presa em sistemas internos de regulação, inacessível para quem mais precisa dela: o paciente.

## O que o app já faz

- **Lista as unidades de saúde próximas** (hospitais e UPAs), com tempo de espera estimado e status visual (baixa, média ou alta espera).
- **Mostra o detalhe de cada unidade**, incluindo endereço e especialidades.
- **Permite que qualquer pessoa relate** como está a fila em tempo real — esse relato fica salvo e, no futuro, vai alimentar a estimativa de espera mostrada para os próximos usuários.
- **Funciona como um app instalável no celular** (PWA), com ícone próprio na tela inicial, mesmo sendo construído inteiramente com tecnologia web.

> Importante: o app **não promete reservar vaga**. A decisão clínica de quem é atendido e em qual ordem continua sendo responsabilidade exclusiva de cada unidade de saúde e de seus profissionais. O que eu ofereço aqui é orientação para ajudar na escolha de para onde ir — nunca uma garantia.

## Como construí

Escolhi essa stack porque queria aprender uma combinação comum no mercado, com uma linguagem de back-end performática e simples (Go) e o ecossistema de front-end mais usado hoje (React + TypeScript).

**Back-end**
- [Go](https://go.dev/) — servidor HTTP e regras de negócio
- [pgx](https://github.com/jackc/pgx) — driver de conexão com o PostgreSQL
- API REST própria, sem framework externo, usando a biblioteca padrão `net/http`

**Banco de dados**
- [PostgreSQL](https://www.postgresql.org/)

**Front-end**
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) como ferramenta de build e servidor de desenvolvimento
- [React Router](https://reactrouter.com/) para navegação entre telas
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) para transformar o app em um PWA instalável

## Estrutura do projeto

```
onde-tem-vaga/
├── backend/          # Servidor Go e API REST
│   ├── main.go
│   ├── hospital.go
│   └── relato.go
└── frontend/         # Aplicação React + TypeScript
    ├── src/
    │   ├── App.tsx
    │   └── pages/
    │       ├── Home.tsx
    │       ├── HospitalDetail.tsx
    │       └── ReportPage.tsx
    └── public/        # Ícones do PWA
```

## Como rodar o projeto localmente

Se você quiser rodar esse projeto na sua máquina, aqui está o passo a passo que eu mesmo sigo.

### Pré-requisitos

- Go 1.23 ou superior
- Node.js (via [nvm](https://github.com/nvm-sh/nvm), versão LTS)
- PostgreSQL

### 1. Clone o repositório

```bash
git clone https://github.com/HonoratoJunior/onde-tem-vaga.git
cd onde-tem-vaga
```

### 2. Configure o banco de dados

```bash
sudo -u postgres createdb onde_tem_vaga
sudo -u postgres psql onde_tem_vaga
```

Dentro do `psql`, crie o usuário da aplicação e as tabelas (veja a seção de schema abaixo, ou peça o arquivo de migração completo).

### 3. Configure as variáveis de ambiente do back-end

Eu não deixo nenhuma senha fixa no código — o servidor lê a conexão com o banco a partir de uma variável de ambiente. Copie o modelo e preencha com seus próprios dados:

```bash
cd backend
cp run.sh.example run.sh
nano run.sh   # edite com usuário, senha e nome do seu banco
chmod +x run.sh
./run.sh
```

O servidor sobe em `http://localhost:8080`.

### 4. Configure o front-end

```bash
cd frontend
npm install
cp .env.example .env
nano .env   # defina VITE_API_URL com o endereço do seu back-end
npm run dev
```

O app abre em `http://localhost:5173`.

### 5. (Opcional) Acessar pelo celular

Para testar no celular na mesma rede Wi-Fi, rode o front-end com `npm run dev -- --host` e acesse pelo IP local da máquina, mantendo `VITE_API_URL` apontando para esse mesmo IP.

## O que vem a seguir

Esta é a minha lista de próximos passos, em ordem de prioridade:

- [ ] Calcular o tempo de espera exibido a partir da média real dos relatos recentes, em vez de um valor fixo
- [ ] Buscar parceria com secretarias de saúde para integrar dados oficiais de ocupação
- [ ] Adicionar mapa visual das unidades, não só lista
- [ ] Autenticação simples para evitar relatos abusivos
- [ ] Publicar a primeira versão em produção

## Sobre dados e responsabilidade

Os dados de hospitais e UPAs usados até aqui são baseados em cadastros públicos (CNES) e informações divulgadas pela Prefeitura de Nova Iguaçu/RJ. Este projeto não possui, até o momento, nenhum vínculo oficial com o Ministério da Saúde, SUS, ou qualquer secretaria municipal ou estadual de saúde.

## Licença

Ainda não defini uma licença formal para este repositório.

---

Feito por [Honorato Junior](https://github.com/HonoratoJunior), aprendendo Go, React e PostgreSQL um dia de cada vez.
