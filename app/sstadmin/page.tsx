import Link from "next/link";
import { readBundle, getPreferredBackend } from "@/lib/cms/store";
import { countEnquiriesByStatus } from "@/lib/enquiries/types";
import { listEnquiries } from "@/lib/enquiries/store";

const LINKS = [
  ["/sstadmin/enquiries", "Enquiries", "Incoming quotes — status, notes and follow-up"],
  ["/sstadmin/site", "Business details", "Phone, address, social links and navigation"],
  ["/sstadmin/home", "Home page", "Hero slides and trust bar"],
  ["/sstadmin/destinations", "Destinations", "Places you serve and home featured cards"],
  ["/sstadmin/fleet", "Fleet", "Traveller and Urbania copy and images"],
  ["/sstadmin/services", "Services", "Trip types and why-choose-us points"],
  ["/sstadmin/faqs", "FAQs", "Questions shown on the homepage"],
  ["/sstadmin/reviews", "Reviews", "Customer feedback on the site"],
  ["/sstadmin/blog", "Blog", "Travel guides and articles"],
  ["/sstadmin/gallery", "Gallery", "Photo captions and image paths"],
  ["/sstadmin/pages", "About & legal", "About, contact intro, privacy and terms"],
] as const;

export default async function AdminDashboardPage() {
  const { bundle, backend } = await readBundle();
  const preferred = getPreferredBackend();
  const enquiryCounts = countEnquiriesByStatus(await listEnquiries());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Website admin</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Update public website content here without editing code. Storage is
          currently using <strong>{preferred === "supabase" ? "Supabase" : backend}</strong>.
          {preferred === "supabase"
            ? " Form submissions, photo uploads, destinations and blog edits are saved here and survive deploys."
            : " For Vercel production, run supabase/production.sql and add Supabase keys so enquiries, uploads and content persist after deploy."}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {LINKS.map(([href, title, text]) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:border-teal"
          >
            <h2 className="font-bold text-navy">{title}</h2>
            {href === "/sstadmin/enquiries" && enquiryCounts.new > 0 ? (
              <p className="mt-2 text-sm font-semibold text-teal">
                {enquiryCounts.new} new {enquiryCounts.new === 1 ? "enquiry" : "enquiries"} waiting
              </p>
            ) : (
              <p className="mt-2 text-sm text-text-muted">{text}</p>
            )}
          </Link>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-text-muted">
        <p>
          New enquiries: {enquiryCounts.new} · Open enquiries: {enquiryCounts.total} ·
          Destinations: {bundle.destinations.length} · Blog posts: {bundle.blog.length} ·
          FAQs: {bundle.faqs.length} · Reviews: {bundle.reviews.length}
        </p>
        <p className="mt-3">
          Workflow: edit a section → <strong>Save draft</strong> →{" "}
          <strong>Publish live</strong> when ready.
        </p>
      </div>
    </div>
  );
}
