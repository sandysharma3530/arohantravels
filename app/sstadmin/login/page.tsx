"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setup = searchParams.get("setup") === "1";

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed.");
      return;
    }
    router.replace(searchParams.get("next") || "/sstadmin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-soft"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          Arohan Travels
        </p>
        <h1 className="mt-2 text-2xl font-bold text-navy">Admin login</h1>
        {setup ? (
          <p className="mt-3 text-sm text-text-muted">
            Add ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_SECRET to
            .env.local, then restart the server.
          </p>
        ) : (
          <p className="mt-3 text-sm text-text-muted">
            Sign in with the credentials stored in your environment file.
          </p>
        )}
        <label className="mt-6 block text-sm font-semibold text-navy">
          Username
          <input
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-navy">
          Password
          <input
            type="password"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className={cn(buttonVariants({ variant: "teal", size: "lg" }), "mt-6 w-full")}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
