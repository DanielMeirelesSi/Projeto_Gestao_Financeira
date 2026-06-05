# +Grana

Aplicação web para organização financeira pessoal, com controle de gastos, acompanhamento de metas e visualização consolidada da situação financeira do usuário.

## Funcionalidades implementadas

### Autenticação e usuários

* Cadastro público de novos usuários.
* Login com geração de token JWT.
* Armazenamento seguro de senhas com hash.
* Envio do token pelo cabeçalho `Authorization`.
* Proteção das rotas privadas com guard de autenticação.
* Separação dos dados por usuário autenticado.
* Bloqueio de acesso aos dados de outros usuários.
* Listagem completa de usuários restrita a administradores.
* Remoção da senha das respostas retornadas pela API.

### Gastos

* Cadastro de despesas.
* Listagem dos gastos do usuário autenticado.
* Edição de despesas.
* Exclusão de despesas.
* Categorias personalizadas.
* Classificação por tipo:

  * `Fixo`
  * `Variável`
  * `Obrigatório`
* Atualização automática dos totais no dashboard.

### Metas financeiras

* Cadastro de metas.
* Definição de valor objetivo.
* Registro do valor atual acumulado.
* Definição de data limite.
* Edição das informações.
* Exclusão de metas.
* Barra de progresso individual.
* Atualização automática dos dados no dashboard.

### Dashboard

O dashboard reúne as principais informações financeiras em uma única tela:

* salário mensal cadastrado;
* total de gastos registrados;
* saldo disponível;
* quantidade de metas financeiras;
* gráfico de gastos por categoria;
* gráfico de evolução mensal dos gastos;
* metas em andamento;
* gastos mais recentes.

## Tecnologias utilizadas

### Backend

* Node.js
* TypeScript
* NestJS
* MongoDB
* Mongoose
* JWT
* bcryptjs
* class-validator

### Frontend

* React
* TypeScript
* Vite
* React Router
* Recharts
* CSS

### Infraestrutura

* Docker
* Docker Compose
* NGINX

## Arquitetura da aplicação

A aplicação é executada com três containers:

```text
web -> React servido pelo NGINX 
backend -> API NestJS 
db -> MongoDB
```

O frontend é compilado com Vite e servido pelo NGINX.

O backend centraliza as regras de negócio, a autenticação e o acesso ao banco de dados.

O MongoDB utiliza um volume persistente para preservar os registros mesmo após a reinicialização dos containers.

## Decisões técnicas

### Autenticação

Após o login, o backend gera um token JWT.

O token é enviado nas requisições privadas pelo cabeçalho:

```text
Authorization: Bearer <token>
```

As rotas protegidas utilizam um guard de autenticação no backend.

### Isolamento dos dados

Os gastos e as metas não recebem o identificador do usuário diretamente pelo frontend.

O backend identifica o usuário autenticado pelo token e vincula automaticamente os registros à conta correta.

Essa abordagem impede que um usuário consulte, altere ou exclua registros pertencentes a outra conta.

### Containers

O frontend utiliza um build em múltiplos estágios:

```text
Node.js  → compila o projeto React
NGINX    → serve os arquivos finais
```

O sistema completo pode ser iniciado com um único comando usando Docker Compose.

## Como executar

### Pré-requisitos

* Git
* Docker Desktop

Não é necessário instalar Node.js ou MongoDB localmente para executar a aplicação com Docker.

### Configuração

Clone o repositório:

```bash
git clone https://github.com/DanielMeirelesSi/Projeto_Gestao_Financeira.git
```

Acesse a pasta:

```bash
cd Projeto_Gestao_Financeira
```

Altere a branch da entrega:

```bash
git switch entrega-tcs
```

Crie o arquivo `.env` com base no modelo disponibilizado.

No PowerShell:

```powershell
Copy-Item .env.example .env
```

No Linux ou macOS:

```bash
cp .env.example .env
```

Preencha as variáveis do arquivo `.env`:

```env
MONGO_ROOT_USERNAME=your_username
MONGO_ROOT_PASSWORD=your_password
MONGO_DATABASE=grana
MONGO_HOST=localhost
MONGO_PORT=27017

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### Inicialização

Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

O comando cria as imagens e inicia os serviços:

```text
backend
db
web
```

Após a inicialização, acesse:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
Health:   http://localhost:3000/health
```

