import { ArrowLeft, Loader2, PlusCircle, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import { MemoizedProductSelect } from "@/components/common/MemoizedProductSelect";
import { useFetchBuyers, useFetchItems, useFetchGoDown } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";
import CreateItem from "@/features/master/components/item/ItemFormDialog";

const InvoiceFormMobile = ({
  formData,
  invoiceData,
  handleInputChange,
  handleTableChange,
  addRow,
  removeRow,
  handleSubmit,
  isLoading,
  isEdit,
}) => {
  const navigate = useNavigate();
  const { data: buyerData } = useFetchBuyers();
  const { data: itemsData } = useFetchItems();
  const { data: godownData } = useFetchGoDown();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Mobile Header */}
      <div className="bg-yellow-500 text-white p-4 shadow-md sticky top-0 z-10 flex items-center gap-3">
        <button type="button" onClick={() => navigate("/invoice")} className="p-1">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">{isEdit ? "Edit Invoice" : "New Invoice"}</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Basic Details */}
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-3 border border-yellow-100">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Date*</label>
            <Input
              type="date"
              value={formData.invoice_date}
              onChange={(e) => handleInputChange(e, "invoice_date")}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Buyer*</label>
            <MemoizedSelect
              value={formData.invoice_buyer_id}
              onChange={(val) => handleInputChange(val, "invoice_buyer_id")}
              options={buyerData?.buyers?.map(b => ({ value: b.id, label: b.buyer_name })) || []}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Vehicle No</label>
            <Input
              value={formData.invoice_vehicle_no}
              onChange={(e) => handleInputChange(e, "invoice_vehicle_no")}
              placeholder="Vehicle No"
            />
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-gray-700">ITEMS ({invoiceData.length})</h2>
            <Button type="button" size="sm" variant="outline" onClick={addRow} className="h-8 border-yellow-300 text-yellow-600">
              <PlusCircle className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          {invoiceData.map((row, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-yellow-100 relative">
              <button
                type="button"
                onClick={() => removeRow(index)}
                disabled={invoiceData.length === 1}
                className="absolute top-2 right-2 text-red-500 p-1"
              >
                <MinusCircle className="h-5 w-5" />
              </button>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500">
                    Item<span className="text-red-500">*</span>
                  </label>
                  <CreateItem />
                </div>
                <MemoizedProductSelect
                  value={row.invoice_sub_item_id}
                  onChange={(val) => handleTableChange(val, index, "invoice_sub_item_id")}
                  options={itemsData?.items?.map(i => ({ value: i.id, label: i.item_name })) || []}
                  placeholder="Select Item"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Godown</label>
                    <MemoizedSelect
                      value={row.invoice_sub_godown_id}
                      onChange={(val) => handleTableChange(val, index, "invoice_sub_godown_id")}
                      options={godownData?.godown?.map(g => ({ value: g.id, label: g.godown })) || []}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Rate</label>
                    <Input
                      type="number"
                      value={row.invoice_sub_rate}
                      onChange={(e) => handleTableChange(e.target.value, index, "invoice_sub_rate")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Box</label>
                    <Input
                      type="number"
                      value={row.invoice_sub_box}
                      onChange={(e) => handleTableChange(e.target.value, index, "invoice_sub_box")}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Piece</label>
                    <Input
                      type="number"
                      value={row.invoice_sub_piece}
                      onChange={(e) => handleTableChange(e.target.value, index, "invoice_sub_piece")}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Amount</label>
                    <div className="h-9 flex items-center font-bold text-sm">
                      {Number(row.invoice_sub_amount || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-100">
          <label className="text-xs font-semibold text-gray-500 uppercase">Remarks</label>
          <Textarea
            value={formData.invoice_remark}
            onChange={(e) => handleInputChange(e, "invoice_remark")}
            placeholder="Add notes..."
            rows={2}
            className="mt-1"
          />
        </div>
      </div>

      {/* Floating Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-20">
        <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 h-12 text-lg font-bold" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
          {isEdit ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceFormMobile;
