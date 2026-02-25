"use client";

import { useEffect, useState } from "react";

interface LoadingStepsProps {
  currentStep: number;
}

const STEPS = [
  { label: "Analisando padrões operacionais…", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { label: "Mapeando soluções SAP aplicáveis…", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" },
  { label: "Gerando recomendações personalizadas…", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
];

export default function LoadingSteps({ currentStep }: LoadingStepsProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = Math.min(((currentStep + 1) / STEPS.length) * 100, 95);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= target) return target;
        return prev + 0.5;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 relative">
      {/* Animated background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full border border-brand-500/10 animate-[ping_3s_ease-in-out_infinite]" />
        <div className="absolute w-48 h-48 rounded-full border border-brand-400/15 animate-[ping_3s_ease-in-out_0.5s_infinite]" />
        <div className="absolute w-32 h-32 rounded-full border border-brand-300/20 animate-[ping_3s_ease-in-out_1s_infinite]" />
      </div>

      {/* Central orb */}
      <div className="relative mb-10">
        <div className="relative h-20 w-20">
          {/* Outer rotating ring */}
          <svg className="absolute inset-0 h-20 w-20 animate-spin" style={{ animationDuration: "3s" }} viewBox="0 0 80 80">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="36" fill="none" stroke="url(#grad)" strokeWidth="2" strokeLinecap="round" strokeDasharray="180 226" />
          </svg>
          {/* Inner pulsing core */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-brand-500/30 to-brand-400/10 backdrop-blur-sm flex items-center justify-center animate-pulse">
            <div className="h-6 w-6 rounded-full bg-brand-400 shadow-lg shadow-brand-400/50" />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-8">
        <div className="h-1 rounded-full bg-surface-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300 transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
        <p className="text-xs text-surface-500 text-center mt-2 tabular-nums">
          {Math.round(progress)}%
        </p>
      </div>

      {/* Steps */}
      <div className="w-full max-w-sm space-y-3">
        {STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <div
              key={index}
              className={`flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-700 ease-out ${
                isDone
                  ? "bg-brand-500/10 border border-brand-500/20"
                  : isCurrent
                  ? "bg-surface-800/80 border border-brand-500/30 shadow-lg shadow-brand-500/5"
                  : "bg-surface-900/30 border border-surface-800/50 opacity-40"
              }`}
              style={{
                transform: isCurrent ? "scale(1.02)" : "scale(1)",
                transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center">
                {isDone ? (
                  <div className="h-8 w-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isCurrent ? (
                  <div className="h-8 w-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                    <svg className="h-4 w-4 text-brand-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-surface-800/50 flex items-center justify-center">
                    <svg className="h-4 w-4 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                  </div>
                )}
              </div>
              <span className={`text-sm ${isDone ? "text-brand-400" : isCurrent ? "text-white font-medium" : "text-surface-600"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
