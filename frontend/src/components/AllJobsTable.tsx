import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "./ui/data-table";
import JobResponse from "@/models/responses/job.response";
import { Link } from "@tanstack/react-router";
import { dateStringToTimeAndDate } from "@/utils/date-format.utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useDeleteJobMutation,
  useGetJobsSuspenseQuery,
} from "@/hooks/use-query.hook";
import { LoadingDialog } from "./ui/loading-dialog";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useMemo } from "react";

const createColumns = (onDeleteJob: (job: JobResponse) => void) => {
  const columns: ColumnDef<JobResponse>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "company",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Company
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("company")}</div>
      ),
    },
    {
      accessorKey: "position",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title / Position
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="text-center">{row.getValue("position")}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Applied Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center capitalize">
          {dateStringToTimeAndDate(row.getValue("createdAt") as string)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const job = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-full p-0">
                <span className="sr-only">More</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link to="/jobs/$jobId/modal" params={{ jobId: job.id }}>
                  View and Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDeleteJob(job)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};

const AllJobsTable: React.FC = () => {
  const { data: jobs } = useGetJobsSuspenseQuery();
  const { mutate, isPending: isPendingDelete } = useDeleteJobMutation();

  const onDeleteJob = (job: JobResponse) => {
    mutate(job.id);
  };

  const onDeleteJobs = (jobs: JobResponse[]) => {
    jobs.forEach((job) => {
      mutate(job.id);
    });
  };

  const columns = useMemo(() => createColumns(onDeleteJob), []);

  return (
    <>
      {jobs.length ? (
        <DataTable
          data={jobs}
          columns={columns}
          onRowDeleteRequested={onDeleteJobs}
        />
      ) : null}
      <LoadingDialog isLoading={isPendingDelete}>Deleting</LoadingDialog>
    </>
  );
};

export default AllJobsTable;
