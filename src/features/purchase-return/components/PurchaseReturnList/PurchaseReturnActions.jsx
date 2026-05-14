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
  navigateToPurchaseReturnEdit,
  navigateToPurchaseReturnView,
} from "@/api";
import { encryptId } from "@/components/common/Encryption";
import moment from "moment";

export const PurchaseReturnActions = ({ 
  purchaseId, 
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
                onClick={() => navigateToPurchaseReturnEdit(navigate, purchaseId)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Purchase Return</p>
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
              onClick={() => navigateToPurchaseReturnView(navigate, purchaseId)}
            >
              <View className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Purchase Return</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {userId != 1 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => onDelete(purchaseId)}
                className="text-red-500"
                type="button"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Purchase Return</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => onWhatsApp(encryptId(purchaseId))}
              className="text-green-500"
              type="button"
              size="icon"
            >
              <RiWhatsappFill className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Whatsapp Purchase Return</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const handleSendWhatsApp = (purchase, purchaseSub, buyer) => {
  const { purchase_ref_no, purchase_date, purchase_vehicle_no } = purchase;
  const { buyer_name, buyer_city } = buyer;

  const purchaseNo = purchase_ref_no?.split("-").pop();
  const NAME_WIDTH = 25;

  const itemLines = purchaseSub.map((item) => {
    const name = (item.item_name || "")
      .slice(0, NAME_WIDTH)
      .padEnd(NAME_WIDTH, " ");
    const box = `${String(item.purchase_sub_box || 0)}`;
    return `${name}${box}`;
  });

  const totalQty = purchaseSub.reduce(
    (sum, item) => sum + (parseInt(item.purchase_sub_box, 10) || 0),
    0
  );

  const message = `\`\`\`
=== PackReturnList ===
No.        : ${purchaseNo}
Date       : ${moment(purchase_date).format("DD-MM-YYYY")}
Party      : ${buyer_name}
City       : ${buyer_city}
VEHICLE NO : ${purchase_vehicle_no}
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
