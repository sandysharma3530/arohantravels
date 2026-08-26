import { CmsEditor } from "@/components/admin/CmsEditor";

export default function AdminPagesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">About & legal pages</h1>
      <CmsEditor section="pages" />
    </div>
  );
}
