# HireFlow

## AI-Powered Applicant Tracking System

HireFlow is an independent portfolio project exploring a thoughtful recruiting workflow: applicant intake, job management, interview coordination, an auditable candidate pipeline, and AI-assisted resume review. It is intentionally designed so the human recruiter remains responsible for every decision.

## Live Demo

[https://hireflow-zeta-eight.vercel.app](https://hireflow-zeta-eight.vercel.app)

## GitHub Repository

[https://github.com/mrivaldodestadhiohamzah/hireflow](https://github.com/mrivaldodestadhiohamzah/hireflow)

## What is included

- Public landing page and candidate-facing open-role board.
- Responsive recruiter demo workspace at `/demo` with dashboard, jobs, interviews, candidate search, filters, stage transitions, activity history, and meaningful empty/error feedback.
- Candidate details with transparent AI-assisted matching guidance and a recruiter-facing disclaimer.
- Next.js status routes: `/api/health` and `/api/dashboard` (the latter describes the browser-local demo data boundary rather than returning shared metrics).
- FastAPI matching service with a provider-neutral, no-credential demo fallback.
- ASP.NET Core 8 / EF Core / PostgreSQL service foundation with health check, Swagger, CORS policy, and initial jobs/candidates endpoints.
- Docker Compose stack and GitHub Actions validation workflow.

## Screenshots

The public [landing page](https://hireflow-zeta-eight.vercel.app) and [recruiter demo workspace](https://hireflow-zeta-eight.vercel.app/demo) are the current, interactive product previews. Static screenshots have not been committed, so the README does not present stale visuals as the product evolves.

## Architecture

```text
Next.js web (public site + recruiter workspace)
              | REST / JWT in a full deployment
ASP.NET Core API + EF Core ---- PostgreSQL
              | structured resume/job request
FastAPI analysis service ---- optional LLM provider adapter
```

The running UI is deliberately self-contained so it remains useful when the database or AI provider is unavailable. The deployed demo uses browser-local account and workspace storage scoped by normalized account email; it does not claim to be production authentication. The service folders are the deployment-ready separation point for live persistence, authentication, uploads, and provider-backed analysis.

## Tech stack

| Area | Technology |
| --- | --- |
| Web | Next.js 15, TypeScript, React 19, Tailwind CSS, Lucide |
| API foundation | ASP.NET Core 8, Entity Framework Core, PostgreSQL, Swagger/OpenAPI |
| AI | Python 3.13, FastAPI, Pydantic |
| Delivery | Docker Compose, GitHub Actions |

## Project structure

```text
src/                 Next.js public site, demo workspace, and demo API routes
services/api/        ASP.NET Core / EF Core service foundation
services/ai/         FastAPI, provider-neutral matching service
.github/workflows/   Continuous-integration workflow
```

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

## Demo mode

The recruiter workspace is a clearly labeled browser-local demo. The dedicated fictional showcase account is:

| Email | Password |
| --- | --- |
| `demo@hireflow.app` | `HireFlowDemo2026!` |

Registration creates a local account record with a one-way password hash, and login restores that account's session. Workspace records are stored under an email-scoped key, so a newly registered user starts with empty candidates, jobs, interviews, activity, team, and settings rather than inheriting showcase content. The showcase seed is available only to the built-in demo account.

## Testing

The following checks have been run locally:

- `npm run test` — 2 Vitest checks passed.
- `npm run lint` — passed.
- `npm run build` — passed.
- `python -m compileall -q services/ai` — passed.
- .NET 8.0.424 restore and Release build of `services/api/HireFlow.Api.csproj` — passed.

The ASP.NET project currently has no test project, so `dotnet test` has no test cases to execute. Docker Desktop is not installed in the current environment; the Compose configuration has not been run locally.

## API documentation

Swagger is enabled by the ASP.NET API at `/swagger`. The service currently exposes health, jobs listing/creation, and candidates listing routes. The intended API surface is documented by the product architecture and should be expanded with JWT/refresh-token authentication, role policies, uploads, applications, interview feedback, activity logging, migrations, and tests before a public production deployment.

## Security considerations

- The UI makes no employment decision and excludes protected characteristics from matching guidance.
- The FastAPI demo fallback does not call external providers or persist submitted resume text.
- Production CORS origins are explicit through `AllowedOrigins`.
- Secrets belong in host/deployment variables, not code or client bundles.
- Before public deployment, add JWT validation, hashed passwords, refresh-token rotation, upload malware/type/size controls, authorization integration tests, and database migrations.

## Docker

`docker compose up --build` is provided for local multi-service development. Docker execution was not verified in the current environment because Docker Desktop is unavailable.

## CI/CD

GitHub Actions runs web tests/build, compiles the ASP.NET API, and verifies Docker builds for every push and pull request. Deployment should be configured as a protected follow-on job with the relevant provider secrets.

## Deployment

The Next.js public site and seeded recruiter demo are deployed to Vercel at [hireflow-zeta-eight.vercel.app](https://hireflow-zeta-eight.vercel.app). The GitHub repository is connected to the Vercel project.

The ASP.NET Core API, PostgreSQL database, and FastAPI service are not deployed. A practical next split is Render/Fly.io/Azure Container Apps for the API and AI containers, plus managed PostgreSQL (Neon or Supabase). Configure the web API URL, API allowed origin, database connection string, JWT secret, and AI service URL before enabling persistent workflows.

## Known limitations

The deployed site is a polished browser-local portfolio demo. Candidate data, pipeline changes, jobs, team changes, settings, and activity persist per local account in that browser. This is not a replacement for server-side authentication: passwords are only hashed for the local demo account registry, and there is no cross-device sync, database persistence, refresh-token rotation, file upload, or live API/AI integration in the public demo.

## Future improvements

- Deploy the API, AI service, and managed PostgreSQL database.
- Add migrations, seeded API data, JWT/refresh-token flows, and role authorization tests.
- Add secure resume uploads and end-to-end application/interview workflows.
