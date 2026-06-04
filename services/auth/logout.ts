import api from "@/utils/axios";

export const authService = {
  logout: () => api.post("/auth/logout"),
};