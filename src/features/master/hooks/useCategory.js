import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import usetoken from "@/api/usetoken";
import { masterService } from "../services/masterService";

export const useCategory = (categoryId = null) => {
  const token = usetoken();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!categoryId;

  const useCategoriesQuery = () => useQuery({
    queryKey: ["categories"],
    queryFn: () => masterService.getCategories(token),
    enabled: !!token,
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    category_status: "Active",
  });

  useEffect(() => {
    if (isEditMode && open) {
      const fetchCategory = async () => {
        setIsFetching(true);
        try {
          const category = await masterService.getCategoryById(categoryId, token);
          setFormData({
            category: category.category || "",
            category_status: category.category_status || "Active",
          });
        } catch (err) {
          toast({ title: "Error", description: "Failed to fetch category details", variant: "destructive" });
          setOpen(false);
        } finally {
          setIsFetching(false);
        }
      };
      fetchCategory();
    }
  }, [open, categoryId, isEditMode, token, toast]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.category) {
      toast({ title: "Validation Error", description: "Category name is required", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const response = isEditMode
        ? await masterService.updateCategory(categoryId, formData, token)
        : await masterService.createCategory(formData, token);

      if (response?.data.code === 200) {
        toast({ title: "Success", description: response.data.msg });
        queryClient.invalidateQueries(["categories"]);
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
    useCategoriesQuery,
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
