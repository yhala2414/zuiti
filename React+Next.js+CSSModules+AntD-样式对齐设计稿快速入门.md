# React + Next.js + CSS Modules + Ant Design：样式对齐设计稿快速入门（给零基础同学）

> 目标：用“组件化开发”的方式，把页面做得尽量贴近设计稿（颜色/渐变/圆角/大小/边距），并且让你知道：**改哪里（TSX / CSS Modules / 全局主题）**、**怎么改**、**为什么这么改**、以及**怎么排查不一致**。  
> 本文不绑定具体项目，但会给出可直接套用的写法与心智模型。

---

## 0. 你要先建立的心智模型（非常重要）

当你发现“实际效果”和“设计稿”差很多，通常不是一个点的问题，而是这些层叠在一起：

1. **组件结构（TSX）**：HTML/组件结构决定了哪些地方能控制尺寸、间距、圆角。
2. **局部样式（CSS Modules）**：你写的 `.module.css` 负责“这个组件内部”的布局与细节。
3. **组件库样式（Ant Design）**：AntD 自带大量默认样式（颜色、padding、radius、hover、字体）。
4. **全局样式/主题变量**：全局字体、基础字号、主题色、统一圆角、统一间距体系。
5. **浏览器差异 & 默认样式**：`body` 默认 margin、字体渲染、缩放、系统字体等。

对齐设计稿的核心策略是：

- **能用“主题/Token”统一的，就不要每个地方手写**（例如主色、圆角、间距基准）。
- **能在“组件内部局部控制”的，就不要用全局硬覆盖**（局部更可维护）。
- **确实需要覆盖 AntD 默认样式时，要知道覆盖的方式与成本**（优先主题，其次局部覆盖，最后再考虑更强的覆盖手段）。

---

## 1. Next.js 里样式文件通常放哪？怎么加载？

你会遇到两类样式：

### 1.1 全局样式（global）

用途：全站通用（字体、背景色、全局 reset、CSS 变量、统一的 spacing/radius 等）。

- **App Router（Next.js 13+）**：通常在 `app/globals.css`，并在 `app/layout.tsx` 引入：
  ```tsx
  // app/layout.tsx
  import './globals.css';
  ```
- **Pages Router**：通常在 `styles/globals.css`，并在 `pages/_app.tsx` 引入：
  ```tsx
  // pages/_app.tsx
  import '@/styles/globals.css';
  ```

> 记忆：**全局 CSS 只能在顶层引入**（layout 或 _app），不能在任意组件里到处 import 全局 CSS（Next.js 会限制）。

### 1.2 组件局部样式（CSS Modules）

用途：只影响当前组件，避免 class 命名冲突，适合组件化开发。

文件名通常是：`Something.module.css`（或 `.module.scss`）。

在组件中这样用：

```tsx
import styles from './Something.module.css';

export function Something() {
  return <div className={styles.root}>Hello</div>;
}
```

---

## 2. 怎么改 TSX：让样式“有地方可落”

很多同学改不出效果，根因是：**结构不对、class 没挂对、或者被 AntD 默认样式压住了**。

### 2.1 先看：你要改的是“谁”的样式？

常见目标与对应位置：

- 改“一个盒子”的 padding/圆角/背景：给它包一层 `div` 或在它自身加 `className`
- 改“文本”的字号/颜色/行高：给文本元素（`<span>` / `<p>`）加 `className`
- 改“布局”（左右排列/居中/间距）：改父容器（flex/grid）更有效
- 改 AntD 组件外观：优先 **ConfigProvider theme**；不够再 **加 className + 局部覆盖**

### 2.2 `className` 是入口：把 CSS Modules 的类挂上去

```tsx
import clsx from 'clsx';
import styles from './Card.module.css';

type Props = {
  active?: boolean;
};

export function Card({ active }: Props) {
  return (
    <div className={clsx(styles.card, active && styles.active)}>
      <div className={styles.title}>标题</div>
      <div className={styles.desc}>描述</div>
    </div>
  );
}
```

