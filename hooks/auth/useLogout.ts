"use client";

import { authService } from "@/services/auth/logout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
// import your auth store if you have one

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),

    onSuccess: async () => {
      // 1. clear backend session (cookie removed)
      await queryClient.clear();

      // 2. IMPORTANT: clear frontend auth state
      // authStore.setState({ user: null }); // if using zustand/context

      // 3. redirect safely (no reload flicker)
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