import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DispatchItemDetailsDialog = ({
  selectedRef,
  setSelectedRef,
  reportData,
  isDoubleBranch,
  columnVisibility,
}) => {
  if (!selectedRef) return null;

  const currentDispatch = reportData?.dispatch?.find((d) => d.dispatch_ref === selectedRef);
  const filteredItems = reportData?.details?.filter((d) => d.dispatch_ref === selectedRef) || [];

  return (
    <Dialog
      open={!!selectedRef}
      onOpenChange={(open) => !open && setSelectedRef(null)}
    >
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-xl border-none shadow-2xl">
        <DialogHeader className="p-6 bg-gray-50 border-b">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Item Details: <span className="text-blue-600 ml-2">{currentDispatch?.dispatch_ref_no}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          <div className="overflow-x-auto overflow-y-auto max-h-[60vh] border rounded-lg">
            <table className="w-full border-collapse text-[11px]">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="border-b px-3 py-3 text-left font-bold text-gray-600 uppercase">Item Name</th>
                  <th className="border-b px-3 py-3 text-left font-bold text-gray-600 uppercase">Size</th>
                  <th className="border-b px-3 py-3 text-left font-bold text-gray-600 uppercase">Brand</th>
                  <th className="border-b px-3 py-3 text-left font-bold text-gray-600 uppercase">Batch No</th>
                  {isDoubleBranch ? (
                    <>
                      {columnVisibility.box && <th className="border-b px-3 py-3 text-right font-bold text-gray-600 uppercase">Box</th>}
                      {columnVisibility.piece && <th className="border-b px-3 py-3 text-right font-bold text-gray-600 uppercase">Piece</th>}
                    </>
                  ) : (
                    columnVisibility.available_box && <th className="border-b px-3 py-3 text-right font-bold text-gray-600 uppercase">Box</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredItems.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 font-medium text-gray-700">{item.item_name}</td>
                    <td className="px-3 py-3 text-gray-600">{item.item_size}</td>
                    <td className="px-3 py-3 text-gray-600">{item.item_brand}</td>
                    <td className="px-3 py-3 text-gray-600">{item.dispatch_sub_batch_no}</td>
                    {isDoubleBranch ? (
                      <>
                        {columnVisibility.box && <td className="px-3 py-3 text-right font-bold text-gray-900">{item.dispatch_sub_box}</td>}
                        {columnVisibility.piece && <td className="px-3 py-3 text-right font-bold text-gray-900">{item.dispatch_sub_piece}</td>}
                      </>
                    ) : (
                      columnVisibility.available_box && <td className="px-3 py-3 text-right font-bold text-gray-900">{item.dispatch_sub_box}</td>
                    )}
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={isDoubleBranch ? 6 : 5} className="px-3 py-8 text-center text-gray-400 italic">
                      No items found for this dispatch reference.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DispatchItemDetailsDialog;
