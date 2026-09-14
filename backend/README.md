# RiazAI Backend

The backend of RiazAI is a Spring Boot application that provides the core audio analysis engine, specifically implementing YIN-based fundamental frequency (F0) estimation.

## 🛠 Requirements
- **Java 17** (Required)
- **Maven** (or use the provided Maven Wrapper `mvnw`)

## 🚀 Getting Started

### Running Locally
1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Start the server using the Maven Wrapper:
   \`\`\`bash
   ./mvnw spring-boot:run
   \`\`\`
   The server will start on `http://localhost:8080` by default.

### Testing
Run the full test suite to verify the analysis engine and API endpoints:
\`\`\`bash
./mvnw test
\`\`\`

## 🧠 Analysis Architecture

### YIN Algorithm Implementation
The backend implements the **YIN algorithm**, a time-domain autocorrelation-based method for pitch detection.
1. **Preprocessing**: The audio signal is normalized and split into frames.
2. **Difference Function**: Computes the squared difference between a frame and its shifted version.
3. **Cumulative Mean Normalized Difference**: Reduces "octave errors" by normalizing the difference function.
4. **Absolute Thresholding**: Identifies the first dip below a specific threshold to determine the period ($\tau$).
5. **F0 Calculation**: Converts the period $\tau$ into a frequency in Hz.

### Computed Metrics
- **Stability**: Calculated based on the variance of F0 over time.
- **Pitch Variance**: The statistical spread of the detected fundamental frequencies.
- **F0 Contour**: The raw frequency values per frame, sent to the frontend for visualization.

## 📡 API Documentation

### `POST /api/analyse`
- **Content-Type**: `multipart/form-data`
- **Parameter**: `audioFile` (File)
- **Function**: Receives an audio file, processes it through the YIN pipeline, and returns a JSON response containing the F0 contour and computed metrics.

### `GET /api/health`
- **Function**: Health check endpoint to verify the service is running.
- **Response**: `{"status": "UP"}`

## ⚙️ Configuration

### CORS Configuration
Cross-Origin Resource Sharing (CORS) is configured in \`WebConfig.java\` to allow requests from the RiazAI frontend (default: `http://localhost:3000`).

### Upload Limits
- **Max File Size**: 10 MB (Configured in \`application.properties\`).
- **Supported Formats**: Optimized for monophonic WAV files.

### Environment Variables
Configuration is managed via \`src/main/resources/application.properties\`. You can override these values using system environment variables.

## 📁 Structure
- \`src/main/java/com/riazai/service/\`: Contains \`F0AnalysisService\` (YIN implementation) and \`AnalysisOrchestrationService\`.
- \`src/main/java/com/riazai/controller/\`: REST API endpoints.
- \`src/main/java\com/riazai/model/\`: Data transfer objects (DTOs) for API responses.
- \`src/test/\`: JUnit tests for the analysis pipeline and controllers.
