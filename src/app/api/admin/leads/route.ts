import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return unauthorizedResponse();
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
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
      techHelpText: l.techHelpText,
      createdAt: l.createdAt.toISOString(),
    };
  });

  return NextResponse.json({ results: formatted });
}
