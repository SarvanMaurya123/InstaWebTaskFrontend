"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LeadData, leadService } from "@/services/leadService";
import { toast } from "react-hot-toast";

type UpdateLeadPayload = {
  _id: string;
  data: Partial<LeadData>;
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ _id, data }: UpdateLeadPayload) =>
      leadService.update(_id, data),

    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["leads-infinite"] });
    },

    onError: () => {
      toast.error("Failed to update lead");
    },
  });

  return {
    updateLead: mutation.mutate,
    isUpdating: mutation.isPending,
  };
};