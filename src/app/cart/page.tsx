import MainLayout from "@/components/layout/main-layout";
import CartPageContent from "@/features/cart/components/cart-page-content";

export const metadata = {
  title: "Cart | WOODLOOM",
  description: "Review your selected WOODLOOM furniture pieces.",
};

export default function CartPage() {
  return (
    <MainLayout>
      <CartPageContent />
    </MainLayout>
  );
}
