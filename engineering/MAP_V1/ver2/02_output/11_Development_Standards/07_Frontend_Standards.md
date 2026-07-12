# MAP MVP Frontend Standards

| Field    | Value              |
| -------- | ------------------ |
| Document | MAP MVP Frontend Standards |
| Version  | 1.0                |
| Date     | July 2026          |
| Status   | Official           |

---

## 1. React

- Use **React 18+** for all frontend applications.
- Use **functional components only** — no class components in new code.
- Leverage **hooks** (`useState`, `useEffect`, `useContext`, `useMemo`, `useCallback`, `useRef`) for state and lifecycle management.
- Use custom hooks to extract and reuse component logic.
- Avoid inline styles; prefer Tailwind CSS utility classes or CSS modules.
- Use React.memo, useMemo, and useCallback judiciously — only when profiling shows a performance need.

## 2. Next.js

- Use **Next.js 14+** (App Router) when server-side rendering (SSR) or static site generation (SSG) is required.
- Prefer **React SPA** (Vite) for internal dashboards and admin tools where SEO and SSR are not needed.
- Use **React Server Components** for data fetching and rendering where client interactivity is not required.
- Co-locate page components, layouts, and route-specific logic within the `app/` directory.
- Use `loading.tsx`, `error.tsx`, and `not-found.tsx` for route-level UX states.

## 3. TypeScript

- Use **TypeScript in strict mode** across all frontend projects.
- **Never use `any`** — use `unknown` and narrow types with type guards.
- Prefer **`interface`** over `type` for object shapes (supports declaration merging and is more readable).
- Use **named exports** over default exports for better refactoring and tree-shaking.
- Define types in a centralized `types/` directory or co-located with the feature module.
- Use `as const` assertions and template literal types where applicable.

```typescript
interface MigrationRecord {
  id: string;
  sourceSystem: string;
  targetEnvironment: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
}
```

## 4. Tailwind CSS

- Use **Tailwind CSS** as the primary styling approach (utility-first).
- Define **design tokens** (colors, spacing, typography) in `tailwind.config.ts`.
- **No inline styles** — use Tailwind utility classes exclusively.
- Use **CSS Modules** for complex component-specific styles that cannot be expressed cleanly with utilities.
- Extend the default theme with MAP brand tokens:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1E40AF',
          secondary: '#3B82F6',
          accent: '#10B981',
        },
      },
    },
  },
};
```

## 5. State Management

| Concern            | Solution           | When to Use                              |
| ------------------ | ------------------ | ---------------------------------------- |
| Server State       | **React Query**    | API data fetching, caching, synchronization |
| Application State  | **React Context**  | Auth, theme, locale — low-frequency updates |
| Complex Client State | **Zustand**     | Multi-step workflows, complex UI state   |

- **Never store server/API state in local state management.** Use React Query.
- Keep Context providers thin — only for truly global, low-change state.
- Zustand preferred over Redux for its simplicity and minimal boilerplate.
- Persist UI state to URL params or localStorage when recovery on refresh is needed.

## 6. Forms

- Use **React Hook Form** as the default form library for performance and minimal re-renders.
- Use **Zod** schemas for validation logic shared between client and server.
- Choose **controlled** components when form state drives UI behavior; use **uncontrolled** for simple inputs.
- Centralize form validation schemas in a shared `schemas/` directory.
- Always provide clear, field-level error messages.

```typescript
import { z } from 'zod';

const migrationSchema = z.object({
  sourceSystem: z.string().min(1, 'Source system is required'),
  targetEnvironment: z.string().min(1, 'Target environment is required'),
  batchSize: z.number().int().positive().max(10000),
});
```

## 7. Validation

- Use **Zod schemas** as the single source of truth for validation rules.
- Validate on the **client** for immediate feedback and on the **server** for security.
- Derive TypeScript types from Zod schemas using `z.infer<typeof schema>` — never duplicate type definitions.
- Display **friendly, actionable error messages** — avoid exposing raw validation internals.
- Use toast notifications for non-field-specific errors (network failures, server errors).

## 8. Accessibility

- Target **WCAG 2.2 AA** compliance for all user-facing components.
- Use **semantic HTML** elements (`<nav>`, `<main>`, `<article>`, `<button>`, `<input>`) over generic `<div>`/`<span>`.
- Ensure full **keyboard navigation** — all interactive elements must be focusable and operable via keyboard.
- Use **ARIA attributes** only when semantic HTML is insufficient (e.g., `aria-label`, `aria-expanded`, `role`).
- Test with screen readers (NVDA, VoiceOver) and automated tools (axe-core, Lighthouse).
- Maintain visible focus indicators on all interactive elements.

## 9. Component Design

- Follow **Atomic Design** principles: Atoms → Molecules → Organisms → Templates → Pages.
- Use **compound components** for complex UI patterns (tabs, accordions, modals).
- Prefer **render props** or **custom hooks** to share behavior — avoid HOCs.
- Extract reusable logic into **custom hooks** (`useMigrationStatus`, `useValidation`).
- Keep components small, focused, and testable (single responsibility).
- Co-locate component files (component, styles, tests, types) in a single directory.

```
components/
├── MigrationCard/
│   ├── MigrationCard.tsx
│   ├── MigrationCard.test.tsx
│   ├── MigrationCard.styles.ts
│   └── types.ts
```

## 10. Recommended Libraries

| Category             | Library          | Purpose                              |
| -------------------- | ---------------- | ------------------------------------ |
| Data Fetching        | React Query (TanStack Query) | Server state management, caching, background sync |
| Forms                | React Hook Form  | Performant form handling             |
| Validation           | Zod              | Schema-based validation and type inference |
| HTTP Client          | Axios or fetch   | API communication                    |
| Date Handling        | date-fns         | Lightweight date manipulation        |
| Charts               | recharts         | Data visualization and dashboards    |
| UI Components        | Radix UI or shadcn/ui | Accessible headless primitives    |
| Icons                | Lucide React     | Consistent icon set                  |
| Animation            | Framer Motion    | Declarative animations and transitions |

## 11. Top 5 Frontend Frameworks

| Feature              | React             | Angular           | Vue               | Svelte            | SolidJS            |
| -------------------- | ----------------- | ----------------- | ----------------- | ----------------- | ------------------ |
| Type                 | Library           | Full framework    | Progressive framework | Compiler-based | Reactive library   |
| Bundle Size (min)    | ~42 KB            | ~143 KB           | ~33 KB            | ~2 KB             | ~8 KB              |
| Learning Curve       | Low-Medium        | High              | Low               | Low               | Low-Medium         |
| TypeScript Support   | Excellent         | Excellent         | Very Good         | Good              | Excellent          |
| Ecosystem Size       | Very Large        | Large             | Large             | Growing           | Small              |
| Performance          | Very Good         | Good              | Very Good         | Excellent         | Excellent          |
| Server-Side Rendering| Next.js           | Angular Universal | Nuxt              | SvelteKit         | SolidStart         |
| Component Model      | Functional + Hooks | Components + DI   | SFC + Composition | SFC + Reactivity  | Functional + Signals |
| Best For             | General purpose, large apps | Enterprise, large teams | Quick prototyping, SPAs | Small-medium apps, performance-critical | Performance-critical SPAs |

**Recommendation:** Use **React 18 + Next.js 14 (App Router)** for MAP frontend applications. React provides the largest ecosystem and talent pool, Next.js adds SSR/SSG capabilities for migration dashboards, and the combination pairs seamlessly with our TypeScript-first approach and Tailwind CSS styling system.
