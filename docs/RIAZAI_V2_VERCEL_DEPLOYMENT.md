# RiazAI V2 — Vercel Deployment Preparation

## 1. Frontend Framework

| Property | Value |
|----------|-------|
| Framework | React 19 (Create React App 5) |
| Styling | Tailwind CSS 3.4 |
| Routing | React Router DOM 7.13 (BrowserRouter) |
| Language | JavaScript (JSX) |
| Package Manager | npm |

## 2. Build Configuration

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `build/` |
| Development server | `npm start` (port 3000) |
| Test command | `npm test` |

The project uses Create React App's default build pipeline with `react-scripts build`.

## 3. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_BASE_URL` | Yes (production) | Backend API base URL, e.g. `https://api.riazai.com` |
| — | — | Falls back to `http://localhost:8080` in development |

### Setting on Vercel

1. Go to **Project Settings → Environment Variables**
2. Add `REACT_APP_API_BASE_URL`
3. Set value to the deployed backend URL (e.g. `https://riazai-backend.railway.app`)
4. Apply to **Production**, **Preview**, and **Development** environments

### Local Development

```bash
cp .env.example .env.local
# Edit .env.local with your local backend URL
```

`.env.local` is gitignored and will not be committed.

## 4. Backend API Requirement

The frontend requires a running Spring Boot backend with:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/analyse` | POST | Audio file upload → F0 analysis |
| `/api/health` | GET | Backend health check |

The backend runs independently and is **NOT** deployed to Vercel. It must be hosted separately (e.g. Railway, Render, Fly.io, or a VPS).

### Backend Deployment

The Spring Boot backend (`Spring-boot&Maven/`) is a standalone Java application:

```bash
# Build
./mvnw package -DskipTests

# Run
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

The backend listens on port 8080 by default.

## 5. CORS Configuration

The backend CORS is configured in `WebConfig.java` with these defaults:

```
http://localhost:3000      (CRA dev server)
http://localhost:3001      (alternative dev port)
https://riazai.vercel.app  (production Vercel)
```

For Vercel preview deployments or a different production domain, set the `ALLOWED_ORIGINS` environment variable on the **backend server**:

```bash
ALLOWED_ORIGINS=https://riazai.vercel.app,https://riazai-abc123.vercel.app
```

Comma-separated list of allowed origins. When set, this overrides the defaults.

## 6. React Router / SPA Fallback

The application uses `BrowserRouter` with these client-side routes:

| Route | Component |
|-------|-----------|
| `/` | Landing page |
| `/dashboard` | Dashboard |
| `/analyse` | Audio analysis |
| `/sessions` | Session history |
| `/analytics` | Analytics |
| `/goals` | Goals (placeholder) |
| `/journal` | Journal (placeholder) |
| `/coach` | Coach (placeholder) |
| `/profile` | Profile (placeholder) |
| `/settings` | Settings (placeholder) |

### SPA Fallback (vercel.json)

A `vercel.json` rewrite rule ensures direct navigation to any route serves `index.html`:

```json
{
  "rewrites": [
    {
      "source": "/((?!assets/|.*\\..*).*)",
      "destination": "/index.html"
    }
  ]
}
```

This rewrites all requests that don't match static assets or files with extensions to `index.html`, allowing React Router to handle client-side routing.

## 7. Vercel Project Settings

When creating or configuring the Vercel project:

| Setting | Value |
|---------|-------|
| Framework Preset | Create React App |
| Root Directory | `ReactApp/myappvercel` |
| Build Command | `npm run build` |
| Output Directory | `build` |
| Install Command | `npm install` |
| Node.js Version | 18+ (default) |

### Important: Root Directory

The React app is nested inside `ReactApp/myappvercel/`. In Vercel project settings, set the **Root Directory** to `ReactApp/myappvercel` so the build runs from the correct location.

## 8. Local Development Setup

```bash
# 1. Navigate to the React app
cd ReactApp/myappvercel

# 2. Install dependencies
npm install

# 3. Create local environment file
cp .env.example .env.local

# 4. Edit .env.local
#    Set REACT_APP_API_BASE_URL=http://localhost:8080

# 5. Start the dev server
npm start
```

The React dev server runs at `http://localhost:3000` and proxies API requests to the backend at the configured URL.

## 9. Production Deployment Steps

### Frontend (Vercel)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set **Root Directory** to `ReactApp/myappvercel`
4. Add environment variable `REACT_APP_API_BASE_URL` with the backend URL
5. Deploy (automatic on push to main branch)

### Backend (Separate Host)

1. Build: `./mvnw package -DskipTests`
2. Deploy the JAR to your chosen host
3. Set `ALLOWED_ORIGINS` to include the Vercel domain
4. Verify `GET /api/health` returns `{"status":"ok"}`

### Post-Deployment Verification

1. Visit `https://<your-vercel-domain>/` — Landing page loads
2. Navigate to `/analyse` — Analysis page renders
3. Click through all routes — no 404s
4. Upload a WAV file — backend analysis returns real F0 metrics
5. Check Sessions — analysis session saved correctly
6. Check Analytics — session data appears

## 10. Known Deployment Limitations

### Current Limitations

1. **WAV-only backend** — The backend only supports WAV format. MP3/FLAC/OGG uploads will trigger demo fallback. Frontend accepts all formats but backend only processes WAV.
2. **No authentication** — The backend API is open. Anyone with the URL can upload files.
3. **No database** — Sessions are stored in browser localStorage only. Clearing browser data loses history.
4. **Single backend instance** — No load balancing or scaling configured.
5. **30-second timeout** — Analysis requests timeout after 30 seconds (configurable in `api.js`).
6. **10 MB file limit** — Maximum upload size is 10 MB (configurable in `audioConfig.js`).

### Architecture

```
Vercel (Frontend)          Separate Host (Backend)
┌──────────────────┐       ┌──────────────────────┐
│ React + Tailwind │──────▶│ Spring Boot          │
│ (SPA on CDN)     │ POST  │ REST API             │
│                  │ /api/  │ F0 Analysis (YIN)    │
│ localStorage     │       │ WAV Processing       │
│ (sessions)       │       │                      │
└──────────────────┘       └──────────────────────┘
```

The F0 analysis engine remains on the Spring Boot backend. It is NOT moved to Vercel serverless functions.

## 11. Files Changed for Deployment Preparation

| File | Change |
|------|--------|
| `.env.example` | **Created** — Documents required environment variable |
| `vercel.json` | **Created** — SPA rewrite rule for React Router |
| `.gitignore` | **Updated** — Added `.env` to ignored files |
| `WebConfig.java` | **Updated** — Configurable CORS via `ALLOWED_ORIGINS` env var |

## 12. Manual Steps Required Before Deploy

1. **Set `REACT_APP_API_BASE_URL`** on Vercel to point to the deployed backend
2. **Set `ALLOWED_ORIGINS`** on the backend to include the Vercel domain
3. **Deploy the Spring Boot backend** to a hosting provider
4. **Verify CORS** by checking that `POST /api/analyse` works from the Vercel frontend
5. **Test WAV upload** end-to-end from the deployed frontend
