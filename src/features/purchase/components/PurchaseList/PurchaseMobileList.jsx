import { Edit } from "lucide-react";
import { RiWhatsappFill } from "react-icons/ri";
import StatusToggle from "@/components/toggle/StatusToggle";
import { encryptId } from "@/components/common/Encryption";
import { navigateToPurchaseEdit } from "@/api";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export const PurchaseMobileList = ({ 
  items, 
  userId, 
  onStatusChange, 
  onWhatsApp 
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {items.length > 0 ? (
        items.map((item, index) => (
          <div
            key={item.id}
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.purchase_status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    <StatusToggle
                      initialStatus={item.purchase_status}
                      teamId={item.id}
                      onStatusChange={onStatusChange}
                    />
                  </span>
                  {userId != 3 && (
                    <button
                      className="px-2 py-1 bg-yellow-400 hover:bg-yellow-600 rounded-lg text-black text-xs"
                      onClick={() => navigateToPurchaseEdit(navigate, item.id)}
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
                {item.purchase_ref_no && (
                  <Badge icon={<RefIcon />} label="Ref No:" value={item.purchase_ref_no} />
                )}
                {item.purchase_vehicle_no && (
                  <Badge icon={<VehicleIcon />} label="Vehicle No:" value={item.purchase_vehicle_no} />
                )}
                {item.purchase_date && (
                  <Badge icon={<CalendarIcon />} value={moment(item.purchase_date).format("DD-MMM-YY")} />
                )}
                {userId == 3 && item.branch_name && (
                  <Badge icon={<VehicleIcon />} label="Branch Name:" value={item.branch_name} />
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

const Badge = ({ icon, label, value }) => (
  <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1">
    {icon}
    <span className="text-xs text-gray-700">
      {label && <span className="text-[10px] mr-1">{label}</span>}
      {value}
    </span>
  </div>
);

const RefIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mr-1">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const VehicleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mr-1">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mr-1">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
