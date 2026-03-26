# Architecture & Design Principles

The RentEase Server is built with a strong emphasis on Object-Oriented Programming (OOP) and SOLID principles to ensure the codebase remains maintainable as it grows.

## 🧱 Layered Architecture (Clean Architecture)

We follow a strict separation of concerns:

1.  **Core (Domain)**: Business entities and repository interfaces. Framework-independent.
2.  **Application**: Use Cases that orchestrate business logic. DTOs and Mappers.
3.  **Infrastructure**: Concrete implementations of repositories (Prisma), database configuration, and external services.
4.  **Presentation**: Express routes, controllers, and dependency injection setup.

## 🧠 OOP Pillars in Action

### 1. Encapsulation
- **UserEntity**: Holds properties and methods related to users (getters/setters).
- **UserRepository**: Hides complex database queries; controllers only interact via simple methods like `create`.
- **Controllers**: Use private methods and dependency injection to hide implementation details.

### 2. Inheritance
- **BaseRepository**: An abstract class providing common functionality to all repositories.
- **Interfaces**: `IUserRepository` extends `IBaseRepository`, providing specialized user methods.

### 3. Polymorphism
- **Dependency Injection**: Controllers depend on interfaces (e.g., `ICreateUserUseCase`). Any implementation can be swapped in without changing the controller.
- **Generics**: `BaseRepository<T>` works with any entity type, demonstrating parametric polymorphism.

### 4. Abstraction
- **Repository Interfaces**: Define *what* a repository should do, not *how*. The controller only knows the `create` method exists.
- **Use Case Interfaces**: Define the structure of application features like registration or login.

## ⚖️ SOLID Principles

- **SRP (Single Responsibility)**: Mappers only map, repositories only touch the DB, controllers only handle HTTP.
- **OCP (Open/Closed)**: New repository types or status codes can be added without modifying existing code.
- **LSP (Liskov Substitution)**: Any class implementing an interface (e.g., `IUserRepository`) can be used wherever that interface is required.
- **ISP (Interface Segregation)**: Small, focused interfaces instead of "fat" ones.
- **DIP (Dependency Inversion)**: High-level modules (Controllers) don't depend on low-level modules (Prisma); both depend on abstractions (Interfaces).
