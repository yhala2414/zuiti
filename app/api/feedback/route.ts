import { apiErrorCopy } from "@/config";
import { jsonError } from "@/lib/domain/responses";
import { submitFeedback } from "@/lib/use-cases/submit-feedback";
import { FeedbackRequestSchema } from "@/lib/validators/feedback";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = FeedbackRequestSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("INVALID_INPUT", apiErrorCopy.invalidInput, 400);
    }

    const result = await submitFeedback(parsed.data);
    return Response.json(result, { status: 200 });
  } catch {
    return jsonError("INTERNAL_ERROR", apiErrorCopy.internalError, 500);
  }
}
