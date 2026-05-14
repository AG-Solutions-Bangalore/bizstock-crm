import React, { useRef, useState } from "react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { useFetchBuyers } from "@/hooks/useApi";
import { usePaymentLedgerReport } from "../hooks/useReport";
import PaymentLedgerFilters from "../components/PaymentLedgerFilters";
import PaymentLedgerTable from "../components/PaymentLedgerTable";
import Loader from "@/components/loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PaymentLedgerPage = () => {
  const containerRef = useRef(null);
  
  const [formData, setFormData] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    buyer_id: "",
  });

  const [errormsg, setErrorMsg] = useState("");
  const [activeParams, setActiveParams] = useState(null);

  const { data: reportData, isLoading, isError, refetch } = usePaymentLedgerReport(activeParams || {});
  const { data: buyerData } = useFetchBuyers();

  const handleInputChange = (field, e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "buyer_id" && value) setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.buyer_id) {
      setErrorMsg("Select a Buyer");
      return;
    }
    setActiveParams(formData);
  };

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Payment_Ledger_Statement",
  });

  if (isError) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader><CardTitle className="text-destructive">Error Fetching Ledger</CardTitle></CardHeader>
        <CardContent><Button onClick={() => refetch()} variant="outline">Try Again</Button></CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
        <PaymentLedgerFilters
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          buyerData={buyerData}
          handlePrintPdf={handlePrintPdf}
          errormsg={errormsg}
        />

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : reportData ? (
          <PaymentLedgerTable
            reportData={reportData}
            containerRef={containerRef}
            formData={formData}
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
            <p>Please select an account and period to generate the statement.</p>
          </div>
        )}
      </div>

  );
};

export default PaymentLedgerPage;
