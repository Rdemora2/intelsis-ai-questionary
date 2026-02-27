"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import HomeSplash from "@/components/HomeSplash";

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashFinish = useCallback(() => setSplashDone(true), []);

  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      {!splashDone && <HomeSplash onFinish={handleSplashFinish} />}

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating gradient orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/8 rounded-full blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-brand-400/5 rounded-full blur-[100px] animate-[float_10s_ease-in-out_2s_infinite_reverse]" />
          <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-brand-500/5 rounded-full blur-[90px] animate-[float_12s_ease-in-out_4s_infinite]" />

          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Animated particles — 16 dots */}
          {[
            { top: "12%", left: "10%", w: "w-1", d: "6s", delay: "0s" },
            { top: "25%", left: "85%", w: "w-1.5", d: "7s", delay: "1s" },
            { top: "40%", left: "70%", w: "w-1", d: "8s", delay: "2s" },
            { top: "55%", left: "25%", w: "w-1", d: "5s", delay: "0.5s" },
            { top: "70%", left: "55%", w: "w-0.5", d: "6s", delay: "3s" },
            { top: "18%", left: "45%", w: "w-1", d: "9s", delay: "1.5s" },
            { top: "80%", left: "15%", w: "w-1.5", d: "7s", delay: "4s" },
            { top: "35%", left: "5%", w: "w-1", d: "8s", delay: "2.5s" },
            { top: "65%", left: "90%", w: "w-1", d: "6s", delay: "0.8s" },
            { top: "48%", left: "40%", w: "w-0.5", d: "10s", delay: "3.5s" },
            { top: "8%", left: "65%", w: "w-1", d: "7s", delay: "1.2s" },
            { top: "88%", left: "75%", w: "w-1", d: "5s", delay: "2.8s" },
            { top: "30%", left: "50%", w: "w-0.5", d: "9s", delay: "4.2s" },
            { top: "75%", left: "35%", w: "w-1.5", d: "6s", delay: "1.8s" },
            { top: "50%", left: "8%", w: "w-1", d: "8s", delay: "3.2s" },
            { top: "15%", left: "30%", w: "w-1", d: "7s", delay: "0.3s" },
          ].map((p, i) => (
            <div
              key={i}
              className={`absolute ${p.w} ${p.w} rounded-full bg-brand-400/30`}
              style={{
                top: p.top,
                left: p.left,
                aspectRatio: "1",
                animationName: "particle",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDuration: p.d,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        <div className="max-w-lg w-full flex flex-col items-center text-center relative z-10">
          <div className="mb-6 w-full flex justify-center">
            <Image
              src="/grupo-intelsis.png"
              alt="Grupo Intelsis"
              width={360}
              height={86}
              priority
              className="h-20 w-auto"
            />
          </div>

          <div className="space-y-3 mb-8">
            <h1 className="text-3xl font-bold text-white leading-tight sm:text-4xl tracking-tight">
              Cadastre-se no
              <span className="text-brand-400"> Grupo Intelsis </span>
              e receba oportunidades SAP
            </h1>

            <p className="text-surface-400 text-lg leading-relaxed">
              Preencha seus dados e fique por dentro de soluções e novidades SAP
              com o Grupo Intelsis.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/scan"
              className="inline-block w-full max-w-xs rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-300 active:from-brand-600 active:to-brand-500 transition-all duration-200"
            >
              Preencher cadastro →
            </Link>

            <p className="text-xs text-surface-500">
              Leva menos de 2 minutos. Seus dados estão seguros.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-surface-800 py-4 text-center text-xs text-surface-500">
        <Link
          href="/privacy"
          className="text-white hover:text-brand-400 transition-colors"
        >
          Política de Privacidade
        </Link>
        <span className="mx-2 text-surface-700">·</span>
        <a
          href="https://grupointelsis.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-brand-400 transition-colors"
        >
          Grupo Intelsis
        </a>
      </footer>
    </div>
  );
}
