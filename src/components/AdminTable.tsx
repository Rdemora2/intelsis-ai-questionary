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

  const getAuthHeader = useCallback(() => {
    const stored =
      typeof window !== "undefined" ? sessionStorage.getItem("bar_auth") : null;
    return stored ? `Basic ${stored}` : "";
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads", {
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
  }, [getAuthHeader]);

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
    const res = await fetch("/api/admin/export", {
      headers: { Authorization: getAuthHeader() },
    });

    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split("T")[0]}.xlsx`;
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
              E-mail
            </label>
            <input
              id="adminUser"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
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
      <div className="flex items-center justify-between rounded-xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm p-4">
        <span className="text-sm text-surface-400">
          {data.length} registro(s)
        </span>

        <button
          onClick={handleExport}
          className="rounded-lg bg-gradient-to-r from-brand-500 to-brand-400 px-5 py-2 text-sm font-medium text-white hover:shadow-lg hover:shadow-brand-500/25 transition-all"
        >
          Baixar XLSX
        </button>
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
                <th className="px-4 py-3 font-medium text-surface-400">Demo</th>
                <th className="px-4 py-3 font-medium text-surface-400">Tech</th>
                <th className="px-4 py-3 font-medium text-surface-400">
                  Detalhe Tech
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
                  <td
                    className="px-4 py-3 text-surface-300 max-w-[200px] truncate"
                    title={entry.techHelpText || ""}
                  >
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
