import { CmsEditor } from "@/components/admin/CmsEditor";

export default function AdminBlogPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">Blog</h1>
      <CmsEditor section="blog" />
    </div>
  );
}
