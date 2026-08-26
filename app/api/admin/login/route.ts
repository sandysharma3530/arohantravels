import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  credentialsMatch,
  getAdminCookieName,
  getAdminCookieOptions,
  isAdminAuthConfigured,
} from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "Set ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_SECRET in .env.local." },
      { status: 503 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const limited = rateLimit(`admin-login:${ip}`, 8, 15 * 60 * 1000);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait and try again." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;
  const username = body?.username?.trim() || "";
  const password = body?.password || "";

  if (!credentialsMatch(username, password)) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const token = await createAdminSessionToken(username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminCookieName(), token, getAdminCookieOptions());
  return response;
}
