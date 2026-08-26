import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { EnquiryInput } from "@/lib/validation";
import { getAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import { isEphemeralHost, PERSISTENT_STORAGE_HELP } from "@/lib/runtime";
import {
  isEnquiryStatus,
  type EnquiryPatch,
  type StoredEnquiry,
} from "@/lib/enquiries/types";

const FILE_PATH = path.join(process.cwd(), "data", "enquiries.json");

type FilePayload = { enquiries: StoredEnquiry[] };

type SupabaseEnquiryRow = {
  id: string;
  reference: string;
  full_name: string;
  phone: string;
  email: string | null;
  travel_date: string | null;
  return_date: string | null;
  pickup_location: string;
  destination: string;
  passengers: number | null;
  preferred_vehicle: string | null;
  trip_type: string | null;
  message: string | null;
  source_page: string | null;
  submitted_at: string;
  created_at?: string;
  status?: string | null;
  notes?: string | null;
  archived?: boolean | null;
  updated_at?: string | null;
};

function nowIso() {
  return new Date().toISOString();
}

function asDateOnly(value?: string | null) {
  if (!value || !value.trim()) return null;
  return value.slice(0, 10);
}

function normalizeEnquiry(row: Partial<StoredEnquiry> & { id: string; reference: string }): StoredEnquiry {
  const submittedAt = row.submittedAt || nowIso();
  return {
    id: row.id,
    reference: row.reference,
    fullName: row.fullName || "",
    phone: row.phone || "",
    email: row.email || null,
    travelDate: asDateOnly(row.travelDate),
    returnDate: asDateOnly(row.returnDate),
    pickupLocation: row.pickupLocation || "",
    destination: row.destination || "",
    passengers: typeof row.passengers === "number" ? row.passengers : null,
    preferredVehicle: row.preferredVehicle || null,
    tripType: row.tripType || null,
    message: row.message || null,
    sourcePage: row.sourcePage || null,
    submittedAt,
    status: isEnquiryStatus(row.status) ? row.status : "new",
    notes: row.notes || "",
    archived: Boolean(row.archived),
    createdAt: row.createdAt || submittedAt,
    updatedAt: row.updatedAt || submittedAt,
  };
}

function fromSupabaseRow(row: SupabaseEnquiryRow): StoredEnquiry {
  return normalizeEnquiry({
    id: row.id,
    reference: row.reference,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    travelDate: row.travel_date,
    returnDate: row.return_date,
    pickupLocation: row.pickup_location,
    destination: row.destination,
    passengers: row.passengers,
    preferredVehicle: row.preferred_vehicle,
    tripType: row.trip_type,
    message: row.message,
    sourcePage: row.source_page,
    submittedAt: row.submitted_at,
    status: isEnquiryStatus(row.status) ? row.status : "new",
    notes: row.notes || "",
    archived: Boolean(row.archived),
    createdAt: row.created_at || row.submitted_at,
    updatedAt: row.updated_at || row.submitted_at,
  });
}

function toSupabaseRow(enquiry: StoredEnquiry) {
  return {
    id: enquiry.id,
    reference: enquiry.reference,
    full_name: enquiry.fullName,
    phone: enquiry.phone,
    email: enquiry.email,
    travel_date: enquiry.travelDate,
    return_date: enquiry.returnDate,
    pickup_location: enquiry.pickupLocation,
    destination: enquiry.destination,
    passengers: enquiry.passengers,
    preferred_vehicle: enquiry.preferredVehicle,
    trip_type: enquiry.tripType,
    message: enquiry.message,
    source_page: enquiry.sourcePage,
    submitted_at: enquiry.submittedAt,
    created_at: enquiry.createdAt,
    status: enquiry.status,
    notes: enquiry.notes,
    archived: enquiry.archived,
    updated_at: enquiry.updatedAt,
  };
}

function mergeEnquiries(groups: StoredEnquiry[][]) {
  const map = new Map<string, StoredEnquiry>();
  for (const group of groups) {
    for (const item of group) {
      const key = item.reference || item.id;
      const existing = map.get(key);
      if (!existing || existing.updatedAt < item.updatedAt) {
        map.set(key, item);
      }
    }
  }
  return [...map.values()].sort((a, b) =>
    b.submittedAt.localeCompare(a.submittedAt),
  );
}

async function readFileEnquiries(): Promise<StoredEnquiry[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as FilePayload;
    return (parsed.enquiries || []).map((item) =>
      normalizeEnquiry({
        ...item,
        id: item.id || randomUUID(),
        reference: item.reference,
      }),
    );
  } catch {
    return [];
  }
}

async function writeFileEnquiries(enquiries: StoredEnquiry[]) {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  const payload: FilePayload = { enquiries };
  await fs.writeFile(FILE_PATH, JSON.stringify(payload, null, 2), "utf8");
}

async function tryWriteFileEnquiries(enquiries: StoredEnquiry[]) {
  if (isEphemeralHost()) return;
  try {
    await writeFileEnquiries(enquiries);
  } catch (error) {
    console.warn("[enquiries] local file write skipped", error);
  }
}

async function readSupabaseEnquiries(): Promise<StoredEnquiry[]> {
  const client = getAdminClient();
  if (!client) return [];
  const { data, error } = await client
    .from("enquiries")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) {
    console.error("[enquiries] supabase list failed", error.message);
    return [];
  }
  return ((data || []) as SupabaseEnquiryRow[]).map(fromSupabaseRow);
}

