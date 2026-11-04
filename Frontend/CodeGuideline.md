# Code Guideline

## Project Structure Overview

```
project-root/
  ├── i18n.config.json       # i18n manifest for supported locales and language metadata
  ├── public/
  │   └── locales/           # public/locales/{code}.json translation files
  ├── src/
  │   ├── components/        # All reusable UI components
  │   │   ├── ui/            # Prebuilt and custom UI components, grouped by function
  │   │   ├── ai/            # Ciudadan assistant (floating button + chat panel)
  │   │   ├── auth/          # Login/register modal
  │   │   ├── brand/         # Wordmark and brand marks
  │   │   ├── common/        # Cross-feature building blocks (hero, KPIs, badges, timeline…)
  │   │   ├── conversations/ # Conversation cards (Montería Habla)
  │   │   ├── initiatives/   # Initiative cards (Montería Hace)
  │   │   ├── layout/        # Navbar, mobile tab bar, footer
  │   │   ├── map/           # Leaflet map canvas, filters, legend, report popup
  │   │   ├── projects/      # Project cards (Montería Resuelve)
  │   │   └── citizen-reports/  # Report cards, list, timeline, feedback
  │   ├── context/           # React contexts (auth-context.tsx: mock citizen session)
  │   ├── data/              # Mock data separated from UI (categories, barrios, reports, …)
  │   ├── hooks/             # Custom React hooks
  │   │   └── queries/       # React Query hooks per domain (reports, content, stats)
  │   ├── i18n/              # i18n runtime: config.ts (entry) + util.ts (helpers)
  │   ├── layouts/           # Route layouts (site-layout.tsx)
  │   ├── lib/               # Utilities (format, validation schemas, navigation map)
  │   ├── pages/             # Application pages (each page in its own subdirectory)
  │   ├── services/          # Decoupled data layer (mock today, API-ready tomorrow)
  │   ├── types/             # Domain model shared by data, services and UI
  │   ├── App.tsx            # Main app component, sets up route providers
  │   ├── router.tsx         # Router config, sets up routing
  │   ├── main.tsx           # Entry point for the React app
  │   └── index.css          # Global styles and Montería Puede Más design tokens
  ├── package.json           # Project metadata and scripts
  ├── tailwind.config.ts     # Tailwind CSS configuration
  └── ...                    # Other config and lock files
```

> Backend-handoff temporary files (`scripts/`, `i18n.scan.json`, `reports/i18n/`, `docs/i18n-*.md`) are kept in the repo only until backend integration of i18n statistics/scan/auto-translate is complete. They are owned by the backend long-term and will be removed once integration lands. Treat them as read-only handoff copies — do not extend them.

## Directory Responsibilities

