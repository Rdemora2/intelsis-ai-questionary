"use client";

import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  showBack?: boolean;
}

export default function Header({ showBack }: HeaderProps) {
  return (
    <header className="w-full border-b border-surface-800 bg-surface-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-intelsis.svg"
            alt="Grupo Intelsis"
            width={160}
            height={38}
            priority
            className="h-9 w-auto"
          />
        </Link>
        {showBack && (
          <Link
            href="/"
            className="text-sm text-surface-400 hover:text-brand-400 transition-colors"
          >
            ← Início
          </Link>
        )}
      </div>
    </header>
  );
}
