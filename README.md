# Product Dashboard

A single-page application built for users to browse, filter, search, and manage products. Built with React, Vite, TypeScript, and React Query.

---

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Install & Run

```bash
# 1. Unzip and enter the project
unzip product-dashboard.zip
cd product-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Login Credentials

Username - admin
Password - password123

Username1 - thomas
Password1 - frontend2024

Username2 - ops
Password2 - ops1234

### Core
- **`/products`** — Paginated product list (10 per page) with skeleton loading states
- **`/product/:id`** — Full product detail page with image gallery
- **Search** — Debounced text search via dummyjson search API
- **Filters** — Category (from API), brand (derived client-side), price range
- **Sort** — Newest / oldest by `meta.createdAt`
- **Error states** — Retry buttons, empty states with contextual messaging
- **Loading states** — Skeleton rows on list, full-page spinner on detail

### Stretch Goals (all implemented)
- **Add Product form** — Modal with full client-side validation (required fields, min length, positive price). POST to dummyjson `/products/add`. Query cache invalidated on success.
- **Brand chart** — Bar chart (Recharts) showing product count per brand, top 8 brands
- **Auth mock** — Fake login with username/password validation, token stored in sessionStorage, protected routes
- **Tests** — RTL + Vitest covering: utils, ProductTable (render, click, keyboard, stock states), Pagination (disabled states, page change), FiltersContext (set/reset, page reset on filter change), AuthContext (login/logout), AddProductModal (validation, ESC close)

### State management: Two React Contexts
- **`AuthContext`** — Manages auth state (user, token). Persisted to `sessionStorage` so the user stays logged in on page refresh within the session.
- **`FiltersContext`** — Manages all filter state (search, category, brand, price range, sort order) and current page. Centralised so any component can read or update filters without prop drilling. Page resets to 1 automatically whenever any filter changes — preventing the UX issue of being on page 3 and changing a filter to a result set with only 1 page.

### Data fetching: React Query
- `staleTime: 5 minutes` — Product list data doesn't need to refetch on every navigation. Avoids unnecessary API calls while keeping data reasonably fresh.
- `refetchOnWindowFocus: true` — Meets the brief's requirement explicitly.
- `placeholderData: (prev) => prev` — Keeps the previous page's data visible while the next page loads, preventing a jarring flash to empty/loading state on pagination.
- Separate query for all products (for brand derivation and chart) with `staleTime: 10 minutes` — this is a heavier call so it caches longer.
- Query keys are centralised in `queryKeys.ts` so invalidation is consistent and there's one source of truth.

### API strategy
- Text search and category filter are handled server-side via dummyjson's endpoints (`/products/search?q=` and `/products/category/:slug`).
- Brand filter is applied client-side since the API doesn't support it natively. For a production app with large datasets this would move server-side.
- Price range is also client-side for the same reason.

### Styling: CSS Modules
- No CSS-in-JS library — zero runtime overhead, full TypeScript class name checking with CSS Modules.
- Design tokens in `:root` on `index.css` ensure every component uses the same colour, spacing, and radius values.
- Dark-mode only — matches the "operations tool" context where a dark interface reduces eye strain during long sessions.

### Accessibility
- All interactive table rows have `role="button"`, `tabIndex={0}`, `aria-label`, and keyboard handlers for Enter and Space.
- Form controls all have associated `<label>` elements, either visible or `sr-only`.
- Error messages use `role="alert"` for screen reader announcement.
- Empty and loading states use `role="status"` and `aria-live`.
- Pagination uses `aria-current="page"` on the active page and `aria-label` on all navigation buttons.
- Images have meaningful `alt` text; decorative elements are `aria-hidden`.

## What I'd Do Next With More Time

1. **Virtualised table rows** — For very large datasets (1000+ rows), use `@tanstack/react-virtual` to only render visible rows, reducing DOM nodes and improving scroll performance.

2. **Infinite scroll option** — Give users the choice between paginated view and infinite scroll for different workflows.

3. **Server-side brand and price filters** — Move client-side filters to query params so results are accurate across the full dataset, not just the current page.

4. **Product edit and delete** — Full CRUD using dummyjson's PUT/DELETE endpoints with optimistic updates: update the cache immediately, revert on error.

5. **Column visibility and custom sorting** — Let users toggle which table columns are visible and click column headers to sort by that field.

6. **Persistent filter state** — Sync filter state to URL search params (`?search=laptop&category=electronics`) so users can share filtered views and the browser back button works as expected.

7. **Real auth** — Replace the mock with a proper JWT flow, refresh token rotation, and httpOnly cookie storage.

8. **E2E tests** — Add Cypress or Playwright tests covering the full login → filter → click → detail flow across real API responses.

9. **Error monitoring** — Integrate Sentry for production error tracking with React Error Boundaries at the route level.

10. **Storybook** — Document all UI primitives (Badge, Spinner, EmptyState, etc.) in Storybook for team reference and visual regression testing.