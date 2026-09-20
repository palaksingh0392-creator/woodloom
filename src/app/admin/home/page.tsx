import AdminSectionCard from "@/features/admin/components/admin-section-card";
import HomeHeroManager from "@/features/admin/components/home-hero-manager";
import { listAdminHomeHeroSlides } from "@/lib/home";

export default async function AdminHomePage() {
  const slides = await listAdminHomeHeroSlides();

  return (
    <AdminSectionCard title="Homepage Content">
      <HomeHeroManager slides={slides} />
    </AdminSectionCard>
  );
}
