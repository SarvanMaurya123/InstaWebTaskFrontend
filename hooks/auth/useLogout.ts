"use client";

import { authService } from "@/services/auth/logout";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),

    onSuccess: async () => {
      /**
       * Cookies are cleared from backend
       * No token handling needed
       */

      // clear ALL cached API data
      await queryClient.clear();

      // redirect
      window.location.href = "/login";
    },

    onError: (err: any) => {
      console.error(
        "Logout failed:",
        err?.response?.data?.message || err.message
      );
    },
  });
};