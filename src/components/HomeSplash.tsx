"use client";

import { useEffect, useState } from "react";

export default function HomeSplash({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"logo" | "expand" | "done">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("expand"), 1200);
    const t2 = setTimeout(() => {
      setPhase("done");
      onFinish();
    }, 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-surface-950 transition-opacity duration-700 ${
        phase === "expand" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background pulse rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-72 h-72 rounded-full border border-brand-500/10 animate-[ping_2.5s_ease-out_infinite]" />
        <div className="absolute w-52 h-52 rounded-full border border-brand-400/15 animate-[ping_2.5s_ease-out_0.4s_infinite]" />
        <div className="absolute w-36 h-36 rounded-full border border-brand-300/20 animate-[ping_2.5s_ease-out_0.8s_infinite]" />
      </div>

      {/* Floating particles during splash */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-brand-400/30 animate-[particle_4s_ease-in-out_infinite]"
            style={{
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              top: `${10 + ((i * 7) % 80)}%`,
              left: `${5 + ((i * 11) % 90)}%`,
              animationDelay: `${(i * 0.3) % 3}s`,
              animationDuration: `${3 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      {/* Central logo orb */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Rotating ring */}
        <div className="relative h-24 w-24">
          <svg
            className="absolute inset-0 h-24 w-24 animate-spin"
            style={{ animationDuration: "2.5s" }}
            viewBox="0 0 96 96"
          >
            <defs>
              <linearGradient
                id="splash-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle
              cx="48"
              cy="48"
              r="44"
              fill="none"
              stroke="url(#splash-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="200 276"
            />
          </svg>
          {/* Inner glow */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-brand-500/25 to-brand-400/10 backdrop-blur-sm flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-brand-400 shadow-lg shadow-brand-400/60 animate-pulse" />
          </div>
        </div>

        {/* Brand text */}
        <div className="flex flex-col items-center gap-1 animate-pulse">
          <span className="text-sm font-semibold text-brand-400 tracking-widest uppercase">
            Intelsis
          </span>
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}
