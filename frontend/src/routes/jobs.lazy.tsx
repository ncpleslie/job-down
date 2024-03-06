import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import AllJobsTable from "../components/AllJobsTable";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import { Suspense } from "react";

export const Route = createLazyFileRoute("/jobs")({
  component: Index,
});

function Index() {
  return (
    <div>
      <Suspense
        fallback={<LoadingDialog isLoading={true}>Loading</LoadingDialog>}
      >
        <AllJobsTable />
      </Suspense>
      <Outlet />
    </div>
  );
}
