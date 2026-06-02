import MainLayout from "@/components/layout/main-layout";
import PolicySection from "@/components/shared/policy-section";
import StaticPage from "@/components/shared/static-page";

export const metadata = {
  title: "Terms & Conditions | WOODLOOM",
  description: "WOODLOOM website and purchase terms.",
};

export default function TermsAndConditionsPage() {
  return (
    <MainLayout>
      <StaticPage
        eyebrow="Terms & Conditions"
        title="Terms For Using WOODLOOM"
        description="These terms prepare the public legal layer for browsing, checkout, payments, returns, and account usage."
      >
        <PolicySection title="Website Use">
          <p>
            Customers may browse, save, and purchase furniture through the
            platform. Misuse, fraudulent activity, or unauthorized admin access
            is not permitted.
          </p>
        </PolicySection>

        <PolicySection title="Orders & Payments">
          <p>
            Orders are subject to product availability, payment verification,
            delivery eligibility, and operational confirmation.
          </p>
        </PolicySection>

        <PolicySection title="Product Information">
          <p>
            Product dimensions, finishes, images, availability, and prices
            should remain clear and accurate. Natural wood variation may occur.
          </p>
        </PolicySection>
      </StaticPage>
    </MainLayout>
  );
}
