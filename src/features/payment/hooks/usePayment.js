import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "../api/paymentService";
import { useToast } from "@/hooks/use-toast";

export const usePayment = (token) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const usePayments = () =>
    useQuery({
      queryKey: ["payments"],
      queryFn: () => paymentService.getAll(token),
      enabled: !!token,
    });

  const usePaymentById = (id) =>
    useQuery({
      queryKey: ["payment", id],
      queryFn: () => paymentService.getById(id, token),
      enabled: !!id && !!token,
    });

  const usePaymentModes = (enabled = true) =>
    useQuery({
      queryKey: ["paymentModes"],
      queryFn: () => paymentService.getPaymentModes(token),
      enabled: !!token && enabled,
    });

  const createPayment = useMutation({
    mutationFn: (data) => paymentService.create(data, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries(["payments"]);
      } else {
        toast({ title: "Error", description: data.msg, variant: "destructive" });
      }
    },
  });

  const updatePayment = useMutation({
    mutationFn: ({ id, data }) => paymentService.update(id, data, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries(["payments"]);
      } else {
        toast({ title: "Error", description: data.msg, variant: "destructive" });
      }
    },
  });

  const deletePayment = useMutation({
    mutationFn: (id) => paymentService.delete(id, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries(["payments"]);
      } else {
        toast({ title: "Error", description: data.msg, variant: "destructive" });
      }
    },
  });

  return {
    usePayments,
    usePaymentById,
    usePaymentModes,
    createPayment,
    updatePayment,
    deletePayment,
  };
};
