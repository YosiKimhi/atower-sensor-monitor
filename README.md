# ATower Sensor Monitor

A real-time monitoring system for ATower sensors, tracking temperature data across different tower faces.

## Prerequisites

- Docker Desktop
- Node.js 18.x (for both frontend and backend)

## Environment Files Setup

**Important**: The required environment files (`.env`) for both frontend and backend will be sent separately via email for security reasons. Once received:

1. Place the backend `.env` file in the `backend/` directory
2. Place the frontend `.env` file in the `frontend/` directory

## Quick Start with Docker (Recommended)

1. Make sure Docker Desktop is running on your machine
2. Clone the repository
3. Place the environment files as described above
4. From the root directory, run:
```bash
cd docker
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Manual Setup (For Development)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Run the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Project Structure

```Text
atower-sensor-monitor/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── pages/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── middleware/  
│   └── package.json
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
└── README.md
```

## Features

- Real-time sensor monitoring
- Temperature tracking across all tower faces
- Malfunctioning sensor detection
- Historical data visualization
- Automated alerts for abnormal readings

## API Documentation

The backend API is available at `http://localhost:4000` with the following endpoints:

- `POST /api/readings` - Submit new sensor reading
- `GET /api/reports/malfunctioning` - Get malfunctioning sensors report
- `GET /api/reports/weekly` - Get weekly temperature report

## Troubleshooting

1. **Docker Issues**
   - Ensure Docker Desktop is running
   - Try stopping all containers: `docker-compose down`
   - Remove old builds: `docker-compose down --rmi all`

2. **Environment Files**
   - Verify both `.env` files are in their correct locations
   - Check file permissions
   - Ensure no syntax errors in the env files

3. **Port Conflicts**
   - Make sure ports 3000 and 4000 are not in use
   - To check ports in use (Windows): `netstat -ano | findstr "3000 4000"`


## 1. System Architecture Overview

### High-Level Architecture


```Text
├── Frontend (React)
├── Backend (Node.js/Express)
└── Database (MongoDB)
```
### System Components

1. Data Collection Layer
	- Sensor Data Ingestion API
	- Real-time data processing
	- Data validation
2. Processing Layer
	- Temperature aggregation service
	- Malfunction detection service
	- Data cleanup service (for removed sensors)
3. Storage Layer
	- Sensor data storage
	- Aggregated data storage
	- Malfunction records
4. API Layer
	- REST endpoints for reports
5. Presentation Layer
	- Basic React dashboard
	- Reports interface

## 2. Detailed Technical Design

### Database Schema (MongoDB)

### Temperature Readings Collection
```javascript
{
    timestamp: Number,        // Unix timestamp (integer)
    id: Number,              // Sensor numeric ID (integer)
    face: String,           // 'south', 'east', 'north', 'west'
    temperature: Number      // Temperature in Celsius (double)
}
```
Indexes:
- `{ id: 1, timestamp: -1 }`      // For finding sensor's last reading
- `{ face: 1, timestamp: -1 }`    // For malfunction detection
- `{ timestamp: -1 }`             // For cleanup of old data

### Hourly Aggregates Collection
```javascript
{
    timestamp: Number,        // Start of hour (Unix timestamp)
    face: String,           // 'south', 'east', 'north', 'west'
    averageTemperature: Number  // Average temperature for the hour
}
```
Indexes:
- `{ timestamp: -1 }`            // For weekly report

### Notes:
- Temperature Readings Collection stores raw sensor data (1 reading/second from each sensor)
- Hourly Aggregates Collection stores pre-calculated hourly averages for reporting
- Sensor status (active/inactive) is determined by checking last reading timestamp
- Malfunctions are calculated by comparing readings from sensors on the same face

## 3. Implementation Plan

### Phase 1: Core Infrastructure
1. Set up Node.js/Express backend
2. Configure MongoDB connection
3. Create basic project structure
4. Implement Docker configuration
### Phase 2: Data Ingestion
1. Create sensor data ingestion API
2. Implement data validation
3. Set up real-time processing pipeline
### Phase 3: Processing Services
1. Implement hourly aggregation service
2. Create malfunction detection algorithm
3. Build sensor cleanup service
### Phase 4: API Development
1. Create reporting endpoints
2. Implement malfunction notification system
3. Build data query services
### Phase 5: Frontend Development
1. Create basic React dashboard
2. Implement reporting interface
3. Add real-time notifications display

## 4. Key Technical Considerations

1. Scalability
	- Use MongoDB indexes for efficient queries
	- Implement data partitioning for temperature readings
2. Performance
	- Batch processing for hourly aggregations
	- Efficient algorithms for malfunction detection
	- Optimized database queries
3. Reliability
	- Error handling
	- Data validation
	- Logging system
4. Maintainability
	- Clean code architecture
	- Dependency injection
	- Comprehensive documentation

