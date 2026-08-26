import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validation";
import { generateEnquiryReference } from "@/lib/enquiry-reference";
import { rateLimit } from "@/lib/rate-limit";
import {
  sendCustomerAcknowledgementEmail,
  sendEnquiryNotificationEmail,
} from "@/lib/email";
import { saveEnquiry } from "@/lib/enquiries/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const limited = rateLimit(`enquiry:${ip}`, 5, 60_000);
    if (!limited.success) {
      return NextResponse.json(
        {
          error:
            "Too many enquiry submissions. Please wait a minute and try again.",
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the form fields and try again.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Honeypot triggered
    if (data.website && data.website.length > 0) {
      return NextResponse.json({
        reference: generateEnquiryReference(),
        message: "Enquiry received.",
      });
    }

    const reference = generateEnquiryReference();
    const submittedAt = new Date().toISOString();
    const sourcePage = data.sourcePage || "unknown";

    const notification = await sendEnquiryNotificationEmail({
      reference,
      data,
      submittedAt,
      sourcePage,
    });

    await sendCustomerAcknowledgementEmail({ reference, data });

    const storage = await saveEnquiry({
      reference,
      data,
      submittedAt,
      sourcePage,
    });

    const resendConfigured = Boolean(
      process.env.RESEND_API_KEY &&
        process.env.RESEND_FROM_EMAIL &&
        process.env.BUSINESS_ENQUIRY_EMAIL,
    );

    if (!resendConfigured && notification.skipped) {
      console.info("[enquiry] Accepted without email delivery (dev mode)", {
        reference,
        storage,
      });
    }

    return NextResponse.json({
      reference,
      message:
        "Thank you. Your enquiry has been received. We will contact you shortly.",
      emailSent: !notification.skipped,
      stored: storage.saved,
    });
  } catch (error) {
    console.error("[enquiry] Unexpected error", error);
    return NextResponse.json(
      {
        error:
          "We could not process your enquiry right now. Please try again or contact us on WhatsApp.",
      },
      { status: 500 },
    );
  }
}
