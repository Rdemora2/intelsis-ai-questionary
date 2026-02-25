import {
  GoogleGenerativeAI,
  type GenerativeModel,
} from "@google/generative-ai";
import type { LLMInput, LLMOutput } from "@/types";
import { llmOutputSchema } from "@/lib/validation";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { generateFallback } from "@/lib/fallback";
import { log } from "@/lib/logger";

let _client: GoogleGenerativeAI | null = null;
let _model: GenerativeModel | null = null;
let _repairModel: GenerativeModel | null = null;

function getModelName(): string {
  return process.env.GEMINI_MODEL || "gemini-3-flash";
}

function getMainModel(): GenerativeModel {
  if (!_model) {
    _client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    _model = _client.getGenerativeModel({
      model: getModelName(),
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    });
  }
  return _model;
}

function getRepairModel(): GenerativeModel {
  if (!_repairModel) {
    if (!_client) {
      _client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    }
    _repairModel = _client.getGenerativeModel({
      model: getModelName(),
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    });
  }
  return _repairModel;
}

// --- Timeout helper ---
const LLM_TIMEOUT_MS = 12_000;

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${label} timeout after ${ms}ms`)),
      ms,
    );
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

async function callLLM(input: LLMInput, requestId: string): Promise<string> {
  const model = getMainModel();
  const startTime = Date.now();

  const result = await withTimeout(
    model.generateContent(buildUserPrompt(input)),
    LLM_TIMEOUT_MS,
    "llm_call",
  );
  const response = result.response;

  log("info", "llm_call_completed", {
    request_id: requestId,
    model: getModelName(),
    duration_ms: Date.now() - startTime,
  });

  const content = response.text();
  if (!content) throw new Error("Empty LLM response");
  return content;
}

async function callRepair(
  input: LLMInput,
  previousOutput: string,
  validationError: string,
  requestId: string,
): Promise<string> {
  const model = getRepairModel();

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: buildUserPrompt(input) }] },
      { role: "model", parts: [{ text: previousOutput }] },
    ],
  });

  const result = await withTimeout(
    chat.sendMessage(
      `JSON inválido. Erro: ${validationError}. Corrija seguindo o formato especificado.`,
    ),
    LLM_TIMEOUT_MS,
    "llm_repair",
  );

  log("info", "llm_repair_call", { request_id: requestId });

  const content = result.response.text();
  if (!content) throw new Error("Empty LLM repair response");
  return content;
}

export async function generateDiagnosis(
  input: LLMInput,
  requestId: string,
): Promise<LLMOutput> {
  if (!process.env.GEMINI_API_KEY) {
    log("warn", "gemini_key_missing_using_fallback", { request_id: requestId });
    return generateFallback(input);
  }

  try {
    const raw = await callLLM(input, requestId);
    const parsed = JSON.parse(raw);
    const validated = llmOutputSchema.safeParse(parsed);

    if (validated.success) {
      return validated.data;
    }

    log("warn", "llm_output_validation_failed_attempting_repair", {
      request_id: requestId,
      error: validated.error.message,
    });

    try {
      const repaired = await callRepair(
        input,
        raw,
        validated.error.issues.map((i) => i.message).join("; "),
        requestId,
      );
      const repairedParsed = JSON.parse(repaired);
      const repairedValidated = llmOutputSchema.safeParse(repairedParsed);

      if (repairedValidated.success) {
        return repairedValidated.data;
      }

      log("warn", "llm_repair_failed_using_fallback", {
        request_id: requestId,
      });
      return generateFallback(input);
    } catch (repairError) {
      log("error", "llm_repair_exception", {
        request_id: requestId,
        error:
          repairError instanceof Error
            ? repairError.message
            : String(repairError),
      });
      return generateFallback(input);
    }
  } catch (error) {
    log("error", "llm_call_failed_using_fallback", {
      request_id: requestId,
      error: error instanceof Error ? error.message : String(error),
    });
    return generateFallback(input);
  }
}
