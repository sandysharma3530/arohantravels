import { CmsEditor } from "@/components/admin/CmsEditor";

export default function AdminReviewsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">Reviews</h1>
      <CmsEditor section="reviews" />
    </div>
  );
}
