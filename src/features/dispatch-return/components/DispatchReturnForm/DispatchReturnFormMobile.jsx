import { Input } from "@/components/ui/input";
import { MemoizedProductSelect } from "@/components/common/MemoizedProductSelect";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import CreateItem from "@/features/master/components/item/ItemFormDialog";

export const DispatchReturnFormMobile = ({
  invoiceData,
  handlePaymentChange,
  itemsData,
  godownData,
  addRow,
  removeRow,
  handleDeleteRow,
  userType,
  singlebranch,
  doublebranch,
  userbatch,
  batchOptions
}) => {
  return (
    <div className="space-y-4">
      {invoiceData.map((row, index) => (
        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-yellow-100 relative">
          <div className="absolute top-2 right-2 flex gap-2">
            {row.id ? (
              userType == 2 && (
                <button type="button" onClick={() => handleDeleteRow(row.id)} className="text-red-500">
                  <Trash2 className="h-5 w-5" />
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={() => removeRow(index)}
                disabled={invoiceData.length === 1}
                className="text-red-500 disabled:opacity-30"
              >
                <MinusCircle className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="space-y-3 pt-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500">Item</label>
                <CreateItem />
              </div>
              <MemoizedProductSelect
                value={row.dispatch_sub_item_id}
                onChange={(e) => handlePaymentChange(e, index, "dispatch_sub_item_id")}
                options={itemsData?.items?.map(i => ({ value: i.id, label: i.item_name })) || []}
                placeholder="Select Item"
              />
              {row.item_size && (
                <div className="text-[10px] text-gray-500">
                  Size: {row.item_size} | Brand: {row.item_brand}
                </div>
              )}
            </div>

            {userbatch === "Yes" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Batch No</label>
                <MemoizedProductSelect
                  value={row.dispatch_sub_batch_no}
                  onChange={(e) => handlePaymentChange(e, index, "dispatch_sub_batch_no")}
                  options={batchOptions[index] || []}
                  placeholder="Select Batch"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Godown</label>
              <MemoizedSelect
                value={row.dispatch_sub_godown_id}
                onChange={(e) => handlePaymentChange(e, index, "dispatch_sub_godown_id")}
                options={godownData?.godown?.map(g => ({ value: g.id, label: g.godown_name })) || []}
                placeholder="Select Godown"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Rate</label>
              <Input
                type="number"
                value={row.dispatch_sub_rate}
                onChange={(e) => handlePaymentChange(e, index, "dispatch_sub_rate")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {singlebranch === "Yes" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Box</label>
                  <Input
                    type="number"
                    value={row.dispatch_sub_box}
                    onChange={(e) => handlePaymentChange(e, index, "dispatch_sub_box")}
                  />
                </div>
              )}
              {doublebranch === "Yes" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Piece</label>
                  <Input
                    type="number"
                    value={row.dispatch_sub_piece}
                    onChange={(e) => handlePaymentChange(e, index, "dispatch_sub_piece")}
                  />
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              Current Stock: {row.stockData?.total_box || 0} Box / {row.stockData?.total_piece || 0} Piece
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="w-full py-3 bg-yellow-50 text-yellow-600 rounded-xl border border-dashed border-yellow-300 font-medium flex items-center justify-center hover:bg-yellow-100 transition-colors"
      >
        <PlusCircle className="h-5 w-5 mr-2" /> Add New Item
      </button>
    </div>
  );
};
