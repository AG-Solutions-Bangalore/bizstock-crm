import moment from "moment";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import StatusToggle from "@/components/toggle/StatusToggle";

export const QuotationMobileList = ({ items, userId, onDelete, onStatusChange }) => {
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
                <StatusToggle
                  initialStatus={item.quotation_status}
                  teamId={item.id}
                  onStatusChange={onStatusChange}
                />
                {userId != 3 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-500"
                    onClick={() => navigate(`/quotation/form/${item.id}`)}
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
                {item.quotation_ref_no}
              </div>
              <div className="bg-gray-100 rounded-full px-2 py-0.5">
                <span className="font-semibold text-[10px]">Date: </span>
                {moment(item.quotation_date).format("DD-MMM-YY")}
              </div>
              {item.quotation_vehicle_no && (
                <div className="bg-gray-100 rounded-full px-2 py-0.5">
                  <span className="font-semibold text-[10px]">Veh: </span>
                  {item.quotation_vehicle_no}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
