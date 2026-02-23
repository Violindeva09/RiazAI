# RiyazAI – Intelligent Practice Analytics System for Musicians

RiyazAI is a Spring Boot + Maven web application prototype that helps musicians turn daily practice recordings into measurable insights.

## What it does

- Upload a practice recording from the web UI.
- Analyse signal behaviour to estimate:
  - Accuracy percentage
  - Note stability
  - Consistency score
- Generate a simple 6-session improvement trend.
- Provide personalised feedback based on analysis outcomes.

## Tech stack

- Java 17
- Spring Boot 3
- Maven
- Thymeleaf (server-side rendered dashboard)

## Run locally

```bash
mvn spring-boot:run
```

Open: `http://localhost:8080`

## If port 8080 is already in use

### Option A: stop the process on 8080

#### Linux / macOS
```bash
lsof -i :8080
kill -9 <PID>
```

#### Windows (PowerShell)
```powershell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Option B: run RiyazAI on another port

#### Temporary (single run)
```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```
Then open: `http://localhost:8081`

#### Environment-variable based (configured in app)
This project reads `PORT` from environment via `application.properties`.

Linux / macOS:
```bash
PORT=8081 mvn spring-boot:run
```

Windows (PowerShell):
```powershell
$env:PORT=8081
mvn spring-boot:run
```

## Commit changes to GitHub

Run these commands after making edits:

```bash
git status
git add .
git commit -m "<your message>"
git push origin <your-branch>
```

If this is your first push of the branch:

```bash
git push -u origin <your-branch>
```

## Test

```bash
mvn test
```

## Abstract

In 2026, many music students practice independently without structured guidance, making it hard to measure improvement or identify technical mistakes. RiyazAI addresses this by analysing uploaded practice recordings and generating pitch and consistency-driven metrics, trend insights, and actionable feedback so progress becomes measurable, efficient, and goal-oriented.
