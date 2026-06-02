import MainLayout from "@/components/layout/main-layout";
import PolicySection from "@/components/shared/policy-section";
import StaticPage from "@/components/shared/static-page";

export const metadata = {
  title: "Shipping Policy | WOODLOOM",
  description: "WOODLOOM shipping, delivery, and installation policy.",
};

export default function ShippingPolicyPage() {
  return (
    <MainLayout>
      <StaticPage
        eyebrow="Shipping Policy"
        title="Delivery Built For Furniture"
        description="Shipping expectations for large wooden furniture need to be clear before checkout. This page prepares that trust layer."
      >
        <PolicySection title="Delivery Coverage">
          <p>
            WOODLOOM currently communicates selected-city delivery support.
            Exact city eligibility, delivery charge, and installation options
            will later be calculated from backend service rules.
          </p>
        </PolicySection>

        <PolicySection title="Delivery Timelines">
          <p>
            Most ready pieces should show an estimated delivery window during
            checkout. Custom or made-to-order products may require longer
            preparation timelines.
          </p>
        </PolicySection>

        <PolicySection title="Installation">
          <p>
            Optional installation can be added for eligible furniture types.
            Final installation rules will connect to product, location, and
            order data.
          </p>
        </PolicySection>
      </StaticPage>
    </MainLayout>
  );
}
