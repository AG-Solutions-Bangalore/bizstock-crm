import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";

import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { ButtonConfig } from "@/config/ButtonConfig";
import { decryptId } from "@/components/common/Encryption";
import usetoken from "@/api/usetoken";
import { purchaseService } from "../api/purchaseService";

const PurchaseViewPage = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);
  const containerRef = useRef();
  const token = usetoken();
  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);

  const { data: purchaseData, isLoading } = useQuery({
    queryKey: ["purchase", decryptedId],
    queryFn: () => purchaseService.getById(decryptedId, token),
    enabled: !!decryptedId,
  });

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Purchase",
    pageStyle: `
      @page { size: A4 portrait; margin: 5mm; }
      @media print {
        body { font-size: 10px; margin: 0mm; padding: 0mm; }
        table { font-size: 11px; }
        .print-hide { display: none; }
      }
    `,
  });

  const handleSaveAsPdf = () => {
    if (!containerRef.current) return;
    html2pdf()
      .from(containerRef.current)
      .set({
        margin: 10,
        filename: `Purchase_${decryptedId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );

  const purchase = purchaseData?.purchase || {};
  const buyer = purchaseData?.buyer || {};
  const purchasesubData = purchaseData?.purchaseSub || [];

  const totalPurchaseSubPiece = purchasesubData.reduce(
    (sum, row) => sum + (row.purchase_sub_piece || 0),
    0,
  );
  const totalPurchaseSubBox = purchasesubData.reduce(
    (sum, row) => sum + (row.purchase_sub_box || 0),
    0,
  );
  const totalPurchaseWeight = purchasesubData.reduce(
    (sum, row) => sum + (row.item_weight || 0) * (row.purchase_sub_box || 0),
    0,
  );

  return (
    <div className="w-full">
      <div
        className={`sticky top-0 z-10 border border-gray-200 rounded-lg ${ButtonConfig.cardheaderColor} shadow-sm p-4 mb-4`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Purchase Details</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex-1`}
              onClick={handlePrintPdf}
            >
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
            <Button
              className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex-1`}
              onClick={handleSaveAsPdf}
            >
              <Printer className="h-4 w-4 mr-2" /> PDF
            </Button>
          </div>
        </div>
      </div>

      <div
        className="bg-white border border-black max-w-4xl mx-auto p-8"
        ref={containerRef}
      >
        <h2 className="text-center font-bold text-2xl mb-6">PURCHASE</h2>

        <div className="grid grid-cols-2 border border-black mb-6">
          <div className="border-r border-black">
            <div className="p-3 border-b border-black">
              <span className="font-bold">Name:</span> {buyer.buyer_name}
            </div>
            <div className="p-3">
              <span className="font-bold">Ref No:</span> {purchase.purchase_ref}
            </div>
          </div>
          <div>
            <div className="p-3 border-b border-black">
              <span className="font-bold">City:</span> {buyer.buyer_city}
            </div>
            <div className="p-3">
              <span className="font-bold">Date:</span>{" "}
              {moment(purchase.purchase_date).format("DD-MMM-YYYY")}
            </div>
          </div>
        </div>

        <table className="w-full border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100">
              <th
                rowSpan={2}
                className=" rowSpan={2} p-2 border border-black text-left"
              >
                ITEM NAME
              </th>
              <th rowSpan={2} className="p-2 border border-black">
                SIZE
              </th>
              {singlebranch === "Yes" && doublebranch === "Yes" ? (
                <th className="border border-black" colSpan={2}>
                  QUANTITY
                </th>
              ) : (
                <th colSpan={2} className=" p-2 border border-black">
                  QUANTITY
                </th>
              )}
            </tr>
            {singlebranch === "Yes" && doublebranch === "Yes" && (
              <tr className="bg-gray-100">
                <th className="p-2 border border-black text-center text-xs">
                  Box
                </th>
                <th className="p-2 border border-black text-center text-xs">
                  Piece
                </th>
              </tr>
            )}
          </thead>
          <tbody>
            {purchasesubData.map((row, index) => (
              <tr key={index}>
                <td className="p-2 border border-black">{row.item_name}</td>
                <td className="p-2 border border-black text-center">
                  {row.item_size}
                </td>
                {singlebranch === "Yes" && doublebranch === "Yes" ? (
                  <>
                    <td className="p-2 border border-black text-center">
                      {row.purchase_sub_box}
                    </td>
                    <td className="p-2 border border-black text-center">
                      {row.purchase_sub_piece}
                    </td>
                  </>
                ) : (
                  <td className="p-2 border border-black text-right">
                    {row.purchase_sub_box}
                  </td>
                )}
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="p-2 border border-black" colSpan={2}>
                TOTAL
              </td>
              {singlebranch === "Yes" && doublebranch === "Yes" ? (
                <>
                  <td className="p-2 border border-black text-center">
                    {totalPurchaseSubBox}
                  </td>
                  <td className="p-2 border border-black text-center">
                    {totalPurchaseSubPiece}
                  </td>
                </>
              ) : (
                <td className="p-2 border border-black text-right">
                  {totalPurchaseSubBox}
                </td>
              )}
            </tr>
          </tbody>
        </table>

        <div className="mt-6 text-sm border border-black">
          {totalPurchaseWeight > 0 && (
            <p className="p-2 border-b border-black">
              <span className="font-bold">WEIGHT:</span> {totalPurchaseWeight}{" "}
              KG
            </p>
          )}
          <p className="p-2 border-b border-black">
            <span className="font-bold">VEHICLE:</span>{" "}
            {purchase.purchase_vehicle_no}
          </p>
          <p className="p-2">
            <span className="font-bold">REMARK:</span>{" "}
            {purchase.purchase_remark}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseViewPage;
