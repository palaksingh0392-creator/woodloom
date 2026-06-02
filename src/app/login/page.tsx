import MainLayout from "@/components/layout/main-layout";
import AuthCard from "@/features/auth/components/auth-card";
import LoginForm from "@/features/auth/components/login-form";

export const metadata = {
  title: "Login | WOODLOOM",
  description: "Login to your WOODLOOM account.",
};

export default function LoginPage() {
  return (
    <MainLayout>
      <AuthCard
        eyebrow="Customer Login"
        title="Welcome Back To WOODLOOM"
        description="Access your saved pieces, checkout details, and future order tracking from one calm account space."
        footerText="New to WOODLOOM?"
        footerHref="/register"
        footerLabel="Create an account"
      >
        <LoginForm />
      </AuthCard>
    </MainLayout>
  );
}
