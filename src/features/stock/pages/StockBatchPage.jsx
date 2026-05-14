import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/loader/Loader";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { useStockBatchReport } from "../hooks/useStock";
import StockBatchFilters from "../components/StockBatchFilters";
import StockBatchTable from "../components/StockBatchTable";

const StockBatchPage = () => {
  const containerRef = useRef();
  const sliderTrackRef = useRef(null);
  const [maxTotal, setMaxTotal] = useState(0);
  const [minTotal, setMinTotal] = useState(0);
  const [range, setRange] = useState([0, 0]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const [formData, setFormData] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
  });

  const { data: stockData, isLoading, isError } = useStockBatchReport(formData);

  useEffect(() => {
    if (stockData && stockData.length > 0) {
      const allTotals = stockData.map((buyer) => {
        const itemPiece = Number(buyer.item_piece) || 1;
        const opening = (Number(buyer.openpurch || 0) * itemPiece + Number(buyer.openpurch_piece || 0)) -
                        (Number(buyer.closesale || 0) * itemPiece + Number(buyer.closesale_piece || 0)) -
                        (Number(buyer.openpurchR || 0) * itemPiece + Number(buyer.openpurchR_piece || 0)) +
                        (Number(buyer.closesaleR || 0) * itemPiece + Number(buyer.closesaleR_piece || 0));

        const purchase = Number(buyer.purch || 0) * itemPiece + Number(buyer.purch_piece || 0);
        const purchaseR = Number(buyer.purchR || 0) * itemPiece + Number(buyer.purchR_piece || 0);
        const sale = Number(buyer.sale || 0) * itemPiece + Number(buyer.sale_piece || 0);
        const saleR = Number(buyer.saleR || 0) * itemPiece + Number(buyer.saleR_piece || 0);

        const total = opening + purchase - purchaseR - sale + saleR;
        return isNaN(total) ? 0 : total;
      });

      const min = Math.min(...allTotals);
      const max = Math.max(...allTotals);

      setMinTotal(min);
      setMaxTotal(max);
      setRange([min, max]);
    }
  }, [stockData]);

  const handleTrackClick = (e, sliderRef) => {
    setIsLocalLoading(true);
    const rect = sliderRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    let clickedValue = Math.round(
      (clickX / width) * (maxTotal - minTotal) + minTotal
    );

    clickedValue = Math.max(minTotal, Math.min(maxTotal, clickedValue));

    const [start, end] = range;

    let newRange;
    if (Math.abs(clickedValue - start) < Math.abs(clickedValue - end)) {
      newRange = [Math.min(clickedValue, end), end];
    } else {
      newRange = [start, Math.max(clickedValue, start)];
    }

    setTimeout(() => {
      setRange(newRange);
      setIsLocalLoading(false);
    }, 200);
  };

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Stock Batch Summary",
    pageStyle: `
      @page { size: A4 portrait; margin: 5mm; }
      @media print {
        body { font-size: 10px; margin: 0mm; padding: 0mm; }
        table { font-size: 11px; }
        .print-hide { display: none; }
      }
    `,
  });

  const handleInputChange = (field, valueOrEvent) => {
    const value =
      typeof valueOrEvent === "object" && valueOrEvent.target
        ? valueOrEvent.target.value
        : valueOrEvent;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isError) {
    return (
      <div className="p-4 text-center text-destructive font-bold">
        Error loading stock batch data. Please try again.
      </div>
    );
  }

  return (
    <div className="p-0 md:p-4">
        <StockBatchFilters 
          formData={formData}
          handleInputChange={handleInputChange}
          range={range}
          setRange={setRange}
          minTotal={minTotal}
          maxTotal={maxTotal}
          sliderTrackRef={sliderTrackRef}
          handleTrackClick={handleTrackClick}
          handlePrintPdf={handlePrintPdf}
        />

        {isLoading || isLocalLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader />
          </div>
        ) : (
          <StockBatchTable 
            data={stockData || []}
            range={range}
            containerRef={containerRef}
            formData={formData}
          />
        )}
    </div>
  );
};

export default StockBatchPage;
