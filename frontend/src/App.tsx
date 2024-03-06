import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRouteMask,
  createRouter,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const jobModalToJobMask = createRouteMask({
  routeTree,
  from: "/jobs/$jobId/modal",
  to: "/jobs/$jobId",
  params: (prev) => ({
    jobId: prev.jobId,
  }),
});

const addJobModalToAddJobMask = createRouteMask({
  routeTree,
  from: "/jobs/add/modal",
  to: "/jobs/add",
});

const router = createRouter({
  routeTree,
  routeMasks: [jobModalToJobMask, addJobModalToAddJobMask],
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

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
        <RouterProvider router={router} />
      </main>
    </QueryClientProvider>
  );
}

export default App;
