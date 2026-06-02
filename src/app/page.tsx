import MainLayout from "@/components/layout/main-layout";

import HeroSection from "@/features/home/components/hero-section";
import FeaturedProducts from "@/features/home/components/featured-products";
import CuratedCollections from "@/features/home/components/curated-collections";
import OurStory from "@/features/home/components/our-story";
import RoomInspiration from "@/features/home/components/room-inspiration";
import EditorsPicks from "@/features/home/components/editors-picks";
import JournalSection from "@/features/home/components/journal-section";
import SeasonalOffer from "@/features/home/components/seasonal-offer";
import RecommendedProducts from "@/features/home/components/recommended-products";
import CustomerTestimonials from "@/features/home/components/customer-testimonials";
import StoreLocator from "@/features/home/components/store-locator";
import { listCatalogProducts } from "@/lib/catalog";

export default async function HomePage() {
  const products = await listCatalogProducts();

  return (
    <MainLayout>
      <HeroSection />

      <CuratedCollections />

      <FeaturedProducts products={products} />
      <SeasonalOffer />
      <OurStory />
      <RoomInspiration />
      <EditorsPicks products={products} />
      <RecommendedProducts products={products} />
      <CustomerTestimonials />
      <StoreLocator />
      <JournalSection />
    </MainLayout>
  );
}
