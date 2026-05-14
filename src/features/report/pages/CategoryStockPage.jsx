import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import { useToast } from "@/hooks/use-toast";
import { useFetchCategory } from "@/hooks/useApi";
import { useCategoryStock } from "../hooks/useReport";
import { toggleCategoryColumn } from "@/redux/categoryColumnVisibilitySlice";
import CategoryStockFilters from "../components/CategoryStockFilters";
import CategoryStockTable from "../components/CategoryStockTable";
import Loader from "@/components/loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CategoryStockPage = () => {
  const containerRef = useRef();
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const columnVisibility = useSelector((state) => state.categorycolumnVisibility);
  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);

  const [formData, setFormData] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    category_id: "",
  });

  const [activeParams, setActiveParams] = useState(null);
  const [brands, setBrands] = useState(["All Brands"]);
  const [selectedBrands, setSelectedBrands] = useState("All Brands");

  const { data: Categorystockdata, isLoading, isError, refetch } = useCategoryStock(activeParams || {});
  const { data: categoryData } = useFetchCategory();

  const handleInputChange = (field, valueOrEvent) => {
    const value = typeof valueOrEvent === "object" && valueOrEvent.target
      ? valueOrEvent.target.value
      : valueOrEvent;

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category_id) {
      toast({
        title: "Missing Information",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    setActiveParams(formData);
  };

  useEffect(() => {
    if (Categorystockdata?.stock && Categorystockdata.stock.length > 0) {
      const uniqueBrands = [...new Set(Categorystockdata.stock.map((item) => item.item_brand))];
      const sortedBrands = uniqueBrands
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
      setBrands(["All Brands", ...sortedBrands]);
    }
  }, [Categorystockdata]);

  const handleToggle = (key) => {
    dispatch(toggleCategoryColumn(key));
  };

  const print = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: `Category_Stock_${formData.category_id}`,
  });

  const handlePrintPdf = () => {
    if (!Categorystockdata?.stock?.length) {
      toast({
        title: "No Data",
        description: "Please search the category data first",
        variant: "destructive",
      });
      return;
    }
    print();
  };

  const handleSaveAsPdf = () => {
    if (!containerRef.current || !Categorystockdata?.stock?.length) {
      toast({
        title: "No Data",
        description: "Please search the category data first",
        variant: "destructive",
      });
      return;
    }

    html2pdf()
      .from(containerRef.current)
      .set({
        margin: 10,
        filename: `Category_Stock_${Categorystockdata?.item?.category || "Report"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  const calculateStock = (item) => {
    const itemPiece = Number(item.item_piece) || 1;
    const openingPurch = Number(item.openpurch || 0) * itemPiece + Number(item.openpurch_piece || 0);
    const openingSale = Number(item.closesale || 0) * itemPiece + Number(item.closesale_piece || 0);
    const openingPurchR = Number(item.openpurchR || 0) * itemPiece + Number(item.openpurchR_piece || 0);
    const openingSaleR = Number(item.closesaleR || 0) * itemPiece + Number(item.closesaleR_piece || 0);
    const openingBalance = (openingPurch - openingSale) - (openingPurchR - openingSaleR);

    const purchase = Number(item.purch || 0) * itemPiece + Number(item.purch_piece || 0);
    const purchaseR = Number(item.purchR || 0) * itemPiece + Number(item.purchR_piece || 0);
    const sale = Number(item.sale || 0) * itemPiece + Number(item.sale_piece || 0);
    const saleR = Number(item.saleR || 0) * itemPiece + Number(item.saleR_piece || 0);

    return openingBalance + (purchase - purchaseR) - (sale - saleR);
  };

  const processedItems = Categorystockdata?.stock?.map(item => ({
    ...item,
    total: calculateStock(item)
  })) || [];

  const filteredStock = processedItems.filter((item) => {
    const matchesBrand = selectedBrands === "All Brands" || item.item_brand === selectedBrands;
    return matchesBrand;
  });

  const grandTotal = filteredStock.reduce((acc, item) => acc + item.total, 0);

  if (isError) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader><CardTitle className="text-destructive">Error Fetching Report</CardTitle></CardHeader>
        <CardContent>
          <Button onClick={() => refetch()} variant="outline">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
        <CategoryStockFilters
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          categoryData={categoryData}
          columnVisibility={columnVisibility}
          handleToggle={handleToggle}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          brands={brands}
          handlePrintPdf={handlePrintPdf}
          handleSaveAsPdf={handleSaveAsPdf}
        />

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : Categorystockdata?.stock?.length > 0 ? (
          <CategoryStockTable
            filteredStock={filteredStock}
            columnVisibility={columnVisibility}
            singlebranch={singlebranch}
            doublebranch={doublebranch}
            categoryName={Categorystockdata?.item?.category}
            grandTotal={grandTotal}
            containerRef={containerRef}
          />
        ) : activeParams ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
            <p>No stock data found for the selected category and date range.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
            <p>Please select a category and date range to view the stock summary.</p>
          </div>
        )}
      </div>
  );
};

export default CategoryStockPage;
