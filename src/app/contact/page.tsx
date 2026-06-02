import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import MainLayout from "@/components/layout/main-layout";
import StaticPage from "@/components/shared/static-page";

export const metadata = {
  title: "Contact | WOODLOOM",
  description: "Contact WOODLOOM for support, consultations, and store visits.",
};

const contactOptions = [
  {
    icon: MessageCircle,
    title: "WhatsApp Support",
    text: "Share product questions, room photos, or consultation requests.",
    value: "+91 98765 43210",
  },
  {
    icon: Mail,
    title: "Email",
    text: "For orders, returns, collaborations, and product support.",
    value: "hello@woodloom.in",
  },
  {
    icon: Phone,
    title: "Phone",
    text: "Talk to the team during business hours.",
    value: "11 AM - 7 PM",
  },
  {
    icon: MapPin,
    title: "Studio Visits",
    text: "Store locator support is ready for map integration.",
    value: "Bengaluru / Delhi NCR",
  },
];

export default function ContactPage() {
  return (
    <MainLayout>
      <StaticPage
        eyebrow="Contact"
        title="Talk To WOODLOOM"
        description="Reach out for furniture guidance, order support, returns, or interior consultation requests."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {contactOptions.map((option) => {
            const Icon = option.icon;

            return (
              <article
                key={option.title}
                className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-6"
              >
                <Icon className="mb-5 text-[var(--primary)]" size={26} />
                <h2 className="mb-3 text-2xl">{option.title}</h2>
                <p className="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {option.text}
                </p>
                <p className="font-semibold">{option.value}</p>
              </article>
            );
          })}
        </div>
      </StaticPage>
    </MainLayout>
  );
}
