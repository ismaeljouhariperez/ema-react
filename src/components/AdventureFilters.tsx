import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { useState } from "react";

const difficulties = ["Facile", "Moyen", "Difficile"];
const durations = ["1-2h", "2-4h", "4h+", "Journée"];

export const AdventureFilters = () => {
  const { setFilters, filters } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setFilters({ ...filters, search: e.target.value });
  };

  return (
    <Card className="absolute top-6 right-6 w-64 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Filtres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Rechercher</label>
          <Input
            placeholder="Titre de l'aventure..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulté</label>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty}
                variant={
                  filters.difficulty === difficulty ? "default" : "outline"
                }
                size="sm"
                onClick={() => setFilters({ ...filters, difficulty })}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Durée</label>
          <div className="flex flex-wrap gap-2">
            {durations.map((duration) => (
              <Button
                key={duration}
                variant={filters.duration === duration ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters({ ...filters, duration })}
              >
                {duration}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Distance max (km)</label>
          <Input
            type="number"
            min="1"
            max="100"
            value={filters.maxDistance}
            onChange={(e) =>
              setFilters({ ...filters, maxDistance: Number(e.target.value) })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};
