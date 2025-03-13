# Snippets Cursor pour EMA React

Ce document explique comment utiliser les snippets Cursor personnalisés pour le développement du frontend EMA avec React.

## Installation des snippets

Les snippets sont situés dans le dossier `.cursor/snippets` et sont automatiquement chargés par Cursor lorsque vous ouvrez le projet.

## Snippets disponibles

### 1. Composant React (`react-component`)

Crée un composant React fonctionnel avec TypeScript.

```tsx
import React from "react";

interface ComponentNameProps {
  prop: string;
}

export const ComponentName: React.FC<ComponentNameProps> = ({ prop }) => {
  return <div>{prop}</div>;
};

export default ComponentName;
```

### 2. Hook React personnalisé (`react-hook`)

Crée un hook React personnalisé avec état et effets.

```tsx
import { useState, useEffect } from "react";

export const useCustomHook = (param: type) => {
  const [state, setState] = useState<stateType>(initialValue);

  useEffect(() => {
    // Effect logic here
    // Your effect code

    return () => {
      // Cleanup logic here (optional)
      // Your cleanup code
    };
  }, [param]);

  const customFunction = () => {
    // Your function logic
  };

  return {
    state,
    customFunction,
  };
};
```

### 3. Service API (`react-service`)

Crée un service API avec méthodes CRUD.

```tsx
import axios from "axios";
import { API_BASE_URL } from "../config";

export interface EntityName {
  id: number;
  property: string;
  anotherProperty: number;
}

export interface EntityNameCreateDTO {
  property: string;
  anotherProperty: number;
}

export interface EntityNameUpdateDTO {
  property?: string;
  anotherProperty?: number;
}

const entityNameLowerApi = {
  getAll: async (): Promise<EntityName[]> => {
    const response = await axios.get(`${API_BASE_URL}/endpoint`);
    return response.data;
  },

  getById: async (id: number): Promise<EntityName> => {
    const response = await axios.get(`${API_BASE_URL}/endpoint/${id}`);
    return response.data;
  },

  create: async (data: EntityNameCreateDTO): Promise<EntityName> => {
    const response = await axios.post(`${API_BASE_URL}/endpoint`, data);
    return response.data;
  },

  update: async (
    id: number,
    data: EntityNameUpdateDTO
  ): Promise<EntityName> => {
    const response = await axios.put(`${API_BASE_URL}/endpoint/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/endpoint/${id}`);
  },
};

export default entityNameLowerApi;
```

### 4. Page React (`react-page`)

Crée une page React avec React Router et React Query.

```tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Import services and components
import EntityNameService from "../services/entitynameService";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

const EntityNamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: entityInstance,
    isLoading,
    error,
  } = useQuery(
    ["entityname", id],
    () => EntityNameService.getById(Number(id)),
    {
      enabled: !!id,
      onError: (err) => {
        console.error("Error fetching entityname:", err);
      },
    }
  );

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message="Failed to load entityname" />;
  if (!entityInstance) return <ErrorMessage message="EntityName not found" />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">EntityName Details</h1>

      <div className="bg-white shadow rounded-lg p-6">// Page content here</div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => navigate("/entitynames")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to List
        </button>

        <button
          onClick={() => navigate(`/entitynames/${id}/edit`)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default EntityNamePage;
```

### 5. Store Zustand (`react-zustand-store`)

Crée un store Zustand pour la gestion d'état global.

```tsx
import { create } from "zustand";

interface StoreNameState {
  property: type;
  anotherProperty: type;
  setProperty: (property: type) => void;
  setAnotherProperty: (anotherProperty: type) => void;
  resetState: () => void;
}

const initialStoreNameState = {
  property: initialValue,
  anotherProperty: initialValue,
};

export const useStoreNameStore = create<StoreNameState>((set) => ({
  ...initialStoreNameState,

  setProperty: (property) => set({ property }),

  setAnotherProperty: (anotherProperty) => set({ anotherProperty }),

  resetState: () => set(initialStoreNameState),
}));
```

### 6. Hook React Query (`react-query-hook`)

Crée des hooks React Query pour les opérations CRUD.

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EntityNameService from "../services/entitynameService";
import type {
  EntityName,
  EntityNameCreateDTO,
  EntityNameUpdateDTO,
} from "../services/entitynameService";

export const useEntityNames = () => {
  return useQuery<EntityName[], Error>(
    ["entitynames"],
    () => EntityNameService.getAll(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Additional options
    }
  );
};

export const useEntityName = (id: number) => {
  return useQuery<EntityName, Error>(
    ["entityname", id],
    () => EntityNameService.getById(id),
    {
      enabled: !!id,
      // Additional options
    }
  );
};

export const useCreateEntityName = () => {
  const queryClient = useQueryClient();

  return useMutation<EntityName, Error, EntityNameCreateDTO>(
    (data) => EntityNameService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["entitynames"]);
      },
      // Additional options
    }
  );
};

export const useUpdateEntityName = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<EntityName, Error, EntityNameUpdateDTO>(
    (data) => EntityNameService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["entityname", id]);
        queryClient.invalidateQueries(["entitynames"]);
      },
      // Additional options
    }
  );
};

export const useDeleteEntityName = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>(
    (id) => EntityNameService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["entitynames"]);
      },
      // Additional options
    }
  );
};
```

### 7. Animation GSAP (`react-gsap-animation`)

Crée un hook d'animation GSAP.

```tsx
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export const useAnimationNameAnimation = (
  triggerCondition: boolean = true,
  options: {
    duration?: number;
    delay?: number;
    ease?: string;
    customOption?: type;
  } = {}
) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current || !triggerCondition) return;

    const {
      duration = 0.5,
      delay = 0,
      ease = "power2.out",
      customOption = defaultValue,
    } = options;

    // Create animation timeline
    const tl = gsap.timeline({
      paused: true,
      defaults: { duration, ease },
    });

    // Add animations to timeline
    tl.from(elementRef.current, {
      opacity: 0,
      y: 20,
      // Additional animation properties
    }).to(elementRef.current, {
      // Additional animation step
    });

    // Play the animation with delay
    tl.play(delay);

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, [triggerCondition, options]);

  return elementRef;
};
```

### 8. Carte Leaflet (`react-leaflet-map`)

Crée un composant de carte Leaflet.

```tsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapNameProps {
  center: [number, number];
  zoom: number;
  markers?: Array<{
    id: number | string;
    position: [number, number];
    title: string;
    description?: string;
  }>;
  onMarkerClick?: (id: number | string) => void;
}

// Component to handle map events and updates
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

export const MapName: React.FC<MapNameProps> = ({
  center = [48.8566, 2.3522], // Default to Paris
  zoom = 13,
  markers = [],
  onMarkerClick,
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "500px", width: "100%" }}
      className="rounded-lg shadow-md"
    >
      <MapController center={center} zoom={zoom} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          eventHandlers={{
            click: () => onMarkerClick && onMarkerClick(marker.id),
          }}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{marker.title}</h3>
              {marker.description && <p>{marker.description}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapName;
```

## Utilisation des snippets

Pour utiliser un snippet, tapez simplement son nom (par exemple `react-component`) dans un fichier et appuyez sur Tab. Le snippet sera inséré avec des placeholders que vous pourrez remplir en appuyant sur Tab pour passer de l'un à l'autre.
