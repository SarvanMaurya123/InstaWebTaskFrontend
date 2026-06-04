"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { leadService } from "@/services/leadService";

type Lead = {
  _id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  status?: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
};

type LeadPage = {
  data: Lead[];
  page: number;
  hasMore: boolean;
};

export const useInfiniteLeads = () => {
  return useInfiniteQuery({
    queryKey: ["leads-infinite"],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await leadService.getAll(pageParam, 10);

      const payload = res.data;

      return {
        leads: Array.isArray(payload?.data?.leads)
          ? payload.data.leads
          : Array.isArray(payload?.leads)
          ? payload.leads
          : [],
        page: payload?.page ?? pageParam,
        hasMore: Boolean(payload?.hasMore),
      };
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
};