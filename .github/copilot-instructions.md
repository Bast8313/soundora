
# Copilot Coding Agent Instructions for Soundora

## 🏗️ Architecture Overview

- **Frontend**: Angular 17+ SPA (`soundora-frontend/`)
  - Uses standalone components, RxJS for async flows, Angular HttpClient for all API calls
  - Services in `src/app/services/` (e.g., ProductService, AuthService) encapsulate API logic
  - State is local to services/components (no NgRx/global state)
  - UI components in `src/app/components/`
  - All user-facing text in French; code/comments in English

- **Backend**: Node.js/Express (`soundora-backend/`)
  - MVC: `routes/api.js` → controllers in `controllers/` → Supabase (PostgreSQL)
  - Auth via Supabase Auth + JWT (see `config/supabase.js`)
  - Stripe for payments (see `controllers/orderController.js`, `config/stripe.js`)
  - All API routes prefixed with `/api/`
  - Middlewares for auth/validation in `middleware/`

- **External Services**:
  - **Supabase**: Auth & DB
  - **Stripe**: Payments & webhooks
  - **Docker**: Local dev/deployment (`docker-compose.yml`)

## 🚦 Developer Workflows

- **Install dependencies:**
  - Backend: `cd soundora-backend && npm install`
  - Frontend: `cd soundora-frontend && npm install`
- **Start servers:**
  - Backend: `node server.js` (port 3010)
  - Frontend: `ng serve --port 4200`
- **Build frontend:** `npm run build` (in `soundora-frontend/`)
- **Run tests:** `npm run test` (frontend)
- **Lint:** `npm run lint` (frontend)
- **Generate Angular code:**
  - Component: `ng generate component components/your-component`
  - Service: `ng generate service services/your-service`

## 📐 Project-Specific Conventions

- **API URLs**: Hardcoded in Angular services; update in one place if backend URL changes
- **No global state lib**: State is local to services/components
- **Component styles**: Use component-scoped CSS; global styles in `src/styles.css`
- **No separate admin app**: Backoffice features are part of main UI
- **Data flow**: Angular Service → Backend API → Controller → Supabase/Stripe
- **Models/types**: Keep backend and frontend models in sync

## 🔗 Integration Points

- **Supabase**: Auth & DB (`soundora-backend/config/supabase.js`)
- **Stripe**: Payments/webhooks (`soundora-backend/controllers/orderController.js`, `soundora-backend/config/stripe.js`)
- **Docker**: Local dev/deployment (`documentation/docker-compose.yml`)

## 🗂️ Key Files & Directories

- `soundora-backend/server.js`: Backend entry point
- `soundora-backend/controllers/`: API logic (auth, products, orders, etc.)
- `soundora-backend/routes/api.js`: Main API router
- `soundora-frontend/src/app/services/`: Angular services
- `soundora-frontend/src/app/components/`: Angular UI components
- `soundora-frontend/README.md`: Frontend-specific docs
- `README.md`: Project overview/setup
- `documentation/diagrammes/diagramme-architecture-soundora.md`: Architecture diagrams
- `documentation/docs/documentation_api.md`: API reference

## 🧠 AI Agent Guidance

- Follow the Angular service/component pattern for new features
- Add new API endpoints by creating a controller in `controllers/` and a route in `routes/api.js`
- Reference `documentation/` for business logic, UI flows, and technical guides
- Use French for all user-facing text; code and comments in English
- For onboarding, see `documentation/GUIDE-DEMARRAGE-RAPIDE.md` and architecture diagrams

---
For more, see `README.md` and `documentation/`.
