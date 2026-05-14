import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import { useFetchBuyers, useFetchQuotationRef } from "@/hooks/useApi";

const QuotationFormHeader = ({ formData, handleInputChange, isEdit }) => {
  const { data: buyerData } = useFetchBuyers();
  const { data: quotationRef } = useFetchQuotationRef();

  return (
    <Card className="border-yellow-100 shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <span className="w-1 h-4 bg-yellow-500 rounded-full mr-2"></span>
              Date<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              type="date"
              value={formData.quotation_date}
              onChange={(e) => handleInputChange(e, "quotation_date")}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <span className="w-1 h-4 bg-yellow-500 rounded-full mr-2"></span>
              Buyer<span className="text-red-500 ml-1">*</span>
            </label>
            <MemoizedSelect
              value={formData.quotation_buyer_id}
              onChange={(val) => handleInputChange(val, "quotation_buyer_id")}
              options={
                buyerData?.buyers
                  ?.filter((b) => b.buyer_type?.split(",").includes("1"))
                  .map((b) => ({ value: b.id, label: b.buyer_name })) || []
              }
              placeholder="Select Buyer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <span className="w-1 h-4 bg-yellow-500 rounded-full mr-2"></span>
              Ref No<span className="text-red-500 ml-1">*</span>
            </label>
            {isEdit ? (
              <Input value={formData.quotation_ref_no} disabled className="bg-gray-50" />
            ) : (
              <MemoizedSelect
                value={formData.quotation_ref_no}
                onChange={(val) => handleInputChange(val, "quotation_ref_no")}
                options={quotationRef ? [{ value: quotationRef.quotation_ref, label: quotationRef.quotation_ref }] : []}
                placeholder="Select Ref"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <span className="w-1 h-4 bg-gray-300 rounded-full mr-2"></span>
              Vehicle No
            </label>
            <Input
              value={formData.quotation_vehicle_no}
              onChange={(e) => handleInputChange(e, "quotation_vehicle_no")}
              placeholder="Vehicle Number"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <span className="w-1 h-4 bg-gray-300 rounded-full mr-2"></span>
              Remark
            </label>
            <Textarea
              value={formData.quotation_remark}
              onChange={(e) => handleInputChange(e, "quotation_remark")}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationFormHeader;
