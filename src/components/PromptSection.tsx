import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import gsap from "gsap";

const PromptSection = () => {
  const { prompt, setPrompt, isLoading } = useStore();

  useEffect(() => {
    // Animation d'entrée avec GSAP
    gsap.from(".prompt-section", {
      opacity: 0,
      x: -50,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    // TODO: Implémenter l'appel à l'API
    console.log("Prompt soumis:", prompt);
  };

  return (
    <div className="prompt-section h-full p-6 bg-background">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-2xl">
            Découvrez des micro-aventures
          </CardTitle>
          <CardDescription>
            Décrivez votre envie d'aventure et laissez l'IA vous guider vers des
            destinations inattendues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Je cherche une randonnée facile avec un lac en montagne..."
            className="min-h-[200px] resize-none"
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Recherche en cours..." : "Trouver des aventures"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptSection;
