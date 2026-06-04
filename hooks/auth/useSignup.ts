"use client";

import { authService, SignupData } from "@/services/auth/signup";
import { useMutation } from "@tanstack/react-query";

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupData) => authService.signup(data),

    onSuccess: (res) => {
      console.log("Signup Success:", res.data);

      // optional: redirect or store token
      // localStorage.setItem("token", res.data.token);
    },

    onError: (error: any) => {
      console.error(
        "Signup Failed:",
        error?.response?.data?.message || error.message
      );
    },
  });
};