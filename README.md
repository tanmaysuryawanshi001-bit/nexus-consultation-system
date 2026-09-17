# ConnecT — Nexus Consultation System

ConnecT is a full-stack consultation marketplace that helps clients discover verified experts in career, education, and personal growth, then book a one-hour consultation. Consultants can create a profile with their expertise, rate, experience, biography, category, and skills.

## Live application and source code

- **Live frontend:** [nexus-consultation-system.vercel.app](https://nexus-consultation-system.vercel.app)
- **GitHub repository:** [tanmaysuryawanshi001-bit/nexus-consultation-system](https://github.com/tanmaysuryawanshi001-bit/nexus-consultation-system)

## Features

- Landing page with calls to find a consultant or join as an expert.
- Registration and login for clients and consultants.
- JWT-based authentication.
- Consultant discovery with category filters for career, education, and personal growth.
- Search across consultant names, headlines, biographies, and skills.
- Verified-consultant filtering and rating-based ordering.
- Consultant application/profile form.
- Booking modal with session date/time and discussion notes.
- Automatic booking price calculation from hourly rate and duration.
- Responsive navigation and responsive card layout for desktop and mobile screens.
- Vercel single-page-application rewrite so React Router routes work after refresh.
- Branded catch-all 404 page for unknown frontend routes.
- Short-lived in-memory server-side caching for public consultant searches.
- API 404 responses and a centralized Express error handler.
- Helmet security headers and authentication rate limiting.

## Technology stack

### Frontend

- **React 19** — component-based UI and state management with `useState` and `useEffect`.
- **Vite** — fast development server and production bundler.
- **React Router** — client-side routes for `/`, `/find-consultants`, `/become-a-consultant`, and `/login`.
- **Axios** — HTTP client configured with a reusable API instance, base URL, credentials, and an authorization interceptor.
- **Tailwind CSS 4** — utility-first styling configured through `@import "tailwindcss"` and custom theme tokens.
- **PostCSS and Autoprefixer** — CSS processing and browser compatibility.
- **Lucide React** — installed for icon support; the current UI also uses Material Symbols class names.

### Backend

- **Node.js** — server runtime.
- **Express 5** — HTTP server, JSON parsing, route mounting, and request handling.
- **MySQL** — relational persistence for users, consultant profiles, specializations, and bookings.
- **mysql2/promise** — promise-based MySQL connection pool and parameterized queries.
- **bcryptjs** — one-way password hashing and password verification.
- **jsonwebtoken** — signing and verifying bearer tokens.
- **CORS** — controls which browser origins may call the API.
- **dotenv** — loads configuration from environment variables.
- **Nodemon** — development-time automatic server restart.

`helmet`, `express-rate-limit`, and `zod` appear in `backend/package.json`, but the current source does not yet register Helmet headers, rate-limit middleware, or Zod request schemas. They should not be considered active protections until they are added to the application.

## Architecture

```text
React/Vite frontend
        |
        | Axios requests to /api/v1
        v
Express API
  | auth routes/controllers
  | consultant routes/controllers
  | booking routes/controllers
  | JWT middleware
        |
        v
MySQL connection pool
```

The frontend is deployed on Vercel. The backend is a separate Node process and connects to MySQL using environment-based configuration. The API defaults to `http://localhost:5001/api/v1` when `VITE_API_URL` is not supplied.

## Project structure

```text
.
├── backend/
│   ├── src/app.js                    Express entry point and middleware
│   ├── src/config/db.js              MySQL connection pool
│   ├── src/controllers/              Authentication, consultant, and booking logic
│   ├── src/middleware/authMiddleware.js  JWT bearer-token guard
│   ├── src/routes/                   API route definitions
│   └── package.json
├── frontend/
│   ├── src/App.jsx                   React router and page composition
│   ├── src/components/Navbar.jsx     Navigation and sign-out UI
│   ├── src/pages/                    Home, login, discovery, and application pages
│   ├── src/services/api.js            Axios client and API methods
│   ├── src/index.css                  Tailwind theme and global styles
│   ├── vite.config.js
│   ├── vercel.json                   SPA fallback rewrite
│   └── package.json
├── Local MySQL.session.sql            Example local inspection queries
├── Railway Cloud MySQL.session.sql   Example cloud inspection queries
└── seed-sample-consultants.sql       Repeatable seed for two demo consultants
```

## API endpoints

The backend mounts its routes below `/api/v1`.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/` | No | Health check |
| POST | `/auth/register` | No | Create an account and return a JWT |
| POST | `/auth/login` | No | Verify credentials and return a JWT |
| GET | `/consultants` | No | List verified consultants; accepts `category` and `search` query parameters |
| POST | `/consultants/apply` | Bearer JWT | Create a consultant profile and specializations |
| POST | `/bookings` | Bearer JWT | Create a confirmed booking |

The frontend API service also contains methods for `/auth/me`, `/auth/logout`, consultant details/profile updates, booking lists, and booking status updates. Those client methods currently have no matching backend routes in this repository, so they are future-facing and should be implemented or removed before use.

## Authentication flow

1. A user submits the registration or login form.
2. The backend validates required fields and looks up the email with a parameterized query.
3. Registration hashes the password with bcrypt; login compares the supplied password against the stored hash.
4. The API signs a JWT containing the user ID, email, and role, with a seven-day expiry.
5. The frontend stores the token and user summary in `localStorage`.
6. Axios reads the token for each request and sends it as `Authorization: Bearer <token>`.
7. Protected routes verify the token before calling the controller.

## Booking and consultant logic

- Only consultant profiles with `is_verified = TRUE` are returned by the discovery query.
- Category matching uses an `EXISTS` subquery against specializations.
- Search uses parameterized `LIKE` expressions against name, headline, biography, and skill tag.
- Results are grouped and ordered by average rating descending.
- Booking creation looks up the consultant’s hourly rate, calculates `hourly rate × duration / 60`, and stores the booking as `confirmed`.
- The current UI always sends a 60-minute duration, although the backend accepts a `durationMinutes` value.

## Local development

### Prerequisites

- Node.js 18+ recommended.
- MySQL 8+ (or a compatible MySQL service).
- A database named `connect_db` with the tables expected by the controllers: `users`, `consultant_profiles`, `specializations`, and `bookings`.

### Install dependencies

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Configure the backend

Create `backend/.env` and provide real local or hosted database values. Do not commit this file.

```env
PORT=5001
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=replace-with-a-secret
DB_NAME=connect_db
JWT_SECRET=replace-with-a-long-random-secret
```

The code currently falls back to development defaults when variables are absent. Those defaults are convenient locally but must be replaced in any deployed environment.

### Run the applications

In one terminal:

```bash
cd backend
npm run dev
```

In another terminal:

```bash
cd frontend
npm run dev
```

For the deployed frontend, set `VITE_API_URL` to the deployed backend base URL, including `/api/v1`.

### Production build and checks

```bash
cd frontend
npm run lint
npm run build
```

Start the backend with `npm start` from `backend/`.

## Safety and security features

### Implemented

- **Password hashing:** passwords are stored as bcrypt hashes, never as plaintext.
- **Parameterized SQL:** user input is passed as query parameters, reducing SQL-injection risk.
- **JWT expiry:** tokens expire after seven days.
- **Bearer-token protection:** consultant application and booking creation require a valid JWT.
- **Invalid-token handling:** missing, malformed, invalid, and expired tokens receive `401` or `403` responses.
- **Generic login failure:** unknown emails and incorrect passwords return the same message, reducing account-enumeration detail.
- **CORS allowlist:** known production and local origins are listed, with Vercel preview domains supported.
- **Credentialed requests:** the Axios client and CORS configuration explicitly coordinate cross-origin requests.
- **Verified-provider gate:** public discovery excludes consultant profiles that are not marked verified.
- **Required-field checks:** registration, login, and booking controllers reject incomplete required input.
- **Client-side loading states:** submit buttons are disabled during authentication, consultant application, and booking requests to reduce duplicate submissions.
- **Security headers:** Helmet is enabled for the Express API.
- **Authentication throttling:** login and registration requests are rate-limited to 100 requests per 15 minutes per client address.

### Caching and error handling

- `GET /api/v1/consultants` uses a 60-second in-memory cache keyed by the complete request URL, including search and category parameters. Responses expose `X-Cache: HIT` or `MISS` and a matching `Cache-Control` header.
- Consultant profile creation clears the cache so newly created data is not served after a stale entry remains.
- Unknown frontend paths render the custom `NotFound` page; unknown API paths return a JSON `404` response.
- Unexpected Express errors are logged server-side and return a generic `500` response without exposing internal error details.
- The cache is process-local: it resets on server restart and is not shared across multiple backend instances. A shared Redis/cache service is recommended when scaling horizontally.

### Lighthouse

Lighthouse targets are defined in `.lighthouserc.json` for the live home and consultant pages. To run a local report, start the Vite preview server after building and run:

```bash
npx lighthouse http://localhost:4173 --output=html --output-path=./lighthouse-report.html --chrome-flags="--headless"
```

The frontend also includes `npm run lighthouse` with the same command (Lighthouse must be available through `npx` or installed globally).

### Important limitations and recommended hardening

- **Token storage:** `localStorage` is vulnerable to token theft if an XSS vulnerability exists. Production deployments should consider secure, `HttpOnly`, `SameSite` cookies and a CSRF strategy.
- **JWT secret fallback:** the backend contains fallback secrets. Set a strong `JWT_SECRET` and fail startup when it is missing in production.
- **CORS wildcard behavior:** allowing every `*.vercel.app` origin is broader than necessary. Prefer a precise list of trusted deployment URLs.
- **Input validation:** add server-side Zod schemas or equivalent validation for lengths, email normalization, password policy, numeric ranges, dates, notes, and skills.
- **Authorization:** the middleware authenticates users but does not enforce role-specific permissions or ownership checks for every possible future endpoint.
- **Rate limiting and headers:** wire the already-installed `express-rate-limit` and `helmet` packages into the API, especially for login and registration.
- **Error exposure:** registration currently returns `error.message`; use a safe generic response in production and log diagnostic details privately.
- **Booking integrity:** validate that dates are in the future, duration is allowed, and the consultant is available; use transactions/constraints to prevent duplicate or conflicting bookings.
- **Transport security:** use HTTPS for both frontend and backend in deployment and protect database credentials through the hosting provider’s secret manager.
- **Secrets and files:** never commit `.env` files, database passwords, JWT secrets, or production credentials.

This project is an educational/prototype consultation platform and should receive a security review before handling sensitive personal data or real payments.

## Deployment notes

- **Frontend:** deploy `frontend/` to Vercel. `frontend/vercel.json` rewrites all paths to `index.html`, which supports browser refreshes on React Router routes.
- **Backend:** deploy `backend/` to a Node-compatible host such as Railway or another managed service.
- **Database:** configure a reachable MySQL instance and apply the project’s schema/migrations as appropriate. The checked-in SQL session files are inspection queries, not a complete schema migration.
- **Demo data:** run `seed-sample-consultants.sql` in Railway’s MySQL query console to add two verified demo consultants. The script is idempotent and uses unique demo IDs.
- **CORS:** update `allowedOrigins` in `backend/src/app.js` whenever the frontend domain changes.

## Contributing

1. Create a feature branch.
2. Keep secrets out of version control.
3. Run the frontend lint and production build before opening a pull request.
4. Describe API, database, and security implications in the pull request.

## License

No project license is currently declared. Add a `LICENSE` file before redistributing the project.
