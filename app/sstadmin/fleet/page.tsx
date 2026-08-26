import { CmsEditor } from "@/components/admin/CmsEditor";

export default function AdminFleetPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">Fleet</h1>
      <CmsEditor section="fleet" />
    </div>
  );
}
