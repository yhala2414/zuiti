import { modelTimeoutMs } from "@/lib/domain/defaults";
import { ModelBadOutputError, ModelTimeoutError } from "@/lib/domain/errors";
import type { GenerationContext } from "@/lib/context/build-context";
import type { GenerateResult } from "@/lib/domain/enums";
import type { GenerateRequest } from "@/lib/validators/generate";
import { createChatModel } from "./model";
import { createFallbackResult, normalizeGeneratedResult } from "./normalize";
import { generationPrompt } from "./prompts";

function contentToText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item === "object" && "text" in item) {
          return String((item as { text: unknown }).text);
        }
        return "";
      })
      .join("");
  }

  return "";
}

function parseJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const jsonText = trimmed.startsWith("{") ? trimmed : trimmed.match(/\{[\s\S]*\}/)?.[0];

  if (!jsonText) {
    throw new ModelBadOutputError();
  }

  return JSON.parse(jsonText);
}

async function withTimeout<T>(promise: Promise<T>) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new ModelTimeoutError()), modelTimeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function getModelFailureNote(error: unknown) {
  if (error instanceof Error) {
    const status =
      "status" in error && typeof error.status === "number" ? ` status ${error.status}` : "";
    return `模型调用失败${status}：${error.name}`;
  }

  return "模型调用失败：UnknownError";
}

export async function generateWithLlmOrFallback(
  request: GenerateRequest,
  context: GenerationContext,
): Promise<GenerateResult> {
  const { configured, model } = createChatModel();

  if (!configured || !model) {
    return createFallbackResult(request, { language: context.language });
  }

  try {
    const promptValue = await generationPrompt.invoke({
      ...context,
      text: request.text,
      operation: request.operation,
      outputModes: request.outputModes.join(", "),
    });
    const response = await withTimeout(
      model.invoke(promptValue, {
        response_format: { type: "json_object" },
      }),
    );
    const parsed = parseJsonObject(contentToText(response.content));
    const normalized = normalizeGeneratedResult(parsed, {
      source: "model",
      language: context.language,
    });

    if (!normalized) {
      throw new ModelBadOutputError();
    }

    return normalized;
  } catch (error) {
    if (error instanceof ModelTimeoutError || error instanceof ModelBadOutputError) {
      return createFallbackResult(request, {
        language: context.language,
        note: error.message,
      });
    }

    return createFallbackResult(request, {
      language: context.language,
      note: getModelFailureNote(error),
    });
  }
}
