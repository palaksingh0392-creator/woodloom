import MainLayout from "@/components/layout/main-layout";
import OrderSuccessContent from "@/features/checkout/components/order-success-content";

export const metadata = {
  title: "Order Confirmed | WOODLOOM",
  description: "Your WOODLOOM order confirmation.",
};

export default function CheckoutSuccessPage() {
  return (
    <MainLayout>
      <OrderSuccessContent />
    </MainLayout>
  );
}
