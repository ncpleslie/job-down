import { useGetJobByIdQuery } from "@/hooks/use-query.hook";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/jobs/$jobId")({
  component: Job,
});

function Job() {
  const { jobId } = Route.useParams();
  const { data } = useGetJobByIdQuery(jobId);

  return (
    <div>
      <img src={data?.imageUrl} />

      {JSON.stringify(data)}
    </div>
  );
}
