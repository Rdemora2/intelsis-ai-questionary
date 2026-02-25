import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    take: 500,
  });

  const formatted = results.map((r) => ({
    id: r.id,
    score: r.score,
    level: r.level,
    companySize: r.companySize,
    area: r.area,
    createdAt: r.createdAt.toISOString(),
    lead: r.lead
      ? {
          name: r.lead.name,
          company: r.lead.company,
          email: r.lead.email,
          whatsapp: r.lead.whatsapp,
        }
      : null,
  }));

  return NextResponse.json({ results: formatted });
}
