<div align="center">

# 🐻 Poro Guess API

**The backend powering a multi-mode League of Legends guessing game**

[![CI](https://github.com/Sencoool/poro-guess-api/actions/workflows/ci.yml/badge.svg)](https://github.com/Sencoool/poro-guess-api/actions/workflows/ci.yml)
![NestJS](https://img.shields.io/badge/NestJS-v11-E0234E?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)

</div>

---

## 🎮 Overview

**Poro Guess API** is the REST backend for an interactive League of Legends guessing web application. It manages game mechanics, scoring, progressive hint unlocking, and real-time validation across four distinct mini-games:

| Mode | Description |
|------|-------------|
| 🏆 **Classic** | Daily champion guessing with dynamic attribute clues — Role, Species, Release Year, with directional comparison arrows |
| 🧩 **Tile Reveal** | Grid-based image reveal puzzle — a region of the champion splash art is uncovered with each attempt |
| 🔍 **Traits** | A Fan-Pantae-inspired progressive mystery game — 5 clues are unlocked one by one until the champion is identified |
| ⚡ **Ability Matcher** | Memory-match card mechanics linking champion skills to their hotkey slots |

---

## 🏗️ Architecture

The project follows **Clean Architecture (Hexagonal)** principles, with strict separation between domain logic, application use cases, and infrastructure concerns.

```
src/
├── core/               # Domain layer — entities, interfaces, use cases
│   └── user/
├── modules/            # Application layer — NestJS feature modules
│   └── user/
├── infrastructure/     # Infrastructure layer — Prisma, repositories, adapters
│   └── prisma/
│       ├── prisma.service.ts
│       └── repositories/
├── common/             # Shared utilities — filters, interceptors, pipes
└── generated/          # Prisma-generated client (do not edit)
    └── prisma/
```

**Key principles applied:**
- Domain game logic is fully decoupled from persistence and HTTP frameworks
- Repositories are defined as interfaces in the core layer and implemented in infrastructure
- Global validation, serialization, and error handling via NestJS pipes/interceptors/filters

---

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Language**: TypeScript 5.7
- **ORM**: [Prisma](https://www.prisma.io/) v7 (with `@prisma/adapter-pg` driver)
- **Database**: PostgreSQL 16
- **Validation**: `class-validator` + `class-transformer`
- **API Docs**: Swagger / OpenAPI (`/api`)
- **Testing**: Jest (unit) + Supertest (E2E)
- **CI**: GitHub Actions

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 22
- [Docker](https://www.docker.com/) (for local PostgreSQL)

### 1. Clone & install

```bash
git clone https://github.com/Sencoool/poro-guess-api.git
cd poro-guess-api
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values (defaults work out of the box with Docker):

```env
PORT=3000
NODE_ENV=development

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=poro_guess
POSTGRES_PORT=5432

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/poro_guess?schema=public"

PGADMIN_EMAIL=admin@poroguess.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050
```

### 3. Start the database

```bash
docker compose up -d
```

This starts:
- **PostgreSQL 16** on the configured port
- **pgAdmin 4** at `http://localhost:5050`

### 4. Run migrations & generate client

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the server

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at:
- 🚀 **Server**: `http://localhost:3000`
- 📖 **Swagger UI**: `http://localhost:3000/api`

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Unit tests (watch mode)
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## 🗃️ Database

### Useful Prisma commands

```bash
# Run migrations (dev)
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Regenerate Prisma client after schema changes
npm run prisma:generate

# Seed the database
npm run prisma:seed
```

### Schema overview

| Model | Description |
|-------|-------------|
| `User` | Player accounts with role-based access (`USER` / `ADMIN`) |

---

## 📁 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server port |
| `NODE_ENV` | `development` | Runtime environment |
| `DATABASE_URL` | — | Full PostgreSQL connection string |
| `POSTGRES_USER` | `postgres` | PostgreSQL username |
| `POSTGRES_PASSWORD` | `postgres` | PostgreSQL password |
| `POSTGRES_DB` | `poro_guess` | PostgreSQL database name |
| `POSTGRES_PORT` | `5432` | PostgreSQL port |
| `PGADMIN_EMAIL` | — | pgAdmin login email |
| `PGADMIN_PASSWORD` | — | pgAdmin login password |
| `PGADMIN_PORT` | `5050` | pgAdmin UI port |

---

## 📜 License

UNLICENSED — private project.
