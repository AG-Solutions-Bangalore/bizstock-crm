import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quotationService } from "../api/quotationService";
import { useToast } from "@/hooks/use-toast";

export const useQuotation = (token) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const useQuotations = () =>
    useQuery({
      queryKey: ["quotations"],
      queryFn: () => quotationService.getAll(token),
      enabled: !!token,
    });

  const useQuotationById = (id) =>
    useQuery({
      queryKey: ["quotation", id],
      queryFn: () => quotationService.getById(id, token),
      enabled: !!id && !!token,
    });

  const createQuotation = useMutation({
    mutationFn: (data) => quotationService.create(data, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries(["quotations"]);
      } else {
        toast({ title: "Error", description: data.msg, variant: "destructive" });
      }
    },
  });

  const updateQuotation = useMutation({
    mutationFn: ({ id, data }) => quotationService.update(id, data, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries(["quotations"]);
      } else {
        toast({ title: "Error", description: data.msg, variant: "destructive" });
      }
    },
  });

  const deleteQuotation = useMutation({
    mutationFn: (id) => quotationService.delete(id, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries(["quotations"]);
      } else {
        toast({ title: "Error", description: data.msg, variant: "destructive" });
      }
    },
  });

  return {
    useQuotations,
    useQuotationById,
    createQuotation,
    updateQuotation,
    deleteQuotation,
  };
};
