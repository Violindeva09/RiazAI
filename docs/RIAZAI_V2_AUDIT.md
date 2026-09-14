# RiazAI V2 — Repository Audit

**Date:** 2026-09-12  
**Auditor:** AI Assistant  
**Purpose:** Document current state before incremental React + Tailwind frontend development

---

## 1. Repository Overview

The repository contains **three separate projects** at the root level:

```
RiazAI/
├── Spring-boot&Maven/          # Primary working prototype (Spring Boot 3.3.2, Java 17)
├── ReactApp/myappvercel/       # React scaffold (React 19, CRA) — not integrated
└── BackendRender/backendrender/ # Separate Spring Boot 4.0.3 experiment — unused
```

---

## 2. Spring-boot&Maven — Primary Working Prototype

### 2.1 Technology Stack
- **Java 17**
- **Spring Boot 3.3.2**
- **Maven** (wrapper not present; uses system Maven)
- **Thymeleaf** (server-side rendering)
- **JUnit 5 + AssertJ** (testing)

### 2.2 Source Structure
```
Spring-boot&Maven/
├── pom.xml
├── README.md
├── Project - RiazAI - Abstract.pdf
├── src/
│   ├── main/
│   │   ├── java/com/riazai/
│   │   │   ├── RiazAiApplication.java          # Entry point
│   │   │   ├── controller/PracticeController.java
│   │   │   ├── service/AudioAnalysisService.java
│   │   │   └── model/PerformanceMetrics.java   # record
│   │   ├── resources/
│   │   │   ├── templates/index.html            # Thymeleaf template
│   │   │   ├── static/css/styles.css           # Custom CSS
│   │   │   └── application.properties          # Multipart config
│   │   └── test/
│   │       └── java/com/riazai/service/AudioAnalysisServiceTest.java
├── target/                                     # Build output (ignored)
└── .gitignore
```

### 2.3 Entry Point
- `RiazAiApplication.main()` → SpringApplication.run()
- Runs on **port 8080** (default)
- Command: `mvn spring-boot:run`

