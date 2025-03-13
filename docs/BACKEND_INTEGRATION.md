# EMA Backend Integration Guide

This document provides comprehensive information about the EMA backend API (Rails 8) and how to integrate with it from the frontend.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Asynchronous Operations](#asynchronous-operations)
7. [Environment Configuration](#environment-configuration)
8. [Development Workflow](#development-workflow)

## Architecture Overview

The EMA platform consists of three main components:

1. **Frontend (React/TypeScript)** - This repository

   - User interface for adventure discovery and management
   - Communicates exclusively with the Rails backend

2. **Backend API (Rails 8)** - [ema-api repository](https://github.com/your-repo/ema-api)

   - Handles authentication, data storage, and business logic
   - Exposes RESTful API endpoints
   - Communicates with the AI service for adventure generation

3. **AI Service (Python/FastAPI)** - [ema-ai repository](https://github.com/your-repo/ema-ai)
   - Generates adventure recommendations using LangChain and OpenAI
   - Only communicates with the Rails backend, not directly with the frontend

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  ema-frontend   │◄────►│    ema-api      │◄────►│     ema-ai      │
│  (React/TS)     │      │   (Rails 8)     │      │  (Python/FastAPI)│
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Authentication

The backend uses Devise Token Auth for JWT-based authentication. Here's how to implement authentication in your React application:

### Login Flow

1. Send a POST request to `/auth/sign_in` with email and password
2. Store the following response headers:
   - `access-token`
   - `client`
   - `uid`
3. Include these headers in all subsequent authenticated requests

### Example Login Implementation

```typescript
// services/auth.ts
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export interface AuthHeaders {
  "access-token": string;
  client: string;
  uid: string;
}

export const login = async (
  email: string,
  password: string
): Promise<AuthHeaders> => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/sign_in`,
      {
        email,
        password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // Extract auth headers
    const authHeaders: AuthHeaders = {
      "access-token": response.headers["access-token"],
      client: response.headers["client"],
      uid: response.headers["uid"],
    };

    // Store in localStorage or secure storage
    localStorage.setItem("auth", JSON.stringify(authHeaders));

    return authHeaders;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const getAuthHeaders = (): AuthHeaders | null => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
};

export const logout = async (): Promise<void> => {
  const headers = getAuthHeaders();

  if (headers) {
    try {
      await axios.delete(`${API_URL}/auth/sign_out`, { headers });
      localStorage.removeItem("auth");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }

  localStorage.removeItem("auth");
};
```

### Registration Flow

```typescript
export const register = async (
  email: string,
  password: string,
  passwordConfirmation: string,
  name: string
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/auth`, {
      email,
      password,
      password_confirmation: passwordConfirmation,
      name,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint          | Description              | Auth Required |
| ------ | ----------------- | ------------------------ | ------------- |
| POST   | `/auth/sign_in`   | User login               | No            |
| POST   | `/auth`           | User registration        | No            |
| DELETE | `/auth/sign_out`  | User logout              | Yes           |
| GET    | `/api/v1/profile` | Get current user profile | Yes           |

### Adventure Endpoints

| Method | Endpoint                    | Description                | Auth Required |
| ------ | --------------------------- | -------------------------- | ------------- |
| GET    | `/api/v1/adventures`        | List all adventures        | No            |
| GET    | `/api/v1/adventures/:id`    | Retrieve adventure details | No            |
| POST   | `/api/v1/adventures`        | Create a new adventure     | Yes           |
| PUT    | `/api/v1/adventures/:id`    | Update an adventure        | Yes (owner)   |
| DELETE | `/api/v1/adventures/:id`    | Delete an adventure        | Yes (owner)   |
| GET    | `/api/v1/adventures/search` | Search adventures          | No            |

### AI Integration Endpoints

| Method | Endpoint                               | Description                | Auth Required |
| ------ | -------------------------------------- | -------------------------- | ------------- |
| POST   | `/api/v1/ai_adventures/generate`       | Generate adventure with AI | Yes           |
| GET    | `/api/v1/ai_adventures/search_similar` | Find similar adventures    | No            |
| GET    | `/api/v1/ai_adventures/status/:job_id` | Check AI generation status | Yes           |

## Data Models

### Adventure Model

```typescript
interface Adventure {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  tags: string;
  difficulty: string;
  duration: number; // in minutes
  distance: number; // in kilometers
  user_id: number;
  user: User;
  created_at: string;
  updated_at: string;
}
```

### User Model

```typescript
interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}
```

## Error Handling

The backend returns errors in a consistent format:

```json
{
  "error": "Error message",
  "status": 400,
  "details": ["Specific error detail 1", "Specific error detail 2"]
}
```

Implement a global error handler in your axios configuration:

```typescript
// services/api.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getAuthHeaders } from "./auth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth headers
api.interceptors.request.use((config) => {
  const headers = getAuthHeaders();

  if (headers) {
    config.headers = {
      ...config.headers,
      "access-token": headers["access-token"],
      client: headers.client,
      uid: headers.uid,
    };
  }

  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with an error status
      const { data, status } = error.response;

      // Handle 401 Unauthorized - redirect to login
      if (status === 401) {
        localStorage.removeItem("auth");
        window.location.href = "/login";
      }

      // Format error message for UI
      const errorMessage = data.error || "An unexpected error occurred";
      const errorDetails = data.details || [];

      // You can dispatch to a global error state here if using Redux/Context
      console.error(`API Error (${status}): ${errorMessage}`, errorDetails);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network Error: No response received from server");
    } else {
      // Something happened in setting up the request
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
```

## Asynchronous Operations

Some operations like adventure generation with AI are processed asynchronously. Here's how to handle them:

### Adventure Generation Flow

1. Send a POST request to `/api/v1/ai_adventures/generate` with a prompt
2. Receive a job ID in the response
3. Poll the status endpoint `/api/v1/ai_adventures/status/:job_id` to check progress
4. When the status is "completed", fetch the created adventure

```typescript
// services/aiService.ts
import api from "./api";

export const generateAdventure = async (
  prompt: string
): Promise<{ jobId: string }> => {
  const response = await api.post("/api/v1/ai_adventures/generate", { prompt });
  return { jobId: response.data.job_id };
};

export const checkGenerationStatus = async (
  jobId: string
): Promise<{
  status: "scheduled" | "processing" | "completed";
  finishedAt: string | null;
}> => {
  const response = await api.get(`/api/v1/ai_adventures/status/${jobId}`);
  return {
    status: response.data.status,
    finishedAt: response.data.finished_at,
  };
};

// React hook for polling
export const useAdventureGeneration = (prompt: string) => {
  const [status, setStatus] = useState<
    "idle" | "generating" | "completed" | "error"
  >("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startGeneration = async () => {
    try {
      setStatus("generating");
      const { jobId } = await generateAdventure(prompt);
      setJobId(jobId);

      // Start polling
      const intervalId = setInterval(async () => {
        try {
          const result = await checkGenerationStatus(jobId);

          if (result.status === "completed") {
            clearInterval(intervalId);
            setStatus("completed");

            // Fetch the created adventure
            const adventures = await api.get("/api/v1/adventures");
            const latestAdventure = adventures.data[0]; // Assuming sorted by creation date
            setAdventure(latestAdventure);
          }
        } catch (err) {
          clearInterval(intervalId);
          setStatus("error");
          setError("Failed to check generation status");
        }
      }, 2000); // Poll every 2 seconds

      // Clean up interval after 5 minutes (prevent infinite polling)
      setTimeout(() => {
        clearInterval(intervalId);
        if (status === "generating") {
          setStatus("error");
          setError("Generation timed out");
        }
      }, 5 * 60 * 1000);
    } catch (err) {
      setStatus("error");
      setError("Failed to start adventure generation");
    }
  };

  return { status, adventure, error, startGeneration };
};
```

## Environment Configuration

Create a `.env` file in your React project root with these variables:

```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_for_maps
```

For production, set these environment variables on your hosting platform.

## Development Workflow

1. Start the Rails backend:

   ```bash
   # In the ema-api directory
   rails s
   ```

2. Start the Solid Queue worker:

   ```bash
   # In the ema-api directory
   bundle exec solid_queue --config-file=config/solid_queue.yml
   ```

3. Start the React development server:

   ```bash
   # In the ema-frontend directory
   npm start
   ```

4. For testing AI features, ensure the ema-ai service is running:
   ```bash
   # In the ema-ai directory
   uvicorn app.main:app --reload
   ```

### CORS Configuration

The Rails backend is already configured to allow requests from your React app in development. If you're running the frontend on a port other than 3000, update the `ALLOWED_ORIGINS` environment variable in the backend's `.env` file.
