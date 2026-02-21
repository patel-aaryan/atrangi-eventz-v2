# GitHub Copilot Instructions for Atrangi Eventz

## Tech Stack

- Next.js 14+ (App Router), TypeScript, Tailwind CSS
- shadcn/ui, Framer Motion
- PostgreSQL (Neon), Redis (Upstash)

## Component Architecture

### Organization

1. **Page-Specific** (`src/components/[page-name]/`) - Used on one page only
2. **Shared** (`src/components/`) - Used across multiple pages
3. **UI Primitives** (`src/components/ui/`) - shadcn/ui components (add via CLI only)

### Guidelines

- **Naming**: kebab-case files (`hero-section.tsx`), PascalCase components (`HeroSection`)
- **Structure**: Use `'use client'` only when needed, define prop interfaces
- **Styling**: Tailwind utilities, mobile-first, consistent spacing (`p-4`, `gap-6`, `mt-8`)
- **Animations**: Framer Motion for all animations, use declarative `motion` components
- **Exports**: Create `index.ts` for page-specific component folders

#### Component Structure

```typescript
'use client'; // Only if needed (for interactivity/hooks)

import { motion } from 'framer-motion';
// Other imports...

interface ComponentNameProps {
  // Props definition
}

export function ComponentName({ ...props }: ComponentNameProps) {
  return (
    // TSX
  );
}
```

#### Animation Guidelines

- Use Framer Motion for all animations
- Prefer declarative animations with `motion` components
- Common animation patterns:

  ```typescript
  // Fade in
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >

  // Slide in from bottom
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >

  // Stagger children
  <motion.div
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
      }
    }}
  >
  ```

### Layout Conventions

- Use consistent section structure:
  ```typescript
  <section className="container mx-auto px-4 py-16">
    <div className="max-w-7xl mx-auto">
      {/* Content */}
    </div>
  </section>
  ```

### Creating New Components

#### When to create a page-specific component:

- Component is only used on one page or feature area
- Place in `src/components/[page-name]/[component-name].tsx`
- Export from `src/components/[page-name]/index.ts`

#### When to create a shared component:

- Component is used on 2+ pages
- Component is part of the site-wide UI (header, footer, etc.)
- Place in `src/components/[component-name].tsx`

#### When to add to ui folder:

- Never manually add; only use `shadcn` CLI to add components
- Command: `npx shadcn@latest add [component-name]`

### TypeScript Guidelines

- Always define prop interfaces
- Use `type` for simple types, `interface` for objects that may be extended
- Prefer explicit types over `any`
- Use proper typing for event handlers and callbacks

### Import Order

1. React and Next.js imports
2. Third-party libraries (framer-motion, etc.)
3. Internal components and utilities
4. Types
5. Styles (if any)

### Best Practices

- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks
- Use server components by default; add `'use client'` only when needed
- Prefer composition over prop drilling
- Use semantic HTML elements
- Ensure accessibility (ARIA labels, keyboard navigation, etc.)
- Optimize images with Next.js `Image` component
- Use environment variables for configuration

## Backend Architecture

### Infrastructure

- **Database**: PostgreSQL (hosted on Neon)
- **Cache**: Redis (hosted on Upstash)
- **API**: Next.js API Routes (App Router)

### API Flow & Layer Architecture

The backend follows a clean architecture pattern with clear separation of concerns:

```
React Component → API Client → API Route → Service → Repository → Database/Cache
```

#### 1. **API Client Layer** (`src/lib/api/`)

- Abstract functions that components call to interact with the backend
- Handles fetch requests to API routes
- Centralizes API communication logic
- Example:
  ```typescript
  // src/lib/api/users.ts
  export async function getUser(id: string) {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  }
  ```

#### 2. **API Routes** (`src/app/api/`)

- Act as **controllers** in the MVC pattern
- Handle HTTP requests and responses
- Validate inputs and authentication
- Call corresponding services
- Return proper HTTP status codes
- Example structure:
  ```typescript
  // src/app/api/users/route.ts
  export async function GET(request: Request) {
    // 1. Validate input
    // 2. Call service
    // 3. Return response
  }
  ```

#### 3. **Service Layer** (`src/server/services/`)

- Contains **business logic**
- Orchestrates data operations
- Handles complex operations and transformations
- Calls repositories for data access
- Example:
  ```typescript
  // src/server/services/user.service.ts
  export class UserService {
    async getUserProfile(id: string) {
      // Business logic here
      const user = await userRepository.findById(id);
      // Transform, validate, etc.
      return user;
    }
  }
  ```

#### 4. **Repository Layer** (`src/server/repositories/`)

- Handles **data access** (database queries, cache operations)
- Separated by data source:
  - `postgres/` - PostgreSQL database queries
  - `redis/` - Redis cache operations
- Provides abstraction over data sources
- Example:
  ```typescript
  // src/server/repositories/postgres/user.repository.ts
  export class UserRepository {
    async findById(id: string) {
      // Database query
    }
  }
  ```

### Backend Best Practices

#### API Routes (Controllers)

- Keep routes thin - delegate logic to services
- Validate all inputs before processing
- Use proper HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Return consistent error responses
- Use proper status codes:
  - 200: Success
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 500: Internal Server Error

#### Services

- Contain all business logic
- Should be testable independently
- Can call multiple repositories
- Handle data transformation and validation
- Throw meaningful errors

#### Repositories

- Single responsibility: data access only
- No business logic
- Return raw data or null/undefined
- Use prepared statements/parameterized queries
- Handle database-specific errors

#### API Client Functions

- One function per API endpoint
- Handle common errors (network, parsing)
- Type the return values
- Keep functions simple and focused

### Error Handling Pattern

```typescript
// API Route
try {
  const result = await service.method();
  return Response.json(result);
} catch (error) {
  console.error(error);
  return Response.json({ error: "Error message" }, { status: 500 });
}
```

### File Naming Conventions

- API clients: `[resource].ts` (e.g., `users.ts`, `events.ts`)
- Services: `[resource].service.ts` (e.g., `user.service.ts`)
- Repositories: `[resource].repository.ts` (e.g., `user.repository.ts`)
