export const apiErrorCodes = [
  "INVALID_INPUT",
  "SAFETY_REFUSED",
  "MODEL_TIMEOUT",
  "MODEL_BAD_OUTPUT",
  "INTERNAL_ERROR",
] as const;

export type ApiErrorCode = (typeof apiErrorCodes)[number];

export type ApiErrorResponse = {
  ok: false;
  code: ApiErrorCode;
  message: string;
};

export type SafetyRefusedResponse = {
  ok: false;
  code: "SAFETY_REFUSED";
  message: string;
  data: {
    refused: {
      message: string;
      suggestions: string[];
    };
  };
};

export class AppError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly status = 500,
  ) {
    super(message);
  }
}

export class SafetyRefusedError extends AppError {
  constructor(
    message = "该请求涉及高风险表达，不适合直接生成。",
    public readonly suggestions: string[] = [
      "改为描述事实和诉求。",
      "保留边界，但避免人身攻击。",
      "使用更正式、可留痕的表达方式。",
    ],
  ) {
    super("SAFETY_REFUSED", message, 200);
  }
}

export class ModelTimeoutError extends AppError {
  constructor() {
    super("MODEL_TIMEOUT", "模型响应超时，已切换到稳定兜底结果。", 200);
  }
}

export class ModelBadOutputError extends AppError {
  constructor() {
    super("MODEL_BAD_OUTPUT", "模型输出结构不稳定，已切换到稳定兜底结果。", 200);
  }
}
