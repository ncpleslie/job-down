import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  RowData,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { useMemo, useState } from "react";
import { Input } from "./input";
import { DataTableViewOptions } from "./data-table-view-options";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowDeleteRequested?: (rowSelection: TData[]) => void;
  filterOptions: {
    inputFilterKey: string;
    dropdownFilterKeys: string[];
  };
  disabledKey?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowDeleteRequested,
  disabledKey,
  filterOptions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const onDeleteRow = () => {
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((rowSelection) => rowSelection.original);
    onRowDeleteRequested?.(selectedRows);
  };

  type filterOptionsType = typeof filterOptions.dropdownFilterKeys;

  const uniqueValues = useMemo<{
    [Key in filterOptionsType[number]]: string[];
  }>(() => {
    return filterOptions.dropdownFilterKeys?.reduce((prev, curr) => {
      const values = table
        .getCoreRowModel()
        .flatRows.map((row) => row.getValue(curr)) as string[];
      const set = Array.from(new Set(values));

      return { ...prev, [curr]: set };
    }, {});
  }, [table]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-4 py-4">
        <Input
          placeholder={`Filter by ${filterOptions.inputFilterKey}...`}
          value={
            (table
              .getColumn(filterOptions.inputFilterKey)
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn(filterOptions.inputFilterKey)
              ?.setFilterValue(event.target.value)
          }
          className="w-full md:max-w-sm"
        />
        <div className="flex gap-4">
          {filterOptions.dropdownFilterKeys.map((filterOption) => {
            return (
              table.getColumn(filterOption) && (
                <DataTableFacetedFilter
                  key={filterOption}
                  column={table.getColumn(filterOption)}
                  title={filterOption}
                  options={uniqueValues[filterOption]}
                />
              )
            );
          })}
        </div>
        <div className="ml-auto flex flex-row items-center gap-8">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button variant="destructive" onClick={onDeleteRow}>
              Delete Selected
            </Button>
          )}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(header.column.columnDef.meta?.className)}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${(row.getValue("status") as string).trim().toLowerCase() === disabledKey && "bg-gray-200 opacity-30 transition-opacity duration-300 hover:opacity-100"}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(cell.column.columnDef.meta?.className)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="hidden flex-1 py-8 text-sm text-muted-foreground lg:block">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected
      </div>
    </div>
  );
}
