# ABC Group CPS Client

Next.js App Router client for the ABC Group Central Procurement System Phase 1 admin workspace.

## Stack

- Next.js App Router and React
- TypeScript
- Tailwind CSS
- Typed API client through Next.js route handlers
- httpOnly session cookie for the service JWT
- Vitest for frontend policy tests

## Local setup

1. Start the service from `../cps-service` with its Docker Compose stack.
2. Copy `.env.example` to `.env.local` if the service is not using the default URL.
3. Install and run the client:

```bash
npm install
npm run dev
```

The client runs on `http://localhost:3000` by default. The service URL is configured with `CPS_API_URL` and defaults to `http://localhost:3000`.

For local development, the service development seed provides:

- Email: `admin@cps.local`
- Password: `ChangeMe123!`

Do not use development credentials outside local development.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Architecture

- `src/app`: routes, layouts, API route handlers, and middleware.
- `src/components`: reusable UI and application shell components.
- `src/features`: reserved for larger domain-specific client features.
- `src/lib/api`: typed service API access and query functions.
- `src/lib/auth`: session context and authentication state.

The browser never receives the service JWT directly. Next.js route handlers store it in an httpOnly cookie and proxy authenticated service requests through `/api/cps/*`.
