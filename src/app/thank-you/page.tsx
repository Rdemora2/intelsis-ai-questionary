import Link from "next/link";
import Image from "next/image";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/8 rounded-full blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-brand-400/5 rounded-full blur-[100px] animate-[float_10s_ease-in-out_2s_infinite_reverse]" />
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

          <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-8 w-full">
            <div className="text-5xl mb-5">✅</div>
            <h1 className="text-2xl font-bold text-white mb-3">
              Cadastro realizado com sucesso!
            </h1>
            <p className="text-surface-300 mb-8 leading-relaxed">
              Obrigado por se cadastrar no Grupo Intelsis! Entraremos em contato
              em breve com oportunidades SAP exclusivas para sua empresa.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://grupointelsis.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-300 transition-all duration-200"
              >
                Conheça-nos →
              </a>
              <Link
                href="/scan"
                className="inline-flex items-center justify-center rounded-xl border border-surface-600 px-8 py-3.5 text-sm font-semibold text-surface-300 hover:bg-surface-800 hover:text-white transition-all duration-200"
              >
                Novo cadastro
              </Link>
            </div>
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
