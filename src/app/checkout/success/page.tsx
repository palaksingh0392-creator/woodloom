import MainLayout from "@/components/layout/main-layout";
import OrderSuccessContent from "@/features/checkout/components/order-success-content";

export const metadata = {
  title: "Order Confirmed | Shissoo",
  description: "Your Shissoo order confirmation.",
};

export const dynamic = "force-dynamic";

export default function CheckoutSuccessPage() {
  return (
    <MainLayout>
      <OrderSuccessContent />
    </MainLayout>
  );
}
