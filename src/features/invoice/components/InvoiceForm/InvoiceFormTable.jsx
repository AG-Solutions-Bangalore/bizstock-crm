import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, Trash2 } from "lucide-react";
import { MemoizedProductSelect } from "@/components/common/MemoizedProductSelect";
import { useFetchItems, useFetchGoDown, fetchBatchNoByItem } from "@/hooks/useApi";
import { fetchDispatchInvoiceById } from "@/api";
import { useQuery } from "@tanstack/react-query";

const InvoiceFormTable = ({
  invoiceData,
  handleTableChange,
  addRow,
  removeRow,
  singlebranch,
  doublebranch,
  userbatch,
  userType,
  token,
  buyerId,
}) => {
  const { data: itemsData } = useFetchItems();
  const { data: godownData } = useFetchGoDown();
  const [batchOptions, setBatchOptions] = useState({});

  const { data: dispatchRefs } = useQuery({
    queryKey: ["dispatchinvoiceref", buyerId],
    queryFn: () => fetchDispatchInvoiceById(buyerId, token),
    enabled: !!buyerId && !!token,
  });

  const handleBatchFetch = async (itemId, rowIndex) => {
    if (!itemId) return;
    try {
      const res = await fetchBatchNoByItem(itemId, token);
      const batches = res?.batchNo?.map((b) => ({
        value: b.purchase_sub_batch_no,
        label: b.purchase_sub_batch_no,
      })) || [];
      setBatchOptions(prev => ({ ...prev, [rowIndex]: batches }));
    } catch (err) {
      console.error("Batch fetch error:", err);
    }
  };

  return (
    <div className="rounded-xl border border-yellow-200 overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-yellow-50">
          <TableRow>
            <TableHead className="w-[180px]">Ref No*</TableHead>
            <TableHead className="w-[200px]">Item*</TableHead>
            {userbatch === "Yes" && <TableHead className="w-[150px]">Batch No*</TableHead>}
            <TableHead className="w-[150px]">Godown*</TableHead>
            {singlebranch === "Yes" && <TableHead className="w-[100px]">Box*</TableHead>}
            {doublebranch === "Yes" && <TableHead className="w-[100px]">Piece*</TableHead>}
            <TableHead className="w-[120px]">Rate*</TableHead>
            <TableHead className="w-[150px]">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoiceData.map((row, index) => (
            <TableRow key={index} className="hover:bg-yellow-50/30">
              <TableCell>
                <MemoizedProductSelect
                  value={row.dispatch_ref}
                  onChange={(val) => handleTableChange(val, index, "dispatch_ref")}
                  options={dispatchRefs?.dispatch_ref?.map(r => ({ value: r.dispatch_ref, label: r.dispatch_ref })) || []}
                  placeholder="Select Ref"
                />
              </TableCell>
              <TableCell>
                <MemoizedProductSelect
                  value={row.invoice_sub_item_id}
                  onChange={(val) => {
                    handleTableChange(val, index, "invoice_sub_item_id");
                    handleBatchFetch(val, index);
                  }}
                  options={itemsData?.items?.map(i => ({ value: i.id, label: i.item_name })) || []}
                  placeholder="Select Item"
                />
              </TableCell>
              {userbatch === "Yes" && (
                <TableCell>
                  <MemoizedProductSelect
                    value={row.invoice_sub_batch_no}
                    onChange={(val) => handleTableChange(val, index, "invoice_sub_batch_no")}
                    options={batchOptions[index] || []}
                    placeholder="Batch"
                  />
                </TableCell>
              )}
              <TableCell>
                <MemoizedProductSelect
                  value={row.invoice_sub_godown_id}
                  onChange={(val) => handleTableChange(val, index, "invoice_sub_godown_id")}
                  options={godownData?.godown?.map(g => ({ value: g.id, label: g.godown })) || []}
                  placeholder="Godown"
                />
              </TableCell>
              {singlebranch === "Yes" && (
                <TableCell>
                  <Input
                    type="number"
                    value={row.invoice_sub_box}
                    onChange={(e) => handleTableChange(e.target.value, index, "invoice_sub_box")}
                    className="h-9"
                  />
                </TableCell>
              )}
              {doublebranch === "Yes" && (
                <TableCell>
                  <Input
                    type="number"
                    value={row.invoice_sub_piece}
                    onChange={(e) => handleTableChange(e.target.value, index, "invoice_sub_piece")}
                    className="h-9"
                  />
                </TableCell>
              )}
              <TableCell>
                <Input
                  type="number"
                  value={row.invoice_sub_rate}
                  onChange={(e) => handleTableChange(e.target.value, index, "invoice_sub_rate")}
                  className="h-9"
                />
              </TableCell>
              <TableCell className="font-semibold text-gray-900">
                {Number(row.invoice_sub_amount || 0).toLocaleString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(index)}
                  disabled={invoiceData.length === 1}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-3 border-t bg-gray-50">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>
    </div>
  );
};

export default InvoiceFormTable;
