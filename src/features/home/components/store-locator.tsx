import { Clock, MapPin, Phone } from "lucide-react";

const stores = [
  {
    city: "Bengaluru Experience Studio",
    address: "Indiranagar, 100 Feet Road",
    phone: "+91 98765 43210",
    hours: "11 AM - 8 PM",
  },
  {
    city: "Delhi NCR Consultation Lounge",
    address: "Saket, South Delhi",
    phone: "+91 98765 43211",
    hours: "11 AM - 7 PM",
  },
];

export default function StoreLocator() {
  return (
    <section className="border-t border-[var(--border)] py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
        <div
          className="
            grid
            gap-8
            rounded-[24px]
            border
            border-[var(--border)]
            bg-[var(--surface-soft)]
            p-7
            sm:p-10
            lg:grid-cols-[0.8fr_1.2fr]
            lg:p-12
          "
        >
          <div>
            <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
              Store Locator
            </p>

            <h2 className="mb-6 text-4xl leading-[1] sm:text-5xl">
              Visit A WOODLOOM Space
            </h2>

            <p className="max-w-[460px] text-[17px] leading-relaxed text-[var(--text-secondary)]">
              The SRS calls for showroom discovery and store contact details.
              This starts the experience with curated studios and can later
              connect to maps, city search, and admin-managed locations.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {stores.map((store) => (
              <article
                key={store.city}
                className="
                  rounded-[22px]
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  p-6
                "
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--primary)]">
                  <MapPin size={22} />
                </div>

                <h3 className="mb-3 text-2xl leading-tight">{store.city}</h3>

                <div className="grid gap-3 text-sm text-[var(--text-secondary)]">
                  <p className="flex gap-3">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    {store.address}
                  </p>

                  <p className="flex gap-3">
                    <Phone size={16} className="mt-0.5 shrink-0" />
                    {store.phone}
                  </p>

                  <p className="flex gap-3">
                    <Clock size={16} className="mt-0.5 shrink-0" />
                    {store.hours}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
