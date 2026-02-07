📦 RentEase — Server

Backend service for RentEase built with TypeScript, Express, PostgreSQL, Prisma, following Clean Architecture & SOLID principles.

🧱 Architecture Overview

This backend strictly follows Clean Architecture:

src/
│
├── Core/                # Enterprise business rules (Domain)
│   ├── Entities
│   ├── Interfaces
│   ├── Types
│   └── Enums
│
├── Application/         # Application business rules
│   ├── UseCases
│   ├── DTOs
│   └── Mappers
│
├── Infrastructure/      # External services & frameworks
│   ├── Database
│   │   └── prisma
│   ├── Repositories
│   └── Mappers
│
├── Presentation/        # HTTP layer
│   ├── Controllers
│   ├── Routes
│   └── Dependency-Injection
│
├── Shared/              # Shared enums & utilities
│
└── index.ts             # Application entry point

⚙️ Tech Stack

TypeScript

Express

PostgreSQL

Prisma ORM

tsyringe (Dependency Injection)

JWT (planned)

Redis / Cache (planned)

ESLint + Prettier

🧠 Design Principles

SOLID principles

Dependency Inversion

Domain-driven separation

Framework-independent Core

DTO-based input/output

Explicit mappers between layers

🗄 Database

PostgreSQL

Prisma ORM

Schema defined in schema.prisma

Migrations handled via Prisma