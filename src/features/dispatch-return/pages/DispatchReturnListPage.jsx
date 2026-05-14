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
import usetoken from "@/api/usetoken";
import { useQueryClient } from "@tanstack/react-query";
import { 
  fetchDispatchReturnById, 
  navigateTODispatchReturnEdit, 
  navigateTODispatchReturnView 
} from "@/api";

import { useDispatchReturn } from "@/features/dispatch-return/hooks/useDispatchReturn";
import { DispatchReturnTable } from "@/features/dispatch-return/components/DispatchReturnList/DispatchReturnTable";
import { DispatchReturnMobileList } from "@/features/dispatch-return/components/DispatchReturnList/DispatchReturnMobileList";
import { DispatchReturnActions, handleSendWhatsApp } from "@/features/dispatch-return/components/DispatchReturnList/DispatchReturnActions";

const DispatchReturnListPage = () => {
  const navigate = useNavigate();
  const token = usetoken();
  const queryClient = useQueryClient();
  const { useDispatchReturns, deleteDispatchReturn } = useDispatchReturn();
  const { data: dispatchReturn, isLoading, isError, refetch } = useDispatchReturns();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
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
    deleteDispatchReturn(deleteItemId);
    setDeleteConfirmOpen(false);
    setDeleteItemId(null);
  };

  const onWhatsApp = async (encryptedId) => {
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["dispatchreturnByid", encryptedId],
        queryFn: () => fetchDispatchReturnById(encryptedId, token),
      });

      if (data?.dispatch && data?.dispatchSub) {
        handleSendWhatsApp(data.dispatch, data.dispatchSub, data.buyer);
      }
    } catch (error) {
      console.error("Failed to fetch dispatch return data or send WhatsApp:", error);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: "index",
      header: "Sl No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "dispatch_date",
      header: "Date",
      id: "Date",
      cell: ({ row }) => moment(row.original.dispatch_date).format("DD-MMM-YYYY"),
    },
    {
      accessorKey: "buyer_name",
      header: "Buyer Name",
      id: "Buyer Name",
    },
    {
      accessorKey: "dispatch_ref_no",
      header: "Ref No",
      id: "Ref No",
    },
    {
      accessorKey: "dispatch_vehicle_no",
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
      accessorKey: "dispatch_status",
      header: "Status",
      cell: ({ row }) => (
        <StatusToggle
          initialStatus={row.original.dispatch_status}
          teamId={row.original.id}
          onStatusChange={refetch}
        />
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <DispatchReturnActions 
          dispatchId={row.original.id} 
          userId={userId} 
          onDelete={handleDeleteRow}
          onWhatsApp={onWhatsApp}
        />
      ),
    },
  ], [userId, refetch]);

  const filteredData = useMemo(() => {
    if (!dispatchReturn) return [];
    return dispatchReturn.filter(item => {
      const matchesSearch = item.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.dispatch_ref_no?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = !selectedDate || moment(item.dispatch_date).format("YYYY-MM-DD") === selectedDate;
      return matchesSearch && matchesDate;
    });
  }, [dispatchReturn, searchQuery, selectedDate]);

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
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
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
            <CardTitle className="text-destructive">Error Fetching Dispatch Return</CardTitle>
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
        <div className="hidden sm:block">
          <div className="flex text-left text-2xl text-gray-800 font-[400] mb-4">Dispatch Return List</div>

          <div className="flex flex-col md:flex-row md:items-center py-4 gap-2">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search dispatch return..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200 w-full"
              />
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full md:w-48 bg-gray-50 border-gray-200"
            />

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
                  onClick={() => navigate("/dispatch-return/create")}
                >
                  <SquarePlus className="h-4 w-4 mr-2" /> Dispatch Return
                </Button>
              )}
            </div>
          </div>

          <DispatchReturnTable table={table} />
        </div>

        <div className="sm:hidden p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-medium text-gray-800">Dispatch Return List</h1>
            {userId != 3 && (
              <Button
                variant="default"
                className="bg-yellow-400 hover:bg-yellow-600 text-black rounded-l-full"
                onClick={() => navigate("/dispatch-return/create")}
              >
                <SquarePlus className="h-4 w-4" /> Return
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search dispatch return..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>

          <DispatchReturnMobileList 
            items={filteredData} 
            userId={userId}
            onEdit={(id) => navigateTODispatchReturnEdit(navigate, id)}
            onView={(id) => navigateTODispatchReturnView(navigate, id)}
            onWhatsApp={onWhatsApp}
            onStatusChange={refetch}
          />
        </div>
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the dispatch return record.
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

export default DispatchReturnListPage;
