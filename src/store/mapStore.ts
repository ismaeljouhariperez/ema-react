import { create } from "zustand";
import { Map as LeafletMap } from "leaflet";

interface MapStore {
  map: LeafletMap | null;
  isInitialized: boolean;
  setMap: (map: LeafletMap | null) => void;
  setIsInitialized: (initialized: boolean) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  map: null,
  isInitialized: false,
  setMap: (map) => set({ map }),
  setIsInitialized: (initialized) => set({ isInitialized: initialized }),
}));
