import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "leaflet.locatecontrol";
import { useStore } from "@/store/useStore";
import { Card, CardContent } from "@/components/ui/card";
import gsap from "gsap";

const MapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const { adventures, selectedAdventure } = useStore();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialiser la carte
    map.current = L.map(mapContainer.current).setView([46.603354, 1.888334], 6);

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

    // Animation d'entrée avec GSAP
    gsap.from(".map-section", {
      opacity: 0,
      x: 50,
      duration: 0.8,
      ease: "power3.out",
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Mettre à jour les marqueurs quand les aventures changent
  useEffect(() => {
    if (!map.current) return;

    // Supprimer les marqueurs existants
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current?.removeLayer(layer);
      }
    });

    // Ajouter les nouveaux marqueurs
    adventures.forEach((adventure) => {
      const marker = L.marker([adventure.latitude, adventure.longitude])
        .bindPopup(
          `
          <div class="p-2">
            <h3 class="font-semibold">${adventure.title}</h3>
            <p class="text-sm text-gray-600">${adventure.description}</p>
          </div>
        `
        )
        .addTo(map.current!);

      // Animation du marqueur
      marker.on("add", () => {
        const markerElement = marker.getElement();
        if (markerElement) {
          gsap.from(markerElement, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        }
      });
    });
  }, [adventures]);

  return (
    <div className="map-section h-full p-6 bg-background">
      <Card className="h-full overflow-hidden">
        <CardContent className="p-0 h-full">
          <div ref={mapContainer} className="h-full w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export default MapSection;
