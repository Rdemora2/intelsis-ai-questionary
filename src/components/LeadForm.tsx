"use client";

import { useState } from "react";
import Link from "next/link";

interface LeadFormProps {
  resultId: string;
}

export default function LeadForm({ resultId }: LeadFormProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid =
    name.trim().length >= 2 &&
    company.trim().length >= 2 &&
    email.includes("@") &&
    consent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim() || undefined,
          consent,
          resultId,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Erro ao enviar dados.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  if (skipped) {
    return (
      <div className="text-center py-6 text-sm text-surface-400">
        <p>
          Obrigado por participar! Visite nosso stand para conversar com um
          especialista.
        </p>
        <Link
          href="/"
          className="text-brand-400 hover:text-brand-300 mt-2 inline-block"
        >
          ← Novo diagnóstico
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-6 text-center">
        <div className="text-3xl mb-3">✉️</div>
        <h3 className="font-semibold text-brand-400 mb-1">
          Dados registrados!
        </h3>
        <p className="text-sm text-surface-300">
          Um especialista Intelsis entrará em contato para aprofundar o
          diagnóstico e discutir as soluções SAP recomendadas.
        </p>
        <Link
          href="/"
          className="text-brand-400 hover:text-brand-300 text-sm mt-4 inline-block"
        >
          ← Novo diagnóstico
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-5">
      <div className="text-center mb-4">
        <h3 className="font-semibold text-white">
          Quer aprofundar este diagnóstico?
        </h3>
        <p className="text-xs text-surface-400 mt-1">
          Deixe seus dados para um especialista Intelsis × SAP entrar em contato
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label
            htmlFor="leadName"
            className="block text-sm font-medium text-surface-300 mb-1"
          >
            Nome
          </label>
          <input
            id="leadName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
            className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div>
          <label
            htmlFor="leadCompany"
            className="block text-sm font-medium text-surface-300 mb-1"
          >
            Empresa
          </label>
          <input
            id="leadCompany"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            maxLength={100}
            required
            className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div>
          <label
            htmlFor="leadEmail"
            className="block text-sm font-medium text-surface-300 mb-1"
          >
            E-mail
          </label>
          <input
            id="leadEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={200}
            required
            className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div>
          <label
            htmlFor="leadWhatsapp"
            className="block text-sm font-medium text-surface-300 mb-1"
          >
            WhatsApp{" "}
            <span className="text-surface-500 font-normal">(opcional)</span>
          </label>
          <input
            id="leadWhatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            maxLength={20}
            placeholder="(11) 99999-9999"
            className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="mt-0.5 h-5 w-5 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500 focus:ring-offset-surface-900 cursor-pointer"
          />
          <span className="text-xs text-surface-400 leading-relaxed">
            Concordo em ser contatado(a) sobre este diagnóstico, conforme a{" "}
            <Link
              href="/privacy"
              className="text-brand-400 underline"
              target="_blank"
            >
              Política de Privacidade
            </Link>
            .
          </span>
        </label>

        {error && (
          <div className="rounded-lg bg-red-900/30 border border-red-500/30 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setSkipped(true)}
            className="flex-1 rounded-xl border border-surface-600 py-3 text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-surface-300 transition-colors"
          >
            Pular
          </button>
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${
              isValid && !loading
                ? "bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:shadow-lg hover:shadow-brand-500/25"
                : "bg-surface-800 text-surface-600 cursor-not-allowed"
            }`}
          >
            {loading ? "Enviando…" : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}
