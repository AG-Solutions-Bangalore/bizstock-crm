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
  PRE_BOOKING_CREATE,
  PRE_BOOKING_SUB_DELETE,
} from "@/api";
import apiClient from "@/api/axios";
import usetoken from "@/api/usetoken";
import { decryptId } from "@/components/common/Encryption";
import {
  fetchBatchNoByItem,
  useFetchBuyers,
  useFetchGoDown,
  useFetchItems,
  useFetchPreBookingRef,
} from "@/hooks/useApi";

import { PreBookingFormHeader } from "../components/PreBookingForm/PreBookingFormHeader";
import { PreBookingFormTable } from "../components/PreBookingForm/PreBookingFormTable";
import { PreBookingFormMobile } from "../components/PreBookingForm/PreBookingFormMobile";

const PreBookingFormPage = () => {
  const { id } = useParams();
  const decryptedId = id ? decryptId(id) || id : null;
  const editId = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = usetoken();

  const showValidationToast = (message) => {
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: message,
    });
  };

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
    pre_booking_date: today,
    pre_booking_buyer_id: "",
    pre_booking_ref_no: "",
    pre_booking_vehicle_no: "",
    pre_booking_buyer_city: "",
    pre_booking_remark: "",
    pre_booking_status: editId ? "" : null,
  });

  const [invoiceData, setInvoiceData] = useState([
    {
      id: editId ? "" : null,
      pre_booking_sub_item_id: "",
      pre_booking_sub_godown_id: "",
      pre_booking_sub_batch_no: "",
      pre_booking_sub_box: 0,
      item_brand: "",
      item_size: "",
      pre_booking_sub_piece: 0,
      stockData: { total: 0, total_box: 0, total_piece: 0 },
    },
  ]);

  const [batchOptions, setBatchOptions] = useState({});

  const { data: prebookingByid, isFetching } = useQuery({
    queryKey: ["prebooking", decryptedId],
    queryFn: async () => {
      const response = await apiClient.get(
        `${PRE_BOOKING_CREATE}/${decryptedId}`,
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
  const { data: preBookingRef, isLoading: loadingref } =
    useFetchPreBookingRef();

  useEffect(() => {
    if (editId && prebookingByid?.prebooking) {
      setFormData({
        pre_booking_date: prebookingByid.prebooking.pre_booking_date || "",
        pre_booking_buyer_id:
          prebookingByid.prebooking.pre_booking_buyer_id || "",
        pre_booking_buyer_city: prebookingByid.buyer?.buyer_city || "",
        pre_booking_ref_no: prebookingByid.prebooking.pre_booking_ref_no || "",
        pre_booking_vehicle_no:
          prebookingByid.prebooking.pre_booking_vehicle_no || "",
        pre_booking_remark: prebookingByid.prebooking.pre_booking_remark || "",
        pre_booking_status: prebookingByid.prebooking.pre_booking_status || "",
      });

      const mappedData = Array.isArray(prebookingByid.prebookingsub)
        ? prebookingByid.prebookingsub.map((sub) => ({
            id: sub.id || "",
            pre_booking_sub_item_id: sub.pre_booking_sub_item_id || "",
            pre_booking_sub_box: sub.pre_booking_sub_box || 0,
            pre_booking_sub_piece: sub.pre_booking_sub_piece || 0,
            item_brand: sub.item_brand || "",
            item_size: sub.item_size || "",
            pre_booking_sub_godown_id: sub.pre_booking_sub_godown_id,
            pre_booking_sub_batch_no: sub.pre_booking_sub_batch_no,
            stockData: { total: 0, total_box: 0, total_piece: 0 },
          }))
        : [];
      setInvoiceData(mappedData.length > 0 ? mappedData : invoiceData);
    }
  }, [editId, prebookingByid]);

  const addRow = useCallback(() => {
    setInvoiceData((prev) => [
      ...prev,
      {
        pre_booking_sub_item_id: "",
        pre_booking_sub_godown_id: "",
        pre_booking_sub_batch_no: "",
        pre_booking_sub_box: 0,
        pre_booking_sub_piece: 0,
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

    if (fieldName === "pre_booking_sub_item_id") {
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

      if (updatedData[rowIndex].pre_booking_sub_godown_id) {
        fetchAndSetStock(
          rowIndex,
          value,
          updatedData[rowIndex].pre_booking_sub_godown_id,
        );
      }
    } else if (fieldName === "pre_booking_sub_godown_id") {
      updatedData[rowIndex][fieldName] = value;
      if (updatedData[rowIndex].pre_booking_sub_item_id) {
        fetchAndSetStock(
          rowIndex,
          updatedData[rowIndex].pre_booking_sub_item_id,
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

    if (field === "pre_booking_buyer_id") {
      const selectedBuyer = buyerData?.buyers.find(
        (buyer) => buyer.id == value,
      );
      if (selectedBuyer) {
        updatedFormData.pre_booking_buyer_city = selectedBuyer.buyer_city;
      }
    }
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.pre_booking_date) {
      return showValidationToast("Date is required.");
    }
    if (!formData.pre_booking_buyer_id) {
      return showValidationToast("Buyer is required.");
    }
    if (!formData.pre_booking_ref_no) {
      return showValidationToast("Reference Number is required.");
    }

    for (let i = 0; i < invoiceData.length; i++) {
      if (!invoiceData[i].pre_booking_sub_item_id) {
        return showValidationToast(`Please select an Item for row ${i + 1} in Items Details.`);
      }
    }

    setIsLoading(true);
    try {
      const payload = { ...formData, pre_booking_product_data: invoiceData };
      const url = editId
        ? `${PRE_BOOKING_CREATE}/${decryptedId}`
        : PRE_BOOKING_CREATE;
      const method = editId ? "put" : "post";

      const response = await apiClient[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response?.data.code === 200) {
        toast({ title: "Success", description: response.data.msg });
        navigate("/pre-booking");
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
          error?.response?.data?.message || "Failed to save prebooking",
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
        `${PRE_BOOKING_SUB_DELETE}/${deleteItemId}`,
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
          onClick={() => navigate("/pre-booking")}
          className="shrink-0"
          type="button"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0 ">
          <h1 className="text-xl  md:text-2xl font-bold text-gray-900">
            {editId ? "Edit PreBooking" : "Create PreBooking"}
          </h1>
          <p className="text-sm text-gray-500">
            Manage pre-booking details and item quantities
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <PreBookingFormHeader
            formData={formData}
            handleInputChange={handleInputChange}
            buyerData={buyerData}
            preBookingRef={preBookingRef}
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
            <PreBookingFormTable
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
            <PreBookingFormMobile
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
        </div>

        <div className="sticky bottom-0 z-0 flex flex-col-reverse gap-2 border-t border-gray-200 bg-white/95 p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] backdrop-blur sm:flex-row sm:justify-end md:rounded-lg md:border md:px-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/pre-booking")}
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
            {editId ? "Update PreBooking" : "Save PreBooking"}
          </Button>
        </div>
      </form>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this item from the pre-booking.
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

export default PreBookingFormPage;
