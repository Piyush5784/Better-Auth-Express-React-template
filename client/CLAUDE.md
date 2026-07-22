# Client App - Vite + React + TanStack Router

## ⚠️ Important Rules

**NEVER run destructive terminal commands without explicit user permission:**

- ❌ No `rm`, `rm -rf`, `mv`, `cp`, or file deletion commands
- ❌ No folder restructuring or moving files without asking first
- ❌ No bulk operations on directories
- ✅ Ask first before ANY file system modifications via terminal
- ✅ Use Read/Write/Edit tools for code changes only

## Router Migration

This app uses TanStack Router instead of React Router.

### Route Structure

- Folder-based routes in `src/routes/`
- Route files: `auth/Login/index.tsx`, `auth/register/index.tsx`, `dashboard/index.tsx`
- Routes: `/auth/Login/`, `/auth/register/`, `/dashboard/`
- Layouts can use pathless routes with `_` prefix if needed

### Key Files

- `__root.tsx` - Root route with QueryClient & ThemeProvider
- `index.tsx` - Landing page (/)
- `auth/` - Auth routes (login, register)
- `dashboard/` - Dashboard routes

## Development

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```
