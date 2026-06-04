"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService, LeadData } from "@/services/leadService";

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeadData) => leadService.create(data),

    onSuccess: () => {
      // 🔥 refresh leads list automatically
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },

    onError: (error: any) => {
      console.error(
        "Create lead failed:",
        error?.response?.data?.message || error.message
      );
    },
  });
};