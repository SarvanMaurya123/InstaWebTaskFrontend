"use client";

import { useQuery } from "@tanstack/react-query";
import { leadService } from "@/services/leadService";

export type LeadStats = {
  totalLeads: number;
  statusStats: Record<string, number>;
};

export const useLeadStats = () => {
  return useQuery({
    queryKey: ["lead-stats"],
    queryFn: async () => {
      const res = await leadService.stats();
      return res.data.data as LeadStats;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};