import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import usetoken from "@/api/usetoken";
import { decryptId } from "@/components/common/Encryption";
import { useQuotation } from "../hooks/useQuotation";
import { fetchAvaiableItem } from "@/api";
import { fetchBatchNoByItem } from "@/hooks/useApi";
import moment from "moment";

import QuotationFormHeader from "../components/QuotationForm/QuotationFormHeader";
import QuotationFormTable from "../components/QuotationForm/QuotationFormTable";
import QuotationFormMobile from "../components/QuotationForm/QuotationFormMobile";

const QuotationFormPage = () => {
  const { id } = useParams();
  const decryptedId = id ? decryptId(id) : null;
  const navigate = useNavigate();
  const token = usetoken();
  const { toast } = useToast();

  const { useQuotationById, createQuotation, updateQuotation } =
    useQuotation(token);
  const { data: quotationByid, isFetching } = useQuotationById(decryptedId);

  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);
  const userbatch = useSelector((state) => state.auth?.branch_batch);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    quotation_date: moment().format("YYYY-MM-DD"),
    quotation_buyer_id: "",
    quotation_ref_no: "",
    quotation_vehicle_no: "",
    quotation_remark: "",
    quotation_status: id ? "" : null,
  });

  const [invoiceData, setInvoiceData] = useState([
    {
      quotation_sub_item_id: "",
      quotation_sub_godown_id: "",
      quotation_sub_batch_no: "",
      quotation_sub_rate: "",
      quotation_sub_box: 0,
      quotation_sub_piece: 0,
      stockData: { total: 0, total_box: 0, total_piece: 0 },
    },
  ]);

  useEffect(() => {
    if (decryptedId && quotationByid?.quotation) {
      setFormData({
        quotation_date: quotationByid.quotation.quotation_date || "",
        quotation_buyer_id: quotationByid.quotation.quotation_buyer_id || "",
        quotation_ref_no: quotationByid.quotation.quotation_ref_no || "",
        quotation_vehicle_no:
          quotationByid.quotation.quotation_vehicle_no || "",
        quotation_remark: quotationByid.quotation.quotation_remark || "",
        quotation_status: quotationByid.quotation.quotation_status || "",
      });

      const mappedData = Array.isArray(quotationByid.quotationSub)
        ? quotationByid.quotationSub.map((sub) => ({
            id: sub.id || "",
            quotation_sub_item_id: sub.quotation_sub_item_id || "",
            quotation_sub_godown_id: sub.quotation_sub_godown_id || "",
            quotation_sub_batch_no: sub.quotation_sub_batch_no || "",
            quotation_sub_rate: sub.quotation_sub_rate || "",
            quotation_sub_box: sub.quotation_sub_box || 0,
            quotation_sub_piece: sub.quotation_sub_piece || 0,
            stockData: { total: 0, total_box: 0, total_piece: 0 },
          }))
        : [];
      setInvoiceData(
        mappedData.length > 0
          ? mappedData
          : [
              {
                quotation_sub_item_id: "",
                quotation_sub_godown_id: "",
                quotation_sub_batch_no: "",
                quotation_sub_rate: "",
                quotation_sub_box: 0,
                quotation_sub_piece: 0,
                stockData: { total: 0, total_box: 0, total_piece: 0 },
              },
            ],
      );
    }
  }, [decryptedId, quotationByid]);

  const fetchAndSetStock = async (rowIndex, itemId, godownId) => {
    if (!itemId || !godownId) return;
    try {
      const response = await fetchAvaiableItem(itemId, godownId, token);
      const buyer = response?.stock?.[0];
      const itemPiece = Number(buyer?.item_piece || 1);
      const safeNum = (v) => Number(v) || 0;

      const opening =
        safeNum(buyer?.openpurch) * itemPiece +
        safeNum(buyer?.openpurch_piece) -
        (safeNum(buyer?.closesale) * itemPiece +
          safeNum(buyer?.closesale_piece)) -
        (safeNum(buyer?.openpurchR) * itemPiece +
          safeNum(buyer?.openpurchR_piece)) +
        (safeNum(buyer?.closesaleR) * itemPiece +
          safeNum(buyer?.closesaleR_piece));

      const current =
        safeNum(buyer?.purch) * itemPiece +
        safeNum(buyer?.purch_piece) -
        (safeNum(buyer?.purchR) * itemPiece + safeNum(buyer?.purchR_piece)) -
        (safeNum(buyer?.sale) * itemPiece + safeNum(buyer?.sale_piece)) +
        (safeNum(buyer?.saleR) * itemPiece + safeNum(buyer?.saleR_piece));

      const total = opening + current;
      setInvoiceData((prev) => {
        const newData = [...prev];
        newData[rowIndex].stockData = {
          total,
          total_box: Math.floor(total / itemPiece),
          total_piece: total % itemPiece,
        };
        return newData;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleTableChange = (value, rowIndex, fieldName) => {
    const updatedData = [...invoiceData];
    updatedData[rowIndex][fieldName] = value;

    if (
      fieldName === "quotation_sub_item_id" ||
      fieldName === "quotation_sub_godown_id"
    ) {
      fetchAndSetStock(
        rowIndex,
        updatedData[rowIndex].quotation_sub_item_id,
        updatedData[rowIndex].quotation_sub_godown_id,
      );
    }

    setInvoiceData(updatedData);
  };

  const onBarcodeCheck = (barcode, rowIndex) => {
    // Implement barcode logic here if itemsData is available or fetch directly
    toast({ title: "Barcode Scanned", description: barcode });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = { ...formData, quotation_product_data: invoiceData };
      let res;
      if (decryptedId) {
        res = await updateQuotation.mutateAsync({
          id: decryptedId,
          data: payload,
        });
      } else {
        res = await createQuotation.mutateAsync(payload);
      }
      if (res?.code === 200) navigate("/quotation");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/quotation")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {decryptedId ? "Edit Quotation" : "Create Quotation"}
        </h1>
      </div>

      <div className="hidden md:block p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <QuotationFormHeader
            formData={formData}
            handleInputChange={(e, f) =>
              setFormData((p) => ({
                ...p,
                [f]: e?.target ? e.target.value : e,
              }))
            }
            isEdit={!!decryptedId}
          />
          <QuotationFormTable
            invoiceData={invoiceData}
            handleTableChange={handleTableChange}
            addRow={() =>
              setInvoiceData((p) => [
                ...p,
                {
                  quotation_sub_item_id: "",
                  quotation_sub_godown_id: "",
                  quotation_sub_batch_no: "",
                  quotation_sub_rate: "",
                  quotation_sub_box: 0,
                  quotation_sub_piece: 0,
                  stockData: { total: 0, total_box: 0, total_piece: 0 },
                },
              ])
            }
            removeRow={(i) =>
              setInvoiceData((p) => p.filter((_, idx) => idx !== i))
            }
            singlebranch={singlebranch}
            doublebranch={doublebranch}
            userbatch={userbatch}
            token={token}
            isEdit={!!decryptedId}
            onBarcodeCheck={onBarcodeCheck}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/quotation")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {decryptedId ? "Update Quotation" : "Create Quotation"}
            </Button>
          </div>
        </form>
      </div>

      <div className="md:hidden">
        <QuotationFormMobile
          formData={formData}
          invoiceData={invoiceData}
          handleInputChange={(e, f) =>
            setFormData((p) => ({ ...p, [f]: e?.target ? e.target.value : e }))
          }
          handleTableChange={handleTableChange}
          addRow={() =>
            setInvoiceData((p) => [
              ...p,
              {
                quotation_sub_item_id: "",
                quotation_sub_godown_id: "",
                quotation_sub_batch_no: "",
                quotation_sub_rate: "",
                quotation_sub_box: 0,
                quotation_sub_piece: 0,
                stockData: { total: 0, total_box: 0, total_piece: 0 },
              },
            ])
          }
          removeRow={(i) =>
            setInvoiceData((p) => p.filter((_, idx) => idx !== i))
          }
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isEdit={!!decryptedId}
        />
      </div>
    </div>
  );
};

export default QuotationFormPage;
