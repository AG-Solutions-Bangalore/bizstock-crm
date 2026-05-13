import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import { ButtonConfig } from "@/config/ButtonConfig";
import { Printer, Search } from "lucide-react";

const PaymentLedgerFilters = ({
  formData,
  handleInputChange,
  handleSubmit,
  buyerData,
  handlePrintPdf,
  errormsg,
}) => {
  return (
    <div className={`border border-gray-200 rounded-xl ${ButtonConfig.cardheaderColor} shadow-sm p-4 mb-6`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="shrink-0">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Payment Ledger</h1>
          <p className="text-sm text-gray-500">Review detailed financial transactions and account balances.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className={`text-xs font-semibold ${ButtonConfig.cardLabel} block uppercase tracking-wider`}>
                From Date
              </label>
              <Input
                type="date"
                value={formData.from_date}
                className="bg-gray-50 border-gray-200 h-9"
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
                className="bg-gray-50 border-gray-200 h-9"
                onChange={(e) => handleInputChange("to_date", e)}
              />
            </div>
            <div className="space-y-1">
              <label className={`text-xs font-semibold ${ButtonConfig.cardLabel} block uppercase tracking-wider`}>
                Select Account / Buyer
              </label>
              <MemoizedSelect
                value={formData.buyer_id}
                onChange={(e) => handleInputChange("buyer_id", e)}
                options={
                  buyerData?.buyers?.map((buyer) => ({
                    value: buyer.id,
                    label: buyer.buyer_name,
                  })) || []
                }
                placeholder="Choose Account"
                className={`bg-gray-50 border-gray-200 h-9 ${errormsg ? "border-red-500" : ""}`}
              />
              {errormsg && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errormsg}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9"
              onClick={handlePrintPdf}
            >
              <Printer className="h-4 w-4 mr-2" /> Print Ledger
            </Button>
            <Button
              type="submit"
              size="sm"
              className={`h-9 px-6 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            >
              <Search className="h-4 w-4 mr-2" /> Generate
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentLedgerFilters;
