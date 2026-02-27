import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function escapeCSV(value: string | null | undefined): string {
  if (!value) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const companySize = searchParams.get("companySize");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const where: Record<string, unknown> = {};

  if (companySize) {
    where.companySize = companySize;
  }

  if (dateFrom || dateTo) {
    const createdAt: Record<string, Date> = {};
    if (dateFrom) createdAt.gte = new Date(dateFrom);
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      createdAt.lte = to;
    }
    where.createdAt = createdAt;
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Data",
    "ID",
    "Nome",
    "Empresa",
    "E-mail",
    "Telefone",
    "Cargo",
    "Porte",
    "Motivador",
    "Módulos SAP",
    "Desafio",
    "Demo",
    "Ajuda Tech",
    "Detalhe Tech",
    "Consentimento",
  ];

  const rows: string[][] = leads.map((l: (typeof leads)[number]) => {
    let modules = "";
    try {
      modules = JSON.parse(l.sapModules).join("; ");
    } catch {
      modules = l.sapModules;
    }
    return [
      l.createdAt.toISOString(),
      l.id,
      l.fullName,
      l.company,
      l.email,
      l.phone,
      l.jobTitle,
      l.companySize,
      l.motivator,
      modules,
      l.challenges,
      l.demoInterest ? "Sim" : "Não",
      l.techHelp ? "Sim" : "Não",
      l.techHelpText || "",
      l.consent ? "Sim" : "Não",
    ];
  });

  const csv =
    headers.map(escapeCSV).join(",") +
    "\n" +
    rows.map((row: string[]) => row.map(escapeCSV).join(",")).join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
