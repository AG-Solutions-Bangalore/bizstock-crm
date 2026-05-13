import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Page from "@/app/dashboard/page";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/api/axios";
import { BUYER_DOWNLOAD } from "@/api";
import { useBuyerSummaryReport } from "../hooks/useReport";
import BuyerReportTable from "../components/BuyerReportTable";
import Loader from "@/components/loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, FileDown, Download } from "lucide-react";
import { ButtonConfig } from "@/config/ButtonConfig";

const BuyerReportPage = () => {
  const containerRef = useRef();
  const { toast } = useToast();

  const { data: buyerData, isLoading, isError, refetch } = useBuyerSummaryReport();

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Buyer_Summary_Report",
  });

  const handleDownload = async () => {
    try {
      const response = await apiClient.post(
        `${BUYER_DOWNLOAD}`,
        {},
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Buyers_${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Buyer data downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Download failed",
        variant: "destructive",
      });
    }
  };

  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader><CardTitle className="text-destructive">Error Fetching Buyers</CardTitle></CardHeader>
          <CardContent><Button onClick={() => refetch()} variant="outline">Try Again</Button></CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <div className="p-4 md:p-6 space-y-6">
        <div className={`border border-gray-200 rounded-xl ${ButtonConfig.cardheaderColor} shadow-sm p-4 mb-2`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">Buyer Summary</h1>
              <p className="text-sm text-gray-500">Overview of all registered buyers and their status.</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none border-gray-200 shadow-sm"
                onClick={handlePrintPdf}
              >
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
              <Button
                className={`flex-1 sm:flex-none ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} shadow-md`}
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" /> Download CSV
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : (
          <BuyerReportTable
            buyerData={buyerData?.buyer || []}
            containerRef={containerRef}
          />
        )}
      </div>
    </Page>
  );
};

export default BuyerReportPage;
