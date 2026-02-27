import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
    take: 500,
  });

  const formatted = leads.map((l: (typeof leads)[number]) => {
    let sapModules: string[] = [];
    try {
      sapModules = JSON.parse(l.sapModules);
    } catch {
      sapModules = [];
    }
    return {
      id: l.id,
      fullName: l.fullName,
      company: l.company,
      email: l.email,
      phone: l.phone,
      jobTitle: l.jobTitle,
      companySize: l.companySize,
      motivator: l.motivator,
      sapModules,
      challenges: l.challenges,
      demoInterest: l.demoInterest,
      techHelp: l.techHelp,
      createdAt: l.createdAt.toISOString(),
    };
  });

  return NextResponse.json({ results: formatted });
}
