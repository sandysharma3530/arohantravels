import { CmsEditor } from "@/components/admin/CmsEditor";

export default function AdminDestinationsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">Destinations</h1>
      <CmsEditor section="destinations" />
    </div>
  );
}
