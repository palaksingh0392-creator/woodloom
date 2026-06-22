import MainLayout from "@/components/layout/main-layout";
import AuthCard from "@/features/auth/components/auth-card";
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";

export const metadata = {
  title: "Forgot Password | WOODLOOM",
  description: "Reset your WOODLOOM account password.",
};

export default function ForgotPasswordPage() {
  return (
    <MainLayout>
      <AuthCard
        eyebrow="Password Recovery"
        title="Reset Your Account Access"
        description="Enter your account email and the future auth service will send a secure reset link or OTP."
        footerText="Remembered your password?"
        footerHref="/login"
        footerLabel="Back to login"
      >
        <ForgotPasswordForm />
      </AuthCard>
    </MainLayout>
  );
}
