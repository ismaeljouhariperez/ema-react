import { create } from "zustand";

export interface Adventure {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  duration: string;
  distance: number;
  images: string[];
}

interface Store {
  adventures: Adventure[];
  selectedAdventure: Adventure | null;
  prompt: string;
  isLoading: boolean;
  setAdventures: (adventures: Adventure[]) => void;
  setSelectedAdventure: (adventure: Adventure | null) => void;
  setPrompt: (prompt: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  adventures: [],
  selectedAdventure: null,
  prompt: "",
  isLoading: false,
  setAdventures: (adventures) => set({ adventures }),
  setSelectedAdventure: (adventure) => set({ selectedAdventure: adventure }),
  setPrompt: (prompt) => set({ prompt }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
