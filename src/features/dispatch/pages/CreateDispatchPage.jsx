import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { ArrowLeft, Loader2 } from "lucide-react";

import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

import {
  fetchAvaiableItem,
  DISPATCH_CREATE,
  DISPATCH_EDIT_LIST,
  DISPATCH_SUB_DELETE,
} from "@/api";
import apiClient from "@/api/axios";
import usetoken from "@/api/usetoken";
import { decryptId } from "@/components/common/Encryption";
import {
  fetchBatchNoByItem,
  useFetchBuyers,
  useFetchGoDown,
  useFetchItems,
  useFetchDispatchRef,
} from "@/hooks/useApi";

import { DispatchFormHeader } from "../components/DispatchForm/DispatchFormHeader";
import { DispatchFormTable } from "../components/DispatchForm/DispatchFormTable";
import { DispatchFormMobile } from "../components/DispatchForm/DispatchFormMobile";

const CreateDispatchPage = () => {
  const { id } = useParams();
  const decryptedId = id ? decryptId(id) : null;
  const editId = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = usetoken();

  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);
  const userType = useSelector((state) => state.auth.user_type);
  const userbatch = useSelector((state) => state.auth?.branch_batch);

  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const boxInputRefs = useRef([]);
  const today = moment().format("YYYY-MM-DD");

  const [formData, setFormData] = useState({
    dispatch_date: today,
    dispatch_buyer_id: "",
    dispatch_ref_no: "",
    dispatch_vehicle_no: "",
    dispatch_buyer_city: "",
    dispatch_remark: "",
    dispatch_status: editId ? "" : null,
  });

  const [invoiceData, setInvoiceData] = useState([
    {
      id: editId ? "" : null,
      dispatch_sub_item_id: "",
      dispatch_sub_godown_id: "",
      dispatch_sub_rate: "",
      dispatch_sub_box: 0,
      item_brand: "",
      item_size: "",
      dispatch_sub_piece: 0,
      dispatch_sub_batch_no: "",
      stockData: { total: 0, total_box: 0, total_piece: 0 },
    },
  ]);

  const [batchOptions, setBatchOptions] = useState({});

  const { data: dispatchByid, isFetching } = useQuery({
    queryKey: ["dispatch", decryptedId],
    queryFn: async () => {
      const response = await apiClient.get(`${DISPATCH_EDIT_LIST}/${decryptedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!decryptedId && !!token,
  });

  const { data: buyerData, isLoading: loadingbuyer } = useFetchBuyers();
  const { data: itemsData, isLoading: loadingitem } = useFetchItems();
  const { data: godownData, isLoading: loadinggodown } = useFetchGoDown();
  const { data: dispatchRef, isLoading: loadingref } = useFetchDispatchRef();

  useEffect(() => {
    if (editId && dispatchByid?.dispatch) {
      setFormData({
        dispatch_date: dispatchByid.dispatch.dispatch_date || "",
        dispatch_buyer_id: dispatchByid.dispatch.dispatch_buyer_id || "",
        dispatch_buyer_city: dispatchByid.buyer?.buyer_city || "",
        dispatch_ref_no: dispatchByid.dispatch.dispatch_ref_no || "",
        dispatch_vehicle_no: dispatchByid.dispatch.dispatch_vehicle_no || "",
        dispatch_remark: dispatchByid.dispatch.dispatch_remark || "",
        dispatch_status: dispatchByid.dispatch.dispatch_status || "",
      });

      const mappedData = Array.isArray(dispatchByid.dispatchSub)
        ? dispatchByid.dispatchSub.map((sub) => ({
            id: sub.id || "",
            dispatch_sub_item_id: sub.dispatch_sub_item_id || "",
            dispatch_sub_box: sub.dispatch_sub_box || 0,
            dispatch_sub_piece: sub.dispatch_sub_piece || 0,
            item_brand: sub.item_brand || "",
            item_size: sub.item_size || "",
            dispatch_sub_godown_id: sub.dispatch_sub_godown_id,
            dispatch_sub_rate: sub.dispatch_sub_rate,
            dispatch_sub_batch_no: sub.dispatch_sub_batch_no,
            stockData: { total: 0, total_box: 0, total_piece: 0 },
          }))
        : [];
      setInvoiceData(mappedData.length > 0 ? mappedData : invoiceData);
    }
  }, [editId, dispatchByid]);

  const addRow = useCallback(() => {
    setInvoiceData((prev) => [
      ...prev,
      {
        dispatch_sub_item_id: "",
        dispatch_sub_godown_id: "",
        dispatch_sub_rate: "",
        dispatch_sub_box: 0,
        dispatch_sub_piece: 0,
        dispatch_sub_batch_no: "",
        stockData: { total: 0, total_box: 0, total_piece: 0 },
      },
    ]);
  }, []);

  const removeRow = useCallback(
    (index) => {
      if (invoiceData.length > 1) {
        setInvoiceData((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [invoiceData.length],
  );

  const fetchAndSetStock = async (rowIndex, itemId, godownId) => {
    if (!itemId || !godownId) return;
    try {
      const response = await fetchAvaiableItem(itemId, godownId, token);
      const stock = response?.stock?.[0];
      const itemPiece = Number(stock?.item_piece || 1);
      const safeNumber = (val) => Number(val) || 0;

      const openingPurch =
        safeNumber(stock?.openpurch) * itemPiece +
        safeNumber(stock?.openpurch_piece);
      const openingSale =
        safeNumber(stock?.closesale) * itemPiece +
        safeNumber(stock?.closesale_piece);
      const openingPurchR =
        safeNumber(stock?.openpurchR) * itemPiece +
        safeNumber(stock?.openpurchR_piece);
      const openingSaleR =
        safeNumber(stock?.closesaleR) * itemPiece +
        safeNumber(stock?.closesaleR_piece);
      const opening = openingPurch - openingSale - openingPurchR + openingSaleR;

      const purchase =
        safeNumber(stock?.purch) * itemPiece + safeNumber(stock?.purch_piece);
      const purchaseR =
        safeNumber(stock?.purchR) * itemPiece + safeNumber(stock?.purchR_piece);
      const sale =
        safeNumber(stock?.sale) * itemPiece + safeNumber(stock?.sale_piece);
      const saleR =
        safeNumber(stock?.saleR) * itemPiece + safeNumber(stock?.saleR_piece);

      const total = opening + purchase - purchaseR - sale + saleR;
      const totalBox = Math.floor(total / itemPiece);
      const totalPiece = total % itemPiece;

      setInvoiceData((prev) => {
        const newData = [...prev];
        if (newData[rowIndex]) {
          newData[rowIndex].stockData = {
            total,
            total_box: totalBox,
            total_piece: totalPiece,
          };
        }
        return newData;
      });
    } catch (err) {
      console.error("Stock fetch error:", err);
    }
  };

  const handlePaymentChange = async (selectedValue, rowIndex, fieldName) => {
    let value = selectedValue?.target?.value ?? selectedValue;
    const updatedData = [...invoiceData];

    if (fieldName === "dispatch_sub_item_id") {
      updatedData[rowIndex][fieldName] = value;
      const selectedItem = itemsData?.items?.find((item) => item.id === value);
      if (selectedItem) {
        updatedData[rowIndex]["item_size"] = selectedItem.item_size;
        updatedData[rowIndex]["dispatch_sub_rate"] = selectedItem.item_rate;
        updatedData[rowIndex]["item_brand"] = selectedItem.item_brand;
      }

      try {
        const res = await fetchBatchNoByItem(value, token);
        const batches =
          res?.batchNo?.map((batch) => ({
            value: batch.purchase_sub_batch_no,
            label: batch.purchase_sub_batch_no,
          })) || [];
        setBatchOptions((prev) => ({ ...prev, [rowIndex]: batches }));
      } catch (err) {
        console.error("Batch fetch error:", err);
      }

      if (updatedData[rowIndex].dispatch_sub_godown_id) {
        fetchAndSetStock(
          rowIndex,
          value,
          updatedData[rowIndex].dispatch_sub_godown_id,
        );
      }
    } else if (fieldName === "dispatch_sub_godown_id") {
      updatedData[rowIndex][fieldName] = value;
      if (updatedData[rowIndex].dispatch_sub_item_id) {
        fetchAndSetStock(
          rowIndex,
          updatedData[rowIndex].dispatch_sub_item_id,
          value,
        );
      }
    } else {
      updatedData[rowIndex][fieldName] = value;
    }
    setInvoiceData(updatedData);
  };

  const handleInputChange = (e, field) => {
    const value = e.target ? e.target.value : e;
    let updatedFormData = { ...formData, [field]: value };

    if (field === "dispatch_buyer_id") {
      const selectedBuyer = buyerData?.buyers.find(
        (buyer) => buyer.id == value,
      );
      if (selectedBuyer) {
        updatedFormData.dispatch_buyer_city = selectedBuyer.buyer_city;
      }
    }
    setFormData(updatedFormData);
  };

  const showValidationToast = (message) => {
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: message,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dispatch_date) {
      return showValidationToast("Date is required.");
    }
    if (!formData.dispatch_buyer_id) {
      return showValidationToast("Buyer is required.");
    }
    if (!formData.dispatch_ref_no) {
      return showValidationToast("Reference Number is required.");
    }

    for (let i = 0; i < invoiceData.length; i++) {
      if (!invoiceData[i].dispatch_sub_item_id) {
        return showValidationToast(`Please select an Item for row ${i + 1} in Items Details.`);
      }
    }

    setIsLoading(true);
    try {
      const payload = { ...formData, dispatch_product_data: invoiceData };
      const url = editId
        ? `${DISPATCH_EDIT_LIST}/${decryptedId}`
        : DISPATCH_CREATE;
      const method = editId ? "put" : "post";

      const response = await apiClient[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response?.data.code === 200) {
        toast({ title: "Success", description: response.data.msg });
        navigate("/dispatch");
      } else {
        toast({
          title: "Error",
          description: response.data.msg,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to save dispatch",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRow = (productId) => {
    setDeleteConfirmOpen(true);
    setDeleteItemId(productId);
  };

  const confirmDelete = async () => {
    try {
      const response = await apiClient.delete(
        `${DISPATCH_SUB_DELETE}/${deleteItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.code === 200) {
        toast({ title: "Success", description: response.data.msg });
        setInvoiceData((prev) => prev.filter((row) => row.id !== deleteItemId));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteItemId(null);
    }
  };

  if (
    isFetching ||
    loadingbuyer ||
    loadingitem ||
    loadinggodown ||
    loadingref
  ) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-0 md:p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dispatch")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {editId ? "Edit Dispatch" : "Create Dispatch"}
          </h1>
          <p className="text-sm text-gray-500">Manage your dispatch records</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <DispatchFormHeader
            formData={formData}
            handleInputChange={handleInputChange}
            buyerData={buyerData}
            dispatchRef={dispatchRef}
            editId={editId}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Items Details</h2>

          <div className="hidden md:block">
            <DispatchFormTable
              invoiceData={invoiceData}
              handlePaymentChange={handlePaymentChange}
              itemsData={itemsData}
              godownData={godownData}
              addRow={addRow}
              removeRow={removeRow}
              handleDeleteRow={handleDeleteRow}
              userType={userType}
              singlebranch={singlebranch}
              doublebranch={doublebranch}
              userbatch={userbatch}
              batchOptions={batchOptions}
            />
          </div>

          <div className="md:hidden">
            <DispatchFormMobile
              invoiceData={invoiceData}
              handlePaymentChange={handlePaymentChange}
              itemsData={itemsData}
              godownData={godownData}
              addRow={addRow}
              removeRow={removeRow}
              handleDeleteRow={handleDeleteRow}
              userType={userType}
              singlebranch={singlebranch}
              doublebranch={doublebranch}
              userbatch={userbatch}
              batchOptions={batchOptions}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dispatch")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-8"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editId ? "Update Dispatch" : "Save Dispatch"}
          </Button>
        </div>
      </form>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this item from the dispatch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateDispatchPage;
