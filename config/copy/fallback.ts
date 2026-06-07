import type { ExpressionStyle, GenerateResult, ResolvedLanguage } from "@/lib/domain/enums";

/**
 * Fallback result copy shown when the live model path is unavailable.
 * Update these templates to keep demo fallback language and tone aligned with product expectations.
 */
const fallbackStyleIntents: Record<ResolvedLanguage, Record<ExpressionStyle, string>> = {
  "zh-CN": {
    delay: "先争取一点时间",
    refuse: "温和拒绝这个请求",
    boundary: "说明职责边界",
    followup: "礼貌推进对方回复",
    decode: "把潜台词翻译清楚",
    sarcasm: "有态度但不攻击地表达",
  },
  en: {
    delay: "buy a little more time",
    refuse: "turn this request down without escalating",
    boundary: "set a clear ownership boundary",
    followup: "politely move the other side to respond",
    decode: "translate the subtext into direct language",
    sarcasm: "keep some edge without becoming insulting",
  },
  ja: {
    delay: "少し时间をもらうこと",
    refuse: "角を立てずに断ること",
    boundary: "担当范围をはっきりさせること",
    followup: "相手の返信を丁宁に促すこと",
    decode: "含みをわかりやすく言い换えること",
    sarcasm: "きつくなりすぎずに温度差を出すこと",
  },
  ko: {
    delay: "조금 더 시간을 확보하는 것",
    refuse: "관계를 해치지 않고 정중히 거절하는 것",
    boundary: "담당 범위를 분명히 하는 것",
    followup: "상대의 답변을 예의 있게 재촉하는 것",
    decode: "숨은 의도를 더 직접적으로 풀어내는 것",
    sarcasm: "선을 넘지 않으면서 약간의 뉘앙스를 주는 것",
  },
};

type FallbackTextBundle = Omit<GenerateResult, "meta">;

