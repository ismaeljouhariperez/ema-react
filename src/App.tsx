import { ChakraProvider, Box, Grid, GridItem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PromptSection from "./components/PromptSection";
import MapSection from "./components/MapSection";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Box h="100vh" w="100vw" overflow="hidden">
          <Grid templateColumns="repeat(2, 1fr)" h="100%">
            <GridItem>
              <PromptSection />
            </GridItem>
            <GridItem>
              <MapSection />
            </GridItem>
          </Grid>
        </Box>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
