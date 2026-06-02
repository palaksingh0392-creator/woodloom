import MainLayout from "@/components/layout/main-layout";
import AuthCard from "@/features/auth/components/auth-card";
import AuthField from "@/features/auth/components/auth-field";

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
        <form className="grid gap-5">
          <AuthField
            id="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            required
          />

          <button
            type="button"
            className="h-14 rounded-full bg-[var(--primary)] px-8 text-sm uppercase tracking-[2px] text-white"
          >
            Send Reset Link
          </button>
        </form>
      </AuthCard>
    </MainLayout>
  );
}
