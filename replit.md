# ConnectSphere AI

A production-grade corporate intranet web application — the digital nerve center of a modern enterprise. Built as a frontend-only prototype with fully realistic mock data.

## Run & Operate

- Preview the app at the `/` path in the preview pane
- The app runs via the `artifacts/connectsphere: web` workflow (Vite dev server)
- No backend required — all data is local TypeScript mock data

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React + Vite + Tailwind CSS v4
- Routing: wouter
- Animations: Framer Motion
- Charts: Recharts
- Icons: Lucide React
- Theme: next-themes (dark/light)
- Forms: react-hook-form + zod
- UI Components: shadcn/ui

## Where things live

- `artifacts/connectsphere/src/` — all app source code
- `src/data/` — all mock data (employees, announcements, events, recognition, forum, leaderboard, analytics, leadership)
- `src/context/AuthContext.tsx` — auth state with role-based access (employee/admin/ceo)
- `src/context/ThemeContext.tsx` — next-themes wrapper
- `src/layouts/` — AppLayout (sidebar + navbar) and AuthLayout
- `src/components/layout/` — Sidebar, Navbar, MobileNav
- `src/components/common/` — GradientAvatar, StatCard, PageHeader, NotificationPanel, AIAssistant, etc.
- `src/pages/` — all 12 pages

## Pages

| Route | Page | Access |
|---|---|---|
| `/login` | Login | Public |
| `/` | Dashboard | All |
| `/announcements` | Announcements | All |
| `/directory` | Employee Directory | All |
| `/recognition` | Recognition Wall | All |
| `/leaderboard` | Leaderboard | All |
| `/events` | Events | All |
| `/knowledge` | Knowledge Hub | All |
| `/forum` | Forum | All |
| `/leadership` | Leadership | All |
| `/admin` | Admin Center | admin/ceo only |
| `/profile` | My Profile | All |

## Demo Accounts

Click any card on the login page to sign in instantly:
- **Employee** — Alex Rivera, Senior Engineer
- **HR Admin** — Michael Torres, HR Director (has Admin Center access)
- **CEO** — Sarah Chen, CEO (has Admin Center access)

## Architecture decisions

- Frontend-only: no API calls, all data is local TypeScript constants
- Role-based auth stored in localStorage via AuthContext
- Gradient avatars are deterministic from name — no external image services
- Dark/light mode with CSS custom properties, no flash on reload
- Framer Motion page transitions + staggered list animations throughout
- 600ms fake loading delay on every page to demonstrate skeleton loaders

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- All 12 pages use a 600ms loading delay on mount for skeleton demo purposes
- The AI Assistant (floating sparkle button, bottom-right) has pre-written mock responses
- Admin Center redirects non-admin users with an access denied screen
