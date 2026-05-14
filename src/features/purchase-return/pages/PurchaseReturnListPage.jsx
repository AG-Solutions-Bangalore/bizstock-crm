import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, SquarePlus, ChevronDown } from "lucide-react";
import moment from "moment";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import Page from "@/app/dashboard/page";
import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { ButtonConfig } from "@/config/ButtonConfig";
import StatusToggle from "@/components/toggle/StatusToggle";
import { fetchPurchaseReturnById } from "@/api";
import usetoken from "@/api/usetoken";
import { useQueryClient } from "@tanstack/react-query";

import { usePurchaseReturn } from "@/features/purchase-return/hooks/usePurchaseReturn";
import { PurchaseReturnTable } from "@/features/purchase-return/components/PurchaseReturnList/PurchaseReturnTable";
import { PurchaseReturnActions, handleSendWhatsApp } from "@/features/purchase-return/components/PurchaseReturnList/PurchaseReturnActions";

const PurchaseReturnListPage = () => {
  const navigate = useNavigate();
  const token = usetoken();
  const queryClient = useQueryClient();
  const { usePurchaseReturns, deletePurchaseReturn } = usePurchaseReturn();
  const { data: purchase, isLoading, isError, refetch } = usePurchaseReturns();

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const userId = useSelector((state) => state.auth.user_type);

  const handleDeleteRow = (id) => {
    setDeleteItemId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    deletePurchaseReturn(deleteItemId);
    setDeleteConfirmOpen(false);
    setDeleteItemId(null);
  };

  const onWhatsApp = async (encryptedId) => {
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["purchasereturnByid", encryptedId],
        queryFn: () => fetchPurchaseReturnById(encryptedId, token),
      });

      if (data?.purchase && data?.purchaseSub) {
        handleSendWhatsApp(data.purchase, data.purchaseSub, data.buyer);
      }
    } catch (error) {
      console.error("Failed to fetch purchase return data or send WhatsApp:", error);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: "index",
      header: "Sl No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "purchase_date",
      header: "Date",
      id: "Date",
      cell: ({ row }) => moment(row.original.purchase_date).format("DD-MMM-YYYY"),
    },
    {
      accessorKey: "buyer_name",
      header: "Buyer Name",
      id: "Buyer Name",
    },
    {
      accessorKey: "purchase_ref_no",
      header: "Ref No",
      id: "Ref No",
    },
    {
      accessorKey: "purchase_vehicle_no",
      header: "Vehicle No",
      id: "Vehicle No",
    },
    ...(userId == 3
      ? [{
          accessorKey: "branch_name",
          header: "Branch Name",
        }]
      : []),
    {
      accessorKey: "purchase_status",
      header: "Status",
      cell: ({ row }) => (
        <StatusToggle
          initialStatus={row.original.purchase_status}
          teamId={row.original.id}
          onStatusChange={refetch}
        />
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <PurchaseReturnActions 
          purchaseId={row.original.id} 
          userId={userId} 
          onDelete={handleDeleteRow}
          onWhatsApp={onWhatsApp}
        />
      ),
    },
  ], [userId, refetch]);

  const table = useReactTable({
    data: purchase || [],
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
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">Error Fetching purchase returns</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} variant="outline">Try Again</Button>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <div className="w-full p-0 md:p-4 grid grid-cols-1">
        <div className="flex text-left text-2xl text-gray-800 font-[400] mb-4">Purchase Return List</div>

        <div className="flex flex-col md:flex-row md:items-center py-4 gap-2">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search Purchase Return..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200 w-full"
            />
          </div>

          <div className="flex flex-col md:flex-row md:ml-auto gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
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
            {userId != 3 && (
              <Button
                variant="default"
                className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
                onClick={() => navigate("/purchase-return/create")}
              >
                <SquarePlus className="h-4 w-4 mr-2" /> Purchase Return
              </Button>
            )}
          </div>
        </div>

        <PurchaseReturnTable table={table} />
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the purchase return.
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
    </Page>
  );
};

export default PurchaseReturnListPage;