对应 CSS Modules：

```css
.card {
  padding: 12px 16px;
  border-radius: 12px;
  background: #fff;
}

.active {
  outline: 2px solid #1677ff;
}
```

> `clsx` 只是一个“拼 class 的小工具”，不用也行，但零基础同学更不容易写错。

### 2.3 内联样式 `style={{...}}`：什么时候用？

建议：**尽量少用**，因为不方便复用与统一管理。常见可以接受的场景：

- 少量动态值（例如根据 props 计算宽度、颜色、旋转角度）
- 临时调试定位（但最终建议回归到 CSS Modules）

```tsx
<div style={{ width: `${percent}%` }} />
```

### 2.4 “组件化开发”里更推荐的做法：拆成小组件 + 局部样式

与其在一个大页面里堆一堆 div，不如拆成：

- `UserHeader`（头像、昵称、tag）
- `StatCard`（一个统计块）
- `ActionButton`（统一按钮风格）

每个组件一个 `.module.css`，改动范围小、可维护。

---

## 3. 怎么改 CSS Modules：核心语法 + 常见坑

### 3.1 CSS Modules 的特点：默认“只在当前组件生效”

你写的 `.root { ... }` 会被编译成类似 `root__a1b2c3` 的唯一类名，防止冲突。

好处：不会污染全局。代价：你不能在别的组件里直接写 `.root` 去影响它。

### 3.2 常用写法：布局、间距、圆角、渐变

```css
.root {
  display: flex;
  align-items: center;
  gap: 12px; /* 比 margin-left 更直观 */

  padding: 12px 16px;
  border-radius: 16px;

  /* 渐变背景 */
  background: linear-gradient(135deg, #5b8cff 0%, #7a5cff 100%);
}

.title {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: #0f172a;
}
```

### 3.3 组合 class：减少重复

```css
.base {
  border-radius: 12px;
  padding: 12px;
}

.primary {
  composes: base;
  background: #1677ff;
  color: #fff;
}
```

> `composes` 是 CSS Modules 的能力（不是标准 CSS），可用来复用基础样式。若团队不用它，也可以用多个 class + `clsx` 组合。

### 3.4 `:global`：当你必须影响“组件库内部 class”时

有时你需要覆盖 AntD 内部某个类（例如 `.ant-btn`），CSS Modules 默认是局部作用域，这时可以：

```css
/* ButtonWrap.module.css */
.wrap :global(.ant-btn) {
  border-radius: 12px;
}
```

注意：

- `:global` 会让这段选择器变“强”，也更容易产生不可控影响
- 尽量加一个外层 `.wrap` 限定范围，避免影响全站按钮

---

## 4. Ant Design 如何对齐设计稿：优先“主题 Token”，再考虑覆盖

AntD 的默认视觉和设计稿差很多很正常；正确思路是：**先统一主题，再做局部修补**。

### 4.1 第一优先级：ConfigProvider 统一主题（颜色/圆角/字号/间距）

在应用入口包一层 `ConfigProvider`（示例写法，概念为主）：

```tsx
import { ConfigProvider } from 'antd';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#5B8CFF',
          borderRadius: 12,
          fontSize: 14,
          colorText: '#0f172a',
        },
        // 也可以按组件级别调（例如 Button、Card）
        components: {
          Button: {
            controlHeight: 40,
            borderRadius: 12,
          },
          Card: {
            borderRadiusLG: 16,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
```

你会明显看到：默认按钮圆角、默认主色、默认字号等会整体靠近设计稿。

> 要点：**先把“系统性差异”消掉**（主色/圆角/字体/基础间距），再去改局部（某个卡片的渐变、某个模块的特殊边距）。

### 4.2 第二优先级：给 AntD 组件加 `className`，做“有限局部覆盖”

AntD 组件一般都支持 `className`（或某些容器 prop）。你可以这样做：

```tsx
import { Button } from 'antd';
import styles from './PrimaryButton.module.css';

export function PrimaryButton(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} className={styles.btn} type="primary" />;
}
```

