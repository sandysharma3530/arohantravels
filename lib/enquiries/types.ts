export const ENQUIRY_STATUSES = [
  "new",
  "contacted",
  "quoted",
  "booked",
  "closed",
  "cancelled",
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  booked: "Booked",
  closed: "Closed",
  cancelled: "Cancelled",
};

export type StoredEnquiry = {
  id: string;
  reference: string;
  fullName: string;
  phone: string;
  email: string | null;
  travelDate: string | null;
  returnDate: string | null;
  pickupLocation: string;
  destination: string;
  passengers: number | null;
  preferredVehicle: string | null;
  tripType: string | null;
  message: string | null;
  sourcePage: string | null;
  submittedAt: string;
  status: EnquiryStatus;
  notes: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EnquiryPatch = Partial<
  Pick<StoredEnquiry, "status" | "notes" | "archived">
>;

export function isEnquiryStatus(value: unknown): value is EnquiryStatus {
  return (
    typeof value === "string" &&
    (ENQUIRY_STATUSES as readonly string[]).includes(value)
  );
}

export function countEnquiriesByStatus(enquiries: StoredEnquiry[]) {
  const counts = {
    total: 0,
    new: 0,
    contacted: 0,
    quoted: 0,
    booked: 0,
    closed: 0,
    cancelled: 0,
    archived: 0,
  };
  for (const item of enquiries) {
    if (item.archived) {
      counts.archived += 1;
      continue;
    }
    counts.total += 1;
    counts[item.status] += 1;
  }
  return counts;
}
