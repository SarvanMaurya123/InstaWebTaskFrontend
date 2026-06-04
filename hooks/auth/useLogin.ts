"use client";

import { authService, LoginData } from "@/services/auth/login";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),

    onSuccess: async (res) => {
      console.log("Login Success:", res.data);

      /**
       * IMPORTANT:
       * Cookies are already set by backend
       * No token storage needed
       */

      // refresh all protected queries
      await queryClient.invalidateQueries();

      // optional: redirect handled in UI layer
      // router.push("/dashboard");
    },

    onError: (error: any) => {
      console.error(
        "Login Failed:",
        error?.response?.data?.message || error.message
      );
    },
  });
};