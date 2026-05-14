import moment from "moment";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PaymentFormDialog from "../PaymentForm/PaymentFormDialog";

export const PaymentMobileList = ({ items, onDelete }) => {
  if (!items?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center text-gray-500">
        No items found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="relative bg-white rounded-lg shadow-sm border-l-4 border-r border-b border-t border-yellow-500 overflow-hidden p-3"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 text-gray-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-medium">
                  {index + 1}
                </div>
                <h3 className="font-medium text-sm text-gray-800">
                  {item.buyer_name}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <PaymentFormDialog paymentId={item.id} />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item.id)}
                        className="text-red-500 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete Payment</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              <div className="bg-gray-100 rounded-full px-2 py-0.5">
                <span className="font-semibold">Amt: </span>
                {item.payment_amount}
              </div>
              <div className="bg-gray-100 rounded-full px-2 py-0.5">
                <span className="font-semibold">Mode: </span>
                {item.payment_mode}
              </div>
              <div className="bg-gray-100 rounded-full px-2 py-0.5">
                <span className="font-semibold">Date: </span>
                {moment(item.payment_date).format("DD-MMM-YY")}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
