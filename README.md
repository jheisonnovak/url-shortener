# High-Performance URL Shortener

A scalable, production-ready URL shortener microservice built with **NestJS** and designed to handle **1+ million requests**. This project implements enterprise-grade scalability patterns including database replication, caching strategies, monitoring, and distributed architecture concepts.

## 🎯 Project Overview

This URL shortener is architected for **high availability** and **horizontal scalability**, implementing key patterns needed to handle massive traffic loads. While designed to support millions of requests, the current implementation focuses on the infrastructure foundation with plans for complete distributed deployment.

### 🏗️ Architecture Overview

```
Frontend (Not Implemented)
         ↓
Load Balancer (Not Implemented)
         ↓
Multiple Data Centers (Conceptual)
         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Center                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Web Servers (Current)                  │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │    │
│  │  │ API Gateway │ │Auth Service │ │URL Shortener│    │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
│                         ↓                                   │
│         ┌───────────────┴───────────────┐                   │
│         ↓                               ↓                   │
│  ┌─────────────┐                 ┌─────────────┐            │
│  │Message Queue│                 │   Cache &   │            │
│  │& Workers    │                 │ Databases   │            │
│  │             │                 │             │            │
│  │ ┌─────────┐ │                 │ ┌─────────┐ │            │
│  │ │RabbitMQ │ │                 │ │  Redis  │ │            │
│  │ └─────────┘ │                 │ └─────────┘ │            │
│  │ ┌─────────┐ │                 │             │            │
│  │ │Workers  │ │                 │ ┌─────────┐ │            │
│  │ │(Planned)│ │                 │ │Auth DB  │ │            │
│  │ └─────────┘ │                 │ │ Master  │ │            │
│  └─────────────┘                 │ └─────────┘ │            │
│                                  │ ┌─────────┐ │            │
│                                  │ │Short DB │ │            │
│                                  │ │ Master  │ │            │
│                                  │ └─────────┘ │            │
│                                  │ ┌─────────┐ │            │
│                                  │ │Short DB │ │            │
│                                  │ │ Slave1  │ │            │
│                                  │ └─────────┘ │            │
│                                  │ ┌─────────┐ │            │
│                                  │ │Short DB │ │            │
│                                  │ │ Slave2  │ │            │
│                                  │ └─────────┘ │            │
│                                  └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Monitoring & Observability                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ Prometheus  │ │  Grafana    │ │  Logging    │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Scalability Features

### ✅ Implemented

- **Microservices Architecture**: API Gateway, Auth Service, URL Shortener Service
- **Database Replication**: Master-Slave PostgreSQL setup for read scaling
- **Connection Pooling**: PgBouncer for efficient database connections
- **Distributed Caching**: Redis for high-performance data access
- **Message Queue**: RabbitMQ for asynchronous processing
- **Monitoring Stack**: Prometheus + Grafana for metrics and visualization
- **Health Checks**: Comprehensive service health monitoring
- **Container Orchestration**: Docker Compose for local development

### 🔄 Planned/Not Implemented

- **Kubernetes Deployment**: Auto-scaling pods based on demand
- **Load Balancers**: Traffic distribution across multiple instances
- **Multiple Data Centers**: Geographic distribution for global scale
- **Worker Services**: Background job processing for analytics
- **CDN Integration**: Global content delivery
- **Advanced Rate Limiting**: Distributed rate limiting with Redis
- **Service Mesh**: Istio for advanced traffic management
- **Database Sharding**: Horizontal database partitioning

## 📋 Prerequisites

- **[Docker](https://docs.docker.com/get-docker/)** (v20.10+)
- **[Docker Compose](https://docs.docker.com/compose/install/)** (v2.0+)
- **[Git](https://git-scm.com/downloads)**
- **[Node.js](https://nodejs.org/)** (v18+ for local development)

### Verify Installation

```bash
# Check Docker
docker --version

# Check Docker Compose
docker-compose --version

# Check Git
git --version
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/jheisonnovak/url-shortener.git
cd url-shortener
```

### 2. Environment Configuration

Create environment file:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

### 3. Start the System

```bash
# Build and start all services
npm run docker:up

# Or using Docker Compose directly
docker-compose up --build -d
```

### 4. Verify Services

```bash
# Check container status
docker-compose ps

# View logs
npm run docker:logs

# Check monitoring services
npm run monitoring:status
```

### 5. Access Points

- **🌐 API Documentation**: http://localhost:2000/api/docs
- **🔗 API Gateway**: http://localhost:2000
- **📊 Grafana Dashboard**: http://localhost:3000
- **📈 Prometheus**: http://localhost:9090
- **💾 pgAdmin**: http://localhost:5050
- **🐰 RabbitMQ Management**: http://localhost:15672

## ⚙️ Configuration

### Environment Variables

```bash
# Application
NODE_ENV=production

PORT=2000

RABBITMQ_URL=amqp://admin:admin123@rabbitmq:5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin123

DB_USERNAME=postgres
DB_PASSWORD=postgres

DB_NAME_SHORTENER=url_shortener
DB_NAME_AUTH=auth_service

DB_AUTH_HOST=postgres-auth-master
DB_AUTH_PORT=5432

DB_SHORTENER_MASTER_HOST=postgres-shortener-master
DB_SHORTENER_MASTER_PORT=5432

DB_SHORTENER_SLAVE1_HOST=postgres-shortener-slave1
DB_SHORTENER_SLAVE1_PORT=5432

DB_SHORTENER_SLAVE2_HOST=postgres-shortener-slave2
DB_SHORTENER_SLAVE2_PORT=5432

DB_HOST=postgres-shortener-master
DB_PORT=5432
DB_NAME=postgres

