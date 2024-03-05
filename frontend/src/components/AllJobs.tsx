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
import { PropsWithChildren } from "react";

const columns: ColumnDef<JobResponse>[] = [
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("company")}</div>
    ),
  },
  {
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title / Position
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("position")}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Applied Date
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {new Date(row.getValue("createdAt")).toLocaleTimeString()} -{" "}
        {new Date(row.getValue("createdAt")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
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
              <span>More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type AllJobsTableProps = {
  jobs: JobResponse[];
};

const AllJobsTable: React.FC<AllJobsTableProps> = ({ jobs }) => {
  return <DataTable data={jobs} columns={columns} />;
};

export default AllJobsTable;
