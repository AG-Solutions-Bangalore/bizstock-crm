import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonConfig } from "@/config/ButtonConfig";
import { Printer } from "lucide-react";

const StockBatchFilters = ({
  formData,
  handleInputChange,
  range,
  setRange,
  minTotal,
  maxTotal,
  sliderTrackRef,
  handleTrackClick,
  handlePrintPdf,
}) => {
  return (
    <div
      className={`sticky top-0 z-50 bg-white border border-gray-200 rounded-lg ${ButtonConfig.cardheaderColor} shadow-sm p-4 mb-2`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 sm:gap-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Stock Batch Summary
          </h1>
          <p className="text-gray-600 mt-1">
            Add a Stock Batch to Visit Report
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
          <div className="flex flex-col gap-2">
            <div className="w-full sm:w-auto">
              <label
                className={`block ${ButtonConfig.cardLabel} text-sm mb-1 font-medium`}
              >
                From Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.from_date}
                className="bg-white w-full sm:w-auto rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                onChange={(e) => handleInputChange("from_date", e)}
              />
            </div>

            <div className="w-full sm:w-auto">
              <label
                className={`block ${ButtonConfig.cardLabel} text-sm mb-1 font-medium`}
              >
                To Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.to_date}
                className="bg-white w-full sm:w-auto rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                onChange={(e) => handleInputChange("to_date", e)}
              />
            </div>
          </div>

          <div className="w-full sm:w-96 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 select-none font-sans">
            <div className="flex justify-between items-center mb-3">
              <label className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
                Available Between:{" "}
                <span className="text-blue-600 font-mono">{range[0]}</span> –{" "}
                <span className="text-blue-600 font-mono">{range[1]}</span>
              </label>
              <button
                onClick={() => setRange([minTotal, maxTotal])}
                className="text-xs text-blue-600 hover:underline"
              >
                Reset Range
              </button>
            </div>

            <div
              className="relative h-10 flex items-center cursor-pointer"
              ref={sliderTrackRef}
              onClick={(e) => handleTrackClick(e, sliderTrackRef)}
            >
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 rounded-full -translate-y-1/2" />
              <div
                className="absolute top-1/2 h-2 bg-blue-600 rounded-full -translate-y-1/2 transition-all duration-150 ease-in-out"
                style={{
                  left: `${((range[0] - minTotal) / (maxTotal - minTotal)) * 100}%`,
                  width: `${((range[1] - range[0]) / (maxTotal - minTotal)) * 100}%`,
                }}
              />

              <input
                type="range"
                min={minTotal}
                max={maxTotal}
                value={range[0]}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), range[1]);
                  setRange([Math.max(minTotal, val), range[1]]);
                }}
                className="absolute w-full h-10 appearance-none bg-transparent pointer-events-none"
                style={{ zIndex: range[0] === range[1] ? 5 : 3 }}
              />
              <div
                className="absolute top-1/2 rounded-full bg-white border-4 border-blue-600 w-6 h-6 shadow-lg -translate-y-1/2 pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                style={{
                  left: `${((range[0] - minTotal) / (maxTotal - minTotal)) * 100}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
              />

              <input
                type="range"
                min={minTotal}
                max={maxTotal}
                value={range[1]}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), range[0]);
                  setRange([range[0], Math.min(maxTotal, val)]);
                }}
                className="absolute w-full h-10 appearance-none bg-transparent pointer-events-none"
                style={{ zIndex: 4 }}
              />
              <div
                className="absolute top-1/2 rounded-full bg-white border-4 border-blue-600 w-6 h-6 shadow-lg -translate-y-1/2 pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                style={{
                  left: `${((range[1] - minTotal) / (maxTotal - minTotal)) * 100}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
              <span>{minTotal}</span>
              <span>{maxTotal}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-end w-full md:w-auto">
          <Button
            className={`w-full sm:w-auto ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            onClick={handlePrintPdf}
          >
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockBatchFilters;
