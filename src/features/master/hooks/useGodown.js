import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import usetoken from "@/api/usetoken";
import { masterService } from "../services/masterService";

export const useGodown = (godownId = null) => {
  const token = usetoken();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!godownId;

  const useGodownsQuery = () => useQuery({
    queryKey: ["godowns"],
    queryFn: () => masterService.getGodowns(token),
    enabled: !!token,
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState({
    godown: "",
    godown_status: "Active",
  });

  useEffect(() => {
    if (isEditMode && open) {
      const fetchGodown = async () => {
        setIsFetching(true);
        try {
          const godown = await masterService.getGodownById(godownId, token);
          setFormData({
            godown: godown.godown || "",
            godown_status: godown.godown_status || "Active",
          });
        } catch (err) {
          toast({ title: "Error", description: "Failed to fetch godown details", variant: "destructive" });
          setOpen(false);
        } finally {
          setIsFetching(false);
        }
      };
      fetchGodown();
    }
  }, [open, godownId, isEditMode, token, toast]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.godown) {
      toast({ title: "Validation Error", description: "Godown name is required", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const response = isEditMode
        ? await masterService.updateGodown(godownId, formData, token)
        : await masterService.createGodown(formData, token);

      if (response?.data.code === 200) {
        toast({ title: "Success", description: response.data.msg });
        queryClient.invalidateQueries(["godowns"]);
        setOpen(false);
      } else {
        toast({ title: "Error", description: response.data.msg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Operation failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    useGodownsQuery,
    open,
    setOpen,
    isLoading,
    isFetching,
    formData,
    handleInputChange,
    handleSubmit,
    isEditMode,
  };
};
