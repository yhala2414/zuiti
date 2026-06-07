import { apiErrorCopy } from "@/config";
import { jsonError } from "@/lib/domain/responses";
import { generateExpression } from "@/lib/use-cases/generate-expression";
import { GenerateRequestSchema } from "@/lib/validators/generate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = GenerateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("INVALID_INPUT", apiErrorCopy.invalidInput, 400);
    }

    const result = await generateExpression(parsed.data);
    return Response.json(result, { status: 200 });
  } catch {
    return jsonError("INTERNAL_ERROR", apiErrorCopy.internalError, 500);
  }
}
