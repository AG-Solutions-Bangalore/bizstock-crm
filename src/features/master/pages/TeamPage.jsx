import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search } from "lucide-react";
import { useState } from "react";
import Loader from "@/components/loader/Loader";
import TeamFormDialog from "../components/team/TeamFormDialog";
import { useTeam } from "../hooks/useTeam";

const TeamPage = () => {
  const { useTeamsQuery } = useTeam();
  const { data: teams, isLoading, isError } = useTeamsQuery();

  const [sorting, setSorting] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Member Name",
      cell: ({ row }) => <div className="font-medium text-yellow-900">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "branch_name",
      header: "Branch",
    },
    {
      accessorKey: "user_type",
      header: "Role",
      cell: ({ row }) => {
        const roleMap = { 1: "Sales", 2: "Admin", 3: "Super Admin" };
        return roleMap[row.getValue("user_type")] || "User";
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <TeamFormDialog teamId={row.original.id} />,
    },
  ];

  const table = useReactTable({
    data: teams || [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
  });

  if (isLoading) return <Loader />;
  if (isError) return <div className="p-4 text-red-500">Error loading team members.</div>;

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-yellow-900">Team Management</h1>
        <TeamFormDialog />
      </div>

      <Card className="border-yellow-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-yellow-50/50 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-yellow-900">Our Team</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-yellow-600" />
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[250px] bg-white border-yellow-200"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
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
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">No members found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 p-4 bg-yellow-50/10">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamPage;
