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
  PURCHASE_CREATE,
  PURCHASE_EDIT_LIST,
  PURCHASE_SUB_DELETE,
} from "@/api";
import apiClient from "@/api/axios";
import usetoken from "@/api/usetoken";
import { decryptId } from "@/components/common/Encryption";
import {
  fetchBatchNoByItem,
  useFetchBuyers,
  useFetchGoDown,
  useFetchItems,
  useFetchPurchaseRef,
} from "@/hooks/useApi";

import { PurchaseFormHeader } from "../components/PurchaseForm/PurchaseFormHeader";
import { PurchaseFormTable } from "../components/PurchaseForm/PurchaseFormTable";
import { PurchaseFormMobile } from "../components/PurchaseForm/PurchaseFormMobile";

const CreatePurchasePage = () => {
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
  const [errors, setErrors] = useState({});
  const today = moment().format("YYYY-MM-DD");

  const [formData, setFormData] = useState({
    purchase_date: today,
    purchase_buyer_id: "",
    purchase_ref_no: "",
    purchase_vehicle_no: "",
    purchase_remark: "",
    purchase_status: editId ? "" : null,
  });
  const showValidationToast = (message) => {
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: message,
    });
  };
  // const validate = () => {
  //   const newErrors = {};

  //   if (!formData.purchase_date) newErrors.purchase_date = "Date is required";

  //   if (!formData.purchase_buyer_id)
  //     newErrors.purchase_buyer_id = "Buyer is required";

  //   if (!formData.purchase_ref_no)
  //     newErrors.purchase_ref_no = "Reference No is required";

  //   setErrors(newErrors);

  //   return Object.keys(newErrors).length === 0;
  // };

  const [invoiceData, setInvoiceData] = useState([
    {
      id: editId ? "" : null,
      purchase_sub_item_id: "",
      purchase_sub_godown_id: "",
      purchase_sub_batch_no: "",
      purchase_sub_box: 0,
      item_brand: "",
      item_size: "",
      purchase_sub_piece: 0,
      stockData: { total: 0, total_box: 0, total_piece: 0 },
    },
  ]);

  const [batchOptions, setBatchOptions] = useState({});

  const { data: purchaseByid, isFetching } = useQuery({
    queryKey: ["purchaseByid", decryptedId],
    queryFn: async () => {
      const response = await apiClient.get(
        `${PURCHASE_EDIT_LIST}/${decryptedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    enabled: !!decryptedId && !!token,
  });

  const { data: buyerData, isLoading: loadingbuyer } = useFetchBuyers();
  const { data: itemsData, isLoading: loadingitem } = useFetchItems();
  const { data: godownData, isLoading: loadinggodown } = useFetchGoDown();
  const { data: purchaseRef, isLoading: loadingref } = useFetchPurchaseRef();

  useEffect(() => {
    if (editId && purchaseByid?.purchase) {
      setFormData({
        purchase_date: purchaseByid.purchase.purchase_date || "",
        purchase_buyer_id: purchaseByid.purchase.purchase_buyer_id || "",
        purchase_ref_no: purchaseByid.purchase.purchase_ref_no || "",
        purchase_vehicle_no: purchaseByid.purchase.purchase_vehicle_no || "",
        purchase_remark: purchaseByid.purchase.purchase_remark || "",
        purchase_status: purchaseByid.purchase.purchase_status || "",
      });

      const mappedData = Array.isArray(purchaseByid.purchaseSub)
        ? purchaseByid.purchaseSub.map((sub) => ({
            id: sub.id || "",
            purchase_sub_item_id: sub.purchase_sub_item_id || "",
            purchase_sub_box: sub.purchase_sub_box || 0,
            purchase_sub_piece: sub.purchase_sub_piece || 0,
            item_brand: sub.item_brand || "",
            item_size: sub.item_size || "",
            purchase_sub_godown_id: sub.purchase_sub_godown_id,
            purchase_sub_batch_no: sub.purchase_sub_batch_no,
            stockData: { total: 0, total_box: 0, total_piece: 0 },
          }))
        : [];
      setInvoiceData(mappedData.length > 0 ? mappedData : invoiceData);
    }
  }, [editId, purchaseByid]);

  const addRow = useCallback(() => {
    setInvoiceData((prev) => [
      ...prev,
      {
        purchase_sub_item_id: "",
        purchase_sub_godown_id: "",
        purchase_sub_batch_no: "",
        purchase_sub_box: 0,
        purchase_sub_piece: 0,
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

    if (fieldName === "purchase_sub_item_id") {
      updatedData[rowIndex][fieldName] = value;
      const selectedItem = itemsData?.items?.find((item) => item.id === value);
      if (selectedItem) {
        updatedData[rowIndex]["item_size"] = selectedItem.item_size;
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

      if (updatedData[rowIndex].purchase_sub_godown_id) {
        fetchAndSetStock(
          rowIndex,
          value,
          updatedData[rowIndex].purchase_sub_godown_id,
        );
      }
      if (boxInputRefs.current[rowIndex])
        boxInputRefs.current[rowIndex].focus();
    } else if (fieldName === "purchase_sub_godown_id") {
      updatedData[rowIndex][fieldName] = value;
      if (updatedData[rowIndex].purchase_sub_item_id) {
        fetchAndSetStock(
          rowIndex,
          updatedData[rowIndex].purchase_sub_item_id,
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.purchase_date) {
      return showValidationToast("Purchase Date is required.");
    }

    if (!formData.purchase_buyer_id) {
      return showValidationToast("Buyer is required.");
    }

    if (!formData.purchase_ref_no) {
      return showValidationToast("Reference Number is required.");
    }

    // Validate that an item is selected for every row in Items Details
    for (let i = 0; i < invoiceData.length; i++) {
      if (!invoiceData[i].purchase_sub_item_id) {
        return showValidationToast(`Please select an Item for row ${i + 1} in Items Details.`);
      }
    }

    setIsLoading(true);
    try {
      const payload = { ...formData, purchase_product_data: invoiceData };
      const url = editId
        ? `${PURCHASE_EDIT_LIST}/${decryptedId}`
        : PURCHASE_CREATE;
      const method = editId ? "put" : "post";

      const response = await apiClient[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response?.data.code === 200) {
        toast({ title: "Success", description: response.data.msg });
        navigate("/purchase");
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
          error?.response?.data?.message || "Failed to save purchase",
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
        `${PURCHASE_SUB_DELETE}/${deleteItemId}`,
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
    <div className="w-full p-0 md:p-4 space-y-4">
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/purchase")}
          className="shrink-0"
          type="button"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {editId ? "Edit Purchase" : "Create Purchase"}
          </h1>
          <p className="text-sm text-gray-500">
            Manage purchase details and item quantities
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <PurchaseFormHeader
            formData={formData}
            handleInputChange={handleInputChange}
            buyerData={buyerData}
            purchaseRef={purchaseRef}
            editId={editId}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Items Details
            </h2>
          </div>

          <div className="hidden md:block">
            <PurchaseFormTable
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
              boxInputRefs={boxInputRefs}
            />
          </div>

          <div className="md:hidden">
            <PurchaseFormMobile
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
              boxInputRefs={boxInputRefs}
            />
          </div>
        </div>

        <div className="sticky z-0 bottom-0 -mx-0 flex flex-col-reverse gap-2 border-t border-gray-200 bg-white/95 p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] backdrop-blur sm:flex-row sm:justify-end md:rounded-lg md:border md:px-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/purchase")}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black px-8"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editId ? "Update Purchase" : "Save Purchase"}
          </Button>
        </div>
      </form>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this item from the purchase.
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

export default CreatePurchasePage;
