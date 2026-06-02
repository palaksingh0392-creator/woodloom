import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Aarav Mehta",
    location: "Bengaluru",
    quote:
      "The walnut finish looks far richer in person. The whole buying experience felt calm, premium, and personal.",
  },
  {
    name: "Nisha Kapoor",
    location: "Delhi NCR",
    quote:
      "We used the consultation call before ordering our dining table. The guidance made the room come together beautifully.",
  },
  {
    name: "Rohan Iyer",
    location: "Pune",
    quote:
      "Clean design, great material quality, and delivery updates that did not feel chaotic. Exactly what furniture shopping should be.",
  },
];

export default function CustomerTestimonials() {
  return (
    <section className="border-t border-[var(--border)] py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
        <div className="mb-10">
          <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
            Customer Stories
          </p>

          <h2 className="max-w-[720px] text-4xl leading-[1] sm:text-5xl lg:text-6xl">
            Loved In Warm Modern Homes
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="
                rounded-[24px]
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-7
                shadow-[0_18px_60px_var(--shadow-soft)]
              "
            >
              <Quote className="mb-6 text-[var(--primary)]" size={28} />

              <div className="mb-5 flex gap-1 text-[var(--primary)]">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={16} className="fill-current" />
                ))}
              </div>

              <p className="mb-8 text-[17px] leading-relaxed text-[var(--text-secondary)]">
                {testimonial.quote}
              </p>

              <div>
                <h3 className="text-xl">{testimonial.name}</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {testimonial.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
