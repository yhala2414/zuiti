import type { GenerateResult } from "./enums";
import type { ApiErrorCode } from "./errors";

export type GenerateSuccessResponse = {
  ok: true;
  data: GenerateResult;
};

export type ApiOkResponse = {
  ok: true;
};

export function jsonError(code: ApiErrorCode, message: string, status = 400) {
  return Response.json({ ok: false, code, message }, { status });
}
