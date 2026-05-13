import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ButtonConfig } from "@/config/ButtonConfig";
import { AlertCircle, Edit, Loader2, SquarePlus } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useBranch } from "../../hooks/useBranch";

const BranchFormDialog = ({ branchId }) => {
  const {
    open,
    setOpen,
    isLoading,
    isFetching,
    formData,
    handleInputChange,
    handleSubmit,
    hasChanges,
    isEditMode,
  } = useBranch(branchId);

  const { pathname } = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <div>
            <div className="sm:hidden">
              <button className="px-2 py-1 bg-yellow-400 hover:bg-yellow-600 rounded-lg text-black text-xs">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                className={`transition-all duration-200 ${isHovered ? "bg-blue-50" : ""}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Edit className={`h-4 w-4 transition-all duration-200 ${isHovered ? "text-blue-500" : ""}`} />
              </Button>
            </div>
          </div>
        ) : pathname === "/master/branch" ? (
          <div>
            <div className="sm:hidden">
              <Button variant="default" className="md:ml-2 bg-yellow-400 hover:bg-yellow-600 text-black rounded-l-full">
                <SquarePlus className="h-4 w-4" /> Branch
              </Button>
            </div>
            <div className="hidden sm:block">
              <Button variant="default" className={`md:ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}>
                <SquarePlus className="h-4 w-4 mr-2" /> Branch
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="text-red-600 cursor-default" disabled>
            Branch<span className="text-red-500 ml-1">*</span>
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
              <DialogTitle>{isEditMode ? "Update Branch" : "Create New Branch"}</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Edit the details for the branch" : "Enter the details for the new branch"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {!isEditMode && (
                <>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Branch Name *</label>
                    <Input
                      placeholder="Enter Branch Name"
                      value={formData.branch_name}
                      onChange={(e) => handleInputChange("branch_name", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Branch Prefix *</label>
                    <Input
                      placeholder="Enter Branch Prefix"
                      maxLength={2}
                      value={formData.branch_prefix}
                      onChange={(e) => handleInputChange("branch_prefix", e.target.value.toUpperCase())}
                    />
                  </div>
                </>
              )}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Branch Whatsapp *</label>
                <Input
                  placeholder="Enter Branch Whatsapp"
                  value={formData.branch_whatsapp}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) handleInputChange("branch_whatsapp", value);
                  }}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Branch Email *</label>
                <Input
                  type="email"
                  placeholder="Enter Branch Email"
                  value={formData.branch_email}
                  onChange={(e) => handleInputChange("branch_email", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">S Unit *</label>
                  <Select value={formData.branch_s_unit} onValueChange={(v) => handleInputChange("branch_s_unit", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select S Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">D Unit *</label>
                  <Select value={formData.branch_d_unit} onValueChange={(v) => handleInputChange("branch_d_unit", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select D Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Batch *</label>
                  <Select value={formData.branch_batch} onValueChange={(v) => handleInputChange("branch_batch", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {isEditMode && (
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Status *</label>
                    <Select value={formData.branch_status} onValueChange={(v) => handleInputChange("branch_status", v)}>
                      <SelectTrigger className={hasChanges ? "border-blue-200" : ""}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              {hasChanges && (
                <Alert className="bg-blue-50 border-blue-200 mt-2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-600 text-sm">You have unsaved changes</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isEditMode ? !hasChanges : isLoading}
                className={`w-full ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditMode ? "Update Branch" : "Create Branch"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BranchFormDialog;
