import React, { useRef, useState } from "react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import ExcelJS from "exceljs";
import { useToast } from "@/hooks/use-toast";
import { useFetchBuyers } from "@/hooks/useApi";
import { usePurchaseReport } from "../hooks/useReport";
import PurchaseReportFilters from "../components/PurchaseReportFilters";
import PurchaseReportTable from "../components/PurchaseReportTable";
import Loader from "@/components/loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PurchaseReportPage = () => {
  const containerRef = useRef(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    purchase_buyer: "",
  });

  const [activeParams, setActiveParams] = useState(null);

  const { data: reportData, isLoading, isError, refetch } = usePurchaseReport(activeParams || {});
  const { data: buyerData } = useFetchBuyers();

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
    documentTitle: "Purchase_Report",
  });

  const downloadExcel = async () => {
    if (!reportData?.purchase?.length) {
      toast({ title: "No Data", description: "No data available to export", variant: "destructive" });
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Purchase");

    worksheet.addRow([`Purchase Report`]);
    worksheet.addRow([`From: ${moment(formData.from_date).format("DD-MM-YYYY")} To: ${moment(formData.to_date).format("DD-MM-YYYY")}`]);
    worksheet.addRow([]);

    const headers = ["Ref", "Date", "Supplier", "Vehicle No", "Box Count"];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F3F4F6" } };
      cell.alignment = { horizontal: "center" };
    });

    reportData?.purchase?.forEach((transaction) => {
      worksheet.addRow([
        transaction.purchase_ref_no,
        moment(transaction.purchase_date).format("DD MMM YYYY"),
        transaction.purchase_buyer_name,
        transaction.purchase_vehicle_no,
        transaction.sum_purchase_sub_box,
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Purchase_Report_${moment().format("DDMMYY")}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isError) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader><CardTitle className="text-destructive">Error Fetching Purchase Data</CardTitle></CardHeader>
        <CardContent><Button onClick={() => refetch()} variant="outline">Try Again</Button></CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
        <PurchaseReportFilters
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          buyerData={buyerData}
          downloadExcel={downloadExcel}
          handlePrintPdf={handlePrintPdf}
        />

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : reportData?.purchase?.length > 0 ? (
          <PurchaseReportTable
            reportData={reportData}
            containerRef={containerRef}
            formData={formData}
          />
        ) : activeParams ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
            <p>No purchase records found for the selected filters.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
            <p>Please select a supplier and date range to view the purchase report.</p>
          </div>
        )}
    </div>
  );
};

export default PurchaseReportPage;
