import { create } from "zustand";

interface Adventure {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  distance: number;
  latitude: number;
  longitude: number;
}

interface Filters {
  search: string;
  difficulty: string | null;
  duration: string | null;
  maxDistance: number;
}

interface Store {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  adventures: Adventure[];
  setAdventures: (adventures: Adventure[]) => void;
  selectedAdventure: Adventure | null;
  setSelectedAdventure: (adventure: Adventure | null) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export const useStore = create<Store>((set) => ({
  prompt: "",
  setPrompt: (prompt) => set({ prompt }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  adventures: [],
  setAdventures: (adventures) => set({ adventures }),
  selectedAdventure: null,
  setSelectedAdventure: (adventure) => set({ selectedAdventure: adventure }),
  filters: {
    search: "",
    difficulty: null,
    duration: null,
    maxDistance: 50,
  },
  setFilters: (filters) => set({ filters }),
}));
