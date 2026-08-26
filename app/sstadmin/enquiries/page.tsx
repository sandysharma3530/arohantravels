import { EnquiriesManager } from "@/components/admin/EnquiriesManager";
import { getEnquiryStorageBackend } from "@/lib/enquiries/store";

export default function AdminEnquiriesPage() {
  const backend = getEnquiryStorageBackend();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Enquiries</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Track website form submissions, update their status, add internal notes,
          and contact customers. Storage is currently using{" "}
          <strong>{backend === "supabase" ? "Supabase" : "local files"}</strong>
          {backend !== "supabase"
            ? ". For production hosting, run supabase/production.sql and add Supabase keys so enquiries persist after deploy."
            : "."}
        </p>
      </div>
      <EnquiriesManager />
    </div>
  );
}