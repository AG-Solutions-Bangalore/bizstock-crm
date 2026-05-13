import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonConfig } from "@/config/ButtonConfig";
import { Printer, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OverallStockFilters = ({
  formData,
  handleInputChange,
  range,
  setRange,
  minTotal,
  maxTotal,
  sliderTrackRef,
  handleTrackClick,
  handlePrintPdf,
  columnVisibility,
  handleToggle,
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg ${ButtonConfig.cardheaderColor} shadow-sm p-4 md:p-6 mb-6`}>
      <div className="flex flex-col gap-6">

        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Stock Summary
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Filter and view your current inventory levels.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {["box", "piece"].map((key) => (
                  <DropdownMenuItem
                    key={key}
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => handleToggle(key)}
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <span className="capitalize">{key}</span>
                    <input
                      type="checkbox"
                      checked={columnVisibility[key]}
                      readOnly
                      className="h-3.5 w-3.5 pointer-events-none"
                    />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              className={`h-9 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              onClick={handlePrintPdf}
            >
              <Printer className="h-4 w-4 mr-2" /> Print Report
            </Button>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Filters Section */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Date Range */}
          <div className="flex flex-col sm:flex-row gap-4 lg:w-1/3">
            <div className="flex-1">
              <label className={`block text-xs font-semibold ${ButtonConfig.cardLabel} mb-1.5 uppercase tracking-wider`}>
                From Date
              </label>
              <Input
                type="date"
                value={formData.from_date}
                className="h-10 bg-white"
                onChange={(e) => handleInputChange("from_date", e)}
              />
            </div>
            <div className="flex-1">
              <label className={`block text-xs font-semibold ${ButtonConfig.cardLabel} mb-1.5 uppercase tracking-wider`}>
                To Date
              </label>
              <Input
                type="date"
                value={formData.to_date}
                className="h-10 bg-white"
                onChange={(e) => handleInputChange("to_date", e)}
              />
            </div>
          </div>

          {/* Value Slider */}
          <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold text-gray-700">
                Net Stock Range
              </label>
              <div className="flex items-center gap-3">
                <span className="bg-white px-2 py-1 border border-gray-200 rounded text-xs font-mono font-medium text-gray-700 shadow-sm">
                  {range[0]} - {range[1]}
                </span>
                <button
                  onClick={() => setRange([minTotal, maxTotal])}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Reset
                </button>
              </div>
            </div>

            <div
              className="relative h-6 flex items-center cursor-pointer"
              ref={sliderTrackRef}
              onClick={(e) => handleTrackClick(e, sliderTrackRef)}
            >
              {/* Background Track */}
              <div className="absolute w-full h-2 bg-gray-200 rounded-full" />

              {/* Highlighted Range */}
              <div
                className="absolute h-2 bg-blue-500 rounded-full"
                style={{
                  left: `${((range[0] - minTotal) / (maxTotal - minTotal)) * 100}%`,
                  width: `${((range[1] - range[0]) / (maxTotal - minTotal)) * 100}%`,
                }}
              />

              {/* Left Handle */}
              <input
                type="range"
                min={minTotal}
                max={maxTotal}
                value={range[0]}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), range[1]);
                  setRange([Math.max(minTotal, val), range[1]]);
                }}
                className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none z-10"
              />
              <div
                className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-sm pointer-events-none"
                style={{
                  left: `${((range[0] - minTotal) / (maxTotal - minTotal)) * 100}%`,
                  transform: "translate(-50%, 0)",
                }}
              />

              {/* Right Handle */}
              <input
                type="range"
                min={minTotal}
                max={maxTotal}
                value={range[1]}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), range[0]);
                  setRange([range[0], Math.min(maxTotal, val)]);
                }}
                className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none z-20"
              />
              <div
                className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-sm pointer-events-none"
                style={{
                  left: `${((range[1] - minTotal) / (maxTotal - minTotal)) * 100}%`,
                  transform: "translate(-50%, 0)",
                }}
              />
            </div>

            <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
              <span>{minTotal}</span>
              <span>{maxTotal}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OverallStockFilters;