export function createLocalizedFallbackCopy(
  language: ResolvedLanguage,
  style: ExpressionStyle,
  rawText: string,
  note: string,
): FallbackTextBundle {
  const intent = fallbackStyleIntents[language][style];
  const base = rawText.replace(/\s+/g, " ").slice(0, 80) || rawText;

  switch (language) {
    case "en":
      return {
        wechat: {
          candidates: [
            `Let me phrase this more carefully: my goal is to ${intent}. For "${base}", I suggest we first align on the facts and the next step.`,
            `I get what this is about. I want to handle it in a clearer way: ${intent}, while keeping the conversation workable.`,
            `I want to say this in a better way: clarify the boundary and the ask first, then confirm what should happen next.`,
          ],
          recommendedIndex: 0,
          reasons: ["Works for chat", "Softens the edge", "Keeps the point clear"],
        },
        email: {
          candidates: [
            `Hello, I would like to communicate this more clearly and carefully: ${intent}. Based on the current information, I suggest we first confirm the facts, ownership, and next steps.`,
            `Hello, my current view is that we should first make the communication goal explicit and then state the request in a polite but clear way.`,
            `Hello, to reduce misunderstandings, I suggest framing this in three parts: the facts, the current constraint, and the recommended next action.`,
          ],
          recommendedIndex: 0,
          reasons: ["Good for written records", "More formal structure", "Reduces misunderstanding"],
        },
        spoken: {
          candidates: [
            `Let me say it a bit differently. What I really mean is ${intent}, not to make things tense.`,
            `What I mean is: let's first make the current situation clear, then decide what to do next.`,
            `I'm worried the direct version may sound too hard, so I want to put it in a steadier way.`,
          ],
          recommendedIndex: 0,
          reasons: ["Natural when spoken", "Steady but not weak", "Reduces conflict"],
        },
        assumptions: ["Assumes the relationship still needs to continue after this conversation."],
        safetyNotes: [note],
      };
    case "ja":
      return {
        wechat: {
          candidates: [
            `もう少し稳やかに言い换えると、意图は${intent}です。『${base}』については、まず事实と次の动作をそろえたいです。`,
            `意图は理解しています。今回は${intent}という方向で、关系を崩さない伝え方にしたいです。`,
            `少し言い方を整えるなら、先に境界线と要望を明确にしてから、次の进め方を确认したいです。`,
          ],
          recommendedIndex: 0,
          reasons: ["チャット向き", "角を立てにくい", "要点がぶれない"],
        },
        email: {
          candidates: [
            `お世话になっております。今回は${intent}という意图で、より明确かつ稳やかにお伝えしたいと考えています。现时点では、まず事实、担当范围、次の动作を确认するのが适切です。`,
            `お世话になっております。现状の理解としては、まず沟通の目的を明确にし、その上で要望を丁宁に伝える形が望ましいと考えています。`,
            `お世话になっております。认识のずれを防ぐため、事实说明、现状の制约、今后の提案の3点に分けて伝えるのがよいと考えています。`,
          ],
          recommendedIndex: 0,
          reasons: ["书面向き", "构成が安定", "误解を减らしやすい"],
        },
        spoken: {
          candidates: [
            `言い方を少し変えると、私が伝えたいのは${intent}ということです。対立したいわけではありません。`,
            `要するに、まず今の状况をそろえて、その上で次をどうするか决めたいということです。`,
            `そのまま言うと强く闻こえそうなので、もう少し落ち着いた言い方にしたいです。`,
          ],
          recommendedIndex: 0,
          reasons: ["口头で自然", "やわらかいが弱くない", "摩擦を减らしやすい"],
        },
        assumptions: ["この会话の后も关系が续く前提で整えています。"],
        safetyNotes: [note],
      };
    case "ko":
      return {
        wechat: {
          candidates: [
            `조금 더 부드럽게 말하면 제 의도는 ${intent}입니다. "${base}"에 대해서는 먼저 사실과 다음 단계를 맞추고 싶습니다.`,
            `무슨 상황인지 이해했습니다. 이번에는 ${intent} 방향으로, 대화가 틀어지지 않게 정리하고 싶습니다.`,
            `조금 더 나은 표현으로 바꾸면 먼저 경계와 요청을 분명히 하고, 그다음 다음 단계를 확인하고 싶습니다.`,
          ],
          recommendedIndex: 0,
          reasons: ["채팅에 잘 맞음", "톤을 완화함", "핵심을 분명히 함"],
        },
        email: {
          candidates: [
            `안녕하세요. 이번에는 ${intent}라는 의도로 보다 분명하고 안정적으로 전달드리고 싶습니다. 현재로서는 사실관계, 담당 범위, 다음 단계를 먼저 확인하는 편이 적절합니다.`,
            `안녕하세요. 현재 제 판단으로는 먼저 커뮤니케이션 목적을 분명히 하고, 그다음 요청을 정중하지만 명확하게 전달하는 편이 좋습니다.`,
            `안녕하세요. 오해를 줄이기 위해 사실 설명, 현재 제약, 다음 제안의 세 부분으로 나누어 전달드리는 방식을 권합니다.`,
          ],
          recommendedIndex: 0,
          reasons: ["서면 기록에 적합", "구조가 더 공식적", "오해를 줄임"],
        },
        spoken: {
          candidates: [
            `조금 다르게 말씀드리면 제 핵심은 ${intent}이고, 분위기를 나쁘게 만들려는 건 아닙니다.`,
            `제 뜻은 먼저 지금 상황을 분명히 하고, 그다음 어떻게 할지 정하자는 쪽에 가깝습니다.`,
            `그대로 말하면 너무 세게 들릴까 봐, 조금 더 안정적인 표현으로 바꾸고 싶습니다.`,
          ],
          recommendedIndex: 0,
          reasons: ["말로 하기 자연스러움", "단호하지만 과하지 않음", "충돌을 줄임"],
        },
        assumptions: ["대화 이후에도 관계를 이어가야 하는 상황을 가정했습니다."],
        safetyNotes: [note],
      };
    case "zh-CN":
    default:
      return {
        wechat: {
          candidates: [
            `我这边想更稳妥地表达一下：${intent}。关于“${base}”，我建议我们先把事实和下一步对齐。`,
            `这件事我理解你的意思，我这边会按更清楚的方式处理：${intent}，也尽量不让沟通变僵。`,
            `我想换个更合适的说法：先把边界和诉求说清楚，再确认后续怎么推进。`,
          ],
          recommendedIndex: 0,
          reasons: ["适合即时沟通", "语气有缓冲", "保留清晰诉求"],
        },
        email: {
          candidates: [
            `您好，关于这件事，我希望以更清晰、稳妥的方式沟通：${intent}。基于目前信息，建议先确认事实、职责范围和下一步安排。`,
            `您好，针对当前事项，我这边的理解是需要先明确沟通目标，并在保持礼貌的前提下表达诉求。`,
            `您好，为避免信息误解，我建议将该事项拆分为事实说明、当前限制和后续建议三部分来沟通。`,
          ],
          recommendedIndex: 0,
          reasons: ["适合书面留痕", "结构更正式", "降低误解风险"],
        },
        spoken: {
          candidates: [
            `我换个说法哈，这件事我的重点是${intent}，不是想把沟通弄僵。`,
            `我大概想表达的是：先把现在的情况说清楚，然后我们再看下一步怎么处理。`,
            `我怕直接说会有点硬，所以想用更稳一点的方式表达这个意思。`,
          ],
          recommendedIndex: 0,
          reasons: ["适合当面表达", "自然但不软弱", "降低冲突感"],
        },
        assumptions: ["默认对方是仍需继续沟通的关系对象。"],
        safetyNotes: [note],
      };
  }
}
