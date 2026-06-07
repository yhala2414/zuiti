import { SafetyRefusedError } from "@/lib/domain/errors";
import type { GenerateRequest } from "@/lib/validators/generate";

const baseRiskPatterns = [
  /杀|弄死|打死|揍|砍|毒死|炸|威胁|恐吓/u,
  /报复|整死|毁掉|曝光隐私|泄露隐私|人肉|开盒/u,
  /诈骗|勒索|敲诈|伪造|偷|盗|非法|违法/u,
  /贱人|废物|垃圾|傻逼|滚蛋|去死/u,
];

const sarcasmRiskPatterns = [
  /蠢|脑子|有病|恶心|羞辱|骂|阴阳死|狠狠阴阳/u,
  /让.*下不来台|当众羞辱|撕破脸/u,
];

export function assertRequestSafe(request: GenerateRequest) {
  const text = request.text;
  const matchedBase = baseRiskPatterns.some((pattern) => pattern.test(text));
  const matchedSarcasm =
    request.style === "sarcasm" && sarcasmRiskPatterns.some((pattern) => pattern.test(text));

  if (!matchedBase && !matchedSarcasm) {
    return;
  }

  throw new SafetyRefusedError("我不能帮助生成带有威胁、报复、违法、隐私侵犯或明显人身攻击导向的表达。", [
    "把目标改为说明事实、影响和诉求。",
    "保留边界，但不要加入羞辱、威胁或报复内容。",
    "如果需要投诉或申诉，使用正式渠道和可核验信息。",
  ]);
}
