import { CmsEditor } from "@/components/admin/CmsEditor";

export default function AdminServicesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">Services</h1>
      <CmsEditor section="services" />
    </div>
  );
}
