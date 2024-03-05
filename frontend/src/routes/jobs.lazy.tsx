import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useGetJobsQuery } from "../hooks/use-query.hook";
import AllJobsTable from "../components/AllJobs";

export const Route = createLazyFileRoute("/jobs")({
  component: Index,
});

function Index() {
  const { data: allJobs } = useGetJobsQuery();

  return (
    <div>
      {allJobs && <AllJobsTable jobs={allJobs.jobs} />}
      <Outlet />
    </div>
  );
}
