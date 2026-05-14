import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseReturnService } from "../api/purchaseReturnService";
import usetoken from "@/api/usetoken";
import { useToast } from "@/hooks/use-toast";

export const usePurchaseReturn = () => {
  const token = usetoken();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const usePurchaseReturns = () =>
    useQuery({
      queryKey: ["purchase-return"],
      queryFn: () => purchaseReturnService.getAll(token),
      enabled: !!token,
    });

  const usePurchaseReturnById = (id) =>
    useQuery({
      queryKey: ["purchase-return", id],
      queryFn: () => purchaseReturnService.getById(id, token),
      enabled: !!token && !!id,
    });

  const deleteMutation = useMutation({
    mutationFn: (id) => purchaseReturnService.delete(id, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries({ queryKey: ["purchase-return"] });
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
    usePurchaseReturns,
    usePurchaseReturnById,
    deletePurchaseReturn: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
