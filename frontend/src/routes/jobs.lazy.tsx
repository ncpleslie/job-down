import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import { Suspense } from "react";
import AllJobsTableAsync from "@/components/AllJobsTableAsync";
import useHead from "@/hooks/use-head.hook";

export const Route = createLazyFileRoute("/jobs")({
  component: Index,
});

function Index() {
  useHead("Jobs");

  return (
    <div>
      <Suspense
        fallback={<LoadingDialog isLoading={true}>Loading</LoadingDialog>}
      >
        <AllJobsTableAsync />
      </Suspense>
      <Outlet />
    </div>
  );
}
