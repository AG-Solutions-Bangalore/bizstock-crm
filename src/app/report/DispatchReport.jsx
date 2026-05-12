import { DISPATCH_REPORT } from "@/api";
import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFetchBuyers } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import ExcelJS from "exceljs";
import { Search } from "lucide-react";
import moment from "moment";
import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import Page from "../dashboard/page";
import apiClient from "@/api/axios";
import usetoken from "@/api/usetoken";
import DispatchItemDetailsDialog from "./components/DispatchItemDetailsDialog";
import DispatchItemDetailsView from "./components/DispatchItemDetailsView";
import DispatchReportHeader from "./components/DispatchReportHeader";

const DispatchReport = () => {
  const containerRef = useRef(null);
  const [selectedRef, setSelectedRef] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);
  const isDoubleBranch = singlebranch === "Yes" && doublebranch === "Yes";
  const columnVisibility = useSelector((state) => state.columnVisibility);

  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem("dispatchReportFormData");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
    return {
      from_date: moment().startOf("month").format("YYYY-MM-DD"),
      to_date: moment().format("YYYY-MM-DD"),
      sale_buyer: "",
    };
  });

  useEffect(() => {
    sessionStorage.setItem("dispatchReportFormData", JSON.stringify(formData));
  }, [formData]);

  const { toast } = useToast();
  const token = usetoken();

  const handleInputChange = (field, e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    refetch();
  };

  const DispatchStock = async () => {
    const response = await apiClient.post(
      `${DISPATCH_REPORT}`,
      { ...formData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  };

  const {
    data: reportData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dispatchreportdata", formData],
    queryFn: DispatchStock,
    enabled: false,
  });

  const { data: buyerData } = useFetchBuyers();

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Dispatch_report",
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 5mm;
      }
      @media print {
        body {
          font-size: 10px; 
          margin: 0mm;
          padding: 0mm;
        }
        table {
          font-size: 11px;
        }
        .print-hide {
          display: none;
        }
      }
    `,
  });
  const downloadExcel = async () => {
    if (reportData?.dispatch?.length == 0) {
      toast({
        title: "No Data",
        description: "No data available to export",
        variant: "destructive",
      });
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Dispatch");

    // Add title and metadata
    worksheet.addRow([`Dispatch Report`]);
    worksheet.addRow([
      `From: ${moment(formData.from_date).format("DD-MM-YYYY")} To: ${moment(
        formData.to_date,
      ).format("DD-MM-YYYY")}`,
    ]);
    worksheet.addRow([]);

    // Add headers
    const headers = ["Ref", "Date", "Buyer", "Vehicle No"];
    if (isDoubleBranch) {
      if (columnVisibility.box) headers.push("Box");
      if (columnVisibility.piece) headers.push("Piece");
    } else {
      if (columnVisibility.available_box) headers.push("Box");
    }
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F3F4F6" },
      };
      cell.alignment = { horizontal: "center" };
    });

    // Add transactions
    reportData?.dispatch?.forEach((transaction) => {
      const rowData = [
        transaction.dispatch_ref_no,
        moment(transaction.dispatch_date).format("DD MMM YYYY"),
        transaction.buyer_name,
        transaction.dispatch_vehicle_no,
      ];
      if (isDoubleBranch) {
        if (columnVisibility.box)
          rowData.push(transaction.sum_dispatch_sub_box);
        if (columnVisibility.piece)
          rowData.push(transaction.sum_dispatch_sub_piece);
      } else {
        if (columnVisibility.available_box)
          rowData.push(transaction.sum_dispatch_sub_box);
      }
      worksheet.addRow(rowData);
    });

    if (showDetails && reportData?.details?.length > 0) {
      worksheet.addRow([]);
      worksheet.addRow(["Item Details"]);
      const detailHeaders = [
        "Ref No",
        "Date",
        "Item Name",
        "Size",
        "Brand",
        "Category",
        "Batch No",
      ];
      if (isDoubleBranch) {
        if (columnVisibility.box) detailHeaders.push("Box");
        if (columnVisibility.piece) detailHeaders.push("Piece");
      } else {
        if (columnVisibility.available_box) detailHeaders.push("Box");
      }
      const detHeaderRow = worksheet.addRow(detailHeaders);
      detHeaderRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F3F4F6" },
        };
        cell.alignment = { horizontal: "center" };
      });
      reportData.details.forEach((item) => {
        const dObj = reportData.dispatch.find(
          (d) => d.dispatch_ref === item.dispatch_ref,
        );
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
          if (columnVisibility.piece)
            detailRowData.push(item.dispatch_sub_piece);
        } else {
          if (columnVisibility.available_box)
            detailRowData.push(item.dispatch_sub_box);
        }
        worksheet.addRow(detailRowData);
      });
    }

    // Generate and download Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dispatch.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      );
    }

    if (isError) {
      return (
        <Card className="w-full max-w-md mx-auto mt-6">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Fetching Dispatch Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Unable to retrieve Dispatch information. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (reportData?.dispatch?.length > 0) {
      return (
        <div ref={containerRef} className="mt-4">
          <div className="bg-white rounded-lg shadow-sm p-0 md:p-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold mb-4">Dispatch Report</h2>

              <div className="hidden print:block">
                <h2 className="text-lg font-bold mb-4 flex justify-center">
                  From Date - {moment(formData.from_date).format("DD MMM YYYY")}{" "}
                  To -{moment(formData.to_date).format("DD MMM YYYY")}{" "}
                </h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-[11px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-2 py-2 text-center">
                      Ref No
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left">
                      Date
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left">
                      Buyer Name
                    </th>

                    <th className="border border-gray-300 px-2 py-2 text-right">
                      Vehicle No
                    </th>
                    {isDoubleBranch ? (
                      <>
                        {columnVisibility.box && (
                          <th className="border border-gray-300 px-2 py-2 text-right">
                            Box
                          </th>
                        )}
                        {columnVisibility.piece && (
                          <th className="border border-gray-300 px-2 py-2 text-right">
                            Piece
                          </th>
                        )}
                      </>
                    ) : (
                      columnVisibility.available_box && (
                        <th className="border border-gray-300 px-2 py-2 text-right">
                          Box
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {/* Transactions */}
                  {reportData?.dispatch?.map((transaction, index) => (
                    <tr key={index}>
                      <td
                        className="border border-gray-300 px-2 py-1 text-center border-l border-r text-blue-600 cursor-pointer hover:underline"
                        onClick={() =>
                          setSelectedRef(transaction?.dispatch_ref)
                        }
                      >
                        {transaction?.dispatch_ref_no}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 font-medium">
                        {moment(transaction?.dispatch_date).format(
                          "DD MMM YYYY",
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {transaction?.buyer_name}
                      </td>

                      <td className="border border-gray-300 px-2 py-1 text-right">
                        {transaction?.dispatch_vehicle_no}
                      </td>
                      {isDoubleBranch ? (
                        <>
                          {columnVisibility.box && (
                            <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                              {transaction?.sum_dispatch_sub_box}
                            </td>
                          )}
                          {columnVisibility.piece && (
                            <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                              {transaction?.sum_dispatch_sub_piece}
                            </td>
                          )}
                        </>
                      ) : (
                        columnVisibility.available_box && (
                          <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                            {transaction?.sum_dispatch_sub_box}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Search className="h-12 w-12 mb-2 opacity-30" />
        <p className="text-md">Search for an item to view dispatch details</p>
      </div>
    );
  };

  return (
    <Page>
      <div className="p-0 md:p-4">
        <DispatchReportHeader
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          buyerData={buyerData}
          downloadExcel={downloadExcel}
          handlePrintPdf={handlePrintPdf}
        />

        {renderContent()}

        {/* Dialog for Item Details */}
        <DispatchItemDetailsDialog
          selectedRef={selectedRef}
          setSelectedRef={setSelectedRef}
          reportData={reportData}
          isDoubleBranch={isDoubleBranch}
          columnVisibility={columnVisibility}
        />
      </div>
    </Page>
  );
};

export default DispatchReport;
