import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import ExcelJS from "exceljs";
import { useToast } from "@/hooks/use-toast";
import { useFetchBuyers } from "@/hooks/useApi";
import { useDispatchReport } from "../hooks/useReport";
import DispatchReportFilters from "../components/DispatchReportFilters";
import DispatchReportTable from "../components/DispatchReportTable";
import DispatchItemDetailsView from "../components/DispatchItemDetailsView";
import DispatchItemDetailsDialog from "../components/DispatchItemDetailsDialog";
import Loader from "@/components/loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DispatchReportPage = () => {
  const containerRef = useRef(null);
  const { toast } = useToast();
  
  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);
  const isDoubleBranch = singlebranch === "Yes" && doublebranch === "Yes";
  const columnVisibility = useSelector((state) => state.columnVisibility);

  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem("dispatchReportFormData");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      from_date: moment().startOf("month").format("YYYY-MM-DD"),
      to_date: moment().format("YYYY-MM-DD"),
      sale_buyer: "",
    };
  });

  const [activeParams, setActiveParams] = useState(null);
  const [selectedRef, setSelectedRef] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("dispatchReportFormData", JSON.stringify(formData));
  }, [formData]);

  const { data: reportData, isLoading, isError, refetch } = useDispatchReport(activeParams || {});
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
    documentTitle: "Dispatch_Report",
  });

  const downloadExcel = async () => {
    if (!reportData?.dispatch?.length) {
      toast({ title: "No Data", description: "No data available to export", variant: "destructive" });
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Dispatch");

    worksheet.addRow([`Dispatch Report`]);
    worksheet.addRow([`From: ${moment(formData.from_date).format("DD-MM-YYYY")} To: ${moment(formData.to_date).format("DD-MM-YYYY")}`]);
    worksheet.addRow([]);

    const headers = ["Ref", "Date", "Buyer", "Vehicle No"];
    if (isDoubleBranch) {
      if (columnVisibility.box) headers.push("Box");
      if (columnVisibility.piece) headers.push("Piece");
    } else if (columnVisibility.available_box) {
      headers.push("Box");
    }
    
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F3F4F6" } };
      cell.alignment = { horizontal: "center" };
    });

    reportData?.dispatch?.forEach((transaction) => {
      const rowData = [
        transaction.dispatch_ref_no,
        moment(transaction.dispatch_date).format("DD MMM YYYY"),
        transaction.buyer_name,
        transaction.dispatch_vehicle_no,
      ];
      if (isDoubleBranch) {
        if (columnVisibility.box) rowData.push(transaction.sum_dispatch_sub_box);
        if (columnVisibility.piece) rowData.push(transaction.sum_dispatch_sub_piece);
      } else if (columnVisibility.available_box) {
        rowData.push(transaction.sum_dispatch_sub_box);
      }
      worksheet.addRow(rowData);
    });

    if (showDetails && reportData?.details?.length > 0) {
      worksheet.addRow([]);
      worksheet.addRow(["Item Details"]);
      const detailHeaders = ["Ref No", "Date", "Item Name", "Size", "Brand", "Category", "Batch No"];
      if (isDoubleBranch) {
        if (columnVisibility.box) detailHeaders.push("Box");
        if (columnVisibility.piece) detailHeaders.push("Piece");
      } else if (columnVisibility.available_box) {
        detailHeaders.push("Box");
      }
      const detHeaderRow = worksheet.addRow(detailHeaders);
      detHeaderRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F3F4F6" } };
        cell.alignment = { horizontal: "center" };
      });
      reportData.details.forEach((item) => {
        const dObj = reportData.dispatch.find(d => d.dispatch_ref === item.dispatch_ref);
        const detailRowData = [
          dObj?.dispatch_ref_no || item.dispatch_ref,
          moment(item.dispatch_date).format("DD MMM YYYY"),
          item.item_name,
          item.item_size,
          item.item_brand,
          item.item_category_id,
          item.dispatch_sub_batch_no,
        ];
        if (isDoubleBranch) {
          if (columnVisibility.box) detailRowData.push(item.dispatch_sub_box);
          if (columnVisibility.piece) detailRowData.push(item.dispatch_sub_piece);
        } else if (columnVisibility.available_box) {
          detailRowData.push(item.dispatch_sub_box);
        }
        worksheet.addRow(detailRowData);
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Dispatch_Report_${moment().format("DDMMYY")}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isError) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader><CardTitle className="text-destructive">Error Fetching Dispatch Data</CardTitle></CardHeader>
        <CardContent><Button onClick={() => refetch()} variant="outline">Try Again</Button></CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
        <DispatchReportFilters
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
        ) : reportData?.dispatch?.length > 0 ? (
          <div className="space-y-8 animate-in fade-in duration-500 px-4" ref={containerRef}>
            <DispatchReportTable
              reportData={reportData}
              isDoubleBranch={isDoubleBranch}
              columnVisibility={columnVisibility}
              setSelectedRef={setSelectedRef}
              formData={formData}
            />

            <DispatchItemDetailsView
              formData={formData}
              showDetails={showDetails}
              setShowDetails={setShowDetails}
              handlePrintPdf={handlePrintPdf}
              downloadExcel={downloadExcel}
              reportData={reportData}
              isDoubleBranch={isDoubleBranch}
              columnVisibility={columnVisibility}
            />
          </div>
        ) : activeParams ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
            <p>No dispatch records found for the selected filters.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
            <p>Please select a buyer and date range to view the dispatch report.</p>
          </div>
        )}

        <DispatchItemDetailsDialog
          selectedRef={selectedRef}
          setSelectedRef={setSelectedRef}
          reportData={reportData}
          isDoubleBranch={isDoubleBranch}
          columnVisibility={columnVisibility}
        />
      </div>
  );
};

export default DispatchReportPage;
