"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PROCESS_CHECKBOXES,
  OPERATION_CHECKBOXES,
  DOCUMENT_CHECKBOXES,
  COMMUNICATION_CHECKBOXES,
  COMPANY_SIZE_OPTIONS,
  AREA_OPTIONS,
  AREA_LABELS,
} from "@/types";
import LoadingSteps from "./LoadingSteps";

interface CheckboxGroupProps {
  title: string;
  items: readonly { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function CheckboxGroup({
  title,
  items,
  selected,
  onChange,
}: CheckboxGroupProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <fieldset className="rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-5">
      <legend className="px-2 text-sm font-semibold text-brand-400 uppercase tracking-wide">
        {title}
      </legend>
      <div className="space-y-3 mt-2">
        {items.map((item) => (
          <label
            key={item.value}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selected.includes(item.value)}
              onChange={() => toggle(item.value)}
              className="mt-0.5 h-5 w-5 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500 focus:ring-offset-surface-900 cursor-pointer"
            />
            <span className="text-sm text-surface-300 group-hover:text-white leading-snug transition-colors">
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ScanForm() {
  const router = useRouter();
  const [processes, setProcesses] = useState<string[]>([]);
  const [operations, setOperations] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [communication, setCommunication] = useState<string[]>([]);
  const [problemText, setProblemText] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [area, setArea] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");

  const hasSelection =
    processes.length +
      operations.length +
      documents.length +
      communication.length >
    0;
  const isValid =
    hasSelection &&
    companySize &&
    area &&
    name.trim().length >= 2 &&
    company.trim().length >= 2 &&
    email.includes("@") &&
    lgpdConsent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setLoadingStep(0);
    setError("");

    const timer1 = setTimeout(() => setLoadingStep(1), 1200);
    const timer2 = setTimeout(() => setLoadingStep(2), 2400);
    const startTime = Date.now();

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: { processes, operations, documents, communication },
          problemText: problemText.trim(),
          companySize,
          area,
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          lgpdConsent,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Erro ao processar diagnóstico.");
      }

      const result = await response.json();
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 3500 - elapsed);

      setTimeout(() => {
        router.push(`/result/${result.id}`);
      }, remaining);
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setLoading(false);
      setLoadingStep(0);
      setError(
        err instanceof Error
          ? err.message
          : "Erro inesperado. Tente novamente.",
      );
    }
  };

  if (loading) {
    return <LoadingSteps currentStep={loadingStep} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
      <div className="text-center mb-2">
        <h1 className="text-xl font-bold text-white">
          Diagnóstico de Automação
        </h1>
        <p className="text-sm text-surface-400 mt-1">
          Marque as dores que você e sua equipe vivenciam no dia a dia
        </p>
      </div>

      <CheckboxGroup
        title="Processos & Pessoas"
        items={PROCESS_CHECKBOXES}
        selected={processes}
        onChange={setProcesses}
      />

      <CheckboxGroup
        title="Dados & Sistemas"
        items={OPERATION_CHECKBOXES}
        selected={operations}
        onChange={setOperations}
      />

      <CheckboxGroup
        title="Documentos & Compliance"
        items={DOCUMENT_CHECKBOXES}
        selected={documents}
        onChange={setDocuments}
      />

      <CheckboxGroup
        title="Comunicação & Indicadores"
        items={COMMUNICATION_CHECKBOXES}
        selected={communication}
        onChange={setCommunication}
      />

      <fieldset className="rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-5">
        <legend className="px-2 text-sm font-semibold text-brand-400 uppercase tracking-wide">
          Contexto (opcional)
        </legend>
        <div className="mt-2">
          <label
            htmlFor="problemText"
            className="block text-sm text-surface-400 mb-2"
          >
            Descreva brevemente um problema operacional atual
          </label>
          <textarea
            id="problemText"
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Ex: Nosso processo de fechamento mensal leva 5 dias porque dependemos de planilhas…"
            className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
          />
          <p className="text-xs text-surface-500 mt-1 text-right">
            {problemText.length}/500
          </p>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-5">
        <legend className="px-2 text-sm font-semibold text-brand-400 uppercase tracking-wide">
          Sobre sua empresa
        </legend>
        <div className="mt-2 space-y-4">
          <div>
            <label
              htmlFor="leadName"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Seu nome <span className="text-red-400">*</span>
            </label>
            <input
              id="leadName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
              placeholder="Nome completo"
              className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label
              htmlFor="leadCompany"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Empresa <span className="text-red-400">*</span>
            </label>
            <input
              id="leadCompany"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              maxLength={100}
              required
              placeholder="Nome da empresa"
              className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label
              htmlFor="leadEmail"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              E-mail corporativo <span className="text-red-400">*</span>
            </label>
            <input
              id="leadEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={200}
              required
              placeholder="seu@empresa.com"
              className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label
              htmlFor="companySize"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Tamanho da empresa <span className="text-red-400">*</span>
            </label>
            <select
              id="companySize"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              required
              className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="">Selecione o porte</option>
              {COMPANY_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} colaboradores
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="area"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Área principal <span className="text-red-400">*</span>
            </label>
            <select
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
              className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="">Selecione a área</option>
              {AREA_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {AREA_LABELS[opt]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* LGPD Consent */}
      <label className="flex items-start gap-3 cursor-pointer px-1">
        <input
          type="checkbox"
          checked={lgpdConsent}
          onChange={(e) => setLgpdConsent(e.target.checked)}
          required
          className="mt-0.5 h-5 w-5 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500 focus:ring-offset-surface-900 cursor-pointer flex-shrink-0"
        />
        <span className="text-xs text-surface-400 leading-relaxed">
          Concordo com o tratamento dos meus dados pessoais para fins deste
          diagnóstico e possível contato comercial, conforme a{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 underline hover:text-brand-300"
          >
            Política de Privacidade
          </a>{" "}
          e em conformidade com a LGPD (Lei nº 13.709/2018).{" "}
          <span className="text-red-400">*</span>
        </span>
      </label>

      {error && (
        <div className="rounded-lg bg-red-900/30 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid}
        className={`w-full rounded-xl py-4 text-base font-semibold transition-all ${
          isValid
            ? "bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:shadow-lg hover:shadow-brand-500/25 active:from-brand-600 active:to-brand-500"
            : "bg-surface-800 text-surface-600 cursor-not-allowed"
        }`}
      >
        Gerar diagnóstico com soluções SAP
      </button>

      {!hasSelection && (
        <p className="text-center text-xs text-surface-500">
          Selecione ao menos um item para continuar
        </p>
      )}
    </form>
  );
}
