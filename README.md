# RiazAI

Personal Music Practice & Analysis Platform

RiazAI is a research-driven practice analytics platform designed to help musicians track their technical progress through quantitative audio analysis. By focusing on fundamental frequency (F0) estimation and pitch-derived metrics, RiazAI provides musicians with a data-backed view of their stability and intonation over time.

## 🚀 Project Overview

### Problem Statement
Musicians often rely on subjective feeling or a teacher's immediate feedback to assess practice quality. There is a lack of accessible, longitudinal tools that can quantitatively track pitch stability and intonation consistency without requiring a professional studio setup.

### Core Idea
To provide a lightweight, accessible platform where musicians can upload recordings of their practice sessions and receive immediate, objective metrics regarding their pitch stability (via YIN-based F0 estimation) and general performance trends.

### Key Features
- **Audio Analysis Workflow**: Simple upload process for practice recordings.
- **Real F0 Analysis**: Implementation of the YIN algorithm for fundamental frequency estimation.
- **Pitch-Derived Metrics**: Calculation of stability, variance, and longitudinal trends based on F0 data.
- **Session Management**: LocalStorage-based persistence for tracking practice sessions over time.
- **Performance Analytics**: Visual dashboards showing progress and metric trends.
- **Responsive Design**: Fully accessible UI built with React and Tailwind CSS.

## 🛠 Technology Stack

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Persistence**: LocalStorage
- **Routing**: React Router

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot
- **Build Tool**: Maven
- **Analysis Engine**: YIN-based F0 estimation (Custom Implementation)

## 🏗 Architecture

The system follows a decoupled Client-Server architecture:
1. **Frontend**: Handles audio capture/upload, session state, and data visualization.
2. **Backend**: A RESTful API that receives audio files, preprocesses the signal, extracts F0 contours using the YIN algorithm, and computes performance metrics.
3. **Data Flow**: `Audio File` $\rightarrow$ `Spring Boot API` $\rightarrow$ `YIN Analysis` $\rightarrow$ `Metrics` $\rightarrow$ `Frontend Visualization`.

## 🚦 Getting Started

### Frontend Setup
1. Navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Configure environment variables (see `.env.example`):
   \`\`\`bash
   cp .env.example .env
   \`\`\`
4. Start the application:
   \`\`\`bash
   npm start
   \`\`\`

### Backend Setup
1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Ensure Java 17 is installed.
3. Run the application using the Maven Wrapper:
   \`\`\`bash
   ./mvnw spring-boot:run
   \`\`\`

## 📡 API Documentation

### `POST /api/analyse`
**Request**: `multipart/form-data`
- `audioFile`: The audio file to be analyzed.

**Response**: `AnalysisResponse` containing F0 data and computed metrics (Stability, Variance, etc.).

### `GET /api/health`
**Request**: None
**Response**: `{"status": "UP"}`

## 📉 Current Limitations & Future Roadmap

### Current Limitations
- **Monophonic Only**: The YIN algorithm is designed for monophonic signals; polyphonic audio will yield inaccurate results.
- **WAV Focus**: Optimized primarily for WAV format audio files.
- **No Backend Persistence**: Session data is currently stored in the frontend's LocalStorage.
- **No Authentication**: The current version is a prototype without user accounts.
- **F0 Accuracy**: While YIN is robust, results can be affected by high noise floors or extreme timbral variations.

### Future Roadmap
- **Database Integration**: Moving session persistence from LocalStorage to a PostgreSQL/MySQL backend.
- **Multi-instrument Profiles**: Tuning the YIN parameters for different instrument ranges.
- **User Authentication**: Implementing JWT-based auth for secure profile management.
- **Advanced Pedagogical Feedback**: Transitioning from raw metrics to actionable teaching suggestions.

## 📚 Documentation Index

Detailed engineering and research documents are available in the \`docs/\` directory:

- **Research & Framework**:
  - \`RIAZAI_V2_ANALYSIS_RESEARCH_REPORT.md\`: Detailed research on signal analysis.
  - \`RIAZAI_V2_ANALYSIS_DECISION_FRAMEWORK.md\`: Logic behind the computed metrics.
  - \`RIAZAI_V2_ANALYSIS_READINESS.md\`: Initial technical specifications.
- **F0 Engineering**:
  - \`RIAZAI_V2_F0_SPIKE.md\`: Initial implementation and spike reports.
  - \`RIAZAI_V2_F0_VALIDATION.md\`: Validation of the YIN algorithm.
  - \`RIAZAI_V2_F0_INTEGRATION.md\`: Integration of F0 analysis into the backend.
  - \`RIAZAI_V2_PRODUCTION_F0_VALIDATION.md\`: Final production-readiness validation.
  - \`RIAZAI_V2_F0_DEBUGGING_REPORT.md\`: Debugging and edge-case analysis.
  - \`RIAZAI_V2_F0_REALWORLD_VALIDATION.md\`: Real-world signal testing results.
- **Project Management**:
  - \`RIAZAI_V2_AUDIT.md\`: Repository and code audits.
  - \`RIAZAI_V2_PROGRESS.md\`: Project development timeline.
  - \`RIAZAI_V2_VERCEL_DEPLOYMENT.md\`: Deployment guides for the frontend.

## 📁 Project Structure

\`\`\`
RiazAI/
├── backend/             # Spring Boot API & YIN Analysis Engine
│   ├── src/              # Java source code and tests
│   └── pom.xml           # Maven configuration
├── frontend/            # React Application
│   ├── src/              # Components, hooks, and services
│   ├── public/           # Static assets
│   └── package.json      # NPM configuration
└── docs/                # Technical reports and research documentation
\`\`\`

## 📜 License
This project is licensed under the MIT License.
