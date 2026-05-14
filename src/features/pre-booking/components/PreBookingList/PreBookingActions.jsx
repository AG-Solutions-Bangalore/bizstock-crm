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
import {
  navigateToPreBookingEdit,
  navigateToPreBookingView,
} from "@/api";
import { encryptId } from "@/components/common/Encryption";
import moment from "moment";

export const PreBookingActions = ({ 
  preBookingId, 
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
                onClick={() => navigateToPreBookingEdit(navigate, preBookingId)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Pre Booking</p>
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
              onClick={() => navigateToPreBookingView(navigate, preBookingId)}
            >
              <View className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Pre Booking</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {userId != 1 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => onDelete(preBookingId)}
                className="text-red-500"
                type="button"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Pre Booking</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => onWhatsApp(encryptId(preBookingId))}
              className="text-green-500"
              type="button"
              size="icon"
            >
              <RiWhatsappFill className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Whatsapp Pre Booking</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const handleSendWhatsApp = (prebooking, prebookingsub, buyer) => {
  const { pre_booking_ref, pre_booking_date, pre_booking_vehicle_no } = prebooking;
  const { buyer_name, buyer_city } = buyer;

  const preBookingNo = pre_booking_ref?.split("-").pop();
  const NAME_WIDTH = 25;

  const itemLines = prebookingsub.map((item) => {
    let name = (item.item_name || "").slice(0, 20);
    name = name.padEnd(NAME_WIDTH, " ");
    const box = `${String(item.pre_booking_sub_box || 0)}`;
    return `${name}${box}`;
  });

  const totalQty = prebookingsub.reduce(
    (sum, item) => sum + (parseInt(item.pre_booking_sub_box, 10) || 0),
    0
  );

  const message = `\`\`\`
=== PreBookingList ===
No.        : ${preBookingNo}
Date       : ${moment(pre_booking_date).format("DD-MM-YYYY")}
Party      : ${buyer_name}
City       : ${buyer_city}
VEHICLE NO : ${pre_booking_vehicle_no}
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
