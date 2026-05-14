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

export const DispatchFormTable = ({
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
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead className="min-w-[200px]">Item <CreateItem /></TableHead>
            {userbatch === "Yes" && <TableHead>Batch No</TableHead>}
            <TableHead className="min-w-[150px]">Godown</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="w-32">Rate</TableHead>
            {singlebranch === "Yes" && <TableHead className="w-24">Box</TableHead>}
            {doublebranch === "Yes" && <TableHead className="w-24">Piece</TableHead>}
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoiceData.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>
                <MemoizedProductSelect
                  value={row.dispatch_sub_item_id}
                  onChange={(e) => handlePaymentChange(e, index, "dispatch_sub_item_id")}
                  options={itemsData?.items?.map(i => ({ value: i.id, label: i.item_name })) || []}
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
                    value={row.dispatch_sub_batch_no}
                    onChange={(e) => handlePaymentChange(e, index, "dispatch_sub_batch_no")}
                    options={batchOptions[index] || []}
                    placeholder="Batch"
                  />
                </TableCell>
              )}
              <TableCell>
                <MemoizedSelect
                  value={row.dispatch_sub_godown_id}
                  onChange={(e) => handlePaymentChange(e, index, "dispatch_sub_godown_id")}
                  options={godownData?.godown?.map(g => ({ value: g.id, label: g.godown_name })) || []}
                  placeholder="Godown"
                />
              </TableCell>
              <TableCell>
                <div className="text-xs">
                  {row.stockData?.total_box || 0} B / {row.stockData?.total_piece || 0} P
                </div>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={row.dispatch_sub_rate}
                  onChange={(e) => handlePaymentChange(e, index, "dispatch_sub_rate")}
                />
              </TableCell>
              {singlebranch === "Yes" && (
                <TableCell>
                  <Input
                    type="number"
                    value={row.dispatch_sub_box}
                    onChange={(e) => handlePaymentChange(e, index, "dispatch_sub_box")}
                  />
                </TableCell>
              )}
              {doublebranch === "Yes" && (
                <TableCell>
                  <Input
                    type="number"
                    value={row.dispatch_sub_piece}
                    onChange={(e) => handlePaymentChange(e, index, "dispatch_sub_piece")}
                  />
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-1">
                  {row.id ? (
                    userType == 2 && (
                      <button type="button" onClick={() => handleDeleteRow(row.id)} className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      disabled={invoiceData.length === 1}
                      className="text-red-500 disabled:opacity-30"
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
          className="flex items-center text-sm text-yellow-600 font-medium hover:text-yellow-700"
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Add Row
        </button>
      </div>
    </div>
  );
};
