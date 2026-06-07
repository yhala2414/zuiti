/**
 * User-facing request and response copy.
 * Shared by client fetch helpers and route handlers to keep failure text stable.
 */
export const apiErrorCopy = {
  invalidInput: "请求参数不合法。",
  internalError: "服务暂时不可用，请稍后重试。",
  networkError: "服务暂时不可用，请稍后再试。",
} as const;
