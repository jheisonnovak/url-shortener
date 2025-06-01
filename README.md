# URL Shortener - API de Encurtamento de URLs

Api de encurtamento de URLs desenvolvido com **NestJS**.

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **[Docker](https://docs.docker.com/get-docker/)**
- **[Docker Compose](https://docs.docker.com/compose/install/)**
- **[Git](https://git-scm.com/downloads)**

### Verificar Instalação

```bash
# Verificar Docker
docker --version

# Verificar Docker Compose
docker-compose --version

# Verificar Git
git --version
```

## 🚀 Instalação e Execução

### 1. Clone o Repositório

```bash
git clone https://github.com/jheisonnovak/url-shortener.git
cd url-shortener
```

### 2. Configuração das Variáveis de Ambiente

Crie o arquivo `.env` baseado no `.env.example`:

```bash
# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

### 3. Execute o Sistema com Docker

```bash
# Construir e iniciar todos os serviços
npm run docker:up

# Ou usando Docker Compose diretamente
docker-compose up --build -d
```

### 4. Verificar se os Serviços Estão Funcionando

```bash
# Verificar status dos containers
docker-compose ps

# Visualizar logs em tempo real
npm run docker:logs

# Ou para um serviço específico
docker-compose logs -f api-gateway
```

### 5. Acessar a Aplicação

- **Documentação Swagger**: http://localhost:2000/api/docs
- **API Gateway**: http://localhost:2000
- **pgAdmin**: http://localhost:5050
- **RabbitMQ Management**: http://localhost:15672

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

```bash
# Ambiente
NODE_ENV=production

# API Gateway
PORT=2000

# RabbitMQ
RABBITMQ_URL=amqp://user:password@rabbitmq:5672

# Banco de Dados
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME_SHORTENER=url_shortener
DB_NAME_AUTH=auth_service

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=15m
```

### Credenciais Padrão

#### PostgreSQL

- **Host**: localhost:5434 ou postgres
- **Usuário**: postgres
- **Senha**: postgres
- **Databases**: `url_shortener`, `auth_service`

#### pgAdmin

- **URL**: http://localhost:5050
- **Email**: admin@admin.com
- **Senha**: admin

#### RabbitMQ Management

- **URL**: http://localhost:15672
- **Usuário**: user
- **Senha**: password

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger UI:

**URL**: http://localhost:2000/api/docs

### Principais Endpoints:

#### Autenticação

- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Fazer login

#### URLs

- `POST /shortener` - Encurtar URL
- `GET /:shortCode` - Redirecionar para URL original
- `GET /shortener` - Listar URLs do usuário (autenticado)
- `PATCH /shortener/:shortCode` - Atualizar URL (autenticado)
- `DELETE /shortener/:shortCode` - Excluir URL (autenticado)

## 📈 Escalabilidade e Pontos de Melhoria

### 🚀 Preparação para Escalabilidade Horizontal

Para suportar crescimento e alta demanda, o sistema pode ser expandido com as seguintes melhorias:

1. **Múltiplas Instâncias de Microserviços**

2. **Cache Distribuído**

3. **Monitoramento e Observabilidade**

### 🎯 Principais Desafios de Escalabilidade

1. **Geração de Short Codes Únicos:** garantir unicidade em múltiplas instâncias

2. **Consistência de Dados:** manter consistência entre múltiplas instâncias e databases

3. **Rate Limiting Distribuído:** controlar limite de requisições por usuário/IP globalmente

## 👥 Autor

- **Jheison Novak** - [Github](https://github.com/jheisonnovak)
