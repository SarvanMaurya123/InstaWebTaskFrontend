import api from "@/utils/axios";

export type LeadData = {
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
  notes?: string;
};

export const leadService = {
  create: (data: LeadData) => {
    return api.post("/leads/create", data);
  },

  // 🔥 UPDATED: pagination support
  getAll: (page = 1, limit = 10) => {
    return api.get("/leads/get", {
      params: { page, limit },
    });
  },

  getById: (id: string) => {
    return api.get(`/leads/${id}`);
  },

  update: (id: string, data: Partial<LeadData>) => {
    return api.put(`/leads/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete(`/leads/${id}`);
  },
  stats: () => {
    return api.get("/leads/stats");
  },
};