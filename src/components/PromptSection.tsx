import {
  Box,
  VStack,
  Textarea,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import gsap from "gsap";

const PromptSection = () => {
  const [prompt, setPrompt] = useState("");
  const toast = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une description",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // TODO: Implémenter l'appel à l'API
    console.log("Prompt soumis:", prompt);
  };

  return (
    <Box p={6} h="100%" bg="gray.50">
      <VStack spacing={6} align="stretch" h="100%">
        <Text fontSize="2xl" fontWeight="bold">
          Découvrez des micro-aventures
        </Text>
        <Text color="gray.600">
          Décrivez votre envie d'aventure et laissez l'IA vous guider vers des
          destinations inattendues.
        </Text>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Je cherche une randonnée facile avec un lac en montagne..."
          size="lg"
          minH="200px"
          resize="none"
          bg="white"
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px #3182ce",
          }}
        />
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleSubmit}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
        >
          Trouver des aventures
        </Button>
      </VStack>
    </Box>
  );
};

export default PromptSection;
