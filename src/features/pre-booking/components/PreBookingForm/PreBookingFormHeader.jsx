import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import BuyerForm from "@/features/master/components/buyer/BuyerFormDialog";

export const PreBookingFormHeader = ({ 
  formData, 
  handleInputChange, 
  buyerData, 
  preBookingRef, 
  editId 
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="min-w-0 space-y-2">
        <label className="text-sm font-medium">Date<span className="text-red-500">*</span></label>
        <Input
          type="date"
          value={formData.pre_booking_date}
          onChange={(e) => handleInputChange(e, "pre_booking_date")}
          required
        />
      </div>

      <div className="min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Buyer<span className="text-red-500">*</span></label>
          {!editId && <BuyerForm />}
        </div>
        <MemoizedSelect
          value={formData.pre_booking_buyer_id}
          onChange={(e) => handleInputChange(e, "pre_booking_buyer_id")}
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
          <Input value={formData.pre_booking_ref_no} disabled />
        ) : (
          <MemoizedSelect
            value={formData.pre_booking_ref_no}
            onChange={(e) => handleInputChange(e, "pre_booking_ref_no")}
            options={
              preBookingRef ? [{ value: preBookingRef.pre_booking_ref, label: preBookingRef.pre_booking_ref }] : []
            }
            placeholder="Select Ref"
          />
        )}
      </div>

      <div className="min-w-0 space-y-2">
        <label className="text-sm font-medium">Vehicle No</label>
        <Input
          value={formData.pre_booking_vehicle_no}
          onChange={(e) => handleInputChange(e, "pre_booking_vehicle_no")}
          placeholder="Vehicle No"
        />
      </div>

      <div className="min-w-0 space-y-2">
        <label className="text-sm font-medium">City</label>
        <Input
          value={formData.pre_booking_buyer_city}
          onChange={(e) => handleInputChange(e, "pre_booking_buyer_city")}
          placeholder="City"
        />
      </div>

      <div className="min-w-0 space-y-2 sm:col-span-2 xl:col-span-3">
        <label className="text-sm font-medium">Remark</label>
        <Textarea
          value={formData.pre_booking_remark}
          onChange={(e) => handleInputChange(e, "pre_booking_remark")}
          placeholder="Add any notes here"
          rows={2}
        />
      </div>
    </div>
  );
};
