import { ChatPromptTemplate } from "@langchain/core/prompts";
import { generationPromptCopy } from "@/config";

export const generationPrompt = ChatPromptTemplate.fromMessages([
  ["system", generationPromptCopy.systemLines.join("\n")],
  ["human", generationPromptCopy.humanLines.join("\n")],
]);
