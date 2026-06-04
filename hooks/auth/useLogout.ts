"use client";

import { authService } from "@/services/auth/logout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),

    onSuccess: async () => {
      /**
       * 1. Stop all active queries first
       */
      await queryClient.cancelQueries();

      /**
       * 2. Clear ALL cached auth state
       */
      queryClient.removeQueries({ queryKey: ["me"] });
      queryClient.removeQueries({ queryKey: ["user"] });

      /**
       * 3. Full cache reset (safe after logout)
       */
      queryClient.clear();

      /**
       * 4. Force redirect
       */
      router.replace("/login");
    },

    onError: (err: any) => {
      console.error(
        "Logout failed:",
        err?.response?.data?.message || err.message
      );
    },
  });
};