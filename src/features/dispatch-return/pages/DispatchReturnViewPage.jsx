import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Printer, Loader2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";

import Page from "@/app/dashboard/page";
import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { ButtonConfig } from "@/config/ButtonConfig";
import usetoken from "@/api/usetoken";
import { dispatchReturnService } from "../api/dispatchReturnService";

const DispatchReturnViewPage = () => {
  const { id } = useParams();
  const containerRef = useRef();
  const token = usetoken();
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  
  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);

  const { data: dispatchData, isLoading } = useQuery({
    queryKey: ["dispatch-return", id],
    queryFn: () => dispatchReturnService.getById(id, token),
    enabled: !!id,
  });

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Dispatch_Return",
    pageStyle: `
      @page { size: A4 portrait; margin: 5mm; }
      @media print {
        body { font-size: 10px; margin: 0mm; padding: 0mm; }
        table { font-size: 11px; }
      }
    `,
  });

  const handleSaveAsPdf = () => {
    if (!containerRef.current) return;
    setIsPdfLoading(true);
    html2pdf()
      .from(containerRef.current)
      .set({
        margin: 10,
        filename: `Dispatch_Return_${id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save()
      .then(() => setIsPdfLoading(false))
      .catch(() => setIsPdfLoading(false));
  };

  if (isLoading) return <Page><div className="flex justify-center items-center h-full"><Loader /></div></Page>;

  const dispatch = dispatchData?.dispatch || {};
  const buyer = dispatchData?.buyer || {};
  const dispatchSub = dispatchData?.dispatchSub || [];

  const totalSubPiece = dispatchSub.reduce((sum, row) => sum + (row.dispatch_sub_piece || 0), 0);
  const totalSubBox = dispatchSub.reduce((sum, row) => sum + (row.dispatch_sub_box || 0), 0);
  const totalWeight = dispatchSub.reduce((sum, row) => sum + ((row.item_weight || 0) * (row.dispatch_sub_box || 0)), 0);

  return (
    <Page>
      <div className={`sticky top-0 z-10 border border-gray-200 rounded-lg ${ButtonConfig.cardheaderColor} shadow-sm p-4 mb-4`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Dispatch Return Details</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex-1`} onClick={handlePrintPdf}>
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
            <Button className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex-1`} onClick={handleSaveAsPdf} disabled={isPdfLoading}>
              {isPdfLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Printer className="h-4 w-4 mr-2" />} PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-black max-w-3xl mx-auto p-8" ref={containerRef}>
        <h2 className="text-center font-bold text-2xl mb-6">RUFF PERFORMA</h2>

        <div className="grid grid-cols-2 border border-black mb-6">
          <div className="border-r border-black">
            <div className="p-3 border-b border-black"><span className="font-bold">Name:</span> {buyer.buyer_name}</div>
            <div className="p-3"><span className="font-bold">Ref No:</span> {dispatch.dispatch_ref_no}</div>
          </div>
          <div>
            <div className="p-3 border-b border-black"><span className="font-bold">City:</span> {buyer.buyer_city}</div>
            <div className="p-3"><span className="font-bold">Date:</span> {moment(dispatch.dispatch_date).format("DD-MMM-YYYY")}</div>
          </div>
        </div>

        <table className="w-full border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-black text-left">ITEM NAME</th>
              <th className="p-2 border border-black">SIZE</th>
              {singlebranch === "Yes" && doublebranch === "Yes" ? (
                <th className="border border-black" colSpan={2}>QUANTITY</th>
              ) : (
                <th className="p-2 border border-black">QUANTITY</th>
              )}
            </tr>
            {singlebranch === "Yes" && doublebranch === "Yes" && (
              <tr className="bg-gray-100">
                <th className="p-2 border border-black text-center text-xs">Box</th>
                <th className="p-2 border border-black text-center text-xs">Piece</th>
              </tr>
            )}
          </thead>
          <tbody>
            {dispatchSub.map((row, index) => (
              <tr key={index}>
                <td className="p-2 border border-black">{row.item_name}</td>
                <td className="p-2 border border-black text-center">{row.item_size}</td>
                {singlebranch === "Yes" && doublebranch === "Yes" ? (
                  <>
                    <td className="p-2 border border-black text-center">{row.dispatch_sub_box}</td>
                    <td className="p-2 border border-black text-center">{row.dispatch_sub_piece}</td>
                  </>
                ) : (
                  <td className="p-2 border border-black text-right">{row.dispatch_sub_box}</td>
                )}
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="p-2 border border-black">TOTAL</td>
              <td className="p-2 border border-black" />
              {singlebranch === "Yes" && doublebranch === "Yes" ? (
                <>
                  <td className="p-2 border border-black text-center">{totalSubBox}</td>
                  <td className="p-2 border border-black text-center">{totalSubPiece}</td>
                </>
              ) : (
                <td className="p-2 border border-black text-right">{totalSubBox}</td>
              )}
            </tr>
          </tbody>
        </table>

        <div className="mt-6 text-sm border border-black">
          {totalWeight > 0 && <p className="p-3 border-b border-black"><span className="font-bold">WEIGHT:</span> {totalWeight} KG</p>}
          <p className="p-3 border-b border-black"><span className="font-bold">VEHICLE:</span> {dispatch.dispatch_vehicle_no}</p>
          <p className="p-3"><span className="font-bold">REMARK:</span> {dispatch.dispatch_remark}</p>
        </div>
      </div>
    </Page>
  );
};

export default DispatchReturnViewPage;
