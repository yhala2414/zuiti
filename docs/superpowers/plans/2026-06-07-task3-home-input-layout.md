# Task3 Home/Input Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不修改 `tasks.md` 的前提下，将首页和输入页按 `375x750` 重新整理为更依赖常规文档流的布局，并减少绝对定位与硬编码偏移。

**Architecture:** 以现有 `MobileShell` 的 `375x750` 容器为基准，首页和输入页分别改为使用 `flex`、`grid`、`gap`、`padding` 组织主要区块，仅为装饰性元素保留少量相对定位。公共组件只做与布局收口直接相关的微调，避免引入新的抽象层。

**Tech Stack:** Next.js 16 App Router, React 19, CSS Modules, antd-mobile

---

### Task 1: 梳理页面和公共容器边界

**Files:**
- Modify: `components/MobileShell.tsx`
- Modify: `components/MobileShell.module.css`
- Modify: `components/TopBar.tsx`
- Modify: `components/TopBar.module.css`
- Modify: `components/BottomNav.module.css`

- [ ] 核对当前 `375x750` 容器、安全区和顶部结构是否已就位，仅保留与页面重排直接相关的变更。

### Task 2: 重排首页

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/page.module.css`

- [ ] 将首页改为“顶部按钮 / Hero / 场景网格 / 最近使用 / 热门风格 / CTA / 底栏”的流式布局。
- [ ] 收敛首页 `hero`、CTA 和热门风格区域中的硬编码偏移，保留必要的装饰性相对定位。

### Task 3: 重排输入页

**Files:**
- Modify: `app/input/page.tsx`
- Modify: `app/input/page.module.css`

- [ ] 去掉输入页风格区块中标题与卡片列表的绝对定位叠放，改为正常文档流。
- [ ] 调整输入区域、风格横滑区和底部 CTA 的垂直节奏，让 `375x750` 下内容不重叠且滚动自然。

### Task 4: 验证与收口

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/page.module.css`
- Verify: `app/input/page.tsx`
- Verify: `app/input/page.module.css`
- Verify: `components/MobileShell.tsx`
- Verify: `components/MobileShell.module.css`
- Verify: `components/TopBar.tsx`
- Verify: `components/TopBar.module.css`
- Verify: `components/BottomNav.module.css`

- [ ] 使用编辑器诊断检查改动文件的类型和样式问题。
- [ ] 运行 `npm run lint`。
- [ ] 运行 `npm run build`。
- [ ] 汇总修改文件、验证结果和剩余风险。
