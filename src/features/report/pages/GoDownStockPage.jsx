import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import Page from "@/app/dashboard/page";
import { useFetchGoDown, useFetchItems } from "@/hooks/useApi";
import { useGoDownStock } from "../hooks/useReport";
import GoDownStockFilters from "../components/GoDownStockFilters";
import GoDownStockTable from "../components/GoDownStockTable";
import Loader from "@/components/loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GoDownStockPage = () => {
  const containerRef = useRef();
  const [formData, setFormData] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    item_id: "",
    godown_id: "",
  });

  const [activeParams, setActiveParams] = useState(null);
  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);

  const { data: stockData, isLoading, isError, refetch } = useGoDownStock(activeParams || {});
  const { data: itemsData } = useFetchItems();
  const { data: godownData } = useFetchGoDown();

  const handleInputChange = (field, valueOrEvent) => {
    const value = typeof valueOrEvent === "object" && valueOrEvent.target
      ? valueOrEvent.target.value
      : valueOrEvent;

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setActiveParams(formData);
  };

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Stock_Godown_Report",
  });

  const toBoxPiece = (val, itemPiece = 1) => ({
    box: Math.floor(val / itemPiece),
    piece: val % itemPiece,
  });

  const processedStock = (stockData?.stock || []).map((godown) => {
    const itemsWithTotals = godown.items.map((item) => {
      const itemPiece = Number(item.item_piece) || 1;

      const openPurch = Number(item.open_purchase_box || 0) * itemPiece + Number(item.open_purchase_piece || 0);
      const openSale = Number(item.closing_sale_box || 0) * itemPiece + Number(item.closing_sale_piece || 0);
      const openPurchR = Number(item.open_purchase_return_box || 0) * itemPiece + Number(item.open_purchase_return_piece || 0);
      const openSaleR = Number(item.closing_sale_return_box || 0) * itemPiece + Number(item.closing_sale_return_piece || 0);
      const opening = openPurch - openSale - openPurchR + openSaleR;

      const purchase = Number(item.purchase_box || 0) * itemPiece + Number(item.purchase_piece || 0);
      const purchaseR = Number(item.purchase_return_box || 0) * itemPiece + Number(item.purchase_return_piece || 0);
      const sale = Number(item.sale_box || 0) * itemPiece + Number(item.sale_piece || 0);
      const saleR = Number(item.sale_return_box || 0) * itemPiece + Number(item.sale_return_piece || 0);

      const total = opening + purchase - purchaseR - sale + saleR;

      return {
        ...item,
        opening,
        purchase,
        purchaseR,
        sale,
        saleR,
        total,
        openingBP: toBoxPiece(opening, itemPiece),
        purchaseBP: toBoxPiece(purchase, itemPiece),
        purchaseRBP: toBoxPiece(purchaseR, itemPiece),
        saleBP: toBoxPiece(sale, itemPiece),
        saleRBP: toBoxPiece(saleR, itemPiece),
        totalBP: toBoxPiece(total, itemPiece),
      };
    });

    const isDouble = singlebranch === "Yes" && doublebranch === "Yes";
    const totals = itemsWithTotals.reduce((acc, item) => {
      if (isDouble) {
        acc.openingBox += item.openingBP.box;
        acc.openingPiece += item.openingBP.piece;
        acc.purchaseBox += item.purchaseBP.box;
        acc.purchasePiece += item.purchaseBP.piece;
        acc.purchaseRBox += item.purchaseRBP.box;
        acc.purchaseRPiece += item.purchaseRBP.piece;
        acc.saleBox += item.saleBP.box;
        acc.salePiece += item.saleBP.piece;
        acc.saleRBox += item.saleRBP.box;
        acc.saleRPiece += item.saleRBP.piece;
        acc.totalBox += item.totalBP.box;
        acc.totalPiece += item.totalBP.piece;
      } else {
        acc.openingBox += item.opening;
        acc.purchaseBox += item.purchase;
        acc.purchaseRBox += item.purchaseR;
        acc.saleBox += item.sale;
        acc.saleRBox += item.saleR;
        acc.totalBox += item.total;
      }
      return acc;
    }, {
      openingBox: 0, openingPiece: 0, purchaseBox: 0, purchasePiece: 0,
      purchaseRBox: 0, purchaseRPiece: 0, saleBox: 0, salePiece: 0,
      saleRBox: 0, saleRPiece: 0, totalBox: 0, totalPiece: 0
    });

    return {
      ...godown,
      items: itemsWithTotals,
      ...totals
    };
  });

  const grand = processedStock.reduce((sum, g) => {
    sum.openingBox += g.openingBox;
    sum.openingPiece += g.openingPiece;
    sum.purchaseBox += g.purchaseBox;
    sum.purchasePiece += g.purchasePiece;
    sum.purchaseRBox += g.purchaseRBox;
    sum.purchaseRPiece += g.purchaseRPiece;
    sum.saleBox += g.saleBox;
    sum.salePiece += g.salePiece;
    sum.saleRBox += g.saleRBox;
    sum.saleRPiece += g.saleRPiece;
    sum.totalBox += g.totalBox;
    sum.totalPiece += g.totalPiece;
    return sum;
  }, {
    openingBox: 0, openingPiece: 0, purchaseBox: 0, purchasePiece: 0,
    purchaseRBox: 0, purchaseRPiece: 0, saleBox: 0, salePiece: 0,
    saleRBox: 0, saleRPiece: 0, totalBox: 0, totalPiece: 0
  });

  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader><CardTitle className="text-destructive">Error Fetching Stock</CardTitle></CardHeader>
          <CardContent><Button onClick={() => refetch()} variant="outline">Try Again</Button></CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <div className="p-4 md:p-6 space-y-6">
        <GoDownStockFilters
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          itemsData={itemsData}
          godownData={godownData}
          handlePrintPdf={handlePrintPdf}
        />

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : processedStock.length > 0 ? (
          <GoDownStockTable
            processedStock={processedStock}
            singlebranch={singlebranch}
            doublebranch={doublebranch}
            grand={grand}
            containerRef={containerRef}
            formData={formData}
          />
        ) : activeParams ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
            <p>No stock data found for the selected filters.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg border border-dashed border-gray-200 text-gray-400">
            <p>Please select a godown and date range to view the stock summary.</p>
          </div>
        )}
      </div>
    </Page>
  );
};

export default GoDownStockPage;
