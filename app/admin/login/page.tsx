"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminApi, setToken } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    setStatus("submitting");
    setError(null);
    try {
      const { token } = await adminApi.login(
        String(fd.get("email") ?? ""),
        String(fd.get("password") ?? ""),
      );
      setToken(token);
      router.push("/admin");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-cream-100 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-3xl border border-nude-100 bg-white p-8 shadow-sm"
      >
        <div className="font-display text-2xl text-ink-900">Emcey Admin</div>
        <p className="mt-1 text-sm text-ink-500">Sign in to manage the studio.</p>

        <label className="mt-6 block text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-ink-500">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-2 w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-3 text-sm text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
          />
        </label>

        <label className="mt-4 block text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-ink-500">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-2xl border border-nude-200 bg-blush-50/40 px-4 py-3 text-sm text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
          />
        </label>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn btn-primary mt-6 w-full disabled:opacity-60"
        >
          {status === "submitting" ? "Signing in…" : "Sign in"}
        </button>

        {error ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}
      </form>
    </div>
  );
}
