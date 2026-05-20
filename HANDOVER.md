# Talleem Frontend Handover

## Project Summary

Talleem is a React/Vite dashboard application for managing educational and Quran-learning operations. The application includes authentication, role and permission-aware navigation, bilingual Arabic/English UI, CRUD management pages, import/export flows, notifications, join requests, Quran segmentation tools, and static Quran font/data assets.

The frontend talks to a REST API through Axios and uses TanStack React Query for server state. Local user/session state is stored with Zustand.

## Tech Stack

- React 19 with Vite 7
- React Router 7
- TanStack React Query 5
- Zustand for persisted auth/user state
- i18next/react-i18next for localization
- Tailwind CSS 4 through the Vite plugin
- React Hook Form with Yup validation
- Axios for API calls
- React Select and async paginate selects
- React Toastify for success/error feedback
- sql.js plus Quran database/font assets for Quran-related views

## Repository Structure

```text
src/
  api/
    axiosInstance.js       API clients, auth/language interceptors, error normalization
    endpoints.js           API route constants and React Query key constants
    hooks/                 React Query hooks per domain
    services/              Axios service modules per domain
    handler.js             Toast success/error handlers
  assets/                  Bundled app fonts
  components/
    auth/                  Login UI
    common/                Shared inputs, buttons, table cells, modals, maps
    layout/                Navbar, sidebar, protected layout
    quran/                 Quran page rendering components
  pages/                   Feature pages, mostly CRUD modules
  routes/                  Protected route setup and route map
  utils/
    constants/             Role, permission, config, and option constants
    helpers/               Shared data, form, date, async select, and Quran helpers
    hooks/global/          Shared React Query, table, pagination, filtering hooks
    stores/                Zustand stores
    yup/                   Validation schemas per feature
public/
  locales/                 Translation files loaded by i18next
  data/                    Quran data and SQL databases
  fonts/                   Quran page fonts
```

## Environment Variables

Create or update `.env` with:

```env
VITE_API_BASE_URL=https://api-tallam.vocus-dev2.com/api/v1/dashboard
VITE_API_BASE_URL_FRONT=https://api-tallam.vocus-dev2.com/api/v1/front
```

If these are not set, `src/api/axiosInstance.js` falls back to the same production-like URLs above.

## Install And Run

```bash
npm install
npm run dev
```

The dev server is configured in `package.json` to run on port `5000`.

Useful scripts:

```bash
npm run dev      # start local Vite server
npm run build    # production build
npm run lint     # run ESLint
npm run preview  # preview built app
```

## Application Flow

1. `src/main.jsx` mounts the React app and initializes i18n.
2. `src/App.jsx` wraps the app with React Query, React Query Devtools, BrowserRouter, ToastContainer, and routes.
3. `src/routes/AppRoutes.jsx` exposes `/login` publicly and wraps the rest of the app in `ProtectedRoute` plus `Layout`.
4. `src/routes/routes.jsx` defines the protected page routes.
5. `src/utils/stores/user.store.js` persists the authenticated user and access token in local storage under `tallam-user-storage`.
6. `src/api/axiosInstance.js` attaches `Authorization` and `Accept-Language` headers to API requests. A `401` clears the stored user.

## API Pattern

Most features follow this shape:

```text
src/api/endpoints.js
src/api/services/<feature>.service.js
src/api/hooks/use<Feature>.js
src/pages/<feature>/
  <Feature>.jsx
  Create*.jsx
  Edit*.jsx
  Delete*.jsx
  View*.jsx
  Form*.jsx
  Filters.jsx
  configs.jsx
src/utils/yup/<feature>.schemas.js
```

Typical responsibilities:

- `endpoints.js`: stores REST URL constants and cache keys.
- `services/*.service.js`: performs Axios calls.
- `hooks/use*.js`: wraps service calls in React Query hooks and invalidates related cache keys.
- `pages/*/configs.jsx`: table columns, labels, form options, and action config.
- `pages/*/Form*.jsx`: React Hook Form UI, usually backed by Yup schemas.

When adding a new CRUD module, copy the closest existing module with the same behavior, then update endpoint constants, service methods, React Query hooks, page route, sidebar entry, validation schema, and translation keys.

## Authentication And Permissions

Auth is handled through `useUserStore`:

