import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetJobStatsQuery } from "@/hooks/use-query.hook";
import { Button, ScrollArea } from "@/components";
import { StatResponse } from "@/models/responses/stats.response";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createLazyFileRoute("/jobs/stats")({
  component: Stats,
});

function Stats() {
  const { data, isPending } = useGetJobStatsQuery();

  const router = useRouter();

  const onClose = () => {
    router.history.back();
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-h-[100dvh] md:max-h-[90dvh] md:rounded-md">
          <DialogHeader className="mt-6 flex items-center justify-center border-b-2 pb-4">
            <DialogTitle>Stats</DialogTitle>
            <DialogDescription>
              Track your job application progress
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[90vh] md:max-h-[75vh]">
            {data && (
              <div className="flex flex-col items-center justify-center gap-8 p-4">
                <div className="flex w-full flex-row justify-start gap-4">
                  <p className="text-xl font-bold">Total Jobs Applied</p>
                  <p className="text-xl">{data?.total}</p>
                </div>
                <div>
                  <p className="text-xl font-bold">Current Status</p>
                  <p className="text-sm italic">
                    The current status of all your job applications
                  </p>
                  <StatRow stat={data.current} />
                </div>
                <div>
                  <p className="text-xl font-bold">Historical Status</p>
                  <p className="text-sm italic">
                    This includes all status changes including statuses that
                    have been updated
                  </p>
                  <StatRow stat={data.historical} />
                </div>
              </div>
            )}
            {isPending && (
              <div className="flex flex-col gap-4 p-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-9 w-full" />
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="border-t-2 p-4">
            <Button type="button" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface StatRowProps {
  stat: StatResponse;
}

const StatRow: React.FC<StatRowProps> = ({ stat }) => {
  return (
    <div className="flex flex-row flex-wrap gap-2 text-center md:flex-nowrap">
      <p>
        <strong>Applied</strong> {stat.applied}
      </p>
      <p>
        <strong>Interview</strong> {stat.interview}
      </p>
      <p>
        <strong>Offer</strong> {stat.offer}
      </p>
      <p>
        <strong>Rejected</strong> {stat.rejected}
      </p>
      <p>
        <strong>Other</strong> {stat.other}
      </p>
      <p>
        <strong>Accepted</strong> {stat.accepted}
      </p>
      <p>
        <strong>Withdrawn</strong> {stat.withdrawn}
      </p>
    </div>
  );
};
