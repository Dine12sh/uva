"use client";

import React from "react";

export default function SectionSkeleton() {
  return (
    <div className="w-full min-h-[300px] flex flex-col items-center justify-center py-20 px-6 bg-black/40 relative overflow-hidden border-b border-white/5 select-none">
      <div className="w-full max-w-xl flex flex-col gap-5 items-center">
        {/* Title skeleton */}
        <div className="h-7 w-2/5 bg-zinc-800/60 rounded-md animate-pulse" />
        {/* Content line 1 */}
        <div className="h-4.5 w-4/5 bg-zinc-900/60 rounded-md animate-pulse" />
        {/* Content line 2 */}
        <div className="h-4.5 w-3/5 bg-zinc-900/40 rounded-md animate-pulse" />
        {/* Center decorative element */}
        <div className="mt-6 w-36 h-36 rounded-full border border-pink-500/10 bg-pink-500/5 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 rounded-full bg-pink-500/10" />
        </div>
      </div>
    </div>
  );
}
export { SectionSkeleton };
