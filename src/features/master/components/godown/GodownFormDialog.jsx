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
import { useGodown } from "../../hooks/useGodown";
import { ButtonConfig } from "@/config/ButtonConfig";

const GodownFormDialog = ({ godownId }) => {
  const {
    open,
    setOpen,
    isLoading,
    isFetching,
    formData,
    handleInputChange,
    handleSubmit,
    isEditMode,
  } = useGodown(godownId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button variant="ghost" size="icon" className="hover:bg-yellow-100">
            <Edit className="h-4 w-4 text-yellow-700" />
          </Button>
        ) : (
          <Button className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}>
            <SquarePlus className="h-4 w-4 mr-2" /> Godown
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        {isFetching ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Update Godown" : "Create Godown"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Godown Name *</label>
                <Input
                  placeholder="Enter Godown Name"
                  value={formData.godown}
                  onChange={(e) => handleInputChange("godown", e.target.value)}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditMode ? "Update" : "Create")}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GodownFormDialog;
