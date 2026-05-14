import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import { ButtonConfig } from "@/config/ButtonConfig";
import { SquarePlus, Edit, Loader2 } from "lucide-react";
import { useFetchBuyers } from "@/hooks/useApi";
import usetoken from "@/api/usetoken";
import { usePayment } from "../../hooks/usePayment";

const PaymentFormDialog = ({ paymentId = null }) => {
  const [open, setOpen] = useState(false);
  const token = usetoken();
  const { usePaymentById, usePaymentModes, createPayment, updatePayment } = usePayment(token);
  
  const { data: buyerData } = useFetchBuyers();
  const { data: paymentModes } = usePaymentModes(open);
  const { data: paymentData, isFetching } = usePaymentById(paymentId);

  const [formData, setFormData] = useState({
    payment_date: "",
    payment_buyer_id: "",
    payment_mode: "",
    payment_amount: "",
    payment_transaction: "",
    payment_remarks: "",
  });

  useEffect(() => {
    if (paymentId && paymentData) {
      setFormData({
        payment_date: paymentData.payment_date || "",
        payment_buyer_id: paymentData.payment_buyer_id || "",
        payment_mode: paymentData.payment_mode || "",
        payment_amount: paymentData.payment_amount || "",
        payment_transaction: paymentData.payment_transaction || "",
        payment_remarks: paymentData.payment_remarks || "",
      });
    }
  }, [paymentId, paymentData]);

  const handleInputChange = (e, field) => {
    const value = e?.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentId) {
      await updatePayment.mutateAsync({ id: paymentId, data: formData });
    } else {
      await createPayment.mutateAsync(formData);
    }
    setOpen(false);
    if (!paymentId) {
      setFormData({
        payment_date: "",
        payment_buyer_id: "",
        payment_mode: "",
        payment_amount: "",
        payment_transaction: "",
        payment_remarks: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {paymentId ? (
          <Button variant="ghost" size="icon" className="text-blue-500">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          >
            <SquarePlus className="h-4 w-4 mr-2" /> Payment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            {paymentId ? "Edit Payment" : "New Payment"}
          </h2>
          {isFetching ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => handleInputChange(e, "payment_date")}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Buyer</label>
                <MemoizedSelect
                  value={formData.payment_buyer_id}
                  onChange={(val) => handleInputChange(val, "payment_buyer_id")}
                  options={buyerData?.buyers?.map(b => ({ value: b.id, label: b.buyer_name })) || []}
                  placeholder="Select Buyer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Payment Mode</label>
                <MemoizedSelect
                  value={formData.payment_mode}
                  onChange={(val) => handleInputChange(val, "payment_mode")}
                  options={paymentModes?.map(m => ({ value: m.payment_mode, label: m.payment_mode })) || []}
                  placeholder="Select Mode"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  value={formData.payment_amount}
                  onChange={(e) => handleInputChange(e, "payment_amount")}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Transaction ID / Ref</label>
                <Input
                  value={formData.payment_transaction}
                  onChange={(e) => handleInputChange(e, "payment_transaction")}
                  placeholder="Ref No"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Remarks</label>
                <Textarea
                  value={formData.payment_remarks}
                  onChange={(e) => handleInputChange(e, "payment_remarks")}
                  placeholder="Notes..."
                  rows={2}
                />
              </div>

              <Button
                type="submit"
                className={`w-full ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
                disabled={createPayment.isPending || updatePayment.isPending}
              >
                {(createPayment.isPending || updatePayment.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {paymentId ? "Update Payment" : "Save Payment"}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentFormDialog;