### 2.4 API Contract (Current)

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| GET | `/` | — | `index.html` (Thymeleaf) |
| POST | `/analyse` | `multipart/form-data`<br>`audioFile` (required, audio/*) | `index.html` with `metrics` model attribute |

**PerformanceMetrics (JSON-equivalent):**
```json
{
  "accuracyPercentage": 72.45,
  "noteStability": 68.20,
  "consistencyScore": 70.65,
  "trendSeries": [58.65, 61.05, 63.45, 65.85, 68.25, 70.65],
  "personalisedFeedback": "Focus on slow alankar patterns..."
}
```

### 2.5 Working Functionality
✅ **Application starts** (`mvn spring-boot:run`)  
✅ **GET /** renders upload form  
✅ **POST /analyse** accepts audio file, returns metrics + feedback  
✅ **Validation:** empty file rejection, 10MB max upload  
✅ **Error handling:** catches `IllegalArgumentException`, `IOException`  
✅ **Unit tests:** 2 tests pass (`mvn test`)  
✅ **Thymeleaf UI:** clean, responsive, accessible  
✅ **CSS:** custom, modern, no framework dependency

### 2.6 Backend Limitations (Known & Acceptable for Prototype)
| Limitation | Status |
|------------|--------|
| No real pitch detection (heuristic on raw byte amplitude) | Documented, acceptable for MVP |
| No persistence (in-memory only) | By design for this stage |
| No authentication / user sessions | By design |
| No session history / analytics endpoints | Not yet implemented |
| Single-page Thymeleaf UI | To be replaced by React SPA |
| Trend data is synthetic (not historical) | By design |
| No CORS configuration (needed for React integration) | Must add before integration |

### 2.7 Files to Preserve (Do Not Delete)
| File | Reason |
|------|--------|
| `pom.xml` | Build configuration |
| `RiazAiApplication.java` | Entry point |
| `PracticeController.java` | Working REST endpoint |
| `AudioAnalysisService.java` | Core analysis logic (heuristic) |
| `PerformanceMetrics.java` | Data model (record) |
| `index.html` (Thymeleaf) | Fallback/demo UI |
| `styles.css` | Reference styling |
| `application.properties` | Multipart config |
| `AudioAnalysisServiceTest.java` | Regression safety |
| `.gitignore` | Correct Maven ignores |

---

## 3. ReactApp/myappvercel — React Scaffold

### 3.1 Technology Stack
- **React 19.2.4**
- **react-scripts 5.0.1** (Create React App)
- **react-router-dom 7.13.1** (installed, unused)
- **axios 1.13.6** (installed, unused)
- **Testing Library** (Jest + RTL)

### 3.2 Source Structure
```
ReactApp/myappvercel/
├── package.json
├── package-lock.json
├── README.md
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   ├── logo192.png
│   └── logo512.png
├── src/
│   ├── index.js          # Entry point
│   ├── index.css         # Minimal global styles
│   ├── App.js            # Counter demo (placeholder)
│   ├── App.css           # Unused
│   ├── App.test.js       # Default test
│   ├── setupTests.js     # Testing Library config
│   └── reportWebVitals.js
├── node_modules/         # Ignored
├── .gitignore
```

### 3.3 Current State
- **Default CRA scaffold** — no project-specific code
- `App.js` renders a simple counter (increment/decrement)
- No routing configured
- No API service layer
- No Tailwind CSS
- No component structure
- Build commands work: `npm start`, `npm run build`, `npm test`

### 3.4 Files to Preserve
| File | Reason |
|------|--------|
| `package.json` | Dependency manifest (will extend) |
| `public/index.html` | Template (will customize) |
| `public/manifest.json` | PWA config (keep) |
| `src/index.js` | Entry point (will extend) |
| `.gitignore` | Correct Node ignores |

### 3.5 Files to Replace/Remove
| File | Action |
|------|--------|
| `src/App.js` | Replace with new App shell + routing |
| `src/App.css` | Remove (Tailwind replaces) |
| `src/index.css` | Replace with Tailwind directives |
| `src/App.test.js` | Replace with real tests |
| `src/logo.svg` | Replace with RiazAI branding |
| `public/favicon.ico` | Replace with RiazAI favicon |

---

## 4. BackendRender/backendrender — Unused Experiment

### 4.1 Technology Stack
- **Spring Boot 4.0.3** (different major version)
- **Java 21** (different version)
- **Spring Data JPA** + **MySQL** (configured, unused)
- **Thymeleaf** (configured, unused)

### 4.2 Source Structure
```
BackendRender/backendrender/
├── pom.xml
├── mvnw, mvnw.cmd           # Maven wrapper
├── .mvn/wrapper/
├── HELP.md
├── .gitignore
├── src/
│   ├── main/
│   │   ├── java/com/riazai/backendrender/BackendrenderApplication.java
│   │   └── resources/application.properties (only spring.application.name)
│   └── test/
│       └── java/com/riazai/backendrender/BackendrenderApplicationTests.java
```

### 4.3 Status
- **No entities, repositories, controllers, services**
- Only default `@SpringBootApplication` and empty test
- Different Java/Spring version than primary project
- **No integration with primary project**

### 4.4 Recommendation
**Document and ignore.** Do not delete yet (preservation rule), but do not invest time. This is a separate experiment that was never developed.

---

## 5. React ↔ Spring Integration Strategy

### 5.1 Current Gap
- Spring runs on **port 8080** (Thymeleaf serves HTML)
- React dev server runs on **port 3000** (CRA default)
- **No CORS configuration** in Spring → React cannot call API from dev server
- Spring returns **HTML** (Thymeleaf), not JSON

### 5.2 Required Changes for Integration
| Change | Location | Priority |
|--------|----------|----------|
| Add CORS config | Spring `WebMvcConfigurer` | High |
| Change `/analyse` to return JSON | `PracticeController` | High |
| Keep Thymeleaf `GET /` as fallback | `PracticeController` | Medium |
| Add `/api` prefix for REST endpoints | New controller or refactor | Medium |
| Environment variable for API base URL | React `.env` | High |

### 5.3 Proposed API Contract (Post-Integration)
```
POST   /api/analyse          # multipart/form-data → JSON
GET    /api/sessions         # future
GET    /api/sessions/:id     # future
POST   /api/sessions         # future
GET    /api/analytics        # future
GET    /api/goals            # future
POST   /api/goals            # future
PUT    /api/goals/:id        # future
DELETE /api/goals/:id        # future
GET    /api/journal          # future
POST   /api/journal          # future
GET    /api/profile          # future
PUT    /api/profile          # future
GET    /api/settings         # future
PUT    /api/settings         # future
```

---

## 6. Frontend Problems to Solve

| Problem | Severity |
|---------|----------|
| No Tailwind CSS configured | High |
| No React Router configured | High |
| No component architecture | High |
| No API service layer | High |
| No design system / theme | High |
| Placeholder `App.js` | High |
| No responsive navigation/shell | High |
| No landing page | High |
| No dashboard, analysis, sessions, analytics, goals, journal, coach, profile, settings pages | High |
| No localStorage utilities | Medium |
| No demo data separation | Medium |
| No error boundary / loading patterns | Medium |
| No accessibility audit | Medium |

---

## 7. Backend Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| CORS not configured | Blocks React dev integration | Add `WebMvcConfigurer` bean |
| Controller returns HTML, not JSON | Breaks SPA pattern | Add `@RestController` or separate REST endpoints |
| No API versioning | Future breaking changes | Use `/api/v1/` prefix |
| Multipart parsing errors on large files | 500 errors | Already configured 10MB limit |
| Heuristic analysis produces nonsense for non-audio | Misleading results | Validate file type / content-type |
| No request validation beyond `@NotNull` | Bad input crashes | Add Bean Validation annotations |
| No logging / monitoring | Debugging difficult | Add SLF4J + structured logging |

---

## 8. Recommended Implementation Order

### Milestone 1: Audit & Documentation ✅ (This document)
### Milestone 2: React + Tailwind Foundation
1. Install Tailwind CSS v3 in `ReactApp/myappvercel`
2. Configure `tailwind.config.js`, `postcss.config.js`
3. Replace `src/index.css` with `@tailwind base/components/utilities`
4. Verify `npm start` works with Tailwind

### Milestone 3: Application Shell + Navigation
1. Create `src/components/layout/` (Sidebar, Header, Main, AppShell)
2. Create `src/components/navigation/` (NavLink, MobileMenu, DesktopSidebar)
3. Configure React Router v7 with routes for all 10 pages
4. Implement responsive sidebar (desktop) + drawer (mobile)
5. Add active route highlighting

### Milestone 4: Landing Page (`/`)
1. Hero, Problem/Solution, Features, How It Works, Preview, CTA, Footer
2. Use semantic HTML, accessible headings
3. Responsive: mobile-first, Tailwind breakpoints

### Milestone 5: Dashboard (`/dashboard`)
1. Greeting, today's summary, latest analysis cards
2. Metric cards (Accuracy, Stability, Consistency, Overall)
3. Recent sessions list (empty state)
4. Progress trend chart area (placeholder)
5. Practice streak, weekly goal progress
6. Quick action buttons → navigate to other pages

### Milestone 6: Analysis Workflow (`/analyse`)
1. **State 1:** Upload zone (drag/drop, file picker, format/size hints)
2. **State 2:** Analyzing (progress, loading message, animation)
3. **State 3:** Results (scores, feedback, interpretation, actions)
4. Integrate with `POST /api/analyse` when ready (mock first)

### Milestone 7: Sessions + Analytics
1. `/sessions` — search, filter, table/cards, empty state
2. `/analytics` — overview metrics, trend charts (lightweight lib if needed)
3. Use `data/demoData.js` for all content

### Milestone 8: Goals + Journal
1. `/goals` — CRUD UI, localStorage persistence
2. `/journal` — entry form, list, localStorage persistence

### Milestone 9: Profile + Settings
1. `/profile` — form, avatar placeholder
2. `/settings` — theme, notifications, instrument, reminders, reset demo data
3. localStorage persistence

### Milestone 10: Backend API Integration
1. Add CORS + REST endpoints to Spring
2. Create `src/services/api.js` with axios instance
3. Replace demo data with real API calls
4. Handle loading/error/success states globally

### Milestone 11: Polish, Responsiveness, Accessibility
1. Full responsive audit at all breakpoints
2. Accessibility audit (headings, labels, focus, contrast)
3. Cross-browser testing
4. Build optimization
5. Update README with exact run commands

---

## 9. Commands Reference

### Spring Backend (Primary)
```bash
cd Spring-boot&Maven
mvn spring-boot:run          # Runs on http://localhost:8080
mvn test                     # Runs unit tests
mvn clean package            # Builds JAR in target/
```

### React Frontend
```bash
cd ReactApp/myappvercel
npm install                  # First time only
npm start                    # Dev server on http://localhost:3000
npm run build                # Production build in build/
npm test                     # Jest tests
```

### BackendRender (Unused)
```bash
cd BackendRender/backendrender
./mvnw spring-boot:run       # Runs on port 8080 (conflicts with primary)
```

---

## 10. Environment Variables Needed (Future)

| Variable | Default | Purpose |
|----------|---------|---------|
| `REACT_APP_API_BASE_URL` | `http://localhost:8080/api` | React → Spring API |
| `SERVER_PORT` | `8080` | Spring port (if changed) |
| `SPRING_SERVLET_MULTIPART_MAX_FILE_SIZE` | `10MB` | Upload limit |

---

## 11. Summary

| Category | Status |
|----------|--------|
| **Working backend prototype** | ✅ Yes (Spring-boot&Maven) |
| **Working frontend** | ❌ No (React scaffold only) |
| **Backend ready for SPA integration** | ⚠️ Needs CORS + JSON endpoints |
| **Unused code to document/ignore** | BackendRender/backendrender |
| **Technical debt** | Low (clean, small codebase) |
| **Risk of breaking existing functionality** | Low (if preservation rules followed) |

**Next Action:** Begin Milestone 2 — React + Tailwind Foundation in `ReactApp/myappvercel`.