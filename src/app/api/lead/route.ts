import { NextRequest, NextResponse } from "next/server";
import { leadRequestSchema } from "@/lib/validation";
import { sanitizeText } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";
import { createRequestId, logRequest, logError } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = createRequestId();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip, 20)) {
    logRequest(requestId, "POST", "/api/lead", 429, Date.now() - startTime);
    return NextResponse.json({ error: "Muitas requisições." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const validation = leadRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos.",
          details: validation.error.issues.map(
            (i: { path: (string | number)[]; message: string }) => ({
              field: i.path.join("."),
              message: i.message,
            }),
          ),
        },
        { status: 400 },
      );
    }

    const data = validation.data;

    const existingResult = await prisma.scanResult.findUnique({
      where: { id: data.resultId },
      include: { lead: true },
    });

    if (!existingResult) {
      return NextResponse.json(
        { error: "Resultado não encontrado." },
        { status: 404 },
      );
    }

    if (existingResult.lead) {
      return NextResponse.json(
        { error: "Lead já registrado para este diagnóstico." },
        { status: 409 },
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name: sanitizeText(data.name, 100),
        company: sanitizeText(data.company, 100),
        email: sanitizeText(data.email, 200),
        whatsapp: data.whatsapp ? sanitizeText(data.whatsapp, 20) : null,
        consent: data.consent,
        resultId: data.resultId,
      },
    });

    logRequest(requestId, "POST", "/api/lead", 201, Date.now() - startTime);

    return NextResponse.json(
      { id: lead.id, message: "Lead registrado." },
      { status: 201 },
    );
  } catch (error) {
    logError(requestId, error, "lead_api");
    logRequest(requestId, "POST", "/api/lead", 500, Date.now() - startTime);

    return NextResponse.json(
      { error: "Erro interno ao registrar lead." },
      { status: 500 },
    );
  }
}
