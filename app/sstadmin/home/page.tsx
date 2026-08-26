import { CmsEditor } from "@/components/admin/CmsEditor";

export default function AdminHomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">Home page</h1>
      <CmsEditor section="home" />
    </div>
  );
}
