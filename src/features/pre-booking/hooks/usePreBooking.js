import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { preBookingService } from "../api/preBookingService";
import usetoken from "@/api/usetoken";
import { useToast } from "@/hooks/use-toast";

export const usePreBooking = () => {
  const token = usetoken();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const usePreBookings = () =>
    useQuery({
      queryKey: ["pre-bookings"],
      queryFn: () => preBookingService.getAll(token),
      enabled: !!token,
    });

  const usePreBookingById = (id) =>
    useQuery({
      queryKey: ["pre-booking", id],
      queryFn: () => preBookingService.getById(id, token),
      enabled: !!token && !!id,
    });

  const deleteMutation = useMutation({
    mutationFn: (id) => preBookingService.delete(id, token),
    onSuccess: (data) => {
      if (data.code === 200) {
        toast({ title: "Success", description: data.msg });
        queryClient.invalidateQueries({ queryKey: ["pre-bookings"] });
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
    usePreBookings,
    usePreBookingById,
    deletePreBooking: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
