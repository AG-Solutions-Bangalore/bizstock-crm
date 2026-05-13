import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import { ButtonConfig } from "@/config/ButtonConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Printer, ArrowDownToLine, Search } from "lucide-react";

const CategoryStockFilters = ({
  formData,
  handleInputChange,
  handleSubmit,
  categoryData,
  columnVisibility,
  handleToggle,
  selectedBrands,
  setSelectedBrands,
  brands,
  handlePrintPdf,
  handleSaveAsPdf,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className={`text-xs font-semibold ${ButtonConfig.cardLabel} block uppercase tracking-wider`}>
              From Date
            </label>
            <Input
              type="date"
              value={formData.from_date}
              className="bg-gray-50 border-gray-200 h-9 text-sm focus:ring-blue-500"
              onChange={(e) => handleInputChange("from_date", e)}
            />
          </div>
          <div className="space-y-1">
            <label className={`text-xs font-semibold ${ButtonConfig.cardLabel} block uppercase tracking-wider`}>
              To Date
            </label>
            <Input
              type="date"
              value={formData.to_date}
              className="bg-gray-50 border-gray-200 h-9 text-sm focus:ring-blue-500"
              onChange={(e) => handleInputChange("to_date", e)}
            />
          </div>
          <div className="space-y-1">
            <label className={`text-xs font-semibold ${ButtonConfig.cardLabel} block uppercase tracking-wider`}>
              Category
            </label>
            <MemoizedSelect
              className="bg-gray-50 border-gray-200 h-9 text-sm focus:ring-blue-500"
              value={formData.category_id}
              onChange={(e) => handleInputChange("category_id", e)}
              options={
                categoryData?.category?.map((category) => ({
                  value: category.id,
                  label: category.category,
                })) || []
              }
              placeholder="Select Category"
            />
          </div>
          <div className="space-y-1">
            <label className={`text-xs font-semibold ${ButtonConfig.cardLabel} block uppercase tracking-wider`}>
              Brand
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full h-9 justify-between bg-gray-50 border-gray-200 text-sm font-normal">
                  <span className="truncate">{selectedBrands}</span>
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
                {brands.map((brand) => (
                  <DropdownMenuItem key={brand} onSelect={() => setSelectedBrands(brand)}>
                    {brand}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-6">
            {Object.keys(columnVisibility).map((key) => (
              <div key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`col-${key}`}
                  checked={columnVisibility[key]}
                  onChange={() => handleToggle(key)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`col-${key}`} className="text-sm font-medium text-gray-700 capitalize">
                  Show Stock
                </label>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 md:flex-none h-9 border-gray-200"
              onClick={handlePrintPdf}
            >
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 md:flex-none h-9 border-gray-200"
              onClick={handleSaveAsPdf}
            >
              <ArrowDownToLine className="h-4 w-4 mr-2" /> PDF
            </Button>
            <Button
              type="submit"
              size="sm"
              className={`flex-1 md:flex-none h-9 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} px-6`}
            >
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryStockFilters;
