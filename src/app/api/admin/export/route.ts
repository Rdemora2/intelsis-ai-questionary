import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return unauthorizedResponse();
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows = leads.map((l: (typeof leads)[number]) => {
    let modules = "";
    try {
      modules = JSON.parse(l.sapModules).join("; ");
    } catch {
      modules = l.sapModules;
    }
    return {
      Data: l.createdAt.toISOString().split("T")[0],
      Nome: l.fullName,
      Empresa: l.company,
      "E-mail": l.email,
      Telefone: l.phone,
      Cargo: l.jobTitle,
      Porte: l.companySize,
      Motivador: l.motivator,
      "Módulos SAP": modules,
      Desafio: l.challenges,
      Demo: l.demoInterest ? "Sim" : "Não",
      "Ajuda Tech": l.techHelp ? "Sim" : "Não",
      "Detalhe Tech": l.techHelpText || "",
      Consentimento: l.consent ? "Sim" : "Não",
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leads");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="leads-export-${new Date().toISOString().split("T")[0]}.xlsx"`,
    },
  });
}
