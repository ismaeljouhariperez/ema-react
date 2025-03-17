import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "leaflet.locatecontrol";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { useStore } from "@/store/useStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdventureFilters } from "./AdventureFilters";
import { X } from "lucide-react";
import gsap from "gsap";

const MapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markerCluster = useRef<L.MarkerClusterGroup | null>(null);
  const { adventures, selectedAdventure, setSelectedAdventure, filters } =
    useStore();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialiser la carte
    map.current = L.map(mapContainer.current).setView([46.603354, 1.888334], 6);

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.current);

    // Initialiser le cluster de marqueurs
    markerCluster.current = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      animate: true,
      chunkedLoading: true,
      disableClusteringAtZoom: 16,
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

  // Mettre à jour les marqueurs quand les aventures ou les filtres changent
  useEffect(() => {
    if (!map.current || !markerCluster.current) return;

    // Nettoyer les marqueurs existants
    markerCluster.current.clearLayers();

    // Filtrer les aventures
    const filteredAdventures = adventures.filter((adventure) => {
      const matchesSearch = adventure.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesDifficulty =
        !filters.difficulty || adventure.difficulty === filters.difficulty;
      const matchesDuration =
        !filters.duration || adventure.duration === filters.duration;
      const matchesDistance = adventure.distance <= filters.maxDistance;

      return (
        matchesSearch && matchesDifficulty && matchesDuration && matchesDistance
      );
    });

    // Ajouter les nouveaux marqueurs
    filteredAdventures.forEach((adventure) => {
      const marker = L.marker([adventure.latitude, adventure.longitude])
        .bindPopup(
          `
          <div class="p-2">
            <h3 class="font-semibold">${adventure.title}</h3>
            <p class="text-sm text-gray-600">${adventure.description}</p>
          </div>
        `
        )
        .on("click", () => {
          setSelectedAdventure(adventure);
          // Animation du panneau de détails
          gsap.from(".adventure-details", {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: "power2.out",
          });
        });

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

      markerCluster.current.addLayer(marker);
    });
  }, [adventures, filters, setSelectedAdventure]);

  return (
    <div className="map-section h-full p-6 bg-background relative">
      <Card className="h-full overflow-hidden">
        <CardContent className="p-0 h-full">
          <div ref={mapContainer} className="h-full w-full" />
        </CardContent>
      </Card>

      {/* Panneau de filtres */}
      <AdventureFilters />

      {/* Panneau de détails de l'aventure */}
      {selectedAdventure && (
        <div className="adventure-details absolute bottom-6 left-6 right-6 max-w-md">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setSelectedAdventure(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardTitle>{selectedAdventure.title}</CardTitle>
              <CardDescription>
                {selectedAdventure.difficulty} • {selectedAdventure.duration} •{" "}
                {selectedAdventure.distance}km
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {selectedAdventure.description}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MapSection;
