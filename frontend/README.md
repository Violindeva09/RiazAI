# RiazAI Frontend

The frontend of RiazAI is a modern React application that provides a user-friendly interface for music practice analysis and tracking.

## 🛠 Requirements
- Node.js (LTS recommended)
- npm (comes with Node.js)

## 🚀 Getting Started

### Installation
1. Navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

### Running Locally
Start the development server:
\`\`\`bash
npm start
\`\`\`
The application will be available at [http://localhost:3000](http://localhost:3000).

### Testing
Run the test suite to verify frontend components and logic:
\`\`\`bash
npm test
\`\`\`

### Building for Production
Generate a production-ready build:
\`\`\`bash
npm run build
\`\`\`

## ⚙️ Configuration

### Environment Variables
Create a \`.env\` file in the root of the frontend directory based on \`.env.example\`:
\`\`\`bash
cp .env.example .env
\`\`\`

Required variables:
- \`REACT_APP_API_BASE_URL\`: The base URL of the Spring Boot backend (e.g., \`http://localhost:8080\`).

### Backend Configuration
The frontend communicates with the backend via the `api.js` service. Ensure the backend is running and that the \`REACT_APP_API_BASE_URL\` in your \`.env\` file matches the backend's address.

## 🚢 Deployment
This application is configured for deployment on **Vercel**. 
- Refer to \`vercel.json\` for routing and build configurations.
- Detailed deployment steps can be found in \`docs/RIAZAI_V2_VERCEL_DEPLOYMENT.md\`.

## 📁 Structure
- \`src/components/\`: Reusable UI components (Analysis, Analytics, Dashboard, etc.).
- \`src/pages/\`: Main application views.
- \`src/services/\`: API communication logic.
- \`src/utils/\`: Helper functions for storage and analytics calculations.
- \`src/context/\`: Application-wide state (e.g., Theme).
