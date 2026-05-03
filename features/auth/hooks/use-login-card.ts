import { useId, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { loginAccount } from "@/features/auth/services/login";
import { ME_QUERY_KEY } from "@/features/auth/hooks/use-me";
import { getMe } from "@/features/auth/services/me";

export type LoginCardFeedback = {
  type: "success" | "error";
  message: string;
} | null;

export function useLoginCard() {
  const emailId = useId();
  const passwordId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<LoginCardFeedback>(null);

  function togglePasswordVisibility() {
    setShowPassword((value) => !value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;
    setFeedback(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email || !password) {
      setFeedback({
        type: "error",
        message: "Vui lòng nhập email và mật khẩu",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginAccount({ email, password });

      if (result.ok) {
        const meResult = await getMe();
        if (!meResult.ok) {
          setFeedback({
            type: "error",
            message:
              meResult.message ??
              "Đăng nhập thành công nhưng không lấy được thông tin người dùng",
          });
          return;
        }

        queryClient.setQueryData(ME_QUERY_KEY, meResult.result);

        form.reset();
        setShowPassword(false);
        setFeedback(null);
        router.replace("/");
        return;
      }

      setFeedback({
        type: "error",
        message: result.message,
      });

      const passwordField = form.elements.namedItem("password");
      if (passwordField instanceof HTMLInputElement) {
        passwordField.value = "";
      }
      setShowPassword(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    ids: {
      emailId,
      passwordId,
    },
    showPassword,
    togglePasswordVisibility,
    isSubmitting,
    feedback,
    handleSubmit,
  };
}
