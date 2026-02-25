import { NextRequest, NextResponse } from "next/server";
import { scanRequestSchema } from "@/lib/validation";
import { calculateScore } from "@/lib/scoring";
import { generateDiagnosis } from "@/lib/llm";
import { sanitizeForPrompt } from "@/lib/sanitize";

export const dynamic = "force-dynamic";
import { checkRateLimit } from "@/lib/rate-limit";
import { createRequestId, log, logRequest, logError } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import type { LLMInput, ScanAnswers } from "@/types";
import {
  PROCESS_CHECKBOXES,
  OPERATION_CHECKBOXES,
  DOCUMENT_CHECKBOXES,
  COMMUNICATION_CHECKBOXES,
} from "@/types";

const MAX_BODY_SIZE = 10_000;

/** Resolve selected checkbox values to their human-readable labels */
function resolveLabels(answers: ScanAnswers): string[] {
  const ALL_CHECKBOXES = [
    ...PROCESS_CHECKBOXES,
    ...OPERATION_CHECKBOXES,
    ...DOCUMENT_CHECKBOXES,
    ...COMMUNICATION_CHECKBOXES,
  ];
  const allSelected = [
    ...answers.processes,
    ...answers.operations,
    ...answers.documents,
    ...(answers.communication || []),
  ];
  const labels: string[] = [];
  for (const val of allSelected) {
    const cb = ALL_CHECKBOXES.find((c) => c.value === val);
    if (cb) labels.push(cb.label);
  }
  return labels;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = createRequestId();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    logRequest(requestId, "POST", "/api/scan", 429, Date.now() - startTime);
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em alguns minutos." },
      { status: 429 },
    );
  }

  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "Payload excede o tamanho máximo permitido." },
        { status: 413 },
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
    }

    const validation = scanRequestSchema.safeParse(body);
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
    const sanitizedProblemText = sanitizeForPrompt(data.problemText || "");

    // Deterministic scoring — used ONLY as fallback safety net
    const scoring = calculateScore(
      data.answers,
      sanitizedProblemText,
      data.companySize,
    );

    // Resolve human-readable labels for the LLM
    const selectedPains = resolveLabels(data.answers);

    log("info", "scoring_fallback_ready", {
      request_id: requestId,
      fallback_score: scoring.score,
      fallback_level: scoring.level,
      pains_count: selectedPains.length,
    });

    const llmInput: LLMInput = {
      selectedPains,
      companySize: data.companySize,
      area: data.area,
      problemText: sanitizedProblemText,
      _fallback: {
        score: scoring.score,
        level: scoring.level,
        signals: scoring.signals,
        themes: scoring.themes,
      },
    };

    // LLM determines score, level, and recommendations holistically
    const diagnosis = await generateDiagnosis(llmInput, requestId);

    // Fire DB write without blocking the response
    const dbPromise = prisma.scanResult.create({
      data: {
        score: diagnosis.score,
        level: diagnosis.level,
        signals: JSON.stringify(diagnosis.signals),
        automations: JSON.stringify(diagnosis.automations),
        impacts: JSON.stringify(diagnosis.impacts),
        executiveSummary: diagnosis.executive_summary,
        companySize: data.companySize,
        area: data.area,
        problemText: sanitizedProblemText || null,
        answers: JSON.stringify(data.answers),
        requestId,
        lead: {
          create: {
            name: data.name,
            company: data.company,
            email: data.email,
            consent: true,
          },
        },
      },
    });

    // Wait for DB but with a 3s timeout — fallback to temp ID if slow
    let resultId: string;
    try {
      const result = await Promise.race([
        dbPromise,
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
      ]);
      resultId = result?.id || requestId;
      if (!result) {
        // Let the DB write finish in background
        dbPromise.catch((err: unknown) =>
          log("error", "background_db_write_failed", {
            request_id: requestId,
            error: err instanceof Error ? err.message : String(err),
          }),
        );
      }
    } catch (dbErr) {
      log("error", "db_write_failed", {
        request_id: requestId,
        error: dbErr instanceof Error ? dbErr.message : String(dbErr),
      });
      resultId = requestId;
    }

    const response = {
      id: resultId,
      level: diagnosis.level,
      score: diagnosis.score,
      signals: diagnosis.signals,
      automations: diagnosis.automations,
      impacts: diagnosis.impacts,
      executiveSummary: diagnosis.executive_summary,
      requestId,
    };

    logRequest(requestId, "POST", "/api/scan", 200, Date.now() - startTime);

    return NextResponse.json(response);
  } catch (error) {
    logError(requestId, error, "scan_api");
    logRequest(requestId, "POST", "/api/scan", 500, Date.now() - startTime);

    return NextResponse.json(
      { error: "Erro interno ao processar diagnóstico." },
      { status: 500 },
    );
  }
}
