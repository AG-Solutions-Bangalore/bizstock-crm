import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import { ButtonConfig } from "@/config/ButtonConfig";
import { Printer, Search } from "lucide-react";
import { RiFileExcel2Line } from "react-icons/ri";

const DispatchReportHeader = ({
  formData,
  handleInputChange,
  handleSubmit,
  buyerData,
  downloadExcel,
  handlePrintPdf,
}) => {
  return (
    <>
      {/* Mobile View (sm:hidden) */}
      <div className="sm:hidden">
        <div
          className={`sticky top-0 z-10 border border-gray-200 rounded-lg ${ButtonConfig.cardheaderColor} shadow-sm p-0 mb-2`}
        >
          <div className="flex flex-col gap-2">
            {/* Title + Print Button */}
            <div className="flex justify-between items-center">
              <h1 className="text-base font-bold text-gray-800 px-2">
                Dispatch Stock
              </h1>
              <div className="flex gap-[2px]">
                <button
                  type="button"
                  className={` sm:w-auto ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} text-sm p-3 rounded-b-md `}
                  onClick={downloadExcel}
                >
                  <RiFileExcel2Line className="h-3 w-3 " />
                </button>
                <button
                  type="button"
                  className={` sm:w-auto ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} text-sm p-3 rounded-b-md `}
                  onClick={handlePrintPdf}
                >
                  <Printer className="h-3 w-3 " />
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-2 rounded-md shadow-xs"
            >
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="space-y-1">
                  <Input
                    type="date"
                    value={formData.from_date}
                    className="text-xs h-7"
                    onChange={(e) => handleInputChange("from_date", e)}
                  />
                </div>
                <div className="space-y-1">
                  <Input
                    type="date"
                    value={formData.to_date}
                    className="text-xs h-7"
                    onChange={(e) => handleInputChange("to_date", e)}
                  />
                </div>

                <div className="space-y-1">
                  <MemoizedSelect
                    value={formData.sale_buyer}
                    onChange={(e) => handleInputChange("sale_buyer", e)}
                    options={
                      buyerData?.buyers?.map((buyer) => ({
                        value: buyer.buyer_name,
                        label: buyer.buyer_name,
                      })) || []
                    }
                    placeholder="Select Buyer"
                    className="text-xs h-7 flex-1"
                  />
                </div>
                <div className="space-y-1">
                  <Button
                    type="submit"
                    size="sm"
                    className={`h-9 w-full ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
                  >
                    <Search className="h-3 w-3 mr-1" /> Search
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Desktop View (hidden sm:block) */}
      <div className="hidden sm:block">
        <div
          className={`sticky top-0 z-10 border border-gray-200 rounded-lg ${ButtonConfig.cardheaderColor} shadow-sm p-3 mb-2`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="lg:w-64 xl:w-72 shrink-0">
              <h1 className="text-xl font-bold text-gray-800 truncate">
                Dispatch Stock
              </h1>
              <p className="text-md text-gray-500 truncate">
                View dispatch stock
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white p-3 rounded-md shadow-xs  "
            >
              <div className="flex flex-col lg:flex-col lg:items-end gap-3  ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 flex-1  items-center">
                  <div className="space-y-1 ">
                    <label
                      className={`text-xs ${ButtonConfig.cardLabel} block`}
                    >
                      From Date
                    </label>
                    <Input
                      type="date"
                      value={formData.from_date}
                      className="text-xs h-8 w-full"
                      onChange={(e) => handleInputChange("from_date", e)}
                    />
                  </div>
                  <div className="space-y-1 ">
                    <label
                      className={`text-xs ${ButtonConfig.cardLabel} block`}
                    >
                      To Date
                    </label>
                    <Input
                      type="date"
                      value={formData.to_date}
                      className="text-xs h-8 w-full"
                      onChange={(e) => handleInputChange("to_date", e)}
                    />
                  </div>
                  <div className="space-y-1 ">
                    <label
                      className={`text-xs ${ButtonConfig.cardLabel} block`}
                    >
                      Buyer
                    </label>
                    <MemoizedSelect
                      value={formData.sale_buyer}
                      onChange={(e) => handleInputChange("sale_buyer", e)}
                      options={
                        buyerData?.buyers?.map((buyer) => ({
                          value: buyer.buyer_name,
                          label: buyer.buyer_name,
                        })) || []
                      }
                      placeholder="Select Buyer"
                      className="text-xs h-8 w-full"
                    />
                  </div>
                  <div className="md:mt-5 flex space-x-3">
                    <Button
                      type="submit"
                      size="sm"
                      className={`h-8  ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
                    >
                      <Search className="h-3 w-3 mr-1" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handlePrintPdf}
                    >
                      <Printer className="h-3 w-3 mr-1" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={downloadExcel}
                    >
                      <RiFileExcel2Line className="h-3 w-3 mr-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DispatchReportHeader;
