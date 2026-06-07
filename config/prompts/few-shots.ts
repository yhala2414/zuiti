import type { ExpressionStyle } from "@/lib/domain/enums";

type PromptFewShotExample = {
  scene: string;
  userText: string;
  rewrite: string;
  strategy: string;
  risk: string;
};

type PromptStyleFewShotConfig = {
  styleName: string;
  positioning: string;
  keywords: readonly string[];
  examples: readonly PromptFewShotExample[];
};

/**
 * Few-shot examples distilled from the six-style prompt library at the repo root.
 * Keep these examples model-facing only; UI-facing style card copy belongs in config/copy.
 */
export const promptStyleFewShotConfig: Record<ExpressionStyle, PromptStyleFewShotConfig> = {
  delay: {
    styleName: "缓一缓｜体面延期，争取时间",
    positioning:
      "把来不及、没做完、没想好或暂时不能答复，转化为体面、礼貌、有理由、有新时间节点的表达。",
    keywords: ["战略性顺延", "时间窗口", "质量控制", "信息沉淀", "资源带宽", "柔性调整"],
    examples: [
      {
        scene: "职场交付：PPT/方案延期",
        userText: "这个方案我今天真的做不完，能不能明天交？",
        rewrite:
          "这版方案我还需要做最后的信息校验和结构收束，避免仓促提交影响判断。我会在明天上午 10 点前同步完整版本，今晚先把已确认的核心框架发您过目。",
        strategy: "承认延期，但把重点放在交付质量、阶段同步和明确新节点。",
        risk: "不要虚构严重故障，也不要只说自己忙。",
      },
      {
        scene: "线上聊天：拖延回复消息",
        userText: "不好意思我忘回了。",
        rewrite:
          "抱歉，这条消息我前面没有及时接上。最近信息流有点堆叠，但这件事我现在会认真看一下，稍后给你一个明确答复。",
        strategy: "先补歉意，再解释回复滞后，最后给出即将处理的动作。",
        risk: "避免显得冷漠或把责任完全推给客观环境。",
      },
    ],
  },
  refuse: {
    styleName: "不方便｜优雅拒绝，不撕破脸",
    positioning: "把不想做、不能帮、不愿意答应，转化为边界清晰、态度礼貌、关系不崩的拒绝。",
    keywords: ["感谢信任", "资源带宽", "边界清晰", "协作成本", "替代方案", "无法承接"],
    examples: [
      {
        scene: "跨部门协作：拒绝顺手帮一下",
        userText: "这不是我的活，我不想接。",
        rewrite:
          "这块主体工作目前不在我的负责范围里，我这边直接接手可能会影响原本排期。不过我可以把已有资料和对接入口发你，方便你们找到对应负责人推进。",
        strategy: "明确不接主体工作，同时提供低成本支持，减少对抗感。",
        risk: "拒绝要清楚，不要留下自己会兜底的误会。",
      },
      {
        scene: "人情往来：拒绝借钱",
        userText: "我不想借钱给你。",
        rewrite:
          "这次可能没办法借钱给你，我最近也需要把个人财务边界收紧一些。你的情况我理解，如果需要，我可以帮你一起梳理看看有没有其他周转办法。",
        strategy: "不评价对方处境，用个人边界解释拒绝，并给非金钱支持。",
        risk: "不要羞辱或质疑对方，也不要用模糊措辞拖延。",
      },
    ],
  },
  boundary: {
    styleName: "这锅不背｜划清边界，避免背锅",
    positioning:
      "把不是我一个人的问题、不是我负责、不能全怪我，转化为事实清楚、责任边界明确、仍保留补救姿态的表达。",
    keywords: ["责任边界", "事实链路", "外部变量", "流程缺口", "共同复盘", "补救动作"],
    examples: [
      {
        scene: "技术开发：线上 Bug/系统故障",
        userText: "这个 bug 不是我写的，别都怪我。",
        rewrite:
          "这个问题我会一起跟进修复，但从目前链路看，它可能同时涉及历史逻辑、接口依赖和本次部署环境，不能简单归因到单个改动。我先把影响面和修复动作整理出来，方便我们快速止损。",
        strategy: "先接住修复动作，再拆分责任链路，避免单点背锅。",
        risk: "不能恶意甩锅或点名攻击他人。",
      },
      {
        scene: "文案/数据：低级错误",
        userText: "错别字不是我一个人的问题。",
        rewrite:
          "这个错别字我会马上修正。也想同步一下，这说明当前校验链路还有缺口，后续最好增加一次交叉检查，避免类似问题只在最后发布节点才暴露。",
        strategy: "承认问题，强调流程缺口，并提出补救机制。",
        risk: "不要显得完全不负责，也不要把责任硬推给流程。",
      },
    ],
  },
  followup: {
    styleName: "催一催｜礼貌推进，让对方行动",
    positioning: "把你快点、你到底行不行、别拖了，转化为有压力但不失礼的推进表达。",
    keywords: ["截止窗口", "流程卡点", "待命状态", "合流", "确权", "闭环", "推进"],
    examples: [
      {
        scene: "小组协作：催组员交材料",
        userText: "你到底什么时候交 PPT？大家都等你。",
        rewrite:
          "我们这边整体内容已经进入合并阶段，现在主要卡在你负责的 PPT 部分。方便的话请今晚 8 点前同步一下当前版本，哪怕是初稿也可以先进入整合流程。",
        strategy: "说明整体进度依赖对方，并给出明确截止时间和最低交付标准。",
        risk: "不要用责怪口吻压人，避免引发防御。",
      },
      {
        scene: "向上沟通：催审批",
        userText: "老师你快点批一下，不然来不及了。",
        rewrite:
          "老师好，想再轻轻跟进一下这项确认。后续提交和排期都依赖您的审批意见，如果您方便的话，能否在今天下午前帮忙看一下？辛苦老师。",
        strategy: "强调后续流程依赖审批，用尊重语气提出时间窗口。",
        risk: "不要显得逼迫上级或把压力全部丢给对方。",
      },
    ],
  },
  decode: {
    styleName: "话里有话｜识别潜台词，看懂真实意思",
    positioning: "把含糊、委婉、绕弯、客套或不直接表达的话，翻译成更清楚的人话，并给出应对建议。",
    keywords: ["表层意思", "真实意图", "关系信号", "风险判断", "建议回复", "下一步动作"],
    examples: [
      {
        scene: "导师说：你再想想",
        userText: "导师说这个方向你再想想。",
        rewrite:
          "表面意思是方向还可以继续讨论；潜台词可能是当前方案说服力不足，导师暂时不想直接否定。建议回复：好的老师，我会把研究问题、材料来源和预期结论再收窄一版，明天发您确认。",
        strategy: "解析表层意思和潜台词，再给出稳妥回应与下一步动作。",
        risk: "不要制造焦虑，也不要把模糊反馈解读成确定拒绝。",
      },
      {
        scene: "朋友说：都行",
        userText: "他说吃什么都行。",
        rewrite:
          "表面意思是没有明确偏好；潜台词可能是想让你做决定，或不想显得麻烦。建议回复：那我先定两个选项，你看火锅和日料哪个更舒服？如果都可以我就直接订近一点的。",
        strategy: "把含糊态度拆成可确认选项，降低来回沟通成本。",
        risk: "不要替对方过度脑补真实想法。",
      },
    ],
  },
  sarcasm: {
    styleName: "礼貌带刺｜阴阳怪气，但不直接翻车",
    positioning:
      "把不爽、想怼、想阴阳、想让对方听懂，转化为表面礼貌、实际带刺、但不构成人身攻击的表达。",
    keywords: ["礼貌外壳", "轻微讽刺", "点到为止", "行为聚焦", "逻辑反讽", "不攻击人格"],
    examples: [
      {
        scene: "对方已读不回，却催你秒回",
        userText: "你自己半天不回，还催我秒回？",
        rewrite:
          "收到，我会尽快回复。也建议我们之后可以采用同一套消息响应标准，这样双方的信息流体验都会比较稳定。",
        strategy: "用礼貌外壳指出双标，不直接攻击对方。",
        risk: "只讽刺行为和逻辑，不攻击人格或关系。",
      },
      {
        scene: "客户反复改需求但不加钱",
        userText: "你一直加需求还不给钱，想得真美。",
        rewrite:
          "这个新增方向确实很有想象空间，不过如果继续放进原范围里，项目可能会进入一种比较理想主义的免费许愿状态。建议我们先确认新增预算或调整交付范围。",
        strategy: "保留轻微反讽，同时落到预算和范围确认。",
        risk: "不要羞辱客户，也不要让冲突升级。",
      },
    ],
  },
} as const;

export function formatPromptFewShots(style: ExpressionStyle): string {
  const config = promptStyleFewShotConfig[style];
  const examples = config.examples
    .map(
      (example, index) =>
        [
          `样例 ${index + 1}：${example.scene}`,
          `用户原话：${example.userText}`,
          `可发送版本：${example.rewrite}`,
          `策略说明：${example.strategy}`,
          `风险提醒：${example.risk}`,
        ].join("\n"),
    )
    .join("\n\n");

  return [
    `风格定位：${config.styleName}`,
    config.positioning,
    `关键词：${config.keywords.join("、")}`,
    examples,
  ].join("\n");
}
