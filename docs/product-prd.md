# 话到嘴边 产品 PRD

## 1. Product Positioning

`话到嘴边` 是一个面向年轻人的场景表达转换器。它帮助用户把脑子里真实、直接、混乱、不好意思说出口的话，转成适合具体对象、具体场景发送、开口、汇报、拒绝、求助、解释或争取权益的表达版本。

它不是通用 AI 写作工具，也不是聊天机器人。核心价值是降低年轻人在不对等关系中的表达成本和沟通风险。

## 2. Target Users

- 学生：与导师、老师、辅导员、同学、学长学姐沟通。
- 职场新人：与领导、前辈、HR、甲方、同事沟通。
- 社交新人：与朋友、陌生人、合作方、活动主办方沟通。
- 正式事务用户：与学校行政、政府窗口、社区、机构等正式对象沟通。

用户共性：知道自己想表达什么，但在高压力、关系不对等、需要拿捏分寸的时刻，需要快速得到更稳妥的说法。

## 3. Current MVP Flow

```text
Home
  -> Input: scene + target + style + raw thought
  -> Tone: politeness + formality + distance
  -> Results: wechat + email + spoken
  -> History/Profile: local MVP continuation
```

Current routes:

| Page | Route | Purpose |
| --- | --- | --- |
| 首页 | `/` | 产品入口、最近使用、热门风格、开始转换 |
| 输入页 | `/input` | 选择场景、对象、风格，输入真实想法 |
| 语气页 | `/tone` | 调整礼貌程度、正式程度、关系距离，并展示预览 |
| 结果页 | `/results` | 展示三类输出，支持复制、反馈、收藏、分享、再润色、换风格 |
| 历史页 | `/history` | 本地历史记录和收藏记录 |
| 我的页 | `/profile` | 本地偏好、统计和 MVP 个人页 |

## 4. Product Contract

### Scenes

- `student` - 学生沟通
- `work` - 职场沟通
- `social` - 社交沟通
- `formal` - 正式事务

### Targets

Targets are selected after scene selection and represent the communication counterpart, such as teacher, peer, leader, colleague, client, friend, partner, stranger, or institution-facing roles. Current target IDs live in `lib/domain/enums.ts` and the display mapping lives in `config/copy/content.ts`.

### Styles

- `delay` - 先别急：体面延期，争取时间。
- `refuse` - 婉拒了哈：优雅拒绝，不撕破脸。
- `boundary` - 别甩给我：划清边界，避免背锅。
- `followup` - 该交了吧：礼貌推进，让对方行动。
- `decode` - 翻译一下：识别潜台词，看懂真实意思。
- `sarcasm` - 阴阳一下：保留一点态度，但不能攻击或升级冲突。

### Tone Sliders

- `politeness` - 礼貌程度
- `formality` - 正式程度
- `distance` - 关系距离

Range: `0-100`.

### Output Modes

- `wechat` - 微信/IM 短句版
- `email` - 邮件/书面正式版
- `spoken` - 当面/语音沟通版

## 5. Current Behavior

The current MVP supports:

- Home hot style entry and blank flow entry.
- Scene and target selection.
- Style selection with validated query preset.
- Raw text validation using shared limits.
- Tone preview based on generated result when available, otherwise local preview.
- Server-side generation through `/api/generate`.
- Deterministic fallback when model configuration or model call fails.
- Generation metadata: `meta.source` distinguishes `model` and `fallback`; `meta.language` records resolved output language.
- Copy, feedback, tracking, sharing fallback, favorite toggle, local recent history, history route, and profile route.

## 6. Storage and Write Paths

Current MVP write paths are intentionally lightweight:

- Current flow state: Zustand store.
- Recent history: browser local storage through `utils/recent-history.ts`.
- Favorites: browser local storage through `utils/recent-history.ts`.
- Preferences/statistics: local MVP storage keys only.
- Feedback: `POST /api/feedback` with lightweight logging.
- Tracking: `POST /api/track` with lightweight logging.

No database, login, cloud sync, or long-term memory is part of the current scope.

## 7. Non Goals

Do not add these without an approved spec:

- Generic chatbot mode.
- Generic writing platform.
- Login, accounts, or cross-device sync.
- Full database persistence.
- Long-term user memory.
- Vector search/RAG.
- Independent backend service.
- Complex Agent architecture.
- Admin/reporting platform.

## 8. UX Principles

- Users should not need to write prompts.
- Product copy should be practical, direct, and scenario-specific.
- Results must be directly usable, not abstract advice.
- The tool should reduce conflict risk, not intensify it.
- `sarcasm` may be lightly pointed, but must not become insulting, threatening, or escalatory.
- User-visible success must correspond to a state/storage/API/log write path or be clearly staged.

## 9. AI Context Notes

For product questions, this file is the only current PRD. Historical PRDs, old Trae specs, and old root-level planning docs are not product authority.

For implementation details, use:

- Backend/BFF: `docs/backend-architecture.md`
- Frontend structure: `docs/frontend-architecture.md`
- Route map: `docs/mobile-pages-routes.md`
- Copy and prompts: `config/README.md`