```css
/* PrimaryButton.module.css */
.btn {
  border-radius: 12px;
  height: 40px;
  padding: 0 16px;
}

.btn :global(.ant-btn-icon) {
  margin-inline-end: 8px;
}
```

> 建议：**把“设计稿定制过的 AntD 组件”封装成你们自己的组件**（如 `PrimaryButton / GradientCard / AppModal`），避免每个页面都写一堆覆盖。

### 4.3 第三优先级（谨慎）：强行覆盖 AntD 内部样式

当你需要覆盖 `hover`、`focus`、`active` 等状态，或 AntD 内部结构比较深时，可能不得不写更具体的选择器。原则：

- **尽量限制在某个容器范围内**
- **把覆盖集中在一个地方**（例如 `antd-overrides.module.css`），别散落在各组件里

示例（概念演示）：

```css
.panel :global(.ant-input-affix-wrapper) {
  border-radius: 12px;
  padding: 8px 12px;
}

.panel :global(.ant-input-affix-wrapper:hover) {
  border-color: #5b8cff;
}
```

---

## 5. 全局变量/参数：怎么让团队“统一口径”

你经常会听到“变量”“全局参数”“主题变量”，在样式还原里主要指两类：

### 5.1 CSS 变量（推荐用于：颜色、圆角、间距基准）

在全局 CSS 定义：

```css
/* globals.css */
:root {
  --radius-md: 12px;
  --radius-lg: 16px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;

  --brand-1: #5b8cff;
}
```

组件里用：

```css
.card {
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}
```

好处：设计稿改了“统一圆角 12 → 16”，你只改一处。

### 5.2 TS 常量/配置（推荐用于：业务参数、接口地址、枚举）

例如：

```ts
export const UI = {
  headerHeight: 56,
  sidebarWidth: 240,
} as const;
```

然后在 TSX 里用（搭配 style 或计算 class）：

```tsx
<div style={{ height: UI.headerHeight }} />
```

> 区分：**纯视觉统一**更适合 CSS 变量或 AntD token；**业务含义**更适合 TS 常量。

---

## 6. 颜色/渐变/圆角/大小/边距：对齐设计稿的“速查清单”

当你看到差异很大，按这个顺序排查，效率最高：

### 6.1 字体与基础样式（先排除“系统级差异”）

- `body` 是否有默认 margin？（常见：没 reset 导致页面整体偏移）
- `font-family` 是否与设计稿一致？（设计稿常用 PingFang / Inter 等）
- `font-size / line-height` 是否一致？（文字差 1px 也会让整体“松/挤”）
- 浏览器缩放是否 100%？

### 6.2 尺寸/间距（盒模型）

- 你改的是**父容器**还是**子元素**？布局通常在父容器改更正确
- 你以为是 margin，其实是 padding（或反过来）？
- 是否被 AntD 的默认 padding 覆盖？（按钮、卡片、表单项非常常见）

### 6.3 圆角

- 圆角应用在“真正有背景/边框的那个元素”上了吗？  
  例如：你给外层加了 `border-radius`，但背景色在内层，圆角看不到。
- AntD 有默认 radius（或 token）——建议先在主题里统一。

### 6.4 颜色与渐变

- 设计稿颜色通常是 **#RRGGBB + 透明度**，落到代码里可能是 `rgba()` 或 `#RRGGBBAA`
- 渐变常见差异：
  - 角度不同（`90deg` vs `135deg`）
  - 色标位置不同（`0%/100%`）
  - 透明度叠加导致“看起来不一样”

### 6.5 阴影

阴影最容易“看起来不一样”，因为：

- 设计稿里阴影可能是多层叠加
- 浏览器渲染有差异

建议直接用设计稿提供的 shadow 值（或团队沉淀为变量）。

---

## 7. 调试与还原：零基础同学最实用的排查套路

### 7.1 Chrome DevTools：定位“到底谁在控制这个样式”

