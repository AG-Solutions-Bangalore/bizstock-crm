import React, { useRef, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import ExcelJS from "exceljs";
import { useToast } from "@/hooks/use-toast";
import { useFetchItems } from "@/hooks/useApi";
import { useSingleItemStock } from "../hooks/useReport";
import SingleItemStockFilters from "../components/SingleItemStockFilters";
import SingleItemStockTable from "../components/SingleItemStockTable";
import Loader from "@/components/loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SingleItemStockPage = () => {
  const containerRef = useRef(null);
  const { toast } = useToast();
  
  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);
  const isDoubleBranch = singlebranch === "Yes" && doublebranch === "Yes";

  const [formData, setFormData] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    item_name: "",
  });

  const [activeParams, setActiveParams] = useState(null);

  const { data: reportData, isLoading, isError, refetch } = useSingleItemStock(activeParams || {});
  const { data: itemsData } = useFetchItems();

  const handleInputChange = (field, e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.item_name) {
      toast({ title: "Missing Item", description: "Please select an item", variant: "destructive" });
      return;
    }
    setActiveParams(formData);
  };

  const processedData = useMemo(() => {
    const itemData = reportData?.stock?.[0] || reportData?.items?.[0];
    if (!itemData) return { openingStock: {box:0, piece:0}, closingStock: {box:0, piece:0}, transactions: [], itemDetails: null };
    
    const stock = itemData;
    const itemPiece = Number(stock.item_piece) || 1;
    
    const openingPurch = Number(stock.openpurch || 0) * itemPiece + Number(stock.openpurch_piece || 0);
    const openingSale = Number(stock.closesale || 0) * itemPiece + Number(stock.closesale_piece || 0);
    const openingPurchR = Number(stock.openpurchR || 0) * itemPiece + Number(stock.openpurchR_piece || 0);
    const openingSaleR = Number(stock.closesaleR || 0) * itemPiece + Number(stock.closesaleR_piece || 0);

    const openingStockPcs = openingPurch - openingSale - openingPurchR + openingSaleR;
    
    const toBoxPiece = (val) => ({
      box: Math.floor(val / itemPiece),
      piece: val % itemPiece,
    });

    const purchaseTransactions = reportData?.purchase?.map((p) => {
      const pcs = (p?.purchase_sub_box ?? 0) * itemPiece + (p?.purchase_sub_piece ?? 0);
      const bp = toBoxPiece(pcs);
      return { date: p?.purchase_date, ref: `P-${(p?.purchase_ref || "").split("-").pop()}`, boxes: bp.box, piece: bp.piece, type: "purchase", rawDate: new Date(p?.purchase_date) };
    }) || [];

    const purchaseReturnTransactions = reportData?.purchaseR?.map((p) => {
      const pcs = (p?.purchase_sub_box ?? 0) * itemPiece + (p?.purchase_sub_piece ?? 0);
      const bp = toBoxPiece(pcs);
      return { date: p?.purchase_date, ref: `PR-${(p?.purchase_ref || "").split("-").pop()}`, boxes: bp.box, piece: bp.piece, type: "purchasereturn", rawDate: new Date(p?.purchase_date) };
    }) || [];

    const saleTransactions = reportData?.sale?.map((s) => {
      const pcs = (s?.dispatch_sub_box ?? 0) * itemPiece + (s?.dispatch_sub_piece ?? 0);
      const bp = toBoxPiece(pcs);
      return { date: s?.dispatch_date, ref: `S-${(s?.dispatch_ref || "").split("-").pop()}`, boxes: bp.box, piece: bp.piece, type: "sale", rawDate: new Date(s?.dispatch_date) };
    }) || [];

    const saleReturnTransactions = reportData?.saleR?.map((s) => {
      const pcs = (s?.dispatch_sub_box ?? 0) * itemPiece + (s?.dispatch_sub_piece ?? 0);
      const bp = toBoxPiece(pcs);
      return { date: s?.dispatch_date, ref: `SR-${(s?.dispatch_ref || "").split("-").pop()}`, boxes: bp.box, piece: bp.piece, type: "salereturn", rawDate: new Date(s?.dispatch_date) };
    }) || [];

    const allTransactions = [...purchaseTransactions, ...purchaseReturnTransactions, ...saleTransactions, ...saleReturnTransactions].sort((a, b) => a.rawDate - b.rawDate);

    const fromDate = new Date(formData.from_date);
    const toDate = new Date(formData.to_date);
    
    let currentBalancePcs = openingStockPcs;
    const filteredTransactions = [];

    allTransactions.forEach((t) => {
      const delta = (t.type === "purchase" || t.type === "salereturn") ? (t.boxes * itemPiece + t.piece) : -(t.boxes * itemPiece + t.piece);
      
      if (t.rawDate < fromDate) {
        currentBalancePcs += delta;
      } else if (t.rawDate <= toDate) {
        currentBalancePcs += delta;
        filteredTransactions.push({ ...t, balance: toBoxPiece(currentBalancePcs) });
      }
    });

    return {
      openingStock: toBoxPiece(openingStockPcs),
      closingStock: toBoxPiece(currentBalancePcs),
      transactions: filteredTransactions,
      itemDetails: stock,
    };
  }, [reportData, formData.from_date, formData.to_date]);

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: `Stock_Ledger_${formData.item_name}`,
  });

  const downloadExcel = async () => {
    if (!processedData.itemDetails) return;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Item Stock");

    worksheet.addRow([`Stock Report - ${processedData.itemDetails.item_name}`]);
    worksheet.addRow([`From: ${moment(formData.from_date).format("DD-MM-YYYY")} To: ${moment(formData.to_date).format("DD-MM-YYYY")}`]);
    worksheet.addRow([]);

    // Simplified header for Excel - can be improved to match table exactly if needed
    const headers = ["Date", "Reference", "Type", "Box", "Pc", "Balance Box", "Balance Pc"];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell(c => { c.font = {bold: true}; c.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'F3F4F6'}}; });

    processedData.transactions.forEach(t => {
      worksheet.addRow([moment(t.date).format("DD MMM YYYY"), t.ref, t.type, t.boxes, t.piece, t.balance.box, t.balance.piece]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Stock_Ledger_${formData.item_name}.xlsx`;
    link.click();
  };

  if (isError) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader><CardTitle className="text-destructive">Error Fetching Stock</CardTitle></CardHeader>
        <CardContent><Button onClick={() => refetch()} variant="outline">Try Again</Button></CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
        <SingleItemStockFilters
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          itemsData={itemsData}
          downloadExcel={downloadExcel}
          handlePrintPdf={handlePrintPdf}
        />

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]"><Loader /></div>
        ) : processedData.itemDetails ? (
          <SingleItemStockTable
            {...processedData}
            isDoubleBranch={isDoubleBranch}
            containerRef={containerRef}
            formData={formData}
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
            <p>Search for an item to view its detailed stock ledger.</p>
          </div>
        )}
      </div>
  );
};

export default SingleItemStockPage;
