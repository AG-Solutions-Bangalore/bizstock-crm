import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dispatchReturnService } from "../api/dispatchReturnService";
import usetoken from "@/api/usetoken";
import { useToast } from "@/hooks/use-toast";

export const useDispatchReturn = () => {
  const token = usetoken();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const useDispatchReturns = () =>
    useQuery({
      queryKey: ["dispatch-returns"],
      queryFn: () => dispatchReturnService.getAll(token),
      enabled: !!token,
    });

  const useDispatchReturnById = (id) =>
    useQuery({
      queryKey: ["dispatch-return", id],
      queryFn: () => dispatchReturnService.getById(id, token),
      enabled: !!token && !!id,
    });

  const deleteMutation = useMutation({
    mutationFn: (id) => dispatchReturnService.delete(id, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries({ queryKey: ["dispatch-returns"] });
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
    useDispatchReturns,
    useDispatchReturnById,
    deleteDispatchReturn: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
