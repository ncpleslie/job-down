import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRouteMask,
  createRouter,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { auth } from "@/constants/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

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
  context: { auth: undefined },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const [user] = useAuthState(auth);

  return <RouterProvider router={router} context={{ auth: user }} />;
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
      <InnerApp />
    </QueryClientProvider>
  );
}

export default App;
