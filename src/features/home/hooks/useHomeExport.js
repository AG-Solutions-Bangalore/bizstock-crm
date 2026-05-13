import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import downloadExcel from "@/components/common/downloadExcel";

export const useHomeExport = (columnVisibility) => {
  const containerRef = useRef();
  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Stock",
    pageStyle: `
      @page { size: A4 portrait; margin: 5mm; }
      @media print {
        body { font-size: 10px; margin: 0mm; padding: 0mm; }
        table { font-size: 11px; }
        .print-hide { display: none; }
      }
    `,
  });

  const downloadStockCSV = (filteredItems, toast) => {
    if (!filteredItems || filteredItems.length === 0) {
      toast?.({ title: "No Data", description: "No data available to export", variant: "destructive" });
      return;
    }

    const headers = [];
    let showAvailable = false;
    let showBoxPiece = false;

    if (columnVisibility?.item_name) headers.push("Item Name");
    if (columnVisibility?.category) headers.push("Category");
    if (columnVisibility?.size) headers.push("Size");

    const isSingleBranchOnly = (singlebranch === "Yes" && doublebranch === "No") || (singlebranch === "No" && doublebranch === "Yes");
    const isDoubleBranch = singlebranch === "Yes" && doublebranch === "Yes";
    const hasPreBooking = filteredItems.some((item) => Number(item.pre_box) > 0 || Number(item.pre_piece) > 0);

    if (columnVisibility.available_box) {
      if (isSingleBranchOnly) {
        headers.push("Available");
        showAvailable = true;
      } else if (isDoubleBranch) {
        if (columnVisibility.box) headers.push("Available Box");
        if (columnVisibility.piece) headers.push("Available Piece");
        showBoxPiece = true;
      }
    }

    if (hasPreBooking) headers.push("Pre booking");

    const getRowData = (item) => {
      const itemPiece = Number(item.item_piece) || 1;
      const openingPurch = Number(item.openpurch) * itemPiece + Number(item.openpurch_piece);
      const openingSale = Number(item.closesale) * itemPiece + Number(item.closesale_piece);
      const purchase = Number(item.purch) * itemPiece + Number(item.purch_piece);
      const sale = Number(item.sale) * itemPiece + Number(item.sale_piece);
      const total = openingPurch - openingSale + (purchase - sale);
      const box = Math.floor(total / itemPiece);
      const piece = total % itemPiece;

      const row = [];
      if (columnVisibility.item_name) row.push(item.item_name || "");
      if (columnVisibility.category) row.push(item.item_category || "");
      if (columnVisibility.size) row.push(item.item_size || "");

      if (columnVisibility.available_box) {
        if (showAvailable) row.push(total);
        else if (showBoxPiece) {
          if (columnVisibility.box) row.push(box);
          if (columnVisibility.piece) row.push(piece);
        }
      }
      if (hasPreBooking) {
        row.push(Number(item.pre_box) > 0 || Number(item.pre_piece) > 0 ? `${item.pre_box} / ${item.pre_piece}` : "");
      }
      return row;
    };

    downloadExcel({
      data: filteredItems,
      sheetName: "Stock Summary",
      headers,
      getRowData,
      fileNamePrefix: "stock_summary",
      toast,
    });
  };

  const downloadOutOfStockCSV = (filteredItemsZero, toast) => {
    if (!filteredItemsZero || filteredItemsZero.length === 0) {
      toast?.({ title: "No Data", description: "No data available to export", variant: "destructive" });
      return;
    }

    const headers = ["Item Name", "Category"];
    let showAvailable = false;
    let showBoxPiece = false;

    if ((singlebranch === "Yes" && doublebranch === "No") || (singlebranch === "No" && doublebranch === "Yes")) {
      headers.push("Minimum Stock", "Available");
      showAvailable = true;
    } else if (singlebranch === "Yes" && doublebranch === "Yes") {
      headers.push("Minimum Box", "Minimum Piece", "Available Box", "Available Piece");
      showBoxPiece = true;
    }

    const getRowData = (item) => {
      const itemPiece = Number(item?.item_piece) || 1;
      const minimumStock = Number(item?.item_minimum_stock) || 0;
      const total = (Number(item.openpurch) * itemPiece + Number(item.openpurch_piece)) -
                    (Number(item.closesale) * itemPiece + Number(item.closesale_piece)) +
                    ((Number(item.purch) * itemPiece + Number(item.purch_piece)) -
                     (Number(item.sale) * itemPiece + Number(item.sale_piece)));

      if (total < minimumStock) {
        const row = [item.item_name || "", item.item_category || ""];
        if (showAvailable) row.push(minimumStock, total);
        else if (showBoxPiece) {
          row.push(Math.round(minimumStock / itemPiece), minimumStock % itemPiece, Math.round(total / itemPiece), total % itemPiece);
        }
        return row;
      }
    };

    downloadExcel({
      data: filteredItemsZero,
      sheetName: "Out of Stock",
      headers,
      getRowData,
      fileNamePrefix: "out_of_stock_summary",
      toast,
    });
  };

  return {
    containerRef,
    handlePrintPdf,
    downloadStockCSV,
    downloadOutOfStockCSV,
  };
};
