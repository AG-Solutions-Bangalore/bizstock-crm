import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Edit, Search, SquarePlus, Trash2 } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Loader from "@/components/loader/Loader";
import StatusToggle from "@/components/toggle/StatusToggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import usetoken from "@/api/usetoken";
import { ButtonConfig } from "@/config/ButtonConfig";
import { QuotationMobileList } from "../components/QuotationList/QuotationMobileList";
import { QuotationTable } from "../components/QuotationList/QuotationTable";
import { useQuotation } from "../hooks/useQuotation";

const QuotationListPage = () => {
  const navigate = useNavigate();
  const token = usetoken();
  const { useQuotations, deleteQuotation } = useQuotation(token);
  const { data: quotations, isLoading, isError, refetch } = useQuotations();

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const userId = useSelector((state) => state.auth.user_type);

  const handleDeleteRow = (id) => {
    setDeleteItemId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await deleteQuotation.mutateAsync(deleteItemId);
    setDeleteConfirmOpen(false);
    setDeleteItemId(null);
  };

  const columns = useMemo(() => [
    {
      accessorKey: "index",
      header: "Sl No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "quotation_date",
      header: "Date",
      cell: ({ row }) => moment(row.original.quotation_date).format("DD-MMM-YYYY"),
    },
    {
      accessorKey: "buyer_name",
      header: "Buyer Name",
    },
    {
      accessorKey: "quotation_ref_no",
      header: "Ref No",
    },
    {
      accessorKey: "quotation_vehicle_no",
      header: "Vehicle No",
    },
    {
      accessorKey: "quotation_status",
      header: "Status",
      cell: ({ row }) => (
        <StatusToggle
          initialStatus={row.original.quotation_status}
          teamId={row.original.id}
          onStatusChange={refetch}
        />
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {userId != 3 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/quotation/form/${row.original.id}`)}>
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Quotation</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {userId != 1 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(row.original.id)} className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Quotation</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ),
    },
  ], [userId, navigate, refetch]);

  const filteredData = useMemo(() => {
    if (!quotations) return [];
    return quotations.filter(item => 
      item.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.quotation_ref_no?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [quotations, searchQuery]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full"><Loader /></div>
    );
  }

  if (isError) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader><CardTitle className="text-destructive">Error Fetching Quotations</CardTitle></CardHeader>
        <CardContent><Button onClick={() => refetch()} variant="outline">Try Again</Button></CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full p-0 md:p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quotation List</h1>
       
      </div>

      <div className="flex   mb-6 gap-4">
        <div className="relative w-full flex items-center gap-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search quotation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white border-gray-200"
          />
        </div>
         {userId != 3 && (
          <Button
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            onClick={() => navigate("/quotation/form")}
          >
            <SquarePlus className="h-4 w-4 mr-2" /> Quotation
          </Button>
        )}
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="hidden md:block">
        <QuotationTable table={table} />
      </div>

      <div className="md:hidden">
        <QuotationMobileList 
          items={filteredData} 
          userId={userId} 
          onDelete={handleDeleteRow} 
          onStatusChange={refetch}
        />
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Total Quotations: {filteredData.length}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this quotation record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuotationListPage;
