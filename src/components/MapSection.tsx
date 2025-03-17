import { Box, useToast } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialiser la carte
    map.current = L.map(mapContainer.current).setView([46.603354, 1.888334], 6); // Centre sur la France

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.current);

    // Ajouter les contrôles de zoom
    L.control
      .zoom({
        position: "topright",
      })
      .addTo(map.current);

    // Ajouter le contrôle de géolocalisation
    L.control
      .locate({
        position: "topright",
        strings: {
          title: "Me localiser",
        },
        locateOptions: {
          enableHighAccuracy: true,
        },
      })
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <Box h="100%" w="100%" position="relative">
      <Box
        ref={mapContainer}
        h="100%"
        w="100%"
        position="absolute"
        top={0}
        left={0}
      />
    </Box>
  );
};

export default MapSection;
