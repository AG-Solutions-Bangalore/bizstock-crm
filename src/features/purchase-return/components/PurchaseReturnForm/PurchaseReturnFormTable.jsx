import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { MemoizedProductSelect } from "@/components/common/MemoizedProductSelect";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import CreateItem from "@/features/master/components/item/ItemFormDialog";

export const PurchaseReturnFormTable = ({
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
  batchOptions,
  boxInputRefs,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <Table className="min-w-[920px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead className="min-w-[260px]">
              <div className="flex items-center gap-2">
                <span>Item<span className="text-red-500">*</span></span>
                <CreateItem />
              </div>
            </TableHead>
            {userbatch === "Yes" && (
              <TableHead className="min-w-[150px]">Batch No</TableHead>
            )}
            <TableHead className="min-w-[180px]">Godown</TableHead>
            <TableHead className="min-w-[110px]">Stock</TableHead>
            {singlebranch === "Yes" && (
              <TableHead className="w-28">Box</TableHead>
            )}
            {doublebranch === "Yes" && (
              <TableHead className="w-28">Piece</TableHead>
            )}
            <TableHead className="w-14 text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoiceData.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>
                <MemoizedProductSelect
                  value={row.purchase_sub_item_id}
                  onChange={(e) =>
                    handlePaymentChange(e, index, "purchase_sub_item_id")
                  }
                  options={
                    itemsData?.items?.map((i) => ({
                      value: i.id,
                      label: i.item_name,
                    })) || []
                  }
                  placeholder="Select Item"
                />
                {row.item_size && (
                  <div className="text-[10px] mt-1 text-gray-500">
                    Size: {row.item_size} | Brand: {row.item_brand}
                  </div>
                )}
              </TableCell>
              {userbatch === "Yes" && (
                <TableCell>
                  <MemoizedProductSelect
                    value={row.purchase_sub_batch_no}
                    onChange={(e) =>
                      handlePaymentChange(e, index, "purchase_sub_batch_no")
                    }
                    options={batchOptions[index] || []}
                    placeholder="Batch"
                  />
                </TableCell>
              )}
              <TableCell>
                <MemoizedSelect
                  value={row.purchase_sub_godown_id}
                  onChange={(e) =>
                    handlePaymentChange(e, index, "purchase_sub_godown_id")
                  }
                  options={
                    godownData?.godown?.map((g) => ({
                      value: g.id,
                      label: g.godown,
                    })) || []
                  }
                  placeholder="Godown"
                />
              </TableCell>
              <TableCell>
                <div className="rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-700">
                  {row.stockData?.total_box || 0} B /{" "}
                  {row.stockData?.total_piece || 0} P
                </div>
              </TableCell>
              {singlebranch === "Yes" && (
                <TableCell>
                  <Input
                    type="number"
                    value={row.purchase_sub_box}
                    onChange={(e) =>
                      handlePaymentChange(e, index, "purchase_sub_box")
                    }
                    className="min-w-[84px]"
                  />
                </TableCell>
              )}
              {doublebranch === "Yes" && (
                <TableCell>
                  <Input
                    type="number"
                    value={row.purchase_sub_piece}
                    onChange={(e) =>
                      handlePaymentChange(e, index, "purchase_sub_piece")
                    }
                    className="min-w-[84px]"
                  />
                </TableCell>
              )}
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {row.id ? (
                    userType == 2 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      disabled={invoiceData.length === 1}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 disabled:opacity-30"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-2 bg-gray-50 flex justify-center">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-50"
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Add Row
        </button>
      </div>
    </div>
  );
};
