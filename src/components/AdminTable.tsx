"use client";

import { useState, useEffect, useCallback } from "react";
import {
  COMPANY_SIZE_LABELS,
  MOTIVATOR_LABELS,
  CHALLENGE_LABELS,
} from "@/types";

interface LeadEntry {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  jobTitle: string;
  companySize: string;
  motivator: string;
  sapModules: string[];
  challenges: string;
  demoInterest: boolean;
  techHelp: boolean;
  techHelpText: string | null;
  createdAt: string;
}

export default function AdminTable() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [data, setData] = useState<LeadEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterSize, setFilterSize] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const getAuthHeader = useCallback(() => {
    const stored =
      typeof window !== "undefined" ? sessionStorage.getItem("bar_auth") : null;
    return stored ? `Basic ${stored}` : "";
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterSize) params.set("companySize", filterSize);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    try {
      const res = await fetch(`/api/admin/leads?${params.toString()}`, {
        headers: { Authorization: getAuthHeader() },
      });

      if (res.status === 401) {
        setAuthenticated(false);
        sessionStorage.removeItem("bar_auth");
        return;
      }

      const json = await res.json();
      setData(json.results || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filterSize, dateFrom, dateTo, getAuthHeader]);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = btoa(`${username}:${password}`);

    try {
      const res = await fetch("/api/admin/leads", {
        headers: { Authorization: `Basic ${token}` },
      });

      if (res.ok) {
        sessionStorage.setItem("bar_auth", token);
        setAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError("Credenciais inválidas.");
      }
    } catch {
      setAuthError("Erro de conexão.");
    }
  };

  const handleExport = async () => {
    const params = new URLSearchParams();
    if (filterSize) params.set("companySize", filterSize);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    const res = await fetch(`/api/admin/export?${params.toString()}`, {
      headers: { Authorization: getAuthHeader() },
    });

    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white text-center">
            Acesso Administrativo
          </h2>

          <div>
            <label
              htmlFor="adminUser"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Usuário
            </label>
            <input
              id="adminUser"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label
              htmlFor="adminPass"
              className="block text-sm font-medium text-surface-300 mb-1"
            >
              Senha
            </label>
            <input
              id="adminPass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {authError && (
            <p className="text-sm text-red-400 text-center">{authError}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-brand-500/25 transition-all"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-4">
        <div>
          <label
            htmlFor="filterSize"
            className="block text-xs font-medium text-surface-400 mb-1"
          >
            Porte
          </label>
          <select
            id="filterSize"
            value={filterSize}
            onChange={(e) => setFilterSize(e.target.value)}
            className="rounded-lg border border-surface-600 bg-surface-800 px-3 py-2 text-sm text-white"
          >
            <option value="">Todos</option>
            <option value="startup">Startup</option>
            <option value="small">Pequena</option>
            <option value="medium">Média</option>
            <option value="large">Grande</option>
            <option value="enterprise">Corporação</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="dateFrom"
            className="block text-xs font-medium text-surface-400 mb-1"
          >
            De
          </label>
          <input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-surface-600 bg-surface-800 px-3 py-2 text-sm text-white"
          />
        </div>

        <div>
          <label
            htmlFor="dateTo"
            className="block text-xs font-medium text-surface-400 mb-1"
          >
            Até
          </label>
          <input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-surface-600 bg-surface-800 px-3 py-2 text-sm text-white"
          />
        </div>

        <button
          onClick={fetchData}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 transition-colors"
        >
          Filtrar
        </button>

        <button
          onClick={handleExport}
          className="rounded-lg border border-surface-600 px-4 py-2 text-sm font-medium text-surface-300 hover:bg-surface-800 hover:text-white transition-colors"
        >
          Exportar CSV
        </button>

        <span className="text-xs text-surface-500 ml-auto">
          {data.length} registro(s)
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-surface-400">
          Carregando…
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-sm text-surface-400">
          Nenhum registro encontrado.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surface-700/50">
          <table className="w-full text-sm">
            <thead className="bg-surface-800 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-surface-400">Data</th>
                <th className="px-4 py-3 font-medium text-surface-400">Nome</th>
                <th className="px-4 py-3 font-medium text-surface-400">
                  Empresa
                </th>
                <th className="px-4 py-3 font-medium text-surface-400">
                  E-mail
                </th>
                <th className="px-4 py-3 font-medium text-surface-400">
                  Telefone
                </th>
                <th className="px-4 py-3 font-medium text-surface-400">
                  Cargo
                </th>
                <th className="px-4 py-3 font-medium text-surface-400">
                  Porte
                </th>
                <th className="px-4 py-3 font-medium text-surface-400">
                  Motivador
                </th>
                <th className="px-4 py-3 font-medium text-surface-400">
                  Desafio
                </th>
                <th className="px-4 py-3 font-medium text-surface-400">
                  Demo
                </th>
                <th className="px-4 py-3 font-medium text-surface-400">
                  Tech
                </th>
                <th className="px-4 py-3 font-medium text-surface-400">
                  Detalhe
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800 bg-surface-900">
              {data.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-surface-800/60 transition-colors"
                >
                  <td className="px-4 py-3 text-surface-300 whitespace-nowrap">
                    {new Date(entry.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-surface-300">
                    {entry.fullName}
                  </td>
                  <td className="px-4 py-3 text-surface-300">
                    {entry.company}
                  </td>
                  <td className="px-4 py-3 text-surface-300">{entry.email}</td>
                  <td className="px-4 py-3 text-surface-300">{entry.phone}</td>
                  <td className="px-4 py-3 text-surface-300">
                    {entry.jobTitle}
                  </td>
                  <td className="px-4 py-3 text-surface-300">
                    {COMPANY_SIZE_LABELS[entry.companySize] ||
                      entry.companySize}
                  </td>
                  <td className="px-4 py-3 text-surface-300">
                    {MOTIVATOR_LABELS[entry.motivator] || entry.motivator}
                  </td>
                  <td className="px-4 py-3 text-surface-300">
                    {CHALLENGE_LABELS[entry.challenges] || entry.challenges}
                  </td>
                  <td className="px-4 py-3">
                    {entry.demoInterest ? (
                      <span className="text-brand-400">Sim</span>
                    ) : (
                      <span className="text-surface-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {entry.techHelp ? (
                      <span className="text-brand-400">Sim</span>
                    ) : (
                      <span className="text-surface-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-surface-300 max-w-[200px] truncate" title={entry.techHelpText || ""}>
                    {entry.techHelpText || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
