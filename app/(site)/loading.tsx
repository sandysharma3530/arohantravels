import { LoadingState } from "@/components/shared/LoadingState";

export default function SiteLoading() {
  return (
    <LoadingState label="Loading page…" className="min-h-[40vh]" />
  );
}
