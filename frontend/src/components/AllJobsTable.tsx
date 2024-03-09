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
import { Checkbox } from "@/components/ui/checkbox";
import {
  useDeleteJobMutation,
  useGetJobsSuspenseQuery,
} from "@/hooks/use-query.hook";
import { LoadingDialog } from "./ui/loading-dialog";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useMemo } from "react";
import { snakeCaseToTitleCase } from "@/lib/utils/helper.utils";
import AppConstants from "@/constants/app.constants";

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
      meta: {
        className: "hidden lg:table-cell",
      },
    },
    {
      accessorKey: "company",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full max-w-[200px] flex-row flex-nowrap items-center text-xs md:max-w-full lg:flex lg:text-sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Company
            <ArrowUpDown className="ml-2 hidden h-4 w-4 md:block" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="max-w-[19ch] truncate text-ellipsis text-left text-xs md:max-w-full md:text-center lg:text-sm">
          {row.getValue("company")}
        </div>
      ),
    },
    {
      accessorKey: "position",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full max-w-[100px] flex-row flex-nowrap text-xs md:max-w-full lg:flex lg:text-sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title / Position
            <ArrowUpDown className="ml-2 hidden h-4 w-4 md:block" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="max-w-[25ch] text-left text-xs md:max-w-full md:text-center lg:text-sm">
            {row.getValue("position")}
          </div>
        );
      },
      meta: {
        className: "p-2 md:p-4",
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex w-full flex-row flex-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Applied Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center capitalize">
          {row.getValue("createdAt")}
        </div>
      ),
      meta: {
        className: "hidden lg:table-cell",
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex w-full flex-row flex-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center capitalize">
          {snakeCaseToTitleCase(row.getValue("status"))}
        </div>
      ),
      meta: {
        className: "hidden lg:table-cell",
      },
      sortingFn: "alphanumeric",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const job = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-4 p-0 md:w-full">
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
      meta: {
        className: "p-2 md:p-4",
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
          disabledKey={AppConstants.DisabledJobStatuses}
        />
      ) : null}
      <LoadingDialog isLoading={isPendingDelete}>Deleting</LoadingDialog>
    </>
  );
};

export default AllJobsTable;
