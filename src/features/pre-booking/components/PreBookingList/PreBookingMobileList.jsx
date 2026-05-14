import { Edit } from "lucide-react";
import { RiWhatsappFill } from "react-icons/ri";
import moment from "moment";
import StatusToggle from "@/components/toggle/StatusToggle";
import { encryptId } from "@/components/common/Encryption";

export const PreBookingMobileList = ({ 
  items, 
  userId, 
  onEdit, 
  onView, 
  onWhatsApp, 
  onStatusChange 
}) => {
  return (
    <div className="space-y-3">
      {items.length > 0 ? (
        items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onView(item.id)}
            className="relative bg-white rounded-lg shadow-sm border-l-4 border-r border-b border-t border-yellow-500 overflow-hidden"
          >
            <div className="p-2 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-100 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <h3 className="font-medium text-sm text-gray-800">
                    {item.buyer_name}
                  </h3>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.pre_booking_status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <StatusToggle
                      initialStatus={item.pre_booking_status}
                      teamId={item.id}
                      onStatusChange={onStatusChange}
                    />
                  </span>
                  {userId != 3 && (
                    <button
                      className={`px-2 py-1 bg-yellow-400 hover:bg-yellow-600 rounded-lg text-black text-xs`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(item.id);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onWhatsApp(encryptId(item.id));
                    }}
                    className="text-green-500"
                    type="button"
                  >
                    <RiWhatsappFill className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-1">
                {item.pre_booking_ref_no && (
                  <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1">
                    <span className="text-xs text-gray-700">
                      <span className="text-[10px]">Ref No:</span>
                      {item.pre_booking_ref_no}
                    </span>
                  </div>
                )}
                {item.pre_booking_vehicle_no && (
                  <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1">
                    <span className="text-xs text-gray-700">
                      <span className="text-[10px]">Vehicle No:</span>
                      {item.pre_booking_vehicle_no}
                    </span>
                  </div>
                )}
                {item.pre_booking_date && (
                  <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1">
                    <span className="text-xs text-gray-700">
                      {moment(item.pre_booking_date).format("DD-MMM-YY")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center text-gray-500">
          No items found.
        </div>
      )}
    </div>
  );
};
