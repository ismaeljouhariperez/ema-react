import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { useMapStore } from "@/store/mapStore";

const MapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const { setMap, setIsInitialized } = useMapStore();

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

    // Stocker l'instance de la carte dans la ref locale
    mapInstance.current = newMap;

    // Mettre à jour le store
    setMap(newMap);
    setIsInitialized(true);

    // Forcer un redimensionnement après que la carte soit montée
    const timer = setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        setMap(null);
        setIsInitialized(false);
      }
    };
  }, []); // Ne dépend plus de isInitialized

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
