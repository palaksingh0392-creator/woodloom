import { BadgeCheck, Leaf, ShieldCheck } from "lucide-react";

import MainLayout from "@/components/layout/main-layout";
import StaticPage from "@/components/shared/static-page";

export const metadata = {
  title: "About | WOODLOOM",
  description: "Learn about WOODLOOM's premium wooden furniture philosophy.",
};

const values = [
  {
    icon: BadgeCheck,
    title: "Craft-Led Design",
    text: "Every piece starts with material honesty, calm proportions, and daily usability.",
  },
  {
    icon: Leaf,
    title: "Responsible Materials",
    text: "The platform is prepared for traceable wood sourcing and sustainable catalog storytelling.",
  },
  {
    icon: ShieldCheck,
    title: "Built For Trust",
    text: "Warranty, returns, support, and transparent product information are part of the buying journey.",
  },
];

export default function AboutPage() {
  return (
    <MainLayout>
      <StaticPage
        eyebrow="About WOODLOOM"
        title="Furniture For Warm Modern Homes"
        description="WOODLOOM is a premium wooden furniture concept focused on Scandinavian calm, Indian home needs, and a conversion-ready digital experience."
      >
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-7">
          <h2 className="mb-4 text-3xl">Our Philosophy</h2>
          <p className="leading-relaxed text-[var(--text-secondary)]">
            The brand direction is minimal luxury: fewer distractions, better
            materials, strong product imagery, and a calm journey from discovery
            to checkout. The SRS positions WOODLOOM as a direct-to-customer
            furniture platform with future readiness for stores, content,
            mobile apps, and admin operations.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-6"
              >
                <Icon className="mb-5 text-[var(--primary)]" size={26} />
                <h3 className="mb-3 text-2xl">{value.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {value.text}
                </p>
              </article>
            );
          })}
        </div>
      </StaticPage>
    </MainLayout>
  );
}
