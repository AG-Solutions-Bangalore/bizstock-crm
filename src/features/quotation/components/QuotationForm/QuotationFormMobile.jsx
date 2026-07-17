import { MemoizedProductSelect } from "@/components/common/MemoizedProductSelect";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchBuyers, useFetchGoDown, useFetchItems } from "@/hooks/useApi";
import { ArrowLeft, Loader2, MinusCircle, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateItem from "@/features/master/components/item/ItemFormDialog";

const QuotationFormMobile = ({
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col min-h-screen bg-gray-50 pb-20"
    >
      <div className="bg-yellow-500 text-white p-4 shadow-md sticky top-0 z-10 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/quotation")}
          className="p-1"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">
          {isEdit ? "Edit Quotation" : "New Quotation"}
        </h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-3 border border-yellow-100">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Date*
            </label>
            <Input
              type="date"
              value={formData.quotation_date}
              onChange={(e) => handleInputChange(e, "quotation_date")}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Buyer*
            </label>
            <MemoizedSelect
              value={formData.quotation_buyer_id}
              onChange={(val) => handleInputChange(val, "quotation_buyer_id")}
              options={
                buyerData?.buyers?.map((b) => ({
                  value: b.id,
                  label: b.buyer_name,
                })) || []
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-gray-700">ITEMS</h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addRow}
              className="h-8 border-yellow-300 text-yellow-600"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          {invoiceData.map((row, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm border border-yellow-100 relative"
            >
              <button
                type="button"
                onClick={() => removeRow(index)}
                disabled={invoiceData.length === 1}
                className="absolute top-2 right-2 text-red-500 p-1"
              >
                <MinusCircle className="h-5 w-5" />
              </button>

              <div className="space-y-3 pt-2">
                <MemoizedProductSelect
                  value={row.quotation_sub_item_id}
                  onChange={(val) =>
                    handleTableChange(val, index, "quotation_sub_item_id")
                  }
                  options={
                    itemsData?.items?.map((i) => ({
                      value: i.id,
                      label: i.item_name,
                    })) || []
                  }
                  placeholder="Select Item"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Godown*
                    </label>
                    <MemoizedSelect
                      value={row.quotation_sub_godown_id}
                      onChange={(val) =>
                        handleTableChange(val, index, "quotation_sub_godown_id")
                      }
                      options={
                        godownData?.godown?.map((g) => ({
                          value: g.id,
                          label: g.godown,
                        })) || []
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Rate*
                    </label>
                    <Input
                      type="number"
                      value={row.quotation_sub_rate}
                      onChange={(e) =>
                        handleTableChange(
                          e.target.value,
                          index,
                          "quotation_sub_rate",
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Box
                    </label>
                    <Input
                      type="number"
                      value={row.quotation_sub_box}
                      onChange={(e) =>
                        handleTableChange(
                          e.target.value,
                          index,
                          "quotation_sub_box",
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Piece
                    </label>
                    <Input
                      type="number"
                      value={row.quotation_sub_piece}
                      onChange={(e) =>
                        handleTableChange(
                          e.target.value,
                          index,
                          "quotation_sub_piece",
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-20">
        <Button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 h-12 text-lg font-bold"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
          {isEdit ? "Update Quotation" : "Create Quotation"}
        </Button>
      </div>
    </form>
  );
};

export default QuotationFormMobile;
