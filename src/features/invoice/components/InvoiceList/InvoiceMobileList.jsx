import moment from "moment";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const InvoiceMobileList = ({ items, userId, onDelete }) => {
  const navigate = useNavigate();

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
                {userId != 3 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-500"
                    onClick={() => navigate(`/invoice-form/${item.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {userId != 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              <div className="bg-gray-100 rounded-full px-2 py-0.5">
                <span className="font-semibold text-[10px]">Ref: </span>
                {item.invoice_ref_no}
              </div>
              <div className="bg-gray-100 rounded-full px-2 py-0.5">
                <span className="font-semibold text-[10px]">Amt: </span>
                {item.invoice_amount}
              </div>
              <div className="bg-gray-100 rounded-full px-2 py-0.5">
                <span className="font-semibold text-[10px]">Date: </span>
                {moment(item.invoice_date).format("DD-MMM-YY")}
              </div>
              <div className={`rounded-full px-2 py-0.5 font-medium ${
                item.invoice_status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {item.invoice_status}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
