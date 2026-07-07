# MAP UI Implementation Guidance

| Field | Value |
|-------|-------|
| **Document** | MAP UI Implementation Guidance |
| **Version** | 1.0 |
| **Date** | June 2026 |
| **Status** | Official |

---

## 1. React Component Structure

### Directory Layout

```
src/
├── components/          # Shared components
│   ├── ui/              # Primitive components (Button, Input, Card)
│   ├── layout/          # Layout components (Sidebar, Header, Container)
│   ├── data/            # Data components (DataTable, Charts)
│   └── feedback/        # Feedback components (Toast, Alert, Modal)
├── features/            # Feature modules
│   ├── dashboard/
│   ├── projects/
│   ├── discovery/
│   ├── validation/
│   ├── reports/
│   ├── governance/
│   └── admin/
├── hooks/               # Custom hooks
├── lib/                 # Utilities, API clients
├── styles/              # Global styles, Tailwind config
└── types/               # TypeScript types
```

### Component Organization

- **`components/ui/`** contains reusable primitive components with no business logic
- **`components/layout/`** contains structural components for page layout
- **`components/data/`** contains components that render and manipulate data
- **`components/feedback/`** contains components that communicate status to users
- **`features/`** contains feature-specific modules with their own components, hooks, and types
- Each feature module follows the same internal structure: `components/`, `hooks/`, `types/`

---

## 2. Component Naming Conventions

### General Rules

| Element | Convention | Example |
|---------|-----------|---------|
| **Components** | PascalCase | `DataTable`, `UserProfile` |
| **Feature-Prefixed** | Module + Component | `DashboardCard`, `MigrationList` |
| **Hooks** | `use` prefix + PascalCase | `useValidation`, `useProjects` |
| **Types/Interfaces** | PascalCase with `Type` suffix or plain interface | `ProjectType`, `ValidationResult` |
| **Utility Functions** | camelCase | `formatDate`, `calculateProgress` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |

### File Naming

- Component files: `PascalCase.tsx` (e.g., `DataTable.tsx`, `Button.tsx`)
- Hook files: `usePascalCase.ts` (e.g., `useValidation.ts`)
- Type files: `PascalCase.types.ts` or `types.ts` per feature
- Utility files: `camelCase.ts` (e.g., `formatDate.ts`)

### Export Patterns

- Named exports preferred: `export function DataTable() {}`
- Default exports only for page-level components (route components)
- Barrel exports via `index.ts` files for clean import paths

---

## 3. CSS Architecture

### Primary Approach: Tailwind CSS

- All styling via Tailwind utility classes directly in JSX
- Consistent spacing, typography, and color via design tokens
- No separate CSS files for component styling

### CSS Modules (Exceptions)

Use CSS Modules only for:

- Complex animations with keyframes
- Third-party component overrides
- Global layout rules that cannot be expressed as utilities

### CSS Variables for Design Tokens

Define all design tokens as CSS custom properties in `src/styles/variables.css`:

```css
:root {
  --color-primary-500: #0078d4;
  --color-primary-600: #106ebe;
  --color-success-500: #107c10;
  --color-warning-500: #ffb900;
  --color-error-500: #d13438;
  --spacing-unit: 4px;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --radius-md: 0.375rem;
}
```

### Prohibitions

- **No inline styles** (except dynamic values computed at runtime)
- **No CSS-in-JS libraries** (no styled-components, no Emotion)
- **No !important** declarations
- **No magic numbers** — all values from the design token system

---

## 4. Tailwind Configuration

### Theme Extension

Extend the default Tailwind theme in `tailwind.config.ts` with MAP design tokens:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f4fd',
          100: '#c5e1f5',
          200: '#9ecdef',
          300: '#6fb3e5',
          400: '#4a9fdb',
          500: '#0078d4', // MAP primary
          600: '#106ebe',
          700: '#005a9e',
          800: '#004578',
          900: '#003052',
        },
        semantic: {
          success: '#107c10',
          warning: '#ffb900',
          error: '#d13438',
          info: '#0078d4',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Cascadia Code', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
      },
    },
  },
  plugins: [],
}

export default config
```

### Custom Utilities

Define MAP-specific utility classes via Tailwind's `@layer utilities` in `src/styles/utilities.css`:

```css
@layer utilities {
  .card-shadow {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }
  .card-shadow-hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}
```

### Dark Mode Preparation

- Add `darkMode: 'class'` to Tailwind config
- Define dark mode color tokens in CSS variables
- **Not implemented in MVP** — prepare infrastructure for Phase 2

---

## 5. State Management

### React Query (Server State)

- All API calls managed via React Query hooks
- Automatic caching, refetching, and error handling
- Query keys follow convention: `['resource', identifier]`

```typescript
// Example
const { data, isLoading } = useQuery({
  queryKey: ['projects', projectId],
  queryFn: () => fetchProject(projectId),
})
```

### React Context (App State)

Use React Context sparingly for:

- Authentication state (user session, permissions)
- Theme preferences (future dark mode)
- Global UI state (sidebar collapse, modal stack)

### URL State (Filters & Pagination)

- Store filter parameters, sort order, and pagination in URL query params
- Enables shareable links and browser history navigation
- Use `useSearchParams` from React Router

### Local State (Component UI)

- `useState` for simple component state (open/closed, selected item)
- `useReducer` for complex local state machines
- Keep state as close to where it is used as possible

---

## 6. Reusable Component Strategy

### Atomic Design

Follow atomic design methodology for component hierarchy:

| Level | Description | Examples |
|-------|-------------|----------|
| **Atoms** | Smallest building blocks | Button, Input, Badge, Icon, Label |
| **Molecules** | Combinations of atoms | FormField (Label + Input + Message), SearchBar (Input + Button) |
| **Organisms** | Complex UI sections | DataTable, Sidebar, Header, CardGroup |
| **Templates** | Page-level layouts | DashboardLayout, FormLayout, ListLayout |
| **Pages** | Templates with real content | DashboardPage, ProjectListPage |

### Compound Components

Use compound components for complex UI patterns that need flexible composition:

```typescript
// Example: Compound Modal
<Modal>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
```

### Render Props

Use render props when components need to expose internal state or logic to consumers:

```typescript
// Example: Data fetcher with render prop
<DataFetcher url="/api/projects">
  {(data, isLoading, error) => (
    // Consumer controls rendering
  )}
</DataFetcher>
```

### Hooks for Logic Reuse

Extract reusable logic into custom hooks:

| Hook | Purpose |
|------|---------|
| `usePagination` | Pagination state and navigation |
| `useDebounce` | Debounced input values |
| `useLocalStorage` | Persistent local state |
| `useMediaQuery` | Responsive breakpoint detection |
| `useToast` | Toast notification triggers |
| `useModal` | Modal open/close state |
