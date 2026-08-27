import { CmsEditor } from "@/components/admin/CmsEditor";

export default function AdminSitePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">Business details</h1>
      <p className="text-sm text-text-muted">
        Contact details, logo, social links, and which pages appear in the menu.
      </p>
      <CmsEditor section="site" />
    </div>
  );
}
