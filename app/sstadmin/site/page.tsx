import { CmsEditor } from "@/components/admin/CmsEditor";

export default function AdminSitePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">Business details</h1>
      <CmsEditor section="site" />
    </div>
  );
}