Para conferir os containers ativos:

```bash
docker compose ps
```

Para visualizar os logs do backend:

```bash
docker compose logs backend --tail 30
```

Para encerrar os containers sem apagar os dados:

```bash
docker compose down
```

## Rotas principais

### Frontend

| Rota         | Descrição                    | Acesso      |
| ------------ | ---------------------------- | ----------- |
| `/login`     | Login                        | Público     |
| `/cadastro`  | Cadastro de usuário          | Público     |
| `/dashboard` | Resumo financeiro e gráficos | Autenticado |
| `/gastos`    | Gerenciamento de gastos      | Autenticado |
| `/metas`     | Gerenciamento de metas       | Autenticado |

### API

| Método   | Endpoint        | Descrição                      | Acesso                           |
| -------- | --------------- | ------------------------------ | -------------------------------- |
| `POST`   | `/auth/login`   | Login e geração do JWT         | Público                          |
| `POST`   | `/usuarios`     | Cadastro de usuário            | Público                          |
| `GET`    | `/usuarios`     | Listagem de usuários           | Administrador                    |
| `GET`    | `/usuarios/:id` | Consulta de usuário            | Próprio usuário ou administrador |
| `PATCH`  | `/usuarios/:id` | Atualização de usuário         | Próprio usuário ou administrador |
| `DELETE` | `/usuarios/:id` | Exclusão de usuário            | Próprio usuário ou administrador |
| `POST`   | `/gastos`       | Cadastro de gasto              | Autenticado                      |
| `GET`    | `/gastos`       | Listagem dos gastos do usuário | Autenticado                      |
| `PATCH`  | `/gastos/:id`   | Atualização de gasto           | Autenticado                      |
| `DELETE` | `/gastos/:id`   | Exclusão de gasto              | Autenticado                      |
| `POST`   | `/metas`        | Cadastro de meta               | Autenticado                      |
| `GET`    | `/metas`        | Listagem das metas do usuário  | Autenticado                      |
| `PATCH`  | `/metas/:id`    | Atualização de meta            | Autenticado                      |
| `DELETE` | `/metas/:id`    | Exclusão de meta               | Autenticado                      |

## Testes realizados

O fluxo principal foi validado manualmente:

* clonagem pública do repositório em ambiente isolado;
* acesso à branch `entrega-tcs`;
* configuração do arquivo `.env`;
* build e inicialização completa da aplicação com Docker Compose;
* verificação do status saudável do container do MongoDB;
* acesso ao frontend, backend e endpoint de health check;
* cadastro de usuário;
* login e logout;
* acesso às rotas privadas;
* cadastro, edição e exclusão de gastos;
* cadastro, edição e exclusão de metas;
* atualização automática do dashboard;
* separação de dados entre usuários;
* bloqueio de acesso não autorizado;
* bloqueio da listagem completa de usuários para contas comuns;
* persistência dos dados após a reinicialização dos containers.


## Referências consultadas

### NestJS

* [Authentication](https://docs.nestjs.com/security/authentication)
* [Authorization](https://docs.nestjs.com/security/authorization)
* [Guards](https://docs.nestjs.com/guards)
* [Validation](https://docs.nestjs.com/techniques/validation)
* [MongoDB com Mongoose](https://docs.nestjs.com/techniques/mongodb)
* [Configuration](https://docs.nestjs.com/techniques/configuration)
* [Circular dependency](https://docs.nestjs.com/fundamentals/circular-dependency)

### Docker

* [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
* [Compose Build Specification](https://docs.docker.com/reference/compose-file/build/)
* [Services no Docker Compose](https://docs.docker.com/reference/compose-file/services/)
* [Control startup order](https://docs.docker.com/compose/how-tos/startup-order/)

### Frontend

* [Vite](https://vite.dev/guide/)
* [React Router](https://reactrouter.com/start/declarative/installation)
* [React Router: Navigating](https://reactrouter.com/start/declarative/navigating)
* [Recharts](https://recharts.github.io/)
* [ResponsiveContainer](https://recharts.github.io/en-US/api/ResponsiveContainer/)
* [NGINX: diretiva try_files](https://nginx.org/en/docs/http/ngx_http_core_module.html)

### Segurança

* [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
* [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
* [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

## Autor

Daniel Meireles