import { useId, useState } from "react";

import {
  registerAccount,
  type RegisterGender,
} from "@/features/auth/services/register";
import { useDateOfBirthField } from "@/features/auth/hooks/use-date-of-birth-field";
import {
  buildRegisterRequest,
  mapGenderRawToApiGender,
} from "@/features/auth/utils/register-form";

export type RegisterCardFeedback = {
  type: "success" | "error";
  message: string;
} | null;

export function useRegisterCard() {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const dobId = useId();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<RegisterCardFeedback>(null);

  const dateOfBirthField = useDateOfBirthField();

  function togglePasswordVisibility() {
    setShowPassword((value) => !value);
  }

  function toggleConfirmPasswordVisibility() {
    setShowConfirmPassword((value) => !value);
  }

  function resetFormState() {
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordValue("");
    dateOfBirthField.reset();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    const fullName = String(data.get("fullName") ?? "");
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");
    const dateOfBirthRaw = String(data.get("dateOfBirth") ?? "");
    const genderRaw = String(data.get("gender") ?? "male");

    const { request, errorMessage } = buildRegisterRequest({
      fullName,
      email,
      password,
      confirmPassword,
      dateOfBirthRaw,
      genderRaw,
    });

    if (!request) {
      setFeedback({ type: "error", message: errorMessage ?? "Dữ liệu không hợp lệ" });
      return;
    }

    setIsSubmitting(true);
    const result = await registerAccount(request);
    setIsSubmitting(false);

    setFeedback({
      type: result.ok ? "success" : "error",
      message: result.message,
    });

    if (result.ok) {
      form.reset();
      resetFormState();
    }
  }

  const genderDefault: RegisterGender = mapGenderRawToApiGender("male");

  return {
    ids: {
      nameId,
      emailId,
      passwordId,
      confirmPasswordId,
      dobId,
    },
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    passwordValue,
    setPasswordValue,
    isSubmitting,
    feedback,
    handleSubmit,
    dateOfBirthField,
    genderDefault,
  };
}
