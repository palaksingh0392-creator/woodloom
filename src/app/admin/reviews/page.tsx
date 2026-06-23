import AdminReviewsTable from "@/features/admin/components/admin-reviews-table";
import AdminSectionCard from "@/features/admin/components/admin-section-card";
import { listAdminProductReviews } from "@/lib/reviews";

export default async function AdminReviewsPage() {
  const reviews = await listAdminProductReviews();

  return (
    <AdminSectionCard title="Review Moderation">
      <AdminReviewsTable reviews={reviews} />
    </AdminSectionCard>
  );
}
