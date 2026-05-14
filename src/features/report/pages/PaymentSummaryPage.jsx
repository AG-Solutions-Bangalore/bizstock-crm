import React, { useRef, useState } from "react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { usePaymentSummaryReport } from "../hooks/useReport";
import PaymentSummaryFilters from "../components/PaymentSummaryFilters";
import PaymentSummaryTable from "../components/PaymentSummaryTable";
import Loader from "@/components/loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PaymentSummaryPage = () => {
  const containerRef = useRef(null);
  
  const [formData, setFormData] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
  });

  const [activeParams, setActiveParams] = useState(null);

  const { data: reportData, isLoading, isError, refetch } = usePaymentSummaryReport(activeParams || {});

  const handleInputChange = (field, e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setActiveParams(formData);
  };

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Payment_Summary_Statement",
  });

  if (isError) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader><CardTitle className="text-destructive">Error Fetching Summary</CardTitle></CardHeader>
        <CardContent><Button onClick={() => refetch()} variant="outline">Try Again</Button></CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
        <PaymentSummaryFilters
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handlePrintPdf={handlePrintPdf}
        />

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : reportData ? (
          <PaymentSummaryTable
            reportData={reportData}
            containerRef={containerRef}
            formData={formData}
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
            <p>Please select a date range to generate the payment summary.</p>
          </div>
        )}
      </div>
  );
};

export default PaymentSummaryPage;
