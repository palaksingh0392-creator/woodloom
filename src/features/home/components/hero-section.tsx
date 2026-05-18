import Image from "next/image";

import Button from "@/components/ui/button";

import Container from "@/components/shared/container";
import Section from "@/components/shared/section";

export default function HeroSection() {
  return (
    <Section className="pt-10">
      <Container>
        <div
          className="
            grid
            lg:grid-cols-2
            gap-16
            items-center
          "
        >
          {/* LEFT CONTENT */}
          <div>
            <p
              className="
                uppercase
                tracking-[4px]
                text-sm
                text-(--primary)
                mb-6
              "
            >
              Scandinavian Luxury Furniture
            </p>
            <h1 className="heading-display max-w-3xl">
              {" "}
              Crafted Wooden Furniture For Timeless Interiors
            </h1>

            <p className="body-lg text-muted mt-8 max-w-xl">
              Discover handcrafted luxury furniture designed for warm modern
              homes with premium comfort and minimalist elegance.
            </p>

            <div className="flex gap-4 mt-10">
              <Button>Shop Collection</Button>

              <Button variant="secondary">Explore Catalog</Button>
            </div>

            {/* STATS */}
            <div className="flex gap-12 mt-16">
              <div>
                <h3 className="text-3xl font-bold">500+</h3>

                <p className="text-muted mt-2">Premium Products</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">10K+</h3>

                <p className="text-muted mt-2">Happy Customers</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">4.9★</h3>

                <p className="text-muted mt-2">Customer Rating</p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative pl-8">
            <div className="blur-glow" />

            <div
              className="
  relative
  overflow-hidden
  rounded-[40px]
  card-surface
  image-hover
"
            >
              <Image
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
                alt="Luxury Scandinavian Interior"
                width={800}
                height={900}
                className="
                  w-full
                 h-190
                  object-cover
                "
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
