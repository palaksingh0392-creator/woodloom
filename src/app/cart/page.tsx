import MainLayout from "@/components/layout/main-layout";
import CartPageContent from "@/features/cart/components/cart-page-content";

export const metadata = {
  title: "Cart | Shissoo",
  description: "Review your selected Shissoo furniture pieces.",
};

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <MainLayout>
      <CartPageContent />
    </MainLayout>
  );
}
