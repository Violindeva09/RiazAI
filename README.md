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

## Test

```bash
mvn test
```

## Abstract

In 2026, many music students practice independently without structured guidance, making it hard to measure improvement or identify technical mistakes. RiyazAI addresses this by analysing uploaded practice recordings and generating pitch and consistency-driven metrics, trend insights, and actionable feedback so progress becomes measurable, efficient, and goal-oriented.
