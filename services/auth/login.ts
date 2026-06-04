import api from "@/utils/axios";

export type LoginData = {
  email: string;
  password: string;
};

export const authService = {
  
  login: (data: LoginData) => {
    return api.post("/auth/login", data);
  },
};