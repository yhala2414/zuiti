import { analyticsEvents } from "@/lib/analytics/events";
import { logEvent } from "@/lib/analytics/logger";
import { buildGenerationContext } from "@/lib/context/build-context";
import { SafetyRefusedError } from "@/lib/domain/errors";
import type { GenerateResult } from "@/lib/domain/enums";
import { generateWithLlmOrFallback } from "@/lib/llm/pipeline";
import { assertRequestSafe } from "@/lib/safety/policy";
import { isGeneratedResultSafe } from "@/lib/safety/post-check";
import type { GenerateRequest } from "@/lib/validators/generate";

export type GenerateExpressionResult =
  | { ok: true; data: GenerateResult }
  | {
      ok: false;
      code: "SAFETY_REFUSED";
      message: string;
      data: { refused: { message: string; suggestions: string[] } };
    };

export async function generateExpression(request: GenerateRequest): Promise<GenerateExpressionResult> {
  const startedAt = Date.now();

  logEvent(analyticsEvents.generateStarted, {
    sessionId: request.context?.sessionId,
    operation: request.operation,
    scene: request.scene,
    style: request.style,
    text: request.text,
  });

  try {
    assertRequestSafe(request);
    const context = buildGenerationContext(request);
    const data = await generateWithLlmOrFallback(request, context);

    if (!isGeneratedResultSafe(data)) {
      throw new SafetyRefusedError("生成结果包含不适合直接使用的高风险表达。");
    }

    logEvent(analyticsEvents.generateSucceeded, {
      sessionId: request.context?.sessionId,
      operation: request.operation,
      scene: request.scene,
      style: request.style,
      source: data.meta.source,
      language: data.meta.language,
      latencyMs: Date.now() - startedAt,
    });

    return { ok: true, data };
  } catch (error) {
    if (error instanceof SafetyRefusedError) {
      logEvent(analyticsEvents.generateFailed, {
        sessionId: request.context?.sessionId,
        operation: request.operation,
        scene: request.scene,
        style: request.style,
        code: error.code,
        latencyMs: Date.now() - startedAt,
      });

      return {
        ok: false,
        code: "SAFETY_REFUSED",
        message: error.message,
        data: {
          refused: {
            message: error.message,
            suggestions: error.suggestions,
          },
        },
      };
    }

    logEvent(analyticsEvents.generateFailed, {
      sessionId: request.context?.sessionId,
      operation: request.operation,
      scene: request.scene,
      style: request.style,
      code: "INTERNAL_ERROR",
      latencyMs: Date.now() - startedAt,
    });

    throw error;
  }
}
