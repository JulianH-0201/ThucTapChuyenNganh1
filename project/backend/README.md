# Music Player Backend API

Node.js/Express backend for the Vue Music Player application.

## Setup Instructions

### 1. Install Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and configure:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

- `GET /` - API information
- `GET /api/health` - Health check

## Connecting Vue Frontend

In your Vue application, you can make API calls to the backend:

```javascript
// Example: In a Vue component or store
const response = await fetch('http://localhost:3000/api/health');
const data = await response.json();
```

### CORS Configuration

The backend is configured with CORS enabled, so your Vue frontend (typically running on `http://localhost:5173` with Vite) can make requests to the backend.

## Project Structure

```
backend/
├── server.js          # Main server file
├── routes/            # API routes
│   └── example.js     # Example route file
├── middleware/        # Custom middleware
├── utils/             # Utility functions
├── .env               # Environment variables (create this)
└── package.json       # Dependencies
```

## Adding New Routes

1. Create a new route file in `routes/` directory
2. Import and use it in `server.js`:

```javascript
import newRoutes from './routes/newRoute.js';
app.use('/api/new', newRoutes);
```

