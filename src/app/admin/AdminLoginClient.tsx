"use client";

import React, { useState } from "react";
import { loginAction } from "./actions";
import { Lock } from "lucide-react";

export default function AdminLoginClient() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginAction(password);
      if (res.success) {
        window.location.reload(); // reload page to verify session cookies on server
      } else {
        setError(res.error || "Login failed.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-radial from-slate-950 via-purple-950 to-black px-6 text-white select-none">
      {/* Background stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute w-[2px] h-[2px] bg-white rounded-full top-1/4 left-1/3 animate-ping duration-[3000ms]" />
        <div className="absolute w-[3px] h-[3px] bg-pink-300 rounded-full top-2/3 left-3/4 animate-pulse duration-[2000ms]" />
      </div>

      <div className="relative w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md shadow-2xl text-center">
        {/* Glow halo */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent pointer-events-none rounded-2xl" />

        <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-400/20 flex items-center justify-center mx-auto mb-6 text-pink-300">
          <Lock size={28} />
        </div>

        <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200">
          Admin Login
        </h2>
        <p className="text-zinc-400 text-sm mt-2 mb-8">
          Enter password to access the website settings dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 bg-black/40 border border-white/10 rounded-xl text-center text-white placeholder-zinc-500 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-semibold tracking-wide drop-shadow-md">
              ❌ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl font-bold tracking-wider text-white shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-98 transition-transform disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Authenticating..." : "Enter Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
