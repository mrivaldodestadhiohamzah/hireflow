# HireFlow

## AI-Powered Applicant Tracking System

HireFlow is an independent portfolio project exploring a thoughtful recruiting workflow: applicant intake, job management, interview coordination, an auditable candidate pipeline, and AI-assisted resume review. It is intentionally designed so the human recruiter remains responsible for every decision.

## What is included

- Public landing page and candidate-facing open-role board.
- Responsive recruiter demo workspace at `/demo` with dashboard, jobs, interviews, candidate search, filters, stage transitions, activity history, and meaningful empty/error feedback.
- Candidate details with transparent AI-assisted matching guidance and a recruiter-facing disclaimer.
- Next.js health/data routes: `/api/health` and `/api/dashboard`.
- FastAPI matching service with a provider-neutral, no-credential demo fallback.
- ASP.NET Core 8 / EF Core / PostgreSQL service foundation with health check, Swagger, CORS policy, and initial jobs/candidates endpoints.
- Docker Compose stack and GitHub Actions validation workflow.

## Architecture

```text
Next.js web (public site + recruiter workspace)
              | REST / JWT in a full deployment
ASP.NET Core API + EF Core ---- PostgreSQL
              | structured resume/job request
FastAPI analysis service ---- optional LLM provider adapter
```

The running UI is deliberately self-contained with fictional demo data, so it remains useful when the database or AI provider is unavailable. The service folders are the deployment-ready separation point for live persistence, authentication, uploads, and provider-backed analysis.

## Tech stack

| Area | Technology |
| --- | --- |
| Web | Next.js 15, TypeScript, React 19, Tailwind CSS, Lucide |
| API foundation | ASP.NET Core 8, Entity Framework Core, PostgreSQL, Swagger/OpenAPI |
| AI | Python 3.13, FastAPI, Pydantic |
| Delivery | Docker Compose, GitHub Actions |

## Local development

Prerequisites: Node.js 22+, Docker Desktop for the complete stack, and .NET 8 SDK if you wish to run the API outside Docker.

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Open `http://localhost:3000` for the public site or `http://localhost:3000/demo` for the recruiter walkthrough.

Run checks:

```bash
npm run test
npm run build
```

For containers:

```bash
docker compose up --build
```

The API Swagger UI is at `http://localhost:8080/swagger`, the API health endpoint is `/health`, and the AI health endpoint is `http://localhost:8000/health`.

## Environment variables

Copy `.env.example`; do not commit local environment files. `JWT_SECRET` must be replaced by a long random production secret. An LLM API credential, if used, must remain server-side and be injected only into the AI service.

## Demo credentials

The current polished interface is an open, seeded showcase rather than a live identity system. Planned seeded accounts for the API-backed version are:

| Role | Email | Password |
| --- | --- | --- |
| Recruiter | `morgan.reed@hireflow.demo` | `DemoRecruiter!2026` |
| Interviewer | `ravi.shah@hireflow.demo` | `DemoInterviewer!2026` |
| Candidate | `maya.chen@hireflow.demo` | `DemoCandidate!2026` |

These are fictional demo-only identities, never production credentials.

## API documentation

Swagger is enabled by the ASP.NET API at `/swagger`. The service currently exposes health, jobs listing/creation, and candidates listing routes. The intended API surface is documented by the product architecture and should be expanded with JWT/refresh-token authentication, role policies, uploads, applications, interview feedback, activity logging, migrations, and tests before a public production deployment.

## Security considerations

- The UI makes no employment decision and excludes protected characteristics from matching guidance.
- The FastAPI demo fallback does not call external providers or persist submitted resume text.
- Production CORS origins are explicit through `AllowedOrigins`.
- Secrets belong in host/deployment variables, not code or client bundles.
- Before public deployment, add JWT validation, hashed passwords, refresh-token rotation, upload malware/type/size controls, authorization integration tests, and database migrations.

## CI/CD

GitHub Actions runs web tests/build, compiles the ASP.NET API, and verifies Docker builds for every push and pull request. Deployment should be configured as a protected follow-on job with the relevant provider secrets.

## Deployment

Recommended production split: Vercel for the Next.js app, Render/Fly.io/Azure Container Apps for the API and AI containers, and a managed PostgreSQL provider such as Neon or Supabase. Set the web API URL, API allowed origin, database connection string, JWT secret, and AI service URL in those providers. Configure an HTTPS health check for each service before announcing a public URL.

## Current limitations

This repository is not yet publicly deployed or published because this environment has no configured GitHub/deployment credentials and no installed .NET SDK. The demo UI works locally; the persistent auth/database workflow remains the clear next implementation milestone rather than something this README claims is complete.
