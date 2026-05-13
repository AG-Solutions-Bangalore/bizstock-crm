import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Loader2, SquarePlus } from "lucide-react";
import { useBuyer } from "../../hooks/useBuyer";
import { ButtonConfig } from "@/config/ButtonConfig";

const BuyerFormDialog = ({ buyerId }) => {
  const {
    open,
    setOpen,
    isLoading,
    isFetching,
    formData,
    handleInputChange,
    handleSubmit,
    isEditMode,
  } = useBuyer(buyerId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button variant="ghost" size="icon" className="hover:bg-yellow-100">
            <Edit className="h-4 w-4 text-yellow-700" />
          </Button>
        ) : (
          <Button className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}>
            <SquarePlus className="h-4 w-4 mr-2" /> Buyer
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        {isFetching ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Update Buyer" : "Create New Buyer"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Buyer Name *</label>
                <Input
                  placeholder="Enter Buyer Name"
                  value={formData.buyer_name}
                  onChange={(e) => handleInputChange("buyer_name", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  placeholder="Enter City"
                  value={formData.buyer_city}
                  onChange={(e) => handleInputChange("buyer_city", e.target.value)}
                />
              </div>
              {/* Add more fields as needed */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditMode ? "Update Buyer" : "Create Buyer")}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BuyerFormDialog;
