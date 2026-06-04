"use client";

import { authService, LoginData } from "@/services/auth/login";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),

    onSuccess: async (res) => {
      console.log("Login Success:", res.data);

      // Only refetch current user data
      await queryClient.refetchQueries({
        queryKey: ["me"],
      });
    },

    onError: (error: any) => {
      console.error(
        "Login Failed:",
        error?.response?.data?.message || error.message
      );
    },
  });
};