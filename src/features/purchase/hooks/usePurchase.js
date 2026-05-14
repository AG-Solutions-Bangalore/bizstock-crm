import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseService } from "../api/purchaseService";
import usetoken from "@/api/usetoken";
import { useToast } from "@/hooks/use-toast";

export const usePurchase = () => {
  const token = usetoken();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const usePurchases = () =>
    useQuery({
      queryKey: ["purchase"],
      queryFn: () => purchaseService.getAll(token),
      enabled: !!token,
    });

  const usePurchaseById = (id) =>
    useQuery({
      queryKey: ["purchase", id],
      queryFn: () => purchaseService.getById(id, token),
      enabled: !!token && !!id,
    });

  const deleteMutation = useMutation({
    mutationFn: (id) => purchaseService.delete(id, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries({ queryKey: ["purchase"] });
      } else {
        toast({
          title: "Error",
          description: data.msg || "Failed to delete",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Unexpected Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    usePurchases,
    usePurchaseById,
    deletePurchase: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
