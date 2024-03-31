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
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingDialog } from "./ui/loading-dialog";
import { ArrowUpDown, MoreHorizontal, PlusSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { snakeCaseToTitleCase } from "@/lib/utils/helper.utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import JobFormConstants from "@/constants/job-form.constants";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { DropdownSelectInput } from "./ui/dropdown-select-input";

const statusToBadgeColor = (status: string) => {
  switch (status) {
    case "applied":
      return "bg-blue-500 text-white";
    case "phone_screen":
      return "bg-yellow-500 text-black";
    case "coding_challenge":
      return "bg-yellow-500 text-black";
    case "first_interview":
      return "bg-yellow-500 text-black";
    case "second_interview":
      return "bg-yellow-500 text-black";
    case "final_interview":
      return "bg-yellow-500 text-black";
    case "offer":
      return "bg-green-500 text-white";
    case "accepted":
      return "bg-green-500 text-white";
    case "rejected":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const createColumns = (
  onDeleteJob: (job: JobResponse) => void,
  onViewJob: (job: JobResponse) => void,
  onUpdateJob: (job: JobResponse) => void,
) => {
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
        <div className="max-w-[15ch] truncate text-ellipsis text-left text-sm md:max-w-full">
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
          <div className="max-w-[15ch] truncate text-left text-sm md:max-w-full">
            {row.getValue("position")}
          </div>
        );
      },
      meta: {
        className: "p-2 md:p-4",
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
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
      cell: ({ row }) => {
        // Valid JSX is returned but this doesn't start with a capital letter
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [updatingJob, setUpdatingJob] = useState<JobResponse | null>(
          null,
        );
        const job = row.original;
        const status = row.getValue("status") as string;
        // Valid JSX is returned but this doesn't start with a capital letter
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const statusObj = useMemo(
          () => ({
            id: status.toLowerCase(),
            label: `${status.charAt(0).toUpperCase()}${status.slice(1)}`,
          }),
          [status],
        );
        // Valid JSX is returned but this doesn't start with a capital letter
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const statuses = useMemo(() => {
          const statuses = JobFormConstants.JobStatuses;
          if (!statuses.find((status) => status.id === statusObj.id)) {
            statuses.push(statusObj);
          }

          return statuses;
        }, [statusObj]);

        const onSubmit = (newStatus: string) => {
          job.status = newStatus;
          setUpdatingJob(job);
          onUpdateJob(job);
        };

        return (
          <div className="flex justify-center text-center capitalize">
            <div
              className={cn("w-[25ch] rounded-lg", statusToBadgeColor(status))}
            >
              <DropdownSelectInput
                title={snakeCaseToTitleCase(status)}
                options={statuses}
                currentSelection={status}
                onSubmit={onSubmit}
                isPendingUpdate={updatingJob?.id === job.id}
              />
            </div>
          </div>
        );
      },
      meta: {
        className: "hidden md:table-cell",
      },
      sortingFn: "alphanumeric",
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
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
              <DropdownMenuItem onClick={() => onViewJob(job)}>
                View and Edit
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

interface AllJobsTableProps {
  jobs: JobResponse[];
  onDeleteJob: (job: JobResponse) => void;
  onDeleteJobs: (jobs: JobResponse[]) => void;
  onViewJob: (job: JobResponse) => void;
  onUpdateJob: (job: JobResponse) => void;
  isPendingDelete: boolean;
  addNewJobUrl: "/jobs/add/modal" | "/jobs/add";
}

const AllJobsTable: React.FC<AllJobsTableProps> = ({
  jobs,
  isPendingDelete,
  addNewJobUrl,
  onDeleteJob,
  onDeleteJobs,
  onViewJob,
  onUpdateJob,
}) => {
  const columns = useMemo(
    () => createColumns(onDeleteJob, onViewJob, onUpdateJob),
    [onDeleteJob, onViewJob, onUpdateJob],
  );

  return (
    <>
      {jobs.length ? (
        <DataTable
          data={jobs}
          columns={columns}
          onRowDeleteRequested={onDeleteJobs}
          filterOptions={{
            inputFilterKey: "company",
            dropdownFilterKeys: ["status", "position"],
          }}
          disabledKey={JobFormConstants.DisabledJobStatuses}
        />
      ) : (
        <Card>
          <CardHeader className="flex flex-col items-center justify-center">
            <CardTitle>No Jobs Found</CardTitle>
            <CardDescription>Add a new job to get started</CardDescription>
          </CardHeader>
          <CardContent className="flex w-full justify-center">
            <Button variant="outline" asChild>
              <Link to={addNewJobUrl}>
                <PlusSquare className="mr-2 h-6 w-6" />
                New Job
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
      <LoadingDialog isLoading={isPendingDelete}>Deleting</LoadingDialog>
    </>
  );
};

export default AllJobsTable;
