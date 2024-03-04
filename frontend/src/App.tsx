import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from "./components/Main";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <main className="container mx-auto min-h-screen">
        <Main />
      </main>
    </QueryClientProvider>
  );
}

export default App;
