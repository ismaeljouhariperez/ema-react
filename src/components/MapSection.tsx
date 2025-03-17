import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { useMapStore } from "@/store/mapStore";
import { useStore } from "@/store/useStore";

const MapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const { setMap, setIsInitialized } = useMapStore();
  const { adventures } = useStore();

  // Nettoyer les marqueurs existants
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current = [];
  };

  // Ajouter les marqueurs des aventures
  const addAdventureMarkers = () => {
    if (!mapInstance.current) return;

    clearMarkers();

    adventures.forEach((adventure) => {
      const marker = L.marker([adventure.latitude, adventure.longitude]).addTo(
        mapInstance.current!
      ).bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">${adventure.title}</h3>
            <p class="text-sm">${adventure.description}</p>
            <div class="text-xs mt-2">
              <p>Difficulté: ${adventure.difficulty}</p>
              <p>Durée: ${adventure.duration}</p>
              <p>Distance: ${adventure.distance} km</p>
            </div>
          </div>
        `);

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Initialiser la carte
    const newMap = L.map(mapContainer.current, {
      center: [46.603354, 1.888334], // Centre de la France
      zoom: 6,
      zoomControl: false,
    });

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(newMap);

    // Ajouter les contrôles de zoom
    L.control
      .zoom({
        position: "topright",
      })
      .addTo(newMap);

    mapInstance.current = newMap;
    setMap(newMap);
    setIsInitialized(true);

    // Ajouter les marqueurs initiaux
    addAdventureMarkers();

    // Forcer un redimensionnement après que la carte soit montée
    const timer = setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    }, 250);

    return () => {
      clearMarkers();
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        setMap(null);
        setIsInitialized(false);
      }
    };
  }, []); // Ne dépend plus de isInitialized

  // Mettre à jour les marqueurs quand les aventures changent
  useEffect(() => {
    addAdventureMarkers();
  }, [adventures]);

  return (
    <div className="w-full h-full p-4" style={{ minHeight: "600px" }}>
      <Card className="w-full h-full">
        <CardContent className="p-0 relative w-full h-full">
          <div
            ref={mapContainer}
            className="absolute inset-0 w-full h-full rounded-lg"
            style={{ minHeight: "100%", zIndex: 0 }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MapSection;
