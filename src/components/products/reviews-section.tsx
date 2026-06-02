"use client";

import { Star, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Sophia Bennett",
    role: "Interior Designer",
    review:
      "The craftsmanship is exceptional. The wood texture, finish, and comfort feel incredibly premium and timeless.",

    rating: 5,
  },

  {
    name: "Daniel Carter",
    role: "Architect",
    review:
      "Beautiful Scandinavian aesthetic. It instantly elevated the atmosphere of our living room.",

    rating: 5,
  },

  {
    name: "Emma Wilson",
    role: "Home Stylist",
    review:
      "Luxury quality with minimalist elegance. The delivery and packaging experience was also excellent.",

    rating: 5,
  },
];

export default function ReviewsSection() {
  return (
    <section className="pt-28 pb-10">
      <div
        className="
          max-w-[1440px]
          mx-auto

          px-6
          lg:px-10
        "
      >
        {/* HEADER */}
        <div
          className="
            flex
            flex-col
            lg:flex-row

            lg:items-end
            lg:justify-between

            gap-8

            mb-14
          "
        >
          {/* LEFT */}
          <div>
            <p
              className="
                uppercase
                tracking-[3px]
                text-sm
                text-[var(--primary)]

                mb-4
              "
            >
              Customer Experience
            </p>

            <h2
              className="
                text-4xl
                lg:text-5xl

                font-serif

                leading-[1.1]

                mb-5
              "
            >
              Loved By Modern Interiors
            </h2>

            <p
              className="
                max-w-[620px]

                text-[17px]
                leading-relaxed

                text-[var(--text-secondary)]
              "
            >
              Discover how customers style WOODLOOM pieces into warm, timeless
              living spaces.
            </p>
          </div>

          {/* RIGHT SUMMARY */}
          <div
            className="
              flex
              items-center
              gap-5

              lg:justify-end
            "
          >
            <div
              className="
                flex
                items-center
                gap-1
              "
            >
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className="
                    fill-[#c8a27a]
                    text-[#c8a27a]
                  "
                />
              ))}
            </div>

            <div>
              <h3
                className="
                  text-3xl
                  font-semibold
                "
              >
                4.9/5
              </h3>

              <p
                className="
                  text-sm
                  text-[var(--text-secondary)]
                "
              >
                Based on 1,200+ reviews
              </p>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div
          className="
            grid
            lg:grid-cols-3
            gap-8
          "
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="
                bg-[var(--surface)]

                rounded-[32px]

                p-8

                border
                border-[var(--border)]

                hover:-translate-y-1

                transition-all
                duration-500
              "
            >
              {/* STARS */}
              <div
                className="
                  flex
                  items-center
                  gap-1

                  mb-6
                "
              >
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="
                        fill-[#c8a27a]
                        text-[#c8a27a]
                      "
                  />
                ))}
              </div>

              {/* REVIEW */}
              <p
                className="
                  text-[17px]
                  leading-relaxed

                  text-[var(--text-secondary)]

                  mb-8
                "
              >
                “{review.review}”
              </p>

              {/* USER */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <h4
                    className="
                      text-lg
                      font-medium
                      mb-1
                    "
                  >
                    {review.name}
                  </h4>

                  <p
                    className="
                      text-sm
                      text-[var(--text-secondary)]
                    "
                  >
                    {review.role}
                  </p>
                </div>

                <button
                  className="
                    w-11
                    h-11

                    rounded-full

                    border
                    border-[var(--border)]

                    flex
                    items-center
                    justify-center

                    hover:border-[var(--primary)]

                    transition-all
                  "
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
