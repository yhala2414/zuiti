"use client";

import { create } from "zustand";
import {
  getContextDefaultSliders,
  minInputTextLength,
  sceneDefaultSliders,
} from "@/lib/domain/defaults";
import type {
  ExpressionStyle,
  GenerateResult,
  Operation,
  OutputMode,
  Scene,
  TargetId,
  ToneSliders,
} from "@/lib/domain/enums";

export type {
  ExpressionStyle,
  GenerateResult,
  Operation,
  OutputMode,
  Scene,
  TargetId,
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
  target: TargetId;
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
  target: TargetId | null;
  text: string;
  style: ExpressionStyle | null;
  sliders: ToneSliders;
  generation: GenerationState;
  setScene: (scene: Scene) => void;
  setTarget: (target: TargetId | null) => void;
  applySceneDefaults: (scene: Scene) => void;
  applyContextDefaults: (scene: Scene, target: TargetId) => void;
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

export const defaultSliders: ToneSliders = sceneDefaultSliders.work;

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
    target: draft.target,
    sliders: draft.sliders,
    outputModes: draft.outputModes,
    operation: draft.operation,
  });
}

export const useExpressionFlowStore = create<ExpressionFlowState>((set, get) => ({
  sessionId: createSessionId(),
  scene: null,
  target: null,
  text: "",
  style: null,
  sliders: defaultSliders,
  generation: {
    status: "idle",
    result: null,
    errorCode: null,
    errorMessage: null,
    requestKey: null,
  },
  setScene: (scene) => {
    set((state) => ({
      scene,
      target: scene === state.scene ? state.target : null,
      generation: scene === state.scene ? state.generation : { ...state.generation, status: "idle" },
    }));
  },
  setTarget: (target) => {
    set((state) => ({
      target,
      sliders: state.scene && target ? getContextDefaultSliders(state.scene, target) : state.sliders,
      generation: target === state.target ? state.generation : { ...state.generation, status: "idle" },
    }));
  },
  applySceneDefaults: (scene) => {
    set((state) => ({
      scene,
      target: scene === state.scene ? state.target : null,
      style: state.style,
      sliders: sceneDefaultSliders[scene],
      generation:
        scene === state.scene &&
        state.sliders === sceneDefaultSliders[scene]
          ? state.generation
          : { ...state.generation, status: "idle" },
    }));
  },
  applyContextDefaults: (scene, target) => {
    set((state) => ({
      scene,
      target,
      style: state.style,
      sliders: getContextDefaultSliders(scene, target),
      generation:
        scene === state.scene && target === state.target
          ? state.generation
          : { ...state.generation, status: "idle" },
    }));
  },
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

    if (!state.scene || !state.target || !state.style || text.length < minInputTextLength) {
      return null;
    }

    return {
      text,
      scene: state.scene,
      target: state.target,
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
