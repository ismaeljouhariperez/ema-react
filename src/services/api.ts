import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const searchAdventures = async (
  prompt: string
): Promise<Adventure[]> => {
  try {
    const response = await api.post("/api/adventures/search", { prompt });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la recherche d'aventures:", error);
    throw error;
  }
};

export default api;
