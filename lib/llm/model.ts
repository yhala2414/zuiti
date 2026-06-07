import { ChatOpenAI } from "@langchain/openai";
import { modelTimeoutMs } from "@/lib/domain/defaults";

export type ModelFactoryResult = {
  configured: boolean;
  model?: ChatOpenAI;
};

export function createChatModel(): ModelFactoryResult {
  const apiKey = process.env.AI_API_KEY;
  const modelName = process.env.AI_MODEL || "gpt-4o-mini";
  const baseURL = process.env.AI_BASE_URL;

  if (!apiKey) {
    return { configured: false };
  }

  return {
    configured: true,
    model: new ChatOpenAI({
      apiKey,
      model: modelName,
      temperature: 0.5,
      maxRetries: 1,
      timeout: modelTimeoutMs + 5_000,
      configuration: baseURL ? { baseURL } : undefined,
    }),
  };
}
