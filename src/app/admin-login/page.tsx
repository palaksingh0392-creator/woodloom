import MainLayout from "@/components/layout/main-layout";
import AuthCard from "@/features/auth/components/auth-card";
import LoginForm from "@/features/auth/components/login-form";

export const metadata = {
  title: "Admin Login | WOODLOOM",
  description: "Secure login for WOODLOOM administrators and staff.",
};

export default function AdminLoginPage() {
  return (
    <MainLayout>
      <AuthCard
        eyebrow="Admin Access"
        title="WOODLOOM Operations Login"
        description="Sign in with an approved administrator or staff account to manage orders, products, inventory, and customers."
        footerText="Shopping as a customer?"
        footerHref="/login"
        footerLabel="Customer login"
      >
        <LoginForm portal="admin" redirectTo="/admin" />
      </AuthCard>
    </MainLayout>
  );
}
