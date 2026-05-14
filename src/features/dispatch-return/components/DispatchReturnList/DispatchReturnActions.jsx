import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2, View } from "lucide-react";
import { RiWhatsappFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { encryptId } from "@/components/common/Encryption";
import moment from "moment";
import {
  navigateTODispatchReturnEdit,
  navigateTODispatchReturnView,
} from "@/api";

export const DispatchReturnActions = ({ 
  dispatchId, 
  userId, 
  onDelete, 
  onWhatsApp 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row">
      {userId != 3 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateTODispatchReturnEdit(navigate, dispatchId)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Dispatch Return</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateTODispatchReturnView(navigate, dispatchId)}
            >
              <View className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Dispatch Return</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {userId != 1 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => onDelete(dispatchId)}
                className="text-red-500"
                type="button"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Dispatch Return</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => onWhatsApp(encryptId(dispatchId))}
              className="text-green-500"
              type="button"
              size="icon"
            >
              <RiWhatsappFill className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Whatsapp Dispatch</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const handleSendWhatsApp = (dispatch, dispatchSub, buyer) => {
  const { dispatch_ref, dispatch_date, dispatch_vehicle_no } = dispatch;
  const { buyer_name, buyer_city } = buyer;

  const dispatchNo = dispatch_ref?.split("-").pop();
  const NAME_WIDTH = 25;

  const itemLines = dispatchSub.map((item) => {
    let name = (item.item_name || "").slice(0, 20);
    name = name.padEnd(NAME_WIDTH, " ");
    const box = `${String(item.dispatch_sub_box || 0)}`;
    return `${name}${box}`;
  });

  const totalQty = dispatchSub.reduce(
    (sum, item) => sum + (parseInt(item.dispatch_sub_box, 10) || 0),
    0
  );

  const message = `\`\`\`
=== DispatchReturnList ===
No.        : ${dispatchNo}
Date       : ${moment(dispatch_date).format("DD-MM-YYYY")}
Party      : ${buyer_name}
City       : ${buyer_city}
VEHICLE NO : ${dispatch_vehicle_no}
======================
Product [SIZE]          (QTY)
======================
${itemLines.join("\n")}
======================
Total QTY: ${totalQty}
======================
\`\`\``;

  const encodedMessage = encodeURIComponent(message);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    window.location.href = `whatsapp://send?text=${encodedMessage}`;
  } else {
    const webUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`;
    const desktopFallback = `whatsapp://send?text=${encodedMessage}`;

    try {
      window.open(webUrl, "_blank");
      setTimeout(() => {
        window.location.href = desktopFallback;
      }, 500);
    } catch (err) {
      window.location.href = desktopFallback;
    }
  }
};
