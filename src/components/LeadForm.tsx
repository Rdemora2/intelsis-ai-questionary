"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SAP_MODULES, COMPANY_SIZES, MOTIVATORS, CHALLENGES } from "@/types";
import type { LeadFormData } from "@/types";

export default function LeadForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    jobTitle: "",
    companySize: "",
    motivator: "",
    sapModules: [],
    challenges: "",
    demoInterest: false,
    techHelp: false,
    techHelpText: "",
  });

  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof LeadFormData | "consent", string>>
  >({});

  const validate = (): boolean => {
    const errs: Partial<Record<keyof LeadFormData | "consent", string>> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2)
      errs.fullName = "Nome completo é obrigatório";
    if (!formData.company.trim() || formData.company.trim().length < 2)
      errs.company = "Empresa é obrigatória";
    if (!formData.email.trim()) {
      errs.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Email inválido";
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8)
      errs.phone = "Telefone é obrigatório";
    if (!formData.jobTitle.trim() || formData.jobTitle.trim().length < 2)
      errs.jobTitle = "Cargo é obrigatório";
    if (!formData.companySize)
      errs.companySize = "Tamanho da empresa é obrigatório";
    if (!formData.motivator) errs.motivator = "Selecione um motivador";
    if (formData.sapModules.length === 0)
      errs.sapModules = "Selecione pelo menos um módulo";
    if (!formData.challenges) errs.challenges = "Selecione um desafio";
    if (!consent) errs.consent = "Consentimento é obrigatório";

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleModuleToggle = (moduleId: string) => {
    setFormData((prev) => ({
      ...prev,
      sapModules: prev.sapModules.includes(moduleId)
        ? prev.sapModules.filter((id) => id !== moduleId)
        : [...prev.sapModules, moduleId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, consent }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Erro ao enviar formulário.");
      }

      router.push("/thank-you");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro inesperado. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
      <div className="text-center mb-2">
        <h1 className="text-xl font-bold text-white">
          Cadastro — Grupo Intelsis
        </h1>
        <p className="text-sm text-surface-400 mt-1">
          Cadastre-se para receber oportunidades SAP exclusivas
        </p>
      </div>

      {/* Seção 1: Informações Básicas */}
      <fieldset className="rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-5">
        <legend className="px-2 text-sm font-semibold text-brand-400 uppercase tracking-wide">
          Informações Básicas
        </legend>
        <div className="mt-2 space-y-4">
          {/* Nome Completo */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Nome Completo <span className="text-red-400">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              maxLength={100}
              placeholder="Seu nome completo"
              className={`w-full rounded-lg border ${fieldErrors.fullName ? "border-red-500" : "border-surface-600"} bg-surface-800 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500`}
            />
            {fieldErrors.fullName && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                ⚠ {fieldErrors.fullName}
              </p>
            )}
          </div>

          {/* Empresa */}
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Empresa <span className="text-red-400">*</span>
            </label>
            <input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              maxLength={100}
              placeholder="Nome da sua empresa"
              className={`w-full rounded-lg border ${fieldErrors.company ? "border-red-500" : "border-surface-600"} bg-surface-800 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500`}
            />
            {fieldErrors.company && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                ⚠ {fieldErrors.company}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              maxLength={200}
              placeholder="seu.email@empresa.com"
              className={`w-full rounded-lg border ${fieldErrors.email ? "border-red-500" : "border-surface-600"} bg-surface-800 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500`}
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                ⚠ {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Telefone <span className="text-red-400">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              maxLength={20}
              placeholder="(11) 99999-9999"
              className={`w-full rounded-lg border ${fieldErrors.phone ? "border-red-500" : "border-surface-600"} bg-surface-800 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500`}
            />
            {fieldErrors.phone && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                ⚠ {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* Cargo */}
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Cargo/Posição <span className="text-red-400">*</span>
            </label>
            <input
              id="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
              maxLength={100}
              placeholder="Ex: Diretor de TI, Gerente de Operações"
              className={`w-full rounded-lg border ${fieldErrors.jobTitle ? "border-red-500" : "border-surface-600"} bg-surface-800 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500`}
            />
            {fieldErrors.jobTitle && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                ⚠ {fieldErrors.jobTitle}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Seção 2: Informações da Empresa */}
      <fieldset className="rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-5">
        <legend className="px-2 text-sm font-semibold text-brand-400 uppercase tracking-wide">
          Informações da Empresa
        </legend>
        <div className="mt-2 space-y-4">
          <div>
            <label
              htmlFor="companySize"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Tamanho da Empresa <span className="text-red-400">*</span>
            </label>
            <select
              id="companySize"
              value={formData.companySize}
              onChange={(e) =>
                setFormData({ ...formData, companySize: e.target.value })
              }
              className={`w-full rounded-lg border ${fieldErrors.companySize ? "border-red-500" : "border-surface-600"} bg-surface-800 px-3 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500`}
            >
              <option value="">Selecione o tamanho da empresa</option>
              {COMPANY_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
            {fieldErrors.companySize && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                ⚠ {fieldErrors.companySize}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Seção 3: Motivador */}
      <fieldset className="rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-5">
        <legend className="px-2 text-sm font-semibold text-brand-400 uppercase tracking-wide">
          O que o motiva?
        </legend>
        <div className="mt-2 space-y-4">
          <div>
            <label
              htmlFor="motivator"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Qual é seu principal motivador?{" "}
              <span className="text-red-400">*</span>
            </label>
            <select
              id="motivator"
              value={formData.motivator}
              onChange={(e) =>
                setFormData({ ...formData, motivator: e.target.value })
              }
              className={`w-full rounded-lg border ${fieldErrors.motivator ? "border-red-500" : "border-surface-600"} bg-surface-800 px-3 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500`}
            >
              <option value="">Selecione seu motivador</option>
              {MOTIVATORS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            {fieldErrors.motivator && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                ⚠ {fieldErrors.motivator}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Seção 4: Interesse em SAP */}
      <fieldset className="rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-5">
        <legend className="px-2 text-sm font-semibold text-brand-400 uppercase tracking-wide">
          Seu Interesse em SAP
        </legend>
        <div className="mt-2 space-y-5">
          {/* Módulos SAP */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-3">
              Módulos SAP de Interesse <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAP_MODULES.map((module) => (
                <label
                  key={module.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={formData.sapModules.includes(module.id)}
                    onChange={() => handleModuleToggle(module.id)}
                    className="h-5 w-5 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500 focus:ring-offset-surface-900 cursor-pointer"
                  />
                  <span className="text-sm text-surface-300 group-hover:text-white transition-colors">
                    {module.label}
                  </span>
                </label>
              ))}
            </div>
            {fieldErrors.sapModules && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                ⚠ {fieldErrors.sapModules}
              </p>
            )}
          </div>

          {/* Desafios */}
          <div>
            <label
              htmlFor="challenges"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Principal Desafio da Sua Empresa{" "}
              <span className="text-red-400">*</span>
            </label>
            <select
              id="challenges"
              value={formData.challenges}
              onChange={(e) =>
                setFormData({ ...formData, challenges: e.target.value })
              }
              className={`w-full rounded-lg border ${fieldErrors.challenges ? "border-red-500" : "border-surface-600"} bg-surface-800 px-3 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500`}
            >
              <option value="">Selecione o principal desafio</option>
              {CHALLENGES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {fieldErrors.challenges && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                ⚠ {fieldErrors.challenges}
              </p>
            )}
          </div>

          {/* Interesse em Demonstração */}
          <label className="flex items-center gap-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.demoInterest}
              onChange={(e) =>
                setFormData({ ...formData, demoInterest: e.target.checked })
              }
              className="h-5 w-5 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500 focus:ring-offset-surface-900 cursor-pointer"
            />
            <span className="text-sm text-surface-300">
              Tenho interesse em uma demonstração ao vivo
            </span>
          </label>
        </div>
      </fieldset>

      {/* Seção Destaque: Ajuda com Tecnologia */}
      <div className="rounded-xl border-2 border-brand-500/30 bg-gradient-to-r from-brand-500/10 to-brand-400/5 p-5 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.techHelp}
            onChange={(e) =>
              setFormData({
                ...formData,
                techHelp: e.target.checked,
                techHelpText: e.target.checked ? formData.techHelpText : "",
              })
            }
            className="mt-0.5 h-5 w-5 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500 focus:ring-offset-surface-900 cursor-pointer flex-shrink-0"
          />
          <div>
            <span className="text-sm font-semibold text-white block">
              Além de temas SAP, tenho algum problema com Tecnologia que preciso
              de ajuda?
            </span>
            <span className="text-xs text-surface-400 mt-1 block">
              Marque esta opção se tiver dúvidas ou desafios tecnológicos que
              não estão relacionados aos módulos SAP acima.
            </span>
          </div>
        </label>

        {formData.techHelp && (
          <div className="pl-8">
            <label
              htmlFor="techHelpText"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Descreva seu problema ou necessidade
            </label>
            <textarea
              id="techHelpText"
              value={formData.techHelpText}
              onChange={(e) =>
                setFormData({ ...formData, techHelpText: e.target.value })
              }
              maxLength={500}
              rows={3}
              placeholder="Conte-nos brevemente sobre o problema de tecnologia que você enfrenta…"
              className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
            />
            <p className="text-xs text-surface-500 mt-1 text-right">
              {formData.techHelpText.length}/500
            </p>
          </div>
        )}
      </div>

      {/* LGPD Consent */}
      <label className="flex items-start gap-3 cursor-pointer px-1">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className={`mt-0.5 h-5 w-5 rounded ${fieldErrors.consent ? "border-red-500" : "border-surface-600"} bg-surface-800 text-brand-500 focus:ring-brand-500 focus:ring-offset-surface-900 cursor-pointer flex-shrink-0`}
        />
        <span className="text-xs text-surface-400 leading-relaxed">
          Concordo em ser contatado(a) sobre este cadastro, conforme a{" "}
          <Link
            href="/privacy"
            target="_blank"
            className="text-brand-400 underline hover:text-brand-300"
          >
            Política de Privacidade
          </Link>{" "}
          e em conformidade com a LGPD (Lei nº 13.709/2018).{" "}
          <span className="text-red-400">*</span>
        </span>
      </label>
      {fieldErrors.consent && (
        <p className="text-xs text-red-400 px-1 -mt-4 flex items-center gap-1">
          ⚠ {fieldErrors.consent}
        </p>
      )}

      {error && (
        <div className="rounded-lg bg-red-900/30 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Botão de Envio */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-xl py-4 text-base font-semibold transition-all ${
          loading
            ? "bg-surface-800 text-surface-600 cursor-not-allowed"
            : "bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:shadow-lg hover:shadow-brand-500/25 active:from-brand-600 active:to-brand-500"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Enviando…
          </span>
        ) : (
          "Enviar Meu Cadastro"
        )}
      </button>

      <p className="text-xs text-surface-500 text-center">
        Seus dados serão utilizados apenas para contato relacionado a
        oportunidades SAP pelo Grupo Intelsis.
      </p>
    </form>
  );
}
