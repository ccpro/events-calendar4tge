<!-- BEGIN:nextjs-agent-rules -->

## 🚨 Crucial Next.js Context

- **Next.js Version:** Next.js 16.x (App Router).
- **Local Docs:** Do not rely on your pre-trained knowledge if it conflicts with the local framework documentation. Read the bundled framework documentation inside `node_modules/next/dist/docs/` or `.next-docs/` before implementing framework APIs.
      <!-- END:nextjs-agent-rules -->

## 📁 Project Architecture & Boundaries

```text
├── src/
│   ├── app/                 # Next.js App Router (All routing lives here)
│   │   ├── api/             # Route Handlers (Backend API)
│   │   │   └── [route]/
│   │   │       └── route.ts # API Route entry point
│   │   ├── layout.tsx       # Root/Nested Layouts
│   │   └── page.tsx         # Page definitions
│   ├── components/          # Reusable UI Components (Atomic design)
│   ├── hooks/               # Custom React Hooks
│   ├── lib/                 # Core utilities, API clients, and DB adapters
│   │   └── api/             # Shared API fetching logic and SDK wrappers
│   └── types/               # Global TypeScript Type definitions
```

## 🛠️ Tech Stack & Dependencies

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict Mode Enforced)
- **Styling:** CSS
- **Validation:** Zod (Required for all input validation)
- **State/Data Fetching:** TanStack React Query or native `fetch`

## 💻 Core Development Commands

- **Dev Server:** `npm run dev` (Runs on `localhost:3000`)
- **Build Project:** `npm run build`
- **Linting:** `npm run lint`
- **Type Checking:** `npx tsc --noEmit`

## 🏗️ Technical Conventions

### 1. Component Rules

- **Server Components:** Default to React Server Components (RSC) for all layout and page layouts.
- **Client Components:** Use `"use client"` ONLY when incorporating interactivity (e.g., hooks like `useState`, `useEffect`, or event listeners).
- **Styling:** Use utility-first Tailwind classes. Avoid inline styles or CSS modules unless strictly necessary.

### 2. TypeScript & Type Safety

- Avoid `any`. Use exact types or `unknown` with type guards.
- Use explicit return types for all public-facing API utility functions and custom hooks.
- Prefer `interface` for structural object definitions and `type` for unions/primitives.

### 3. API Route Handlers (`src/app/api/...`)

- **File Naming:** All API endpoints must be named `route.ts` inside a nested path directory.
- **Typing:** Use Next.js native types (`NextRequest`, `NextResponse`) for request and response handling.
- **Validation:** Explicitly validate incoming `req.json()` payloads or search params using a Zod schema before processing. Return a `400 Bad Request` on failure.
- **Error Handling:** Wrap endpoint logic in `try/catch` blocks. Return uniform JSON error payloads: `{ error: string, code?: string }`.
- **Database/Services:** Do not write raw database or complex business logic inside `route.ts`. Import service functions from `@/lib/` or `@/services/`.

## ⛔ Negative Constraints & Boundaries

- **DO NOT** mix client-side data fetching directly inside Server Components.
- **DO NOT** install new NPM packages without explicit human verification.
- **DO NOT** bypass Zod validation for API route mutations (`POST`, `PUT`, `PATCH`).

## 🛡️ Permissions & Approvals

- **Human Approval Required:** Destructive operations, editing `.env.example`, database schema migrations, and upgrading core dependencies.
- **Autonomous Allowed:** Creating components, writing API route handlers, creating unit tests, and fixing lint errors.