PGBOUNCER_HOST=pgbouncer
PGBOUNCER_PORT=6432

REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=k8mP9nQ2wE7rT5yU3iO6pA1sD4fG9hJ2lZ8xC5vB7nM0qW3eR6tY9uI2oP5aS8dF
JWT_EXPIRES_IN=15m

PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin
```

### Default Credentials

| Service  | URL                    | Username        | Password |
| -------- | ---------------------- | --------------- | -------- |
| pgAdmin  | http://localhost:5050  | admin@admin.com | admin    |
| RabbitMQ | http://localhost:15672 | admin           | admin    |
| Grafana  | http://localhost:3000  | admin           | admin    |

## 📊 Database Architecture

### Master-Slave Replication

- **Auth Master**: Primary database for user authentication
- **URL Shortener Master**: Primary database for URL operations
- **URL Shortener Slaves (2x)**: Read replicas for scaling queries
- **PgBouncer**: Connection pooling for efficient resource usage

### Database Ports

| Database          | Port | Purpose                  |
| ----------------- | ---- | ------------------------ |
| Auth Master       | 5433 | User authentication data |
| Shortener Master  | 5434 | URL shortening writes    |
| Shortener Slave 1 | 5435 | Read operations          |
| Shortener Slave 2 | 5436 | Read operations          |
| PgBouncer         | 6432 | Connection pooling       |

## 📡 API Documentation

Complete API documentation is available via Swagger UI at: http://localhost:2000/api/docs

### Core Endpoints

#### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication

#### URL Management

- `POST /shortener` - Create shortened URL
- `GET /:shortCode` - Redirect to original URL
- `GET /shortener` - List user URLs (authenticated)
- `PATCH /shortener/:shortCode` - Update URL (authenticated)
- `DELETE /shortener/:shortCode` - Delete URL (authenticated)

## 🔧 Scalability Concepts

### 1. **Horizontal Scaling Strategies**

#### Database Scaling

- **Read Replicas**: Multiple slave databases for read operations
- **Connection Pooling**: PgBouncer manages database connections efficiently
- **Database Sharding**: (Planned) Distribute data across multiple databases

#### Application Scaling

- **Microservices**: Independent services that can scale separately
- **Stateless Design**: Services don't store session data locally
- **Container Orchestration**: Ready for Kubernetes deployment

### 2. **Caching Strategy**

#### Redis Implementation

- **Query Result Caching**: Cache frequent database queries
- **Session Storage**: Distributed session management
- **Rate Limiting**: Distributed rate limiting counters

#### Planned Enhancements

- **CDN Integration**: Static content delivery
- **Multi-level Caching**: L1 (local) + L2 (distributed) cache

### 3. **Message Queue & Workers**

#### Current Implementation

- **RabbitMQ**: Message broker for asynchronous operations
- **Event-driven Architecture**: Loose coupling between services

#### Planned Features

- **Background Workers**: Click counting, analytics processing
- **Dead Letter Queues**: Error handling and retry mechanisms
- **Priority Queues**: Different processing priorities

### 4. **Monitoring & Observability**

#### Implemented Monitoring

- **Prometheus**: Metrics collection from all services
- **Grafana**: Visualization dashboards
- **Health Checks**: Service availability monitoring
- **Database Metrics**: PostgreSQL and Redis monitoring

#### Dashboards Available

- Application performance metrics
- Infrastructure monitoring
- Database performance
- Error rates and response times

### 5. **Performance Optimization**

#### Database Optimizations

- **Indexing Strategy**: Optimized indexes for short codes and user queries
- **Query Optimization**: Efficient SQL queries with proper joins
- **Connection Management**: Pool management and connection reuse

#### Application Optimizations

- **Async Processing**: Non-blocking operations
- **Batch Operations**: Bulk database operations
- **Resource Pooling**: Efficient resource utilization

## 🎯 Million Request Handling Strategy

### Traffic Distribution

1. **Load Balancer** → Distributes requests across multiple instances
2. **API Gateway** → Routes requests to appropriate microservices
3. **Service Instances** → Multiple replicas handle concurrent requests
4. **Database Layer** → Master for writes, slaves for reads
5. **Cache Layer** → Redis reduces database load

### Performance Targets

- **Response Time**: < 100ms for cached requests
- **Throughput**: 1M+ requests per hour
- **Availability**: 99.9% uptime
- **Scalability**: Auto-scaling based on load

## 🔮 Future Enhancements

### Infrastructure

- **Kubernetes**: Production orchestration with auto-scaling
- **Service Mesh**: Istio for advanced traffic management
- **Multi-region**: Geographic distribution
- **CI/CD Pipeline**: Automated testing and deployment

### Features

- **Analytics Dashboard**: Click tracking and statistics
- **Custom Domains**: User-defined short domains
- **QR Code Generation**: Visual URL sharing
- **API Rate Limiting**: Advanced throttling strategies
- **A/B Testing**: Feature flag management

### Monitoring

- **Distributed Tracing**: Request flow across services
- **Log Aggregation**: Centralized logging with ELK stack
- **Alerting**: Proactive issue detection
- **Performance APM**: Application performance monitoring

## 📈 Performance Metrics

The system includes comprehensive monitoring through:

- **Application Metrics**: Request rates, response times, error rates
- **Infrastructure Metrics**: CPU, memory, disk usage
- **Database Metrics**: Query performance, connection pools
- **Business Metrics**: URL creation rates, click tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED License.

## 👨‍💻 Author

**Jheison Novak** - [GitHub](https://github.com/jheisonnovak)

---

⭐ **Star this repo if you find it helpful!**
