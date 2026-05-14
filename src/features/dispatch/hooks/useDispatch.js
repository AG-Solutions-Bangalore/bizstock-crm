import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dispatchService } from "../api/dispatchService";
import usetoken from "@/api/usetoken";
import { useToast } from "@/hooks/use-toast";

export const useDispatch = () => {
  const token = usetoken();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const useDispatches = () =>
    useQuery({
      queryKey: ["dispatches"],
      queryFn: () => dispatchService.getAll(token),
      enabled: !!token,
    });

  const useDispatchById = (id) =>
    useQuery({
      queryKey: ["dispatch", id],
      queryFn: () => dispatchService.getById(id, token),
      enabled: !!token && !!id,
    });

  const deleteMutation = useMutation({
    mutationFn: (id) => dispatchService.delete(id, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries({ queryKey: ["dispatches"] });
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
    useDispatches,
    useDispatchById,
    deleteDispatch: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
