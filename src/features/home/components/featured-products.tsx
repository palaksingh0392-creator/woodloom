import ProductCard from "@/components/product/product-card";

import Container from "@/components/shared/container";
import Section from "@/components/shared/section";

const products = [
  {
    title: "Nordic Lounge Chair",
    category: "Living Room",
    price: "₹24,999",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
  {
    title: "Walnut Dining Table",
    category: "Dining",
    price: "₹48,999",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e",
  },
  {
    title: "Minimal Sofa",
    category: "Living Room",
    price: "₹69,999",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a",
  },
];

export default function FeaturedProducts() {
  return (
    <Section>
      <Container>
        <div
          className="
            flex
            items-end
            justify-between
            mb-14
          "
        >
          <div>
            <p className="label-text mb-4">Featured Products</p>

            <h2 className="heading-lg">Curated Best Sellers</h2>
          </div>

          <button
            className="
              uppercase
              tracking-[2px]
              text-sm
              hover:text-[var(--primary)]
              transition-colors
            "
          >
            View All Products
          </button>
        </div>

        <div
          className="
            grid
            md:grid-cols-2
            lg:grid-cols-3
            gap-8
          "
        >
          {products.map((product) => (
            <ProductCard key={product.title} {...product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
