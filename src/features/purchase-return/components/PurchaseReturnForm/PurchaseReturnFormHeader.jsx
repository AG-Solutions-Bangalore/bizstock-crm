import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import BuyerForm from "@/features/master/components/buyer/BuyerFormDialog";

export const PurchaseReturnFormHeader = ({ 
  formData, 
  handleInputChange, 
  buyerData, 
  purchaseRef, 
  editId 
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="min-w-0 space-y-2">
        <label className="text-sm font-medium">Date<span className="text-red-500">*</span></label>
        <Input
          type="date"
          value={formData.purchase_date}
          onChange={(e) => handleInputChange(e, "purchase_date")}
          required
        />
      </div>

      <div className="min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Buyer<span className="text-red-500">*</span></label>
          {!editId && <BuyerForm />}
        </div>
        <MemoizedSelect
          value={formData.purchase_buyer_id}
          onChange={(e) => handleInputChange(e, "purchase_buyer_id")}
          options={
            buyerData?.buyers
              ?.filter((buyer) => buyer.buyer_type?.split(",").includes("1"))
              .map((buyer) => ({
                value: buyer.id,
                label: buyer.buyer_name,
              })) || []
          }
          placeholder="Select Buyer"
        />
      </div>

      <div className="min-w-0 space-y-2">
        <label className="text-sm font-medium">Ref No<span className="text-red-500">*</span></label>
        {editId ? (
          <Input value={formData.purchase_ref_no} disabled />
        ) : (
          <MemoizedSelect
            value={formData.purchase_ref_no}
            onChange={(e) => handleInputChange(e, "purchase_ref_no")}
            options={
              purchaseRef ? [{ value: purchaseRef.purchase_ref, label: purchaseRef.purchase_ref }] : []
            }
            placeholder="Select Ref"
          />
        )}
      </div>

      <div className="min-w-0 space-y-2">
        <label className="text-sm font-medium">Vehicle No</label>
        <Input
          value={formData.purchase_vehicle_no}
          onChange={(e) => handleInputChange(e, "purchase_vehicle_no")}
          placeholder="Vehicle No"
        />
      </div>

      <div className="min-w-0 space-y-2 sm:col-span-2 xl:col-span-4">
        <label className="text-sm font-medium">Remark</label>
        <Textarea
          value={formData.purchase_remark}
          onChange={(e) => handleInputChange(e, "purchase_remark")}
          placeholder="Add any notes here"
          rows={2}
        />
      </div>
    </div>
  );
};
