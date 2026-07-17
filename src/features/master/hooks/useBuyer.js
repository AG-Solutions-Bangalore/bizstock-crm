import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import usetoken from "@/api/usetoken";
import { masterService } from "../services/masterService";

export const useBuyer = (buyerId = null) => {
  const token = usetoken();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!buyerId;
const showValidationToast = (message) => {
  toast({
    title: "Validation Error",
    description: message,
    variant: "destructive",
  });
};
  // List Logic
  const useBuyersQuery = () => useQuery({
    queryKey: ["buyers"],
    queryFn: () => masterService.getBuyers(token),
    enabled: !!token,
  });

  // Form Logic
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState({
    buyer_name: "",
    buyer_city: "",
    buyer_type: [],
    buyer_status: "Active",
    // ... add more fields as needed based on the form
  });

  useEffect(() => {
    if (isEditMode && open) {
      const fetchBuyer = async () => {
        setIsFetching(true);
        try {
          const buyer = await masterService.getBuyerById(buyerId, token);
          setFormData({
            buyer_name: buyer.buyer_name || "",
            buyer_city: buyer.buyer_city || "",
            buyer_type: buyer.buyer_type || [],
            buyer_status: buyer.buyer_status || "Active",
          });
        } catch (err) {
          toast({ title: "Error", description: "Failed to fetch buyer details", variant: "destructive" });
          setOpen(false);
        } finally {
          setIsFetching(false);
        }
      };
      fetchBuyer();
    }
  }, [open, buyerId, isEditMode, token, toast]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
     if (!formData.buyer_name?.trim()) {
    return showValidationToast("Buyer Name is required.");
  }
    setIsLoading(true);
    try {
      const response = isEditMode
        ? await masterService.updateBuyer(buyerId, formData, token)
        : await masterService.createBuyer(formData, token);

      if (response?.data.code === 200) {
        toast({ title: "Success", description: response.data.msg });
        queryClient.invalidateQueries(["buyers"]);
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
    useBuyersQuery,
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
