import MainLayout from "@/components/layout/main-layout";
import PolicySection from "@/components/shared/policy-section";
import StaticPage from "@/components/shared/static-page";

export const metadata = {
  title: "Return Policy | WOODLOOM",
  description: "WOODLOOM return and replacement policy.",
};

export default function ReturnPolicyPage() {
  return (
    <MainLayout>
      <StaticPage
        eyebrow="Return Policy"
        title="Returns With Clear Rules"
        description="The SRS defines a 7-day return and replacement layer, with restrictions for customized products."
      >
        <PolicySection title="7-Day Return Window">
          <p>
            Eligible products may be requested for return within 7 days of
            delivery, subject to inspection, packaging condition, and product
            category.
          </p>
        </PolicySection>

        <PolicySection title="Replacement Requests">
          <p>
            Damaged, defective, or incorrect items should support replacement
            requests. The admin dashboard will later manage approval and
            operations status.
          </p>
        </PolicySection>

        <PolicySection title="Customized Products">
          <p>
            Customized furniture may have restricted return eligibility because
            finishes, fabric, size, or configuration may be made for a specific
            customer.
          </p>
        </PolicySection>
      </StaticPage>
    </MainLayout>
  );
}
