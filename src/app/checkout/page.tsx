import MainLayout from "@/components/layout/main-layout";
import CheckoutPageContent from "@/features/checkout/components/checkout-page-content";
import { listAccountAddresses } from "@/lib/account";
import { listCatalogProducts } from "@/lib/catalog";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Checkout | Shissoo",
  description: "Complete your Shissoo furniture order.",
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?next=/checkout");
  }

  const [products, addresses] = await Promise.all([
    listCatalogProducts(),
    listAccountAddresses(session.id),
  ]);

  return (
    <MainLayout>
      <CheckoutPageContent
        products={products}
        savedAddresses={addresses}
        razorpayConfigured={isRazorpayConfigured()}
      />
    </MainLayout>
  );
}
