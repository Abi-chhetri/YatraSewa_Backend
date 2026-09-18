# YatraSewa Backend

Backend API for the YatraSewa platform.

## Tech Stack

* Node.js
* Express
* TypeScript
* PostgreSQL
* Prisma ORM
* Zod
* Vitest
* Swagger

## Project Structure

```text
src/
├── config/          # Environment and application configuration
├── controllers/     # Request/response handling
├── generated/       # Generated Prisma client
├── middlewares/     # Logging, validation, rate limiting, errors
├── routes/          # API route definitions
├── schemas/         # Zod validation schemas
├── services/        # External integrations and business services
├── app.ts           # Express application configuration
└── server.ts        # Application entry point

prisma/
├── migrations/      # Database migrations
└── schema.prisma    # Database schema

test/                # Automated tests
```

## API Versioning

All application APIs are exposed under:

`/api/v1`

Example:

`GET /api/v1/health`

## Module Boundaries

The backend follows this request flow:

```text
Request
   ↓
Route
   ↓
Validation Middleware
   ↓
Controller
   ↓
Service / Database
   ↓
Response
```

* Routes define API endpoints.
* Schemas validate incoming request data.
* Controllers handle HTTP request/response logic.
* Services contain business logic and external integrations.
* Prisma handles database access.
* Middleware handles cross-cutting concerns such as logging, validation, rate limiting, and errors.

## Validation

Zod is used for request validation.

Invalid requests are rejected before reaching the controller.

## Error Handling

A global error middleware handles unexpected application errors.

API errors should return a consistent JSON response.

## Current API

### Health Check

`GET /api/v1/health`

Returns the current API health status.

### Vehicle Validation

`POST /api/v1/vehicle`

Currently validates vehicle request data through Zod.

Vehicle database persistence will be implemented during the Core Build phase.

## Environment Setup

Create a local `.env` file based on `.env.example`.

Required variables:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=
```

Never commit `.env` or database credentials.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run tests:

```bash
npm test -- --run
```

## Database

Prisma is used as the ORM with PostgreSQL.

Migration files are stored under:

```text
prisma/migrations/
```

Generated Prisma client files under `src/generated/prisma/` should not be manually edited.

## API Documentation

Swagger API documentation is available at:

`/api/docs`

## Branch Strategy

Development work should not be pushed directly to `main`.

Use a dedicated feature branch for development.

Example:

```text
feature/vehicle-service
```

Changes should go through a Pull Request before merging into `main`.

## Commit Convention

Use clear and descriptive commit messages.

Examples:

```text
feat: add vehicle validation
test: add vehicle validation tests
fix: handle invalid vehicle request
docs: update backend setup instructions
refactor: improve vehicle controller structure
```

## Definition of Done

A task is considered complete when:

* Implementation matches the committed requirement.
* Code follows the agreed module boundaries.
* Required validation is implemented.
* Tests pass.
* API integration is verified.
* Documentation is updated when required.
* Changes are committed to the appropriate feature branch.
* Pull Request is ready for review.
