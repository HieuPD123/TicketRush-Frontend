import { useEffect, useId, useMemo, useRef, useState } from "react";

import {
  registerAccount,
  type RegisterGender,
} from "@/features/auth/services/register";
import { sendRegisterOtp } from "@/features/auth/services/send-register-otp";
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
  const otpId = useId();

  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<RegisterCardFeedback>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpCooldownSeconds, setOtpCooldownSeconds] = useState(0);

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
    setOtpValue("");
    setOtpCooldownSeconds(0);
    dateOfBirthField.reset();
  }

  useEffect(() => {
    if (otpCooldownSeconds <= 0) return;

    const interval = window.setInterval(() => {
      setOtpCooldownSeconds((value) => Math.max(0, value - 1));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [otpCooldownSeconds]);

  const otpCooldownLabel = useMemo(() => {
    const minutes = Math.floor(otpCooldownSeconds / 60);
    const seconds = otpCooldownSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [otpCooldownSeconds]);

  async function handleSendOtp() {
    setFeedback(null);

    const email = String(emailInputRef.current?.value ?? "").trim();
    if (!email) {
      setFeedback({ type: "error", message: "Vui lòng nhập email để nhận OTP" });
      return;
    }

    if (otpCooldownSeconds > 0 || isSendingOtp) {
      return;
    }

    setIsSendingOtp(true);
    const result = await sendRegisterOtp({ email });
    setIsSendingOtp(false);

    // Only show error feedback. Successful send will start cooldown silently.
    if (!result.ok) {
      setFeedback({ type: "error", message: result.message });
    }

    if (result.ok) {
      setOtpCooldownSeconds(5 * 60);
    }
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
    const otp = String(data.get("otp") ?? "");

    const { request, errorMessage } = buildRegisterRequest({
      fullName,
      email,
      password,
      confirmPassword,
      dateOfBirthRaw,
      genderRaw,
      otp,
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
      // Keep user on the registration page (do not redirect to login).
      // Reset the form UI but keep the email field filled so user can proceed.
      form.reset();
      resetFormState();
      try {
        if (emailInputRef.current) {
          emailInputRef.current.value = request.email ?? "";
        }
      } catch {
        // noop
      }
    }
  }

  const genderDefault: RegisterGender = mapGenderRawToApiGender("male");

  const isOtpCooldownActive = otpCooldownSeconds > 0;

  return {
    ids: {
      nameId,
      emailId,
      passwordId,
      confirmPasswordId,
      dobId,
      otpId,
    },
    emailInputRef,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    passwordValue,
    setPasswordValue,
    otpValue,
    setOtpValue,
    isSubmitting,
    isSendingOtp,
    otpCooldownSeconds,
    otpCooldownLabel,
    isOtpCooldownActive,
    feedback,
    handleSubmit,
    handleSendOtp,
    dateOfBirthField,
    genderDefault,
  };
}
