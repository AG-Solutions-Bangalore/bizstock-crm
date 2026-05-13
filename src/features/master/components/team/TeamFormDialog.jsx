import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Loader2, SquarePlus } from "lucide-react";
import { useTeam } from "../../hooks/useTeam";
import { useBranch } from "../../hooks/useBranch";
import { ButtonConfig } from "@/config/ButtonConfig";

const TeamFormDialog = ({ teamId }) => {
  const {
    open,
    setOpen,
    isLoading,
    isFetching,
    formData,
    handleInputChange,
    handleSubmit,
    isEditMode,
  } = useTeam(teamId);

  const { useBranchesQuery } = useBranch();
  const { data: branches } = useBranchesQuery();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button variant="ghost" size="icon" className="hover:bg-yellow-100">
            <Edit className="h-4 w-4 text-yellow-700" />
          </Button>
        ) : (
          <Button className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}>
            <SquarePlus className="h-4 w-4 mr-2" /> Team Member
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
              <DialogTitle>{isEditMode ? "Update Team Member" : "Add Team Member"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Username *</label>
                  <Input
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    disabled={isEditMode}
                  />
                </div>
                {!isEditMode && (
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Password *</label>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Branch *</label>
                  <Select 
                    value={formData.branch_id?.toString()} 
                    onValueChange={(v) => handleInputChange("branch_id", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches?.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.branch_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Role *</label>
                  <Select value={formData.user_type?.toString()} onValueChange={(v) => handleInputChange("user_type", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sales</SelectItem>
                      <SelectItem value="2">Admin</SelectItem>
                      <SelectItem value="3">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {isEditMode && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Status *</label>
                  <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full mt-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditMode ? "Update Member" : "Add Member")}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TeamFormDialog;
