import React, { useRef, useState, useEffect } from "react";
import Page from "@/app/dashboard/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { useStockReport } from "../hooks/useStock";
import { getTodayDate } from "@/utils/currentDate";
import downloadExcel from "@/components/common/downloadExcel";
import StockTable from "../components/StockTable";

const StockViewPage = () => {
  const containerRef = useRef();
  const currentDate = getTodayDate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categories, setCategories] = useState(["All Categories"]);
  const [brands, setBrands] = useState(["All Brands"]);
  const [selectedBrands, setSelectedBrands] = useState("All Brands");
  
  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);
  const columnVisibility = useSelector((state) => state.columnVisibility);

  const { data: stockData, isFetching, isError, refetch } = useStockReport();

  useEffect(() => {
    if (stockData && stockData.length > 0) {
      const uniqueCategories = [
        ...new Set(stockData.map((item) => item.item_category)),
      ];
      const uniqueBrands = [
        ...new Set(stockData.map((item) => item.item_brand)),
      ];
      
      const sortedBrands = uniqueBrands
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

      const sortedCategories = uniqueCategories
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

      setBrands(["All Brands", ...sortedBrands]);
      setCategories(["All Categories", ...sortedCategories]);
    }
  }, [stockData]);

  const calculateStock = (item) => {
    const itemPiece = Number(item.item_piece) || 1;
    const openingPurch = Number(item.openpurch) * itemPiece + Number(item.openpurch_piece);
    const openingSale = Number(item.closesale) * itemPiece + Number(item.closesale_piece);
    const openingPurchR = Number(item.openpurchR || 0) * itemPiece + Number(item.openpurchR_piece || 0);
    const openingSaleR = Number(item.closesaleR || 0) * itemPiece + Number(item.closesaleR_piece || 0);
    const openingBalance = (openingPurch - openingSale) - (openingPurchR - openingSaleR);

    const purchase = Number(item.purch) * itemPiece + Number(item.purch_piece);
    const purchaseR = Number(item.purchR || 0) * itemPiece + Number(item.purchR_piece || 0);
    const sale = Number(item.sale) * itemPiece + Number(item.sale_piece);
    const saleR = Number(item.saleR || 0) * itemPiece + Number(item.saleR_piece || 0);

    return openingBalance + (purchase - purchaseR) - (sale - saleR);
  };

  const filteredItems = stockData?.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const total = calculateStock(item);
    
    const matchesSearch =
      (item?.item_name || "").toLowerCase().includes(searchLower) ||
      (item?.item_category || "").toLowerCase().includes(searchLower) ||
      (item?.item_size || "").toLowerCase().includes(searchLower) ||
      total.toString().toLowerCase().includes(searchLower);

    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.item_category === selectedCategory;
    const matchesBrand =
      selectedBrands === "All Brands" || item.item_brand === selectedBrands;

    return matchesSearch && matchesCategory && matchesBrand;
  }) || [];

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Stock Report",
    pageStyle: `@page { size: A4; } @media print { body { font-size: 10px; margin: 0; padding: 0; } table { font-size: 11px; border-collapse: collapse; width: 100%; } .print-hide { display: none !important; } th, td { border: 1px solid black; padding: 4px; text-align: center; } thead { background-color: #f0f0f0; } }`,
  });

  const downloadCSV = (filteredItems, toast) => {
    if (!filteredItems || filteredItems.length === 0) {
      toast?.({ title: "No Data", description: "No data available to export", variant: "destructive" });
      return;
    }

    const headers = [];
    let showAvailable = false;
    let showBoxPiece = false;

    if (columnVisibility?.item_name) headers.push("Item Name");
    if (columnVisibility?.category) headers.push("Category");
    if (columnVisibility?.brand) headers.push("Brand");
    if (columnVisibility?.size) headers.push("Size");

    const isSingleBranchOnly = (singlebranch === "Yes" && doublebranch === "No") || (singlebranch === "No" && doublebranch === "Yes");
    const isDoubleBranch = singlebranch === "Yes" && doublebranch === "Yes";
    const hasPreBooking = filteredItems.some(item => Number(item.pre_box) > 0 || Number(item.pre_piece) > 0);

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
      const total = calculateStock(item);
      const box = Math.floor(total / itemPiece);
      const piece = total % itemPiece;

      const row = [];
      if (columnVisibility.item_name) row.push(item.item_name || "");
      if (columnVisibility.category) row.push(item.item_category || "");
      if (columnVisibility.brand) row.push(item.item_brand || "");
      if (columnVisibility.size) row.push(item.item_size || "");

      if (columnVisibility.available_box) {
        if (showAvailable) row.push(total);
        else if (showBoxPiece) {
          if (columnVisibility.box) row.push(box);
          if (columnVisibility.piece) row.push(piece);
        }
      }

      if (hasPreBooking) row.push(Number(item.pre_box) > 0 || Number(item.pre_piece) > 0 ? `${item.pre_box} / ${item.pre_piece}` : "");

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

  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader><CardTitle className="text-destructive">Error Fetching Stock</CardTitle></CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} variant="outline">Try Again</Button>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card className="shadow-sm border-0">
        <CardContent className="p-2">
          <StockTable
            title="Stock View"
            selectedCategory={selectedCategory}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredItems={filteredItems}
            categories={categories}
            containerRef={containerRef}
            handlePrintPdf={handlePrintPdf}
            downloadCSV={downloadCSV}
            currentDate={currentDate}
            print="true"
            brands={brands}
            loading={isFetching}
          />
        </CardContent>
      </Card>
    </Page>
  );
};

export default StockViewPage;
