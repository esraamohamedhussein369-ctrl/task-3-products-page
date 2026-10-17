# Task 3 — Products Page

Responsive beauty-store product listing inspired by the supplied Figma screenshot. Built with React, TypeScript, TanStack React Query, Tailwind CSS, and a shadcn/ui-style `Card` component.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Included
- Product listing from DummyJSON API with server-side `limit` / `skip` pagination
- Debounced keyword search using the API search endpoint
- TanStack Query caching, stable query keys, loading/error/empty states, and retry
- Product detail route `/products/:id`, fetched by ID
- Responsive layout based on the provided Crystal cosmetics-shop reference
- Accessible labels, semantic sections, image alt text, reduced-motion support, and basic SEO metadata

## Notes
- The API's available categories differ from the cosmetic labels in the reference design. The category chips use DummyJSON keyword search so they remain connected to live API data.
- The `src/components/ui/card.tsx` file supplies the Card component API used by the page. It is intentionally lightweight so this project runs without a shadcn CLI setup.
