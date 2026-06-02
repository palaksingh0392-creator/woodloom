import MainLayout from "@/components/layout/main-layout";
import CheckoutPageContent from "@/features/checkout/components/checkout-page-content";

export const metadata = {
  title: "Checkout | WOODLOOM",
  description: "Complete your WOODLOOM furniture order.",
};

export default function CheckoutPage() {
  return (
    <MainLayout>
      <CheckoutPageContent />
    </MainLayout>
  );
}
