import { useEffect } from "react";
import { useStore } from "./store/useStore";
import { testAdventures } from "./data/testAdventures";
import PromptSection from "./components/PromptSection";
import MapSection from "./components/MapSection";

function App() {
  const { setAdventures } = useStore();

  useEffect(() => {
    // Charger les données de test
    setAdventures(testAdventures);
  }, [setAdventures]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Assistant de Randonnée
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PromptSection />
          <MapSection />
        </div>
      </div>
    </div>
  );
}

export default App;
