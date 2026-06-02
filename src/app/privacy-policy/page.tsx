import MainLayout from "@/components/layout/main-layout";
import PolicySection from "@/components/shared/policy-section";
import StaticPage from "@/components/shared/static-page";

export const metadata = {
  title: "Privacy Policy | WOODLOOM",
  description: "WOODLOOM privacy and data handling policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <StaticPage
        eyebrow="Privacy Policy"
        title="How Customer Data Is Handled"
        description="This policy prepares the compliance layer for accounts, checkout, analytics, and future marketing integrations."
      >
        <PolicySection title="Data We Collect">
          <p>
            The platform may collect profile details, delivery addresses,
            wishlist activity, cart activity, order information, and support
            requests.
          </p>
        </PolicySection>

        <PolicySection title="How It Is Used">
          <p>
            Customer data supports checkout, order processing, support,
            analytics, personalization, and communication preferences.
          </p>
        </PolicySection>

        <PolicySection title="Security">
          <p>
            Passwords, sessions, payment references, and admin access will be
            protected through secure backend architecture, validation, and
            environment secrets.
          </p>
        </PolicySection>
      </StaticPage>
    </MainLayout>
  );
}
