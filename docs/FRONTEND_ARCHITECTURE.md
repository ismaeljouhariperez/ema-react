# EMA Frontend Architecture

This document outlines the recommended architecture for the EMA frontend application built with React, TypeScript, and other modern web technologies.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [State Management](#state-management)
4. [Routing](#routing)
5. [Component Architecture](#component-architecture)
6. [Styling Approach](#styling-approach)
7. [Map Integration](#map-integration)
8. [Animation Strategy](#animation-strategy)
9. [Performance Considerations](#performance-considerations)
10. [Testing Strategy](#testing-strategy)

## Project Structure

```
ema-frontend/
├── .cursor/                  # Cursor IDE configuration
├── public/                   # Static assets
├── src/
│   ├── assets/               # Images, fonts, etc.
│   │   ├── common/           # Generic components (Button, Input, etc.)
│   │   ├── layout/           # Layout components (Header, Footer, etc.)
│   │   ├── map/              # Map-related components
│   │   └── adventure/        # Adventure-specific components
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   ├── services/             # API services
│   ├── store/                # State management
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Main App component
│   ├── index.tsx             # Entry point
│   └── routes.tsx            # Route definitions
├── .env                      # Environment variables
├── .eslintrc.js              # ESLint configuration
├── .prettierrc               # Prettier configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Technology Stack

### Core Technologies

- **React**: UI library
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and development server

### State Management

- **React Context API**: For global state (authentication, theme, etc.)
- **React Query**: For server state management (data fetching, caching, etc.)
- **Zustand**: For complex UI state management (lightweight alternative to Redux)

### UI and Styling

- **Tailwind CSS**: Utility-first CSS framework
- **GSAP**: Animation library for complex animations
- **Framer Motion**: For simpler component animations
- **Headless UI**: Unstyled, accessible UI components

### Maps and Geolocation

- **Leaflet**: Interactive maps
- **React Leaflet**: React wrapper for Leaflet
- **Turf.js**: Geospatial analysis

### Form Handling

- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation

### Routing

- **React Router**: Client-side routing

### Testing

- **Vitest**: Test runner
- **React Testing Library**: Component testing
- **MSW**: API mocking

## State Management

### State Categories

1. **Server State**: Data from the API

   - Use React Query for fetching, caching, and synchronizing
   - Example: adventures list, user profile

2. **Global UI State**: Application-wide UI state

   - Use React Context or Zustand
   - Example: authentication, theme, sidebar open/closed

3. **Local Component State**: Component-specific state
   - Use React's `useState` or `useReducer`
   - Example: form input values, modal open/closed

### Example React Query Setup

```typescript
// src/services/queryClient.ts
import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
```

```typescript
// src/hooks/useAdventures.ts
import { useQuery } from "react-query";
import api from "../services/api";
import { Adventure } from "../types";

export const useAdventures = (search?: string) => {
  return useQuery<Adventure[]>(
    ["adventures", search],
    async () => {
      const endpoint = search
        ? `/api/v1/adventures/search?query=${encodeURIComponent(search)}`
        : "/api/v1/adventures";

      const response = await api.get(endpoint);
      return response.data;
    },
    {
      keepPreviousData: true,
    }
  );
};
```

### Example Zustand Store

```typescript
// src/store/authStore.ts
import create from "zustand";
import { AuthHeaders, login, logout, getAuthHeaders } from "../services/auth";

interface AuthState {
  isAuthenticated: boolean;
  user: { id: number; email: string; name: string } | null;
  authHeaders: AuthHeaders | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!getAuthHeaders(),
  user: null,
  authHeaders: getAuthHeaders(),

  login: async (email, password) => {
    const headers = await login(email, password);
    set({ isAuthenticated: true, authHeaders: headers });
  },

  logout: async () => {
    await logout();
    set({ isAuthenticated: false, user: null, authHeaders: null });
  },

  setUser: (user) => set({ user }),
}));
```

## Routing

Use React Router for navigation:

```typescript
// src/routes.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import AdventureListPage from "./pages/AdventureListPage";
import AdventureDetailPage from "./pages/AdventureDetailPage";
import CreateAdventurePage from "./pages/CreateAdventurePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "adventures", element: <AdventureListPage /> },
      { path: "adventures/:id", element: <AdventureDetailPage /> },
      {
        path: "adventures/create",
        element: (
          <ProtectedRoute>
            <CreateAdventurePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
```

## Component Architecture

### Component Types

1. **Page Components**: Top-level components that correspond to routes
2. **Layout Components**: Structure the page (Header, Footer, Sidebar)
3. **Feature Components**: Specific to a feature (AdventureCard, MapView)
4. **Common Components**: Reusable UI elements (Button, Input, Modal)

### Component Structure

```typescript
// src/components/adventure/AdventureCard.tsx
import { FC } from "react";
import { Link } from "react-router-dom";
import { Adventure } from "../../types";
import { formatDuration } from "../../utils/formatters";
import Badge from "../common/Badge";

interface AdventureCardProps {
  adventure: Adventure;
  className?: string;
}

const AdventureCard: FC<AdventureCardProps> = ({
  adventure,
  className = "",
}) => {
  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="relative h-48 bg-gray-200">
        {/* Image or map preview could go here */}
        <div className="absolute top-2 right-2">
          <Badge variant={adventure.difficulty}>{adventure.difficulty}</Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{adventure.title}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2">
          {adventure.description}
        </p>

        <div className="flex justify-between text-sm text-gray-500">
          <span>{adventure.location}</span>
          <span>{formatDuration(adventure.duration)}</span>
        </div>

        <Link
          to={`/adventures/${adventure.id}`}
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default AdventureCard;
```

## Styling Approach

### Tailwind CSS

Use Tailwind CSS for utility-first styling:

```typescript
// Example component with Tailwind
const Button = ({ children, variant = "primary", ...props }) => {
  const baseClasses =
    "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};
```

### GSAP for Complex Animations

```typescript
// Example GSAP animation
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const AnimatedHero = () => {
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .from(titleRef.current, { y: 50, opacity: 0, duration: 1 })
      .from(descRef.current, { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
      .from(buttonRef.current, { y: 20, opacity: 0, duration: 0.5 }, "-=0.4");

    return () => timeline.kill();
  }, []);

  return (
    <div className="text-center py-20">
      <h1 ref={titleRef} className="text-4xl font-bold mb-4">
        Discover Your Next Adventure
      </h1>
      <p ref={descRef} className="text-xl mb-8 max-w-2xl mx-auto">
        Explore unique micro-adventures near you, created by locals and AI
        recommendations.
      </p>
      <button
        ref={buttonRef}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Start Exploring
      </button>
    </div>
  );
};
```

## Map Integration

Use Leaflet for interactive maps:

```typescript
// src/components/map/AdventureMap.tsx
import { FC } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Adventure } from "../../types";
import { customMarkerIcon } from "../../utils/mapIcons";

interface AdventureMapProps {
  adventures: Adventure[];
  height?: string;
  zoom?: number;
  center?: [number, number];
}

const AdventureMap: FC<AdventureMapProps> = ({
  adventures,
  height = "500px",
  zoom = 10,
  center = [48.8566, 2.3522], // Default to Paris
}) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {adventures.map((adventure) => (
        <Marker
          key={adventure.id}
          position={[adventure.latitude, adventure.longitude]}
          icon={customMarkerIcon(adventure.difficulty)}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{adventure.title}</h3>
              <p className="text-sm">{adventure.location}</p>
              <p className="text-xs mt-1">
                {adventure.difficulty} • {adventure.duration} min
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AdventureMap;
```

## Animation Strategy

### Animation Categories

1. **Page Transitions**: Animate between routes
2. **UI Feedback**: Animate buttons, form submissions, loading states
3. **Content Reveals**: Animate content as it enters the viewport
4. **Interactive Elements**: Animate hover states, clicks, etc.

### GSAP for Complex Animations

Use GSAP for complex, timeline-based animations:

```typescript
// src/hooks/usePageTransition.ts
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLocation } from "react-router-dom";

export const usePageTransition = () => {
  const location = useLocation();
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    gsap.fromTo(
      container,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );

    return () => {
      gsap.to(container, { opacity: 0, y: -20, duration: 0.3 });
    };
  }, [location.pathname]);

  return containerRef;
};
```

### Framer Motion for Component Animations

Use Framer Motion for simpler component-level animations:

```typescript
// src/components/common/FadeIn.tsx
import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

const FadeIn: FC<FadeInProps> = ({ children, delay = 0, duration = 0.5 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
```

## Performance Considerations

1. **Code Splitting**: Split code by route using React.lazy and Suspense
2. **Memoization**: Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders
3. **Virtualization**: Use react-window or react-virtualized for long lists
4. **Image Optimization**: Use responsive images, lazy loading, and proper formats
5. **Bundle Size**: Monitor bundle size and optimize imports

```typescript
// src/App.tsx with code splitting
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazy-loaded components
const HomePage = lazy(() => import("./pages/HomePage"));
const AdventureListPage = lazy(() => import("./pages/AdventureListPage"));
const AdventureDetailPage = lazy(() => import("./pages/AdventureDetailPage"));
const CreateAdventurePage = lazy(() => import("./pages/CreateAdventurePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/adventures" element={<AdventureListPage />} />
            <Route path="/adventures/:id" element={<AdventureDetailPage />} />
            <Route
              path="/adventures/create"
              element={<CreateAdventurePage />}
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

## Testing Strategy

### Testing Levels

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user flows

### Example Component Test

```typescript
// src/components/adventure/AdventureCard.test.tsx
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdventureCard from "./AdventureCard";

const mockAdventure = {
  id: 1,
  title: "Test Adventure",
  description: "This is a test adventure",
  location: "Test Location",
  latitude: 48.8566,
  longitude: 2.3522,
  tags: "test,adventure",
  difficulty: "moderate",
  duration: 120,
  distance: 5,
  user_id: 1,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
};

describe("AdventureCard", () => {
  it("renders adventure details correctly", () => {
    render(
      <BrowserRouter>
        <AdventureCard adventure={mockAdventure} />
      </BrowserRouter>
    );

    expect(screen.getByText("Test Adventure")).toBeInTheDocument();
    expect(screen.getByText("This is a test adventure")).toBeInTheDocument();
    expect(screen.getByText("Test Location")).toBeInTheDocument();
    expect(screen.getByText("moderate")).toBeInTheDocument();
    expect(screen.getByText("2 hours")).toBeInTheDocument();
    expect(screen.getByText("View Details")).toHaveAttribute(
      "href",
      "/adventures/1"
    );
  });
});
```