- `setUser(user, access_token)` stores the session.
- `clearUser()` logs out locally.
- `hasRole(role)` checks normalized roles.
- `can(resource, action)` checks normalized permissions and lets `super_admin` bypass checks.
- `hasPermission(permission)` supports legacy permission strings.

`ProtectedRoute` currently only checks whether the user is authenticated. Fine-grained permission checks are handled in components through helpers such as `Can`, `usePermission`, and store methods.

## Localization

Localization is configured in `src/i18n.js`.

- Supported languages: `ar`, `en`
- Default/fallback: Arabic from local storage if available, otherwise `ar`, with fallback language `en`
- Translation files live in:
  - `public/locales/ar/translation.json`
  - `public/locales/en/translation.json`

Axios sends the active language as `Accept-Language`, so backend messages can also be localized.

## Forms And Validation

Forms generally use React Hook Form and Yup:

- Shared RHF helpers: `src/utils/hooks/global/useRFH.jsx`
- Shared input components: `src/components/common/inputs/`
- Yup schemas: `src/utils/yup/`
- Form data helpers: `src/utils/helpers/global.fns.js`

File upload/create/update endpoints often use `prepareFormData` and `multipartFormData`.

## Tables, Filters, And Pagination

Reusable table and filter logic lives in:

- `src/components/common/table/Table.jsx`
- `src/components/common/table/cells/`
- `src/utils/hooks/global/useTable.jsx`
- `src/utils/hooks/global/usePagination.jsx`
- `src/utils/hooks/global/useFiltering.jsx`
- `src/utils/hooks/global/useQueryConfig.jsx`

Feature pages usually define table columns and actions in their local `configs.jsx`.

## Quran Features

Quran-specific screens are available at routes such as:

- `/q/u/r/a/n`
- `/quran-segmentation`
- `/suggested-exam-templates`

Important assets:

- `public/data/surah_combined.json`
- `public/data/q_lines.db`
- `public/data/q_glyph.db`
- `public/data/juz_pages.json`
- `public/fonts/p*.ttf`
- `public/fonts/surah-name-v4.ttf`
- `public/fonts/header_surah.ttf`

Be careful when changing public font/data assets because Quran rendering depends on exact glyph and page resources.

## Deployment

The app is Vite-based and includes `vercel.json`, so it is likely intended for Vercel/static deployment. Build with:

```bash
npm run build
```

The deploy output is `dist/`.

## Known Risks And Maintenance Notes

- The repo currently has no test script; validation is mainly `npm run lint` and `npm run build`.
- `ProtectedRoute` accepts `requiredPermissions` but does not use it to block access yet.
- Several modules are generated or pattern-heavy; prefer following an existing nearby module instead of inventing new architecture.
- `src/api/endpoints.js` contains many constants and should be kept in sync with service and hook modules.
- Some naming is inconsistent, such as `quoran-parts`, `attendances-types`, and `essionModes.service.js`; preserve existing route/API compatibility unless there is a coordinated backend and navigation change.
- React Query Devtools are mounted in `App.jsx`; confirm whether this should remain enabled in production builds.
- `.env` exists in the repo. Avoid committing real secrets or environment-specific private URLs.

## New Developer Checklist

1. Install dependencies with `npm install`.
2. Confirm `.env` points to the correct dashboard and front API base URLs.
3. Run `npm run dev` and open `http://localhost:5000`.
4. Log in with a valid backend account.
5. Check language switching and route access for the target role.
6. Before shipping, run `npm run lint` and `npm run build`.
7. For new features, add/update translation keys in both Arabic and English files.
8. For API changes, update endpoint constants, service calls, query hooks, and cache invalidation together.

## Quick Feature Addition Recipe

For a new CRUD resource:

1. Add API URLs and API key in `src/api/endpoints.js`.
2. Add a service file under `src/api/services/`.
3. Add React Query hooks under `src/api/hooks/`.
4. Add a Yup schema under `src/utils/yup/`.
5. Add a page folder under `src/pages/` using an existing module as a template.
6. Register the route in `src/routes/routes.jsx`.
7. Add sidebar/navigation config if needed.
8. Add translation keys to both locale files.
9. Run lint/build and manually test list, create, edit, delete, filters, and permissions.
