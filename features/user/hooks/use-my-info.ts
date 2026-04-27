"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyInfo, type MyInfo } from "@/features/user/services/get-my-info";

export const MY_INFO_QUERY_KEY = ["my-info"] as const;

export function useMyInfo() {
  return useQuery<MyInfo | null>({
    queryKey: MY_INFO_QUERY_KEY,
    queryFn: async () => {
      const result = await getMyInfo();
      return result.ok ? result.user : null;
    },
  });
}
