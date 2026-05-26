import { fetchDispatchInvoiceSubById } from "@/api";
import usetoken from "@/api/usetoken";
import { decryptId } from "@/components/common/Encryption";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useInvoice } from "../hooks/useInvoice";

import InvoiceFormHeader from "../components/InvoiceForm/InvoiceFormHeader";
import InvoiceFormMobile from "../components/InvoiceForm/InvoiceFormMobile";
import InvoiceFormTable from "../components/InvoiceForm/InvoiceFormTable";

const InvoiceFormPage = () => {
  const { id } = useParams();
  const decryptedId = id ? decryptId(id) || id : null;
  const navigate = useNavigate();
  const token = usetoken();
  const { toast } = useToast();
  
  const { useInvoiceById, createInvoice, updateInvoice } = useInvoice(token);
  const { data: invoiceByid, isFetching } = useInvoiceById(decryptedId);

  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);
  const userbatch = useSelector((state) => state.auth?.branch_batch);
  const userType = useSelector((state) => state.auth.user_type);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    invoice_date: "",
    invoice_buyer_id: "",
    invoice_ref_no: id ? "" : null,
    invoice_vehicle_no: "",
    invoice_remark: "",
    invoice_status: "",
  });

  const [invoiceData, setInvoiceData] = useState([
    {
      dispatch_ref: "",
      invoice_sub_item_id: "",
      invoice_sub_godown_id: "",
      invoice_sub_box: "",
      invoice_sub_piece: "",
      invoice_sub_rate: "",
      invoice_sub_amount: "",
      invoice_sub_batch_no: "",
    },
  ]);

  useEffect(() => {
    if (decryptedId && invoiceByid?.invoice) {
      setFormData({
        invoice_date: invoiceByid.invoice.invoice_date || "",
        invoice_buyer_id: invoiceByid.invoice.invoice_buyer_id || "",
        invoice_vehicle_no: invoiceByid.invoice.invoice_vehicle_no || "",
        invoice_remark: invoiceByid.invoice.invoice_remark || "",
        invoice_status: invoiceByid.invoice.invoice_status || "",
        invoice_ref_no: invoiceByid.invoice.invoice_ref_no || "",
      });

      const mappedData = Array.isArray(invoiceByid.invoiceSub)
        ? invoiceByid.invoiceSub.map((sub) => ({
            id: sub.id || "",
            dispatch_ref: sub.dispatch_ref || "",
            invoice_sub_item_id: sub.invoice_sub_item_id || "",
            invoice_sub_godown_id: sub.invoice_sub_godown_id || "",
            invoice_sub_batch_no: sub.invoice_sub_batch_no || "",
            invoice_sub_box: sub.invoice_sub_box || "",
            invoice_sub_piece: sub.invoice_sub_piece || "",
            invoice_sub_rate: sub.invoice_sub_rate || "",
            invoice_sub_amount: sub.invoice_sub_amount || "",
          }))
        : [];
      setInvoiceData(mappedData.length > 0 ? mappedData : [{
        dispatch_ref: "",
        invoice_sub_item_id: "",
        invoice_sub_godown_id: "",
        invoice_sub_box: "",
        invoice_sub_piece: "",
        invoice_sub_rate: "",
        invoice_sub_amount: "",
        invoice_sub_batch_no: "",
      }]);
    }
  }, [decryptedId, invoiceByid]);

  const addRow = useCallback(() => {
    setInvoiceData((prev) => [
      ...prev,
      {
        dispatch_ref: "",
        invoice_sub_item_id: "",
        invoice_sub_godown_id: "",
        invoice_sub_box: "",
        invoice_sub_piece: "",
        invoice_sub_rate: "",
        invoice_sub_amount: "",
        invoice_sub_batch_no: "",
      },
    ]);
  }, []);

  const removeRow = useCallback((index) => {
    setInvoiceData((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleInputChange = (e, field) => {
    const value = e?.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTableChange = async (value, rowIndex, fieldName) => {
    const updatedData = [...invoiceData];
    
    if (fieldName === "dispatch_ref") {
      updatedData[rowIndex][fieldName] = value;
      try {
        const res = await fetchDispatchInvoiceSubById(value, token);
        if (res?.dispatchSub?.length > 0) {
          const mappedRows = res.dispatchSub.map((sub) => {
            const box = Number(sub.dispatch_sub_box ?? 0);
            const piece = Number(sub.dispatch_sub_piece ?? 0);
            const rate = Number(sub.dispatch_sub_rate ?? 0);
            const itemPiece = Number(sub.item_piece ?? 0);
            const totalPieces = box * itemPiece + piece;
            return {
              ...updatedData[rowIndex],
              invoice_sub_item_id: sub.dispatch_sub_item_id ?? "",
              invoice_sub_godown_id: sub.dispatch_sub_godown_id ?? "",
              invoice_sub_batch_no: sub.invoice_sub_batch_no ?? "",
              invoice_sub_box: box,
              invoice_sub_piece: piece,
              invoice_sub_rate: rate,
              invoice_sub_amount: totalPieces * rate,
              item_piece: itemPiece,
            };
          });
          updatedData.splice(rowIndex, 1, ...mappedRows);
        }
      } catch (err) {
        console.error("Error fetching sub data:", err);
      }
    } else {
      updatedData[rowIndex][fieldName] = value;
      
      // Calculation logic
      const box = Number(updatedData[rowIndex].invoice_sub_box ?? 0);
      const piece = Number(updatedData[rowIndex].invoice_sub_piece ?? 0);
      const rate = Number(updatedData[rowIndex].invoice_sub_rate ?? 0);
      const itemPiece = Number(updatedData[rowIndex].item_piece ?? 0);
      const totalPieces = itemPiece * box + piece;
      updatedData[rowIndex].invoice_sub_amount = totalPieces * rate;
    }
    setInvoiceData(updatedData);
  };

  const validate = () => {
    const missing = [];
    if (!formData.invoice_date) missing.push("Date");
    if (!formData.invoice_buyer_id) missing.push("Buyer");
    if (!formData.invoice_ref_no) missing.push("Ref No");
    
    invoiceData.forEach((row, i) => {
      if (!row.invoice_sub_item_id) missing.push(`Row ${i+1}: Item`);
      if (!row.invoice_sub_godown_id) missing.push(`Row ${i+1}: Godown`);
    });

    if (missing.length > 0) {
      toast({
        title: "Validation Error",
        description: `Missing fields: ${missing.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = { ...formData, invoice_product_data: invoiceData };
      let res;
      if (decryptedId) {
        res = await updateInvoice.mutateAsync({ id: decryptedId, data: payload });
      } else {
        res = await createInvoice.mutateAsync(payload);
      }
      if (res?.code === 200) navigate("/invoice");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6 p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/invoice")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{decryptedId ? "Edit Invoice" : "Create Invoice"}</h1>
      </div>

      <div className="hidden md:block p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InvoiceFormHeader 
            formData={formData} 
            handleInputChange={handleInputChange} 
            isEdit={!!decryptedId} 
          />
          <InvoiceFormTable 
            invoiceData={invoiceData} 
            handleTableChange={handleTableChange}
            addRow={addRow}
            removeRow={removeRow}
            singlebranch={singlebranch}
            doublebranch={doublebranch}
            userbatch={userbatch}
            userType={userType}
            token={token}
            buyerId={formData.invoice_buyer_id}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/invoice")}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {decryptedId ? "Update Invoice" : "Create Invoice"}
            </Button>
          </div>
        </form>
      </div>

      <div className="md:hidden">
        <InvoiceFormMobile 
          formData={formData}
          invoiceData={invoiceData}
          handleInputChange={handleInputChange}
          handleTableChange={handleTableChange}
          addRow={addRow}
          removeRow={removeRow}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isEdit={!!decryptedId}
          token={token}
        />
      </div>
    </div>
  );
};

export default InvoiceFormPage;
