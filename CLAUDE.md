# Yen Sao — Multi-Tenant Microservices E-Commerce Platform

## Project Overview

Multi-tenant e-commerce platform serving 2 companies with separate storefronts on a shared platform. Covers product catalog, cart, orders, payments, admin, CI/CD, and observability.

## Repository Structure

This monorepo contains two top-level projects:

```
yen-sao/
├── frontend/          # Next.js client app (TypeScript, Tailwind, ShadCN/UI)
├── backend/           # Java 21 Spring Boot microservices
│   ├── api-gateway/
│   ├── discovery-server/
│   ├── config-server/
│   ├── auth-service/
│   ├── company-service/
│   ├── product-service/
│   ├── cart-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── inventory-service/
│   └── notification-service/
├── docker-compose.yml
└── CLAUDE.md
```

## Architecture

- **Style:** Microservices + Event-Driven
- **Patterns:** Database per service, Saga pattern, CQRS-lite (optional), Outbox pattern (advanced)
- **Communication:** Sync via OpenFeign, Async via Kafka

## Backend Stack

- **Language:** Java 21
- **Framework:** Spring Boot 3
- **Libraries:** Spring Web, Spring Security, Spring Data JPA, Hibernate, Lombok, MapStruct, OpenAPI/Swagger
- **API Gateway:** Spring Cloud Gateway
- **Service Discovery:** Eureka Server
- **Config:** Spring Cloud Config Server
- **Messaging:** Kafka

### Microservices & Databases

| Service            | Database/Store      | Notes                              |
|--------------------|---------------------|------------------------------------|
| Auth Service       | PostgreSQL (auth_db)| JWT + Refresh Tokens               |
| Company Service    | PostgreSQL (company_db)| Tenant management               |
| Product Service    | PostgreSQL (product_db)| Redis cache, optional Elasticsearch |
| Cart Service       | Redis               | Session-based cart                 |
| Order Service      | PostgreSQL (order_db)| Kafka Saga orchestration           |
| Payment Service    | PostgreSQL (payment_db)| Stripe Sandbox / Mock             |
| Inventory Service  | PostgreSQL (inventory_db)| Kafka events                    |
| Notification Service| Kafka Consumer      | SendGrid / Mailgun                 |

### Cache & Search

- **Redis:** Cart, Sessions, Product cache, Rate limiting
- **Elasticsearch/OpenSearch:** Optional for product search

## Frontend Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS + ShadCN/UI
- **State:** Zustand
- **Auth:** JWT with HttpOnly cookies

## Security

- **Authentication:** Spring Security + JWT + Refresh Tokens
- **Authorization (RBAC):** CUSTOMER, COMPANY_ADMIN, SUPER_ADMIN
- **Gateway:** Rate limiting, Token validation, CORS

## DevOps

- **Containers:** Docker + Docker Compose
- **Reverse Proxy:** Nginx
- **CI/CD:** GitHub Actions
- **Frontend Hosting:** Vercel
- **Backend Hosting:** DigitalOcean / Azure
- **Database Hosting:** Neon / Supabase / Managed PostgreSQL

## Observability

- **Logs:** ELK Stack or Loki
- **Metrics:** Prometheus
- **Dashboard:** Grafana
- **Tracing:** Zipkin + OpenTelemetry
- **Errors:** Sentry

## Testing

- **Unit:** JUnit 5 + Mockito
- **Integration:** Spring Boot Test + Testcontainers
- **API:** Postman + Newman
- **Contract:** WireMock

## Business Features

### Customer
- Register/Login, Browse products, Search/filter, Cart, Checkout, Orders, Payment

### Company Admin
- Product CRUD, Inventory, Order management, Analytics

### Platform Admin
- Manage companies, Tenant config

## Build Priority

### Build fully:
- API Gateway, Auth, Product, Cart, Order, Payment

### Stub/lightweight:
- Notification, Analytics, Elasticsearch

## Commands

```bash
# Backend (from backend/)
./mvnw clean install          # Build all services
./mvnw spring-boot:run        # Run individual service

# Frontend (from frontend/)
npm install                   # Install dependencies
npm run dev                   # Dev server
npm run build                 # Production build

# Docker
docker-compose up -d          # Start all services
docker-compose down           # Stop all services
```
