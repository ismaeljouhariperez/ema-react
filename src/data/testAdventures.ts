import { Adventure } from "@/store/useStore";

export const testAdventures: Adventure[] = [
  {
    id: "1",
    title: "Sentier des Crêtes",
    description: "Une randonnée panoramique avec vue imprenable sur la vallée",
    difficulty: "Moyen",
    duration: "2-4h",
    distance: 8.5,
    latitude: 48.1373,
    longitude: 7.1856,
  },
  {
    id: "2",
    title: "Circuit du Lac",
    description: "Une promenade facile autour du lac avec points de vue",
    difficulty: "Facile",
    duration: "1-2h",
    distance: 4.2,
    latitude: 45.8492,
    longitude: 6.1725,
  },
  {
    id: "3",
    title: "Traversée des Alpes",
    description: "Une randonnée difficile en haute montagne",
    difficulty: "Difficile",
    duration: "Journée",
    distance: 15.8,
    latitude: 45.8326,
    longitude: 6.8652,
  },
  {
    id: "4",
    title: "Chemin des Pèlerins",
    description: "Un parcours historique à travers la campagne",
    difficulty: "Moyen",
    duration: "4h+",
    distance: 12.3,
    latitude: 43.8667,
    longitude: -1.7015,
  },
];
