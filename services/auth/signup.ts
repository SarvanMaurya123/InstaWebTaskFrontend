import api from "@/utils/axios";

export type SignupData = {
  name: string;
  email: string;
  password: string;
};

export const authService = {
  signup: (data: SignupData) => {
    return api.post("/auth/signup", data);
  },
};