async function upsertSupabaseEnquiry(enquiry: StoredEnquiry) {
  const client = getAdminClient();
  if (!client) return { saved: false as const, reason: "not_configured" as const };

  const fullRow = toSupabaseRow(enquiry);
  const { error } = await client.from("enquiries").upsert(fullRow);
  if (!error) return { saved: true as const };

  console.warn(
    "[enquiries] supabase upsert with management fields failed; retrying base columns",
    error.message,
  );

  const baseRow = {
    id: fullRow.id,
    reference: fullRow.reference,
    full_name: fullRow.full_name,
    phone: fullRow.phone,
    email: fullRow.email,
    travel_date: fullRow.travel_date,
    return_date: fullRow.return_date,
    pickup_location: fullRow.pickup_location,
    destination: fullRow.destination,
    passengers: fullRow.passengers,
    preferred_vehicle: fullRow.preferred_vehicle,
    trip_type: fullRow.trip_type,
    message: fullRow.message,
    source_page: fullRow.source_page,
    submitted_at: fullRow.submitted_at,
  };
  const retry = await client.from("enquiries").upsert(baseRow);
  if (retry.error) {
    console.error("[enquiries] supabase upsert failed", retry.error.message);
    return { saved: false as const, reason: "error" as const };
  }
  return { saved: true as const };
}

async function deleteSupabaseEnquiry(id: string, reference: string) {
  const client = getAdminClient();
  if (!client) return;
  const byId = await client.from("enquiries").delete().eq("id", id);
  if (byId.error) {
    console.error("[enquiries] supabase delete by id failed", byId.error.message);
  }
  await client.from("enquiries").delete().eq("reference", reference);
}

export function getEnquiryStorageBackend() {
  return isSupabaseConfigured() ? "supabase" : "filesystem";
}

export async function listEnquiries(): Promise<StoredEnquiry[]> {
  const fileItems = await readFileEnquiries();
  if (!isSupabaseConfigured()) return fileItems;
  const dbItems = await readSupabaseEnquiries();
  return mergeEnquiries([fileItems, dbItems]);
}

export async function getEnquiryById(id: string) {
  const items = await listEnquiries();
  return (
    items.find((item) => item.id === id || item.reference === id) || null
  );
}

export async function saveEnquiry(params: {
  reference: string;
  data: EnquiryInput;
  submittedAt: string;
  sourcePage?: string;
}) {
  if (isEphemeralHost() && !isSupabaseConfigured()) {
    throw new Error(`Could not save enquiry. ${PERSISTENT_STORAGE_HELP}`);
  }

  const timestamp = params.submittedAt || nowIso();
  const enquiry = normalizeEnquiry({
    id: randomUUID(),
    reference: params.reference,
    fullName: params.data.fullName,
    phone: params.data.phone,
    email: params.data.email || null,
    travelDate: params.data.travelDate,
    returnDate: params.data.returnDate || null,
    pickupLocation: params.data.pickupLocation,
    destination: params.data.destination,
    passengers: Number(params.data.passengers),
    preferredVehicle: params.data.preferredVehicle,
    tripType: params.data.tripType,
    message: params.data.message || null,
    sourcePage: params.sourcePage || params.data.sourcePage || null,
    submittedAt: timestamp,
    status: "new",
    notes: "",
    archived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const current = await readFileEnquiries();
  await tryWriteFileEnquiries(
    [enquiry, ...current.filter((item) => item.reference !== enquiry.reference)],
  );

  const supabase = await upsertSupabaseEnquiry(enquiry);
  if (isEphemeralHost() && !supabase.saved) {
    throw new Error(
      "Could not save enquiry to Supabase. Run supabase/production.sql and check SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return {
    saved: true as const,
    enquiry,
    backend: supabase.saved ? (isEphemeralHost() ? "supabase" : "both") : "filesystem",
  };
}

export async function updateEnquiry(id: string, patch: EnquiryPatch) {
  const items = await listEnquiries();
  const index = items.findIndex((item) => item.id === id || item.reference === id);
  if (index < 0) return null;

  const next: StoredEnquiry = {
    ...items[index],
    ...patch,
    status: patch.status ?? items[index].status,
    notes: patch.notes ?? items[index].notes,
    archived: patch.archived ?? items[index].archived,
    updatedAt: nowIso(),
  };

  const fileItems = await readFileEnquiries();
  const fileIndex = fileItems.findIndex(
    (item) => item.id === next.id || item.reference === next.reference,
  );
  if (fileIndex >= 0) {
    fileItems[fileIndex] = next;
    await tryWriteFileEnquiries(fileItems);
  } else {
    await tryWriteFileEnquiries([next, ...fileItems]);
  }

  const stored = await upsertSupabaseEnquiry(next);
  if (isEphemeralHost() && !stored.saved) {
    throw new Error(
      "Could not update enquiry in Supabase. Run supabase/production.sql and check SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return next;
}

export async function deleteEnquiry(id: string) {
  const items = await listEnquiries();
  const existing = items.find((item) => item.id === id || item.reference === id);
  if (!existing) return false;

  const fileItems = await readFileEnquiries();
  await tryWriteFileEnquiries(
    fileItems.filter(
      (item) => item.id !== existing.id && item.reference !== existing.reference,
    ),
  );
  await deleteSupabaseEnquiry(existing.id, existing.reference);
  return true;
}