步骤：

1. 右键元素 → Inspect
2. 看右侧 **Styles**：  
   - 哪条样式生效（没划线的）
   - 哪条被覆盖（划线的）
3. 切到 **Computed**：看最终计算值（非常关键）

你要学会回答这句话：  
**“这个 padding/颜色/圆角，是哪条 CSS 规则生效的？”**

### 7.2 先做“最小复现”

如果某个页面很复杂，建议：

- 先把目标组件单独抽出来（只保留必要结构）
- 只保留关键样式
- 让它先对齐设计稿，再放回页面

### 7.3 优先把差异“归类”

不要一上来就到处改：

- 是“整体风格”不对（主色、圆角、字体）→ 先改主题/token/全局
- 是“某个组件”不对（某个卡片渐变、某个按钮高度）→ 改该组件的 CSS Modules
- 是“AntD 默认样式”不对（按钮 padding、Input radius）→ 主题或局部覆盖

---

## 8. 推荐的团队落地方式（长期可维护）

如果你们要长期对齐设计稿，建议形成这套结构：

1. **Design Tokens（全局）**
   - AntD `ConfigProvider theme.token`
   - `globals.css` 的 CSS Variables（如 `--space-*`, `--radius-*`）
2. **UI 基础组件层（你们自己的组件）**
   - `PrimaryButton / AppCard / AppModal / AppInput ...`
   - 在这一层做 AntD 的统一封装与覆盖
3. **业务组件层**
   - 每个业务组件一个 `.module.css`
4. **页面层**
   - 只负责组合组件与业务逻辑，尽量少写细碎样式

这样做的结果是：  
设计稿改主色/圆角 → 你改 token / CSS 变量就能全站生效；  
设计稿要求按钮统一高度 → 你改 `PrimaryButton` 就能全站生效。

---

## 9. 常见问题（FAQ）

### Q1：我改了 `.module.css`，为什么页面没变化？

先检查：

- TSX 里有没有 `className={styles.xxx}` 挂上去？
- 是否写错类名（`styles.root` vs `.root`）？
- 是否被 AntD 或其他全局样式覆盖？（DevTools 看是否被划线）

### Q2：为什么 AntD 的按钮我怎么都改不掉？

常见原因：

- 你改的是外层，但真正生效的是内部元素（DevTools 看结构）
- 需要用 `:global(.ant-btn...)` 选择器覆盖
- 更推荐先用 `ConfigProvider` 的 token/components 配置解决（可维护性更好）

### Q3：设计稿里写“圆角 16”，我应该写哪里？

优先级：

1. 全站统一：用 AntD token（`borderRadius`）或 CSS 变量（`--radius-lg`）
2. 某个组件特例：在该组件 `.module.css` 单独写 `border-radius: 16px`

---

## 10. 你可以直接照抄的“最小模板”

**组件文件：**

```tsx
import clsx from 'clsx';
import styles from './Demo.module.css';

type Props = { highlight?: boolean };

export function Demo({ highlight }: Props) {
  return (
    <div className={clsx(styles.root, highlight && styles.highlight)}>
      <div className={styles.title}>标题</div>
      <div className={styles.sub}>副标题</div>
    </div>
  );
}
```

**样式文件：**

```css
.root {
  padding: var(--space-4, 16px);
  border-radius: var(--radius-lg, 16px);
  background: #fff;
}

.highlight {
  background: linear-gradient(135deg, #5b8cff 0%, #7a5cff 100%);
  color: #fff;
}

.title {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
}

.sub {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.85;
}
```

---

## 下一步（如果你愿意给我一点点你们的背景）

如果你告诉我你们：

- 用的是 Next.js **App Router 还是 Pages Router**
- AntD 版本（大概率是 v5）
- 设计稿的“基准体系”（如 4px/8px 间距体系、统一圆角、主色）

我可以把本文进一步“落成一套可直接复制到项目的模板”（例如：`theme.ts` + `globals.css` + `ui/` 基础组件目录结构）。

