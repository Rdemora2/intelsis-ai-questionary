import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  const level = searchParams.get("level");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const where: Record<string, unknown> = {};

  if (level) {
    where.level = level.toUpperCase();
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

  const results = await prisma.scanResult.findMany({
    where,
    include: { lead: true },
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Data",
    "ID",
    "Score",
    "Nível",
    "Porte",
    "Área",
    "Nome",
    "Empresa",
    "E-mail",
    "WhatsApp",
    "Consentimento",
  ];

  const rows = results.map((r: (typeof results)[number]) => [
    r.createdAt.toISOString(),
    r.id,
    String(r.score),
    r.level,
    r.companySize || "",
    r.area || "",
    r.lead?.name || "",
    r.lead?.company || "",
    r.lead?.email || "",
    r.lead?.whatsapp || "",
    r.lead?.consent ? "Sim" : "",
  ]);

  const csv =
    headers.map(escapeCSV).join(",") +
    "\n" +
    rows.map((row) => row.map(escapeCSV).join(",")).join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bar-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
