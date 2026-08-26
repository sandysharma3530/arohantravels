import { NextResponse } from "next/server";
import {
  deleteEnquiry,
  getEnquiryById,
  listEnquiries,
  updateEnquiry,
} from "@/lib/enquiries/store";
import { isEnquiryStatus } from "@/lib/enquiries/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const enquiry = await getEnquiryById(id);
    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
    }
    return NextResponse.json({ enquiry });
  }

  const enquiries = await listEnquiries();
  return NextResponse.json({ enquiries });
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        id?: string;
        status?: string;
        notes?: string;
        archived?: boolean;
      }
    | null;

  if (!body?.id) {
    return NextResponse.json({ error: "Missing enquiry id." }, { status: 400 });
  }

  if (body.status != null && !isEnquiryStatus(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const enquiry = await updateEnquiry(body.id, {
    ...(body.status ? { status: body.status } : {}),
    ...(typeof body.notes === "string" ? { notes: body.notes } : {}),
    ...(typeof body.archived === "boolean" ? { archived: body.archived } : {}),
  });

  if (!enquiry) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, enquiry });
}

export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  const id =
    body?.id || new URL(request.url).searchParams.get("id") || "";

  if (!id) {
    return NextResponse.json({ error: "Missing enquiry id." }, { status: 400 });
  }

  const deleted = await deleteEnquiry(id);
  if (!deleted) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
