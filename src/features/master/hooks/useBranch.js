import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import usetoken from "@/api/usetoken";
import { masterService } from "../services/masterService";

export const useBranch = (branchId = null) => {
  const token = usetoken();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!branchId;

  // List Logic
  const useBranchesQuery = () => useQuery({
    queryKey: ["branches"],
    queryFn: () => masterService.getBranches(token),
    enabled: !!token,
  });

  // Form Logic
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState({
    branch_name: "",
    branch_prefix: "",
    branch_whatsapp: "",
    branch_email: "",
    branch_s_unit: "",
    branch_d_unit: "",
    branch_batch: "",
    branch_status: "",
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (isEditMode && open) {
      const fetchBranch = async () => {
        setIsFetching(true);
        try {
          const branch = await masterService.getBranchById(branchId, token);
          const filledData = {
            branch_name: branch.branch_name || "",
            branch_whatsapp: branch.branch_whatsapp || "",
            branch_email: branch.branch_email || "",
            branch_status: branch.branch_status || "",
            branch_d_unit: branch.branch_d_unit || "",
            branch_s_unit: branch.branch_s_unit || "",
            branch_batch: branch.branch_batch || "",
          };
          setFormData(filledData);
          setOriginalData(filledData);
        } catch (err) {
          toast({
            title: "Error",
            description: "Failed to fetch branch details",
            variant: "destructive",
          });
          setOpen(false);
        } finally {
          setIsFetching(false);
        }
      };
      fetchBranch();
    }
  }, [open, branchId, isEditMode, token, toast]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!isEditMode) {
      if (!formData.branch_name) missingFields.push("Branch Name");
      if (!formData.branch_prefix) missingFields.push("Branch Prefix");
    }
    if (!formData.branch_whatsapp) missingFields.push("Branch Whatsapp");
    if (!formData.branch_email) missingFields.push("Branch Email");
    if (!formData.branch_s_unit) missingFields.push("S Unit");
    if (!formData.branch_d_unit) missingFields.push("D Unit");
    if (formData.branch_d_unit === "No" && formData.branch_s_unit === "No")
      missingFields.push("Both units cannot be 'No'");
    if (!formData.branch_batch) missingFields.push("Batch");
    if (isEditMode && !formData.branch_status) missingFields.push("Status");

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Missing fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = isEditMode
        ? await masterService.updateBranch(branchId, formData, token)
        : await masterService.createBranch(formData, token);

      if (response?.data.code === 200) {
        toast({ title: "Success", description: response.data.msg });
        queryClient.invalidateQueries(["branches"]);
        setOpen(false);
        if (!isEditMode) {
          setFormData({
            branch_name: "",
            branch_prefix: "",
            branch_whatsapp: "",
            branch_email: "",
            branch_s_unit: "",
            branch_d_unit: "",
            branch_batch: "",
          });
        }
      } else {
        toast({ title: "Error", description: response.data.msg, variant: "destructive" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Operation failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = originalData && Object.keys(formData).some(key => formData[key] !== originalData[key]);

  return {
    useBranchesQuery,
    open,
    setOpen,
    isLoading,
    isFetching,
    formData,
    handleInputChange,
    handleSubmit,
    hasChanges,
    isEditMode,
  };
};
