import { MemoizedProductSelect } from "@/components/common/MemoizedProductSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchBatchNoByItem, useFetchGoDown, useFetchItems } from "@/hooks/useApi";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useState } from "react";

const QuotationFormTable = ({
  invoiceData,
  handleTableChange,
  addRow,
  removeRow,
  singlebranch,
  doublebranch,
  userbatch,
  token,
  isEdit,
  onBarcodeCheck,
}) => {
  const { data: itemsData } = useFetchItems();
  const { data: godownData } = useFetchGoDown();
  const [batchOptions, setBatchOptions] = useState({});

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
            {!isEdit && <TableHead className="w-[120px]">Barcode</TableHead>}
            <TableHead className="w-[200px]">Item*</TableHead>
            {userbatch === "Yes" && <TableHead className="w-[150px]">Batch No*</TableHead>}
            <TableHead className="w-[150px]">Godown*</TableHead>
            <TableHead className="w-[120px]">Rate*</TableHead>
            {singlebranch === "Yes" && <TableHead className="w-[100px]">Box*</TableHead>}
            {doublebranch === "Yes" && <TableHead className="w-[100px]">Piece*</TableHead>}
            <TableHead className="w-[100px]">Stock</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoiceData.map((row, index) => (
            <TableRow key={index} className="hover:bg-yellow-50/30">
              {!isEdit && (
                <TableCell>
                  <Input
                    placeholder="Scan..."
                    className="h-9"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onBarcodeCheck(e.target.value, index);
                        e.target.value = "";
                      }
                    }}
                  />
                </TableCell>
              )}
              <TableCell>
                <MemoizedProductSelect
                  value={row.quotation_sub_item_id}
                  onChange={(val) => {
                    handleTableChange(val, index, "quotation_sub_item_id");
                    handleBatchFetch(val, index);
                  }}
                  options={itemsData?.items?.map(i => ({ value: i.id, label: i.item_name })) || []}
                  placeholder="Select Item"
                />
              </TableCell>
              {userbatch === "Yes" && (
                <TableCell>
                  <MemoizedProductSelect
                    value={row.quotation_sub_batch_no}
                    onChange={(val) => handleTableChange(val, index, "quotation_sub_batch_no")}
                    options={batchOptions[index] || []}
                    placeholder="Batch"
                  />
                </TableCell>
              )}
              <TableCell>
                <MemoizedProductSelect
                  value={row.quotation_sub_godown_id}
                  onChange={(val) => handleTableChange(val, index, "quotation_sub_godown_id")}
                  options={godownData?.godown?.map(g => ({ value: g.id, label: g.godown_name })) || []}
                  placeholder="Godown"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={row.quotation_sub_rate}
                  onChange={(e) => handleTableChange(e.target.value, index, "quotation_sub_rate")}
                  className="h-9"
                />
              </TableCell>
              {singlebranch === "Yes" && (
                <TableCell>
                  <Input
                    type="number"
                    value={row.quotation_sub_box}
                    onChange={(e) => handleTableChange(e.target.value, index, "quotation_sub_box")}
                    className="h-9"
                  />
                </TableCell>
              )}
              {doublebranch === "Yes" && (
                <TableCell>
                  <Input
                    type="number"
                    value={row.quotation_sub_piece}
                    onChange={(e) => handleTableChange(e.target.value, index, "quotation_sub_piece")}
                    className="h-9"
                  />
                </TableCell>
              )}
              <TableCell>
                <div className="text-[10px] leading-tight">
                  <div className="text-gray-500">Box: {row.stockData?.total_box || 0}</div>
                  <div className="text-gray-500">Pcs: {row.stockData?.total_piece || 0}</div>
                  <div className="font-bold text-blue-600">Tot: {row.stockData?.total || 0}</div>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(index)}
                  disabled={invoiceData.length === 1}
                  className="text-red-500 h-8 w-8"
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

export default QuotationFormTable;
