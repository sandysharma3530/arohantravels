import { CmsEditor } from "@/components/admin/CmsEditor";

export default function AdminFaqsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">FAQs</h1>
      <CmsEditor section="faqs" />
    </div>
  );
}
