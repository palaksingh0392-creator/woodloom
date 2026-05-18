import MainLayout from "@/components/layout/main-layout";

import Button from "@/components/ui/button";

import Container from "@/components/shared/container";
import Section from "@/components/shared/section";

export default function HomePage() {
  return (
    <MainLayout>
      <Section>
        <Container>
          <div className="card-surface p-12">
            <h1 className="heading-xl max-w-4xl">
              Luxury Scandinavian Furniture Crafted For Modern Interiors
            </h1>

            <p className="body-lg text-muted mt-6 max-w-2xl">
              Timeless wooden furniture designed with warmth, elegance, and
              minimalist luxury.
            </p>

            <div className="flex gap-4 mt-10">
              <Button>Shop Collection</Button>

              <Button variant="secondary">Explore More</Button>
            </div>
          </div>
        </Container>
      </Section>
    </MainLayout>
  );
}
