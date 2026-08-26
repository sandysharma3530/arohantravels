import { CmsEditor } from "@/components/admin/CmsEditor";

export default function AdminGalleryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">Gallery</h1>
      <CmsEditor section="gallery" />
    </div>
  );
}
