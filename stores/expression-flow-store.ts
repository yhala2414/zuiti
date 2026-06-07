"use client";

import { create } from "zustand";
import type {
  ExpressionStyle,
  GenerateResult,
  Operation,
  OutputMode,
  Scene,
  ToneSliders,
} from "@/lib/domain/enums";

export type {
  ExpressionStyle,
  GenerateResult,
  Operation,
  OutputMode,
  Scene,
  ToneSliders,
} from "@/lib/domain/enums";

export type GenerationStatus =
  | "idle"
  | "loading"
  | "success-model"
  | "success-fallback"
  | "fail"
  | "refused";

export type GenerateDraft = {
  text: string;
  scene: Scene;
  style: ExpressionStyle;
  sliders: ToneSliders;
  outputModes: OutputMode[];
  operation: Operation;
  context: {
    sessionId: string;
    prev?: GenerateResult;
  };
};

type GenerationState = {
  status: GenerationStatus;
  result: GenerateResult | null;
  errorCode: string | null;
  errorMessage: string | null;
  requestKey: string | null;
};

type ExpressionFlowState = {
  sessionId: string;
  scene: Scene | null;
  text: string;
  style: ExpressionStyle;
  sliders: ToneSliders;
  generation: GenerationState;
  setScene: (scene: Scene) => void;
  setText: (text: string) => void;
  setStyle: (style: ExpressionStyle) => void;
  setSlider: (key: keyof ToneSliders, value: number) => void;
  setSliders: (sliders: ToneSliders) => void;
  setGenerationLoading: (requestKey: string) => void;
  setGenerationSuccess: (result: GenerateResult, requestKey: string) => void;
  setGenerationError: (status: "fail" | "refused", code: string, message: string) => void;
  resetGeneration: () => void;
  buildDraft: (operation?: Operation) => GenerateDraft | null;
};

export const defaultSliders: ToneSliders = {
  politeness: 76,
  formality: 58,
  distance: 62,
};

const outputModes: OutputMode[] = ["wechat", "email", "spoken"];

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createRequestKey(draft: GenerateDraft) {
  return JSON.stringify({
    text: draft.text.trim(),
    scene: draft.scene,
    style: draft.style,
    sliders: draft.sliders,
    outputModes: draft.outputModes,
    operation: draft.operation,
  });
}

export const useExpressionFlowStore = create<ExpressionFlowState>((set, get) => ({
  sessionId: createSessionId(),
  scene: null,
  text: "",
  style: "boundary",
  sliders: defaultSliders,
  generation: {
    status: "idle",
    result: null,
    errorCode: null,
    errorMessage: null,
    requestKey: null,
  },
  setScene: (scene) => set({ scene }),
  setText: (text) => {
    set((state) => ({
      text,
      generation: text === state.text ? state.generation : { ...state.generation, status: "idle" },
    }));
  },
  setStyle: (style) => {
    set((state) => ({
      style,
      generation: style === state.style ? state.generation : { ...state.generation, status: "idle" },
    }));
  },
  setSlider: (key, value) => {
    set((state) => ({
      sliders: {
        ...state.sliders,
        [key]: value,
      },
      generation: { ...state.generation, status: "idle" },
    }));
  },
  setSliders: (sliders) => {
    set((state) => ({
      sliders,
      generation: { ...state.generation, status: "idle" },
    }));
  },
  setGenerationLoading: (requestKey) => {
    set({
      generation: {
        status: "loading",
        result: null,
        errorCode: null,
        errorMessage: null,
        requestKey,
      },
    });
  },
  setGenerationSuccess: (result, requestKey) => {
    set({
      generation: {
        status: result.meta.source === "fallback" ? "success-fallback" : "success-model",
        result,
        errorCode: null,
        errorMessage: null,
        requestKey,
      },
    });
  },
  setGenerationError: (status, code, message) => {
    set((state) => ({
      generation: {
        ...state.generation,
        status,
        errorCode: code,
        errorMessage: message,
      },
    }));
  },
  resetGeneration: () => {
    set({
      generation: {
        status: "idle",
        result: null,
        errorCode: null,
        errorMessage: null,
        requestKey: null,
      },
    });
  },
  buildDraft: (operation = "generate") => {
    const state = get();
    const text = state.text.trim();

    if (!state.scene || text.length === 0) {
      return null;
    }

    return {
      text,
      scene: state.scene,
      style: state.style,
      sliders: state.sliders,
      outputModes,
      operation,
      context: {
        sessionId: state.sessionId,
        prev: state.generation.result ?? undefined,
      },
    };
  },
}));
