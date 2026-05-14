import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceService } from "../api/invoiceService";
import { useToast } from "@/hooks/use-toast";

export const useInvoice = (token) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const useInvoices = () =>
    useQuery({
      queryKey: ["invoices"],
      queryFn: () => invoiceService.getAll(token),
      enabled: !!token,
    });

  const useInvoiceById = (id) =>
    useQuery({
      queryKey: ["invoice", id],
      queryFn: () => invoiceService.getById(id, token),
      enabled: !!id && !!token,
    });

  const createInvoice = useMutation({
    mutationFn: (data) => invoiceService.create(data, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries(["invoices"]);
      } else {
        toast({ title: "Error", description: data.msg, variant: "destructive" });
      }
    },
  });

  const updateInvoice = useMutation({
    mutationFn: ({ id, data }) => invoiceService.update(id, data, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries(["invoices"]);
      } else {
        toast({ title: "Error", description: data.msg, variant: "destructive" });
      }
    },
  });

  const deleteInvoice = useMutation({
    mutationFn: (id) => invoiceService.delete(id, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries(["invoices"]);
      } else {
        toast({ title: "Error", description: data.msg, variant: "destructive" });
      }
    },
  });

  const updateInvoiceStatus = useMutation({
    mutationFn: (id) => invoiceService.updateStatus(id, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Status Updated", description: data.msg });
        queryClient.invalidateQueries(["invoices"]);
      }
    },
  });

  return {
    useInvoices,
    useInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
  };
};
