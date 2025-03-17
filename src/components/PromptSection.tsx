import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/useStore";
import gsap from "gsap";

const PromptSection = () => {
  const { prompt, setPrompt, isLoading } = useStore();

  useEffect(() => {
    gsap.from(".prompt-section", {
      y: 50,
      opacity: 0.8,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    console.log("Prompt submitted:", prompt);
  };

  return (
    <div className="h-full p-6 bg-background">
      <Card className="prompt-section">
        <CardHeader>
          <CardTitle>Découvrez des micro-aventures</CardTitle>
          <CardDescription className="text-foreground">
            Décrivez le type d'aventure que vous recherchez et laissez-moi vous
            guider.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ex: Je recherche une randonnée facile de 2h près de Paris..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] bg-background text-foreground"
          />
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Recherche en cours..." : "Trouver une aventure"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptSection;
