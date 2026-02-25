export function sanitizeText(input: string, maxLength = 500): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeForPrompt(text: string): string {
  const dangerous = [
    /ignore\s+(all\s+)?previous/gi,
    /forget\s+(all\s+)?instructions/gi,
    /you\s+are\s+now/gi,
    /act\s+as/gi,
    /system\s*:/gi,
    /\bprompt\b.*\binjection\b/gi,
    /\brole\s*:\s*(system|assistant)\b/gi,
  ];

  let cleaned = text;
  for (const pattern of dangerous) {
    cleaned = cleaned.replace(pattern, "[filtrado]");
  }

  return sanitizeText(cleaned, 500);
}