- **public/**: Static files served directly. Place images, icons, and robots.txt here.
- **public/locales/**: Translation files, one per language (`{code}.json`). Flat dotted keys (e.g. `home.hero.title`); the `fallbackLng` file is the structural source of truth.
- **i18n.config.json**: The lightweight i18n manifest for fallback language, language labels, browser detection aliases, and document direction. Single source of truth for the language list.
- **src/components/**: All UI components.  
  - **ui/**: Contains atomic and composite UI components.  
  - *Group related components into subdirectories if they share a domain or feature (e.g., `map/`, `citizen-reports/`, `ai/`). Never name a source folder `reports` — that path is git-ignored for the i18n backend handoff.*
  - Brand identity lives in `brand/` (wordmark) and design tokens in `src/index.css`.
- **src/context/**: React contexts. `auth-context.tsx` holds the citizen session (mock today) and the global login modal state.
- **src/data/**: Mock data, separated from the UI and typed by `src/types`. `media.ts` centralizes the Montería photography URLs.
- **src/hooks/**: Custom React hooks. Each file should export a single hook focused on one responsibility.  
  - **queries/**: React Query hooks grouped by domain (`use-reports`, `use-content`, `use-stats`).
- **src/layouts/**: Route-level layouts. `site-layout.tsx` composes navbar, content outlet, footer, mobile tab bar and the citizen assistant.
- **src/services/**: Decoupled data layer. Every screen talks to `services/*` (mock today); switching `API_MODE` in `api-client.ts` to `remote` and filling `request()` connects the real API without touching components. `map-provider.ts` abstracts the tile/marker provider (Leaflet today, Mapbox-ready).
- **src/types/**: The shared domain model (reports, projects, conversations, initiatives, citizen, stats).
- **src/lib/**: Utility functions and libraries that are not React components or hooks (`format.ts`, `validation.ts`, `navigation.ts`).
- **src/i18n/**: Two files only.
  - `config.ts` is the runtime entry: imports the manifest via `util.ts`, initializes i18next (HTTP backend, language detector, react binding), syncs `<html lang/dir>`, and re-exports the helpers. Importing this file for its side effect boots i18next.
  - `util.ts` holds pure helpers parsed from the manifest: `fallbackLng`, `supportedLngs`, `languageOptions`, `normalizeLanguage`, `getLanguageDirection`, plus types.
  - Components use the official `useTranslation()` from `react-i18next` directly; there is no project-specific `useT` wrapper.
- **src/pages/**: All route-level pages.  
  - *Each page should have its own subdirectory if it contains more than a single file or has related logic/components.*
- **src/App.tsx**: Sets up global providers.
- **src/router.tsx**: Sets up routing.
- **src/main.tsx**: Application entry point.

**Important:**
Whenever a new module (such as a component, hook, or utility) or a new page is added or removed, this document **must be updated immediately** to reflect the changes. Keeping this documentation up to date ensures that all collaborators have a clear understanding of the current project structure and its intended organization.

## How to Add New Code

### 1. Adding a New Page

- **Create a subdirectory under `src/pages/` for each new page.**
  - Example: For a "Dashboard" page, create `src/pages/dashboard/`.
- **Place the main page component as `index.tsx` inside the subdirectory.**
- **Add any page-specific components or logic in the same subdirectory.**
- **Register the new route in `src/router.tsx and generate a semantic name.**
  - Example:
    ```tsx
    import Dashboard from "./pages/dashboard";
    // ...
    {
      path: "/dashboard",
      name: 'dashboard',
      element: <Dashboard />
    }
    ```

### 2. Adding a New Component

- **If you are adding a group of related components, create a subdirectory (e.g., `form/`, `charts/`).**
- **If the component is only used by a specific page, place it in that page's subdirectory under `src/pages/`.**
- **Each component should be focused on a single responsibility.**
- **Small files (< 100 lines) are encouraged for a single component.**

### 3. Adding a New Hook

- **Create a new file in `src/hooks/` named after the hook (e.g., `use-feature.ts`).**
- **Each file should export only one hook.**
- **Hooks should be as small and focused as possible.**

### 4. Adding Utilities

- **Add utility functions to `src/lib/`.**
- **Group related utilities in the same file or subdirectory if needed.**

### 5. Adding or Updating Languages

- **Language metadata must go through `i18n.config.json`.**
- **Do not hardcode supported languages, labels, browser detection aliases, or RTL direction lists in `src/i18n/*.ts`.**
- **Locale content lives in `public/locales/{code}.json`** as flat dotted-key JSON; the `fallbackLng` file owns the canonical key set.
- **Runtime code reads the manifest only through `src/i18n/util.ts`.** Adding or removing a language means editing `i18n.config.json` plus the matching `public/locales/{code}.json`; nothing in `src/i18n/` needs to change.
- **Translations are read with the official `useTranslation()` from `react-i18next`.** No custom hook, no cast at call sites.

### 6. Consuming Data (mock today, API tomorrow)

- **Never import `src/data/*` from a component.** Screens consume `src/services/*` through the React Query hooks in `src/hooks/queries/`.
- **A new screen follows the same chain:** `types/` → `data/` (mock) → `services/` → `hooks/queries/` → `pages/`.
- **Switching to the real API** means setting `API_MODE = "remote"` in `src/services/api-client.ts` and completing `request()`; component code stays untouched.
- **Map work goes through `src/services/map-provider.ts`** for tiles, colors and bounds, and through `src/components/map/map-canvas.tsx` for markers, clusters and the location picker.

## Coding Best Practices

- **One module, one responsibility:**  
  Each file (component, hook, utility) should do one thing only.
- **High cohesion, low coupling:**  
  Keep related logic together and avoid unnecessary dependencies between modules.
- **Naming conventions:**  
  - Use `PascalCase` for components and page directories.
  - Use `camelCase` for hooks and utility functions.
  - Name page subdirectories and files after their route or feature.
- **Component structure:**  
  - Keep components small and focused.
  - Extract subcomponents if a component grows too large.
- **Page structure:**  
  - Place all logic, hooks, and components specific to a page in its subdirectory.
  - Only share code via `components/`, `hooks/`, or `lib/` if it is truly reusable.
- **Documentation:**  
  - Add comments for complex logic.
  - Document the purpose of each module at the top of the file if not obvious.

## Example: Adding a New "Profile" Page

1. **Create a directory:**  
   `src/pages/profile/`
2. **Add the main page component:**  
   `src/pages/profile/index.tsx`
3. **Add page-specific components:**  
   `src/pages/profile/ProfileHeader.tsx`, `src/pages/profile/ProfileDetails.tsx`
4. **Register the route in `App.tsx`:**
   ```tsx
   import Profile from "./pages/profile";
   // ...
   <Route path="/profile" element={<Profile />} />
   ```
5. **If you need a reusable button, add it to `src/components/ui/button.tsx`.**
