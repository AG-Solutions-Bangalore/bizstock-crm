import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";

import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { STOCK_REPORT } from "@/api";
import apiClient from "@/api/axios";
import usetoken from "@/api/usetoken";
import { toggleColumn } from "@/redux/columnVisibilitySlice";

import OverallStockFilters from "../components/OverallStockFilters";
import OverallStockTable from "../components/OverallStockTable";

const OverallStockPage = () => {
  const containerRef = useRef();
  const sliderTrackRef = useRef(null);
  
  const singlebranch = useSelector((state) => state.auth.branch_s_unit);
  const doublebranch = useSelector((state) => state.auth.branch_d_unit);
  const columnVisibility = useSelector((state) => state.columnVisibility);
  const dispatch = useDispatch();

  const isDoubleBranch = singlebranch === "Yes" && doublebranch === "Yes";
  const token = usetoken();

  const [formData, setFormData] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
  });

  const [maxTotal, setMaxTotal] = useState(0);
  const [minTotal, setMinTotal] = useState(0);
  const [range, setRange] = useState([0, 0]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const fetchStockData = async () => {
    const response = await apiClient.post(
      `${STOCK_REPORT}`,
      { ...formData },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.stock;
  };

  const { data: stockData, isLoading, isError, refetch } = useQuery({
    queryKey: ["stockData", formData],
    queryFn: fetchStockData,
  });

  useEffect(() => {
    if (stockData && stockData.length > 0) {
      const allTotals = stockData.map((item) => {
        const itemPiece = Number(item.item_piece) || 1;
        const opening =
          Number(item.openpurch) * itemPiece +
          Number(item.openpurch_piece) -
          (Number(item.closesale) * itemPiece + Number(item.closesale_piece)) -
          (Number(item.openpurchR) * itemPiece + Number(item.openpurchR_piece)) +
          (Number(item.closesaleR) * itemPiece + Number(item.closesaleR_piece));

        const purchase = Number(item.purch) * itemPiece + Number(item.purch_piece);
        const purchaseR = Number(item.purchR) * itemPiece + Number(item.purchR_piece);
        const sale = Number(item.sale) * itemPiece + Number(item.sale_piece);
        const saleR = Number(item.saleR) * itemPiece + Number(item.saleR_piece);

        return opening + purchase - purchaseR - sale + saleR;
      });

      const min = Math.min(...allTotals);
      const max = Math.max(...allTotals);

      setMinTotal(min);
      setMaxTotal(max);
      setRange([min, max]);
    }
  }, [stockData]);

  const handleInputChange = (field, valueOrEvent) => {
    const value = typeof valueOrEvent === "object" && valueOrEvent.target
      ? valueOrEvent.target.value
      : valueOrEvent;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (key) => {
    dispatch(toggleColumn(key));
  };

  const handleTrackClick = (e, sliderRef) => {
    setIsLocalLoading(true);
    const rect = sliderRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    let clickedValue = Math.round(((clickX / width) * (maxTotal - minTotal)) + minTotal);
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
    documentTitle: "Overall_Stock_Report",
    pageStyle: `
      @page { size: A4 portrait; margin: 5mm; }
      @media print {
        body { font-size: 10px; margin: 0mm; padding: 0mm; }
        table { font-size: 11px; }
        .print-hide { display: none; }
      }
    `,
  });

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
        <OverallStockFilters
          formData={formData}
          handleInputChange={handleInputChange}
          range={range}
          setRange={setRange}
          minTotal={minTotal}
          maxTotal={maxTotal}
          sliderTrackRef={sliderTrackRef}
          handleTrackClick={handleTrackClick}
          handlePrintPdf={handlePrintPdf}
          columnVisibility={columnVisibility}
          handleToggle={handleToggle}
        />

        {isLoading || isLocalLoading ? (
          <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
            <Loader />
            <p className="text-sm font-medium text-gray-400 animate-pulse">Processing inventory data...</p>
          </div>
        ) : stockData?.length > 0 ? (
          <OverallStockTable
            stockData={stockData}
            range={range}
            isDoubleBranch={isDoubleBranch}
            columnVisibility={columnVisibility}
            containerRef={containerRef}
            formData={formData}
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
            <p>No stock data found for the selected filters.</p>
          </div>
        )}
      </div>
  );
};

export default OverallStockPage;
