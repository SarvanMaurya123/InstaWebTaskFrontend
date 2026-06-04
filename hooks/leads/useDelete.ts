"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService } from "@/services/leadService";

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await leadService.delete(id);
    },

    onSuccess: () => {
      // Refresh leads list after delete
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["leads-infinite"] });
    },

    onError: (error) => {
      console.error("Delete failed:", error);
    },
  });

  return {
    deleteLead: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    error: deleteMutation.error,
  };
};