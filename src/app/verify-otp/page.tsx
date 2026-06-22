import MainLayout from "@/components/layout/main-layout";
import AuthCard from "@/features/auth/components/auth-card";
import OtpLoginForm from "@/features/auth/components/otp-login-form";

export const metadata = {
  title: "Verify OTP | WOODLOOM",
  description: "Verify your WOODLOOM login OTP.",
};

export default function VerifyOtpPage() {
  return (
    <MainLayout>
      <AuthCard
        eyebrow="Email OTP"
        title="Verify Your Login Code"
        description="Use a time-limited OTP to access your account without a password. Backend expiry and retry rules will be added with the auth service."
        footerText="Prefer password login?"
        footerHref="/login"
        footerLabel="Use password"
      >
        <OtpLoginForm />
      </AuthCard>
    </MainLayout>
  );
}
