import MainLayout from "@/components/layout/main-layout";
import AuthCard from "@/features/auth/components/auth-card";
import RegisterForm from "@/features/auth/components/register-form";

export const metadata = {
  title: "Create Account | WOODLOOM",
  description: "Create your WOODLOOM customer account.",
};

export default function RegisterPage() {
  return (
    <MainLayout>
      <AuthCard
        eyebrow="Create Account"
        title="Start Your WOODLOOM Account"
        description="Save wishlist pieces, keep delivery details ready, and prepare for order tracking as the commerce backend comes online."
        footerText="Already have an account?"
        footerHref="/login"
        footerLabel="Login"
      >
        <RegisterForm />
      </AuthCard>
    </MainLayout>
  );
}
