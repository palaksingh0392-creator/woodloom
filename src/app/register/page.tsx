import MainLayout from "@/components/layout/main-layout";
import AuthCard from "@/features/auth/components/auth-card";
import RegisterForm from "@/features/auth/components/register-form";

export const metadata = {
  title: "Create Account | Shissoo",
  description: "Create your Shissoo customer account.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ verifiedEmail?: string; verificationToken?: string }>;
}) {
  const params = await searchParams;

  return (
    <MainLayout>
      <AuthCard
        eyebrow="Create Account"
        title="Start Your Shissoo Account"
        description="Save wishlist pieces, keep delivery details ready, and prepare for order tracking as the commerce backend comes online."
        footerText="Already have an account?"
        footerHref="/login"
        footerLabel="Login"
      >
        <RegisterForm
          verifiedEmail={params.verifiedEmail}
          verificationToken={params.verificationToken}
        />
      </AuthCard>
    </MainLayout>
  );
}
