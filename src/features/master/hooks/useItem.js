import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import usetoken from "@/api/usetoken";
import { masterService } from "../services/masterService";

export const useItem = (itemId = null) => {
  const token = usetoken();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!itemId;

  const useItemsQuery = () => useQuery({
    queryKey: ["items"],
    queryFn: () => masterService.getItems(token),
    enabled: !!token,
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState({
    item_category_id: "",
    item_name: "",
    item_rate: "",
    item_piece: "",
    item_size: "",
    item_brand: "",
    item_weight: "",
    item_minimum_stock: "",
    item_surface: "",
    item_image: "",
    item_status: isEditMode ? "" : "Active",
  });

  useEffect(() => {
    if (isEditMode && open) {
      const fetchItem = async () => {
        setIsFetching(true);
        try {
          const item = await masterService.getItemById(itemId, token);
          setFormData({
            item_category_id: item.item_category_id || "",
            item_name: item.item_name || "",
            item_rate: item.item_rate || "",
            item_piece: item.item_piece || "",
            item_size: item.item_size || "",
            item_brand: item.item_brand || "",
            item_weight: item.item_weight || "",
            item_minimum_stock: item.item_minimum_stock || "",
            item_surface: item.item_surface || "",
            item_image: item.item_image || "",
            item_status: item.item_status || "Active",
          });
        } catch (err) {
          toast({ title: "Error", description: "Failed to fetch item details", variant: "destructive" });
          setOpen(false);
        } finally {
          setIsFetching(false);
        }
      };
      fetchItem();
    }
  }, [open, itemId, isEditMode, token, toast]);

  const handleInputChange = (field, value) => {
    
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleSubmit = async (data) => {
  //   setIsLoading(true);
  //   try {
  //     const response = isEditMode
  //       ? await masterService.updateItem(itemId, formData, token)
  //       : await masterService.createItem(formData, token);

  //     if (response?.data.code === 200) {
  //       toast({ title: "Success", description: response.data.msg });
  //       queryClient.invalidateQueries(["items"]);
  //       setOpen(false);
  //     } else {
  //       toast({ title: "Error", description: response.data.msg, variant: "destructive" });
  //     }
  //   } catch (error) {
  //     toast({ title: "Error", description: "Operation failed", variant: "destructive" });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
const handleSubmit = async (data) => {
  setIsLoading(true);
  try {
    const response = isEditMode
      ? await masterService.updateItem(itemId, data, token)
      : await masterService.createItem(data, token);

    if (response?.data.code === 200) {
      toast({
        title: "Success",
        description: response.data.msg,
      });

      queryClient.invalidateQueries({
        queryKey: ["items"],
      });

      setOpen(false);
    } else {
      toast({
        title: "Error",
        description: response.data.msg,
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Operation failed",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
  return {
    useItemsQuery,
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
