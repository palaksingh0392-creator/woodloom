import MainLayout from "@/components/layout/main-layout";
import AuthCard from "@/features/auth/components/auth-card";
import AuthField from "@/features/auth/components/auth-field";

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
        <form className="grid gap-5">
          <AuthField
            id="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            required
          />

          <AuthField
            id="otp"
            label="OTP code"
            type="text"
            inputMode="numeric"
            placeholder="6 digit code"
            maxLength={6}
            required
          />

          <button
            type="button"
            className="h-14 rounded-full bg-[var(--primary)] px-8 text-sm uppercase tracking-[2px] text-white"
          >
            Verify OTP
          </button>
        </form>
      </AuthCard>
    </MainLayout>
  );
}
