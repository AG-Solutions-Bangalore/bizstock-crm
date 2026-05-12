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

  return (
    <Dialog
      open={!!selectedRef}
      onOpenChange={(open) => !open && setSelectedRef(null)}
    >
      <DialogContent className="max-w-4xl p-5">
        <DialogHeader>
          <DialogTitle>
            Item Details (
            {
              reportData?.dispatch?.find((d) => d.dispatch_ref === selectedRef)
                ?.dispatch_ref_no
            }
            )
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto overflow-y-auto max-h-[65vh] py-11 mt-4">
          <table className="w-full border-collapse border border-gray-300 text-xs">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border border-gray-300 px-2 py-2 text-left">
                  Item Name
                </th>
                <th className="border border-gray-300 px-2 py-2 text-left">
                  Size
                </th>
                <th className="border border-gray-300 px-2 py-2 text-left">
                  Brand
                </th>
                <th className="border border-gray-300 px-2 py-2 text-left">
                  Batch No
                </th>
                {isDoubleBranch ? (
                  <>
                    {columnVisibility.box && (
                      <th className="border border-gray-300 px-2 py-2 text-right">
                        Box
                      </th>
                    )}
                    {columnVisibility.piece && (
                      <th className="border border-gray-300 px-2 py-2 text-right">
                        Piece
                      </th>
                    )}
                  </>
                ) : (
                  columnVisibility.available_box && (
                    <th className="border border-gray-300 px-2 py-2 text-right">
                      Box
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {reportData?.details
                ?.filter((d) => d.dispatch_ref === selectedRef)
                .map((item, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 px-2 py-2">
                      {item.item_name}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {item.item_size}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {item.item_brand}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {item.dispatch_sub_batch_no}
                    </td>
                    {isDoubleBranch ? (
                      <>
                        {columnVisibility.box && (
                          <td className="border border-gray-300 px-2 py-2 text-right font-medium">
                            {item.dispatch_sub_box}
                          </td>
                        )}
                        {columnVisibility.piece && (
                          <td className="border border-gray-300 px-2 py-2 text-right font-medium">
                            {item.dispatch_sub_piece}
                          </td>
                        )}
                      </>
                    ) : (
                      columnVisibility.available_box && (
                        <td className="border border-gray-300 px-2 py-2 text-right font-medium">
                          {item.dispatch_sub_box}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              {reportData?.details?.filter(
                (d) => d.dispatch_ref === selectedRef,
              ).length === 0 && (
                <tr>
                  <td
                    colSpan={
                      isDoubleBranch
                        ? 4 +
                          (columnVisibility.box ? 1 : 0) +
                          (columnVisibility.piece ? 1 : 0)
                        : 4 + (columnVisibility.available_box ? 1 : 0)
                    }
                    className="border border-gray-300 px-2 py-4 text-center text-gray-500"
                  >
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DispatchItemDetailsDialog;
