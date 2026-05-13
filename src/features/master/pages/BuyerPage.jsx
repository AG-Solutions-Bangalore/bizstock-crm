import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import Loader from "@/components/loader/Loader";
import BuyerFormDialog from "../components/buyer/BuyerFormDialog";
import { useBuyer } from "../hooks/useBuyer";

const BuyerPage = () => {
  const { useBuyersQuery } = useBuyer();
  const { data: buyers, isLoading, isError } = useBuyersQuery();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "buyer_name",
      header: "Buyer Name",
      cell: ({ row }) => (
        <div className="font-medium text-yellow-900">{row.getValue("buyer_name")}</div>
      ),
    },
    {
      accessorKey: "buyer_city",
      header: "City",
    },
    {
      accessorKey: "buyer_type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("buyer_type");
        const typeMap = { 1: "Buyer", 2: "Vendor" };
        const labels = Array.isArray(type) 
          ? type.map(t => typeMap[t] || t) 
          : String(type).split(",").map(t => typeMap[t.trim()] || t);
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {labels.join(", ")}
          </span>
        );
      }
    },
    {
      accessorKey: "buyer_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("buyer_status");
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <BuyerFormDialog buyerId={row.original.id} />,
    },
  ];

  const table = useReactTable({
    data: buyers || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
  });

  if (isLoading) return <Loader />;
  if (isError) return <div className="p-4 text-red-500">Error loading buyers.</div>;

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-yellow-900">Buyer Management</h1>
        <div className="flex items-center gap-2">
          <BuyerFormDialog />
        </div>
      </div>

      <Card className="border-yellow-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-yellow-50/50 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold text-yellow-900">Buyer List</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-yellow-600" />
                <Input
                  placeholder="Search buyers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px] md:w-[300px] bg-white border-yellow-200 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-yellow-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-yellow-900 font-semibold">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-yellow-50/30 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                      No buyers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 p-4 bg-yellow-50/20">
            <div className="flex-1 text-sm text-yellow-700">
              Total Buyers: {table.getFilteredRowModel().rows.length}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border-yellow-200 text-yellow-700"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="border-yellow-200 text-yellow-700"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerPage;
