# @anthropic/ai-engineering

## 项目概述

本项目是一个基于 React + TypeScript 的前端应用，采用了一套完整的 AI 工程化配置体系，旨在规范 AI 助手的行为，提高开发效率和代码质量。

## 功能特性

- 完整的 AI 工程化配置生成
- 仅支持 React + TypeScript + Vite
- 自动生成分层架构文档
- 内置多种专业技能
- 生成忽略规则配置

## 安装

```bash
npm install -g @anthropic/ai-engineering
```

## 使用

### 初始化配置

```bash
# 基本用法
ai-rule-init init

# 指定模板
ai-rule-init init --template react-ts

# 指定目标目录
ai-rule-init init --dir ./my-project

# 强制覆盖已有配置
ai-rule-init init --force
```

### 生成文档

```bash
# 生成AI工程化说明文档
ai-rule-init generate-docs

# 指定输出文件名
ai-rule-init generate-docs -o MY_DOCS.md

# 指定目标目录
ai-rule-init generate-docs -d ./my-project
```

### 查看技能

```bash
# 列出所有可用技能
ai-rule-init list-skills
```

## 选项

### init 命令

| 选项                        | 说明             | 默认值     |
| --------------------------- | ---------------- | ---------- |
| `-d, --dir <dir>`           | 目标目录         | `.`        |
| `-t, --template <template>` | 模板类型         | `react-ts` |
| `-f, --force`               | 强制覆盖已有文件 | `false`    |
| `--no-docs`                 | 跳过文档生成     | `false`    |
| `--no-skills`               | 跳过技能文件生成 | `false`    |

### generate-docs 命令

| 选项                    | 说明       | 默认值              |
| ----------------------- | ---------- | ------------------- |
| `-d, --dir <dir>`       | 目标目录   | `.`                 |
| `-o, --output <output>` | 输出文件名 | `AI_ENGINEERING.md` |

## 目录结构

```
.agents/
├── README.md                    # 目录索引
├── AI_WORKFLOW.md               # Vibe Coding 工作流规范
├── ignore-rules.txt             # AI 忽略规则（源文件）
├── generate-ignore.js           # 忽略规则生成脚本
├── rules/                       # 规则文件目录
│   ├── checklist.md             # 代码处理检查清单
│   ├── file-priority.md         # 分层读取架构与文件优先级
│   ├── tech-stack.md            # 技术栈信息
│   ├── code-standards.md        # 代码规范
│   ├── logging.md               # 对话日志记录规范
│   └── quality-checklist.md     # 质量检查清单
└── skills/                      # 技能文件目录
    ├── code-documentation-expert/ # 代码文档专家
    ├── find-skills/             # 技能发现
    ├── jotai-expert/            # Jotai 状态管理专家
    ├── less-best-practices/     # Less 最佳实践
    ├── react-performance-optimization/ # React 性能优化
    ├── react-router-data-mode/  # React Router 数据模式
    └── typescript-expert/       # TypeScript 专家
```

## 分层架构

### 层级结构图

```
┌─────────────────────────────────────────────────────────────┐
│                    系统提示层（自动注入）                      │
│                    AGENTS.md (45行)                         │
├─────────────────────────────────────────────────────────────┤
│                    关键读取层（必须读取）                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │ checklist.md    │  │ file-priority.md│  │ docs.md     │  │
│  │ (检查流程)      │  │ (文件优先级)    │  │ (模块文档)  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    按需读取层（场景触发）                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │ tech-stack.md   │  │ code-standards  │  │ quality-    │  │
│  │ (技术栈)        │  │ .md (代码规范)  │  │ checklist.md│  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │ logging.md      │  │ AI_WORKFLOW.md  │  │ skills/*    │  │
│  │ (日志规范)      │  │ (工作流)        │  │ (技能文件)  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 层级说明

| 层级           | 文件                   | 加载方式                           | 说明                                       |
| -------------- | ---------------------- | ---------------------------------- | ------------------------------------------ |
| **系统提示层** | `AGENTS.md`            | 自动注入                           | 核心规则入口，定义角色、项目结构、强制步骤 |
| **关键读取层** | `checklist.md`         | 处理代码前主动读取                 | 代码处理检查清单，强制检查流程             |
| **关键读取层** | `file-priority.md`     | 处理代码前主动读取                 | 文件优先级与分层读取架构                   |
| **关键读取层** | `docs.md`              | 目标文件为 index.tsx/ts 时强制读取 | 模块业务文档                               |
| **按需读取层** | `tech-stack.md`        | 首次处理代码或技术栈相关时         | 技术栈信息                                 |
| **按需读取层** | `code-standards.md`    | 编写/修改代码时                    | 代码规范和生成模板                         |
| **按需读取层** | `quality-checklist.md` | 代码审查或自检时                   | 质量检查清单                               |
| **按需读取层** | `logging.md`           | 需要生成对话日志时                 | 日志记录规范                               |
| **按需读取层** | `AI_WORKFLOW.md`       | 大功能开发需要走完整流程时         | Vibe Coding 工作流                         |
| **按需读取层** | `skills/*`             | 按场景触发                         | 专业技能文件                               |

## 引用关系

### 核心引用链

```
AGENTS.md
├── 引用 checklist.md（处理代码前必须读取）
├── 引用 file-priority.md（处理代码前必须读取）
└── 引用 docs.md（目标文件为 index.tsx/ts 时）

checklist.md
├── 引用 docs.md（强制检查规则）
└── 引用 code-documentation-expert skill（写文档时触发）

file-priority.md
├── 引用 rules/ 目录下所有规则文件
├── 引用 skills/ 目录下所有技能文件
└── 引用 AI_WORKFLOW.md（大功能开发时）

AI_WORKFLOW.md
├── 引用 checklist.md（开发前必须读取）
├── 引用 tech-stack.md（技术栈信息）
├── 引用 code-standards.md（代码规范）
└── 引用 quality-checklist.md（质量检查）
```

### 技能引用关系

```
skills/
├── code-documentation-expert/
│   └── SKILL.md（生成 docs.md 文档）
├── jotai-expert/
│   ├── SKILL.md（Jotai 最佳实践）
│   └── references/（详细参考文档）
├── react-performance-optimization/
│   ├── SKILL.md（React 性能优化）
│   └── references/（详细参考文档）
├── react-router-data-mode/
│   ├── SKILL.md（React Router 数据模式）
│   └── references/（详细参考文档）
├── typescript-expert/
│   ├── SKILL.md（TypeScript 专家）
│   └── references/（详细参考文档）
├── less-best-practices/
│   └── SKILL.md（Less 最佳实践）
└── find-skills/
    └── SKILL.md（技能发现工具）
```

## 工作流程

### 流程图

```
┌─────────────────────────────────────────────────────────────┐
│                    用户请求处理流程                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 接收用户请求                                            │
│      ↓                                                      │
│  2. 判断任务类型                                            │
│      ├── 小修复/小改动 → 快速流程                           │
│      ├── 中等任务 → 标准流程                                │
│      ├── 大功能开发 → 完整流程                              │
│      └── 问答咨询 → 无需工作流                              │
│      ↓                                                      │
│  3. 读取 AGENTS.md（自动注入）                              │
│      ↓                                                      │
│  4. 读取 checklist.md（强制步骤）                           │
│      ↓                                                      │
│  5. 读取 file-priority.md（确认文件优先级）                 │
│      ↓                                                      │
│  6. 按需加载规则文件                                        │
│      ├── tech-stack.md（技术栈相关）                        │
│      ├── code-standards.md（编写/修改代码）                 │
│      └── 其他规则文件                                       │
│      ↓                                                      │
│  7. 判断目标文件类型                                        │
│      ├── index.tsx/index.ts → 读取同级 docs.md              │
│      └── 其他文件 → 读取文件头部 JSDoc/注释                 │
│      ↓                                                      │
│  8. 按需加载技能文件                                        │
│      ├── code-documentation-expert（写文档时）              │
│      ├── jotai-expert（Jotai 相关）                         │
│      ├── react-performance-optimization（性能优化）          │
│      ├── typescript-expert（复杂类型问题）                  │
│      └── 其他技能文件                                       │
│      ↓                                                      │
│  9. 执行任务                                                │
│      ↓                                                      │
│  10. 自检（quality-checklist.md）                           │
│      ↓                                                      │
│  11. 验证（tsc/lint）                                       │
│      ↓                                                      │
│  12. 输出结果 + 固定回执格式                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 三种工作流程

#### 1. 快速流程（小修复/小改动）

**适用场景**：改文案、修 bug、调样式、改类型、删废弃代码，预计耗时 < 30 分钟。

```
1. 读取 checklist.md
2. 读取 tech-stack.md（如需要）
3. 定位代码 → 修改 → 自检
4. 运行 tsc / lint 验证
5. 告知用户修改内容
```

#### 2. 标准流程（中等任务）

**适用场景**：新增/修改组件、对接 API、实现独立小功能，预计耗时 30 分钟 - 2 小时。

```
阶段1：设计（AI执行，1轮）
├── 功能分析 → 简要技术方案
└── 人工确认（快速 yes/no）

阶段2：开发（AI执行）
├── 读取 checklist.md + code-standards.md
├── 按模块开发 + 实时自检
└── 更新相关 docs.md（如需要）

阶段3：交付（AI自检 + 人工抽查）
├── pnpm run tsc
├── pnpm run lint
└── 告知用户变更摘要
```

#### 3. 完整流程（大功能开发）

**适用场景**：新增页面、复杂功能、跨模块改动，预计耗时 > 2 小时。

```
阶段1：设计（AI并发）
┌─────────────────────┐
│ 需求分析 + 技术设计   │
│      ↓              │
│   人工校正(1次)      │
└─────────────────────┘

阶段2：开发（AI执行）
┌─────────────────────┐
│ 任务开发 + 自检      │
│      ↓              │
│   人工Review(1次)   │
└─────────────────────┘

阶段3：交付
┌─────────────────────┐
│ 审核 + 推送          │
└─────────────────────┘
```

## 强制检查流程

### 代码处理前的强制步骤

无论任何任务，只要涉及代码读写，必须按顺序执行：

1. **读取 `.agents/rules/checklist.md`** — 确认检查流程
2. **读取 `.agents/rules/file-priority.md`** — 确认当前场景需要加载哪些规则
3. **按需加载对应规则** — 根据场景判断，禁止加载无关规则
4. **如果目标文件是 `index.tsx`/`index.ts`，按 `.agents/rules/checklist.md` 中的规则读取同级 `docs.md`**

### 强制文档读取规则表

| 文件类型      | 典型路径             | 文件名       | docs.md 位置示例                   | 强制检查 |
| ------------- | -------------------- | ------------ | ---------------------------------- | -------- |
| 页面          | `src/pages/**/`      | `index.tsx`  | `src/pages/TagManage/docs.md`      | ✅ 是    |
| 组件          | `src/components/**/` | `index.tsx`  | `src/components/ArkModal/docs.md`  | ✅ 是    |
| Hooks（目录） | `src/hooks/useXxx/`  | `index.tsx`  | `src/hooks/useQueryParams/docs.md` | ✅ 是    |
| Hooks（扁平） | `src/hooks/`         | `useXxx.tsx` | 无                                 | ❌ 否    |
| 工具函数      | `src/utils/`         | `xxx.ts`     | 无                                 | ❌ 否    |
| Services      | `src/services/`      | `xxx.ts`     | 无                                 | ❌ 否    |

## 技能系统

### 技能分类

| 技能名称                         | 触发场景                            | 用途                  |
| -------------------------------- | ----------------------------------- | --------------------- |
| `code-documentation-expert`      | 用户要求写说明/技术文档时           | 生成 docs.md 文档     |
| `jotai-expert`                   | 涉及 Jotai 状态管理时               | Jotai 最佳实践        |
| `react-performance-optimization` | React 性能优化/减少不必要 re-render | React 性能优化        |
| `react-router-data-mode`         | 涉及路由配置时                      | React Router 数据模式 |
| `typescript-expert`              | 涉及复杂 TypeScript 类型问题时      | TypeScript 专家       |
| `less-best-practices`            | 编写/重构 Less 样式时               | Less 最佳实践         |
| `find-skills`                    | 用户询问如何做某事时                | 技能发现工具          |

### 技能引用机制

技能通过 `skill` 工具加载，注入到当前对话上下文中。每个技能包含：

- **SKILL.md**：主文件，包含技能说明、工作流程、模板规范
- **references/**：可选的详细参考文档
- **scripts/**：可选的脚本工具

## 忽略规则配置

### 忽略文件类型

| 类别     | 文件/目录                             | 原因         |
| -------- | ------------------------------------- | ------------ |
| 构建产物 | `dist/`, `build/`, `node_modules/`    | 无需关注     |
| 锁文件   | `pnpm-lock.yaml`, `package-lock.json` | 无需关注     |
| Git 相关 | `.git/`, `.gitignore`                 | 无需关注     |
| IDE 配置 | `.vscode/`, `.idea/`                  | 无需关注     |
| 测试文件 | `*.test.*`, `*.spec.*`                | 除非明确要求 |
| 环境配置 | `.env`, `config/config.json`          | 含敏感信息   |
| 日志文件 | `*.log`, `logs/`                      | 无需关注     |

### 生成机制

忽略规则由 `.agents/ignore-rules.txt` 生成，输出到：

- `.cursorignore`（Cursor AI）
- `.claudeignore`（Claude）
- `opencode.json`（OpenCode）

## 固定回执格式

每轮对话必须输出：

```
已读取：[rules 文件名] / [skills 名称] / [docs.md 路径]
未读取：[未读取的文件]
```

## 技术栈信息

| 类别      | 技术                                   |
| --------- | -------------------------------------- |
| 前端框架  | React 18 + TypeScript                  |
| 构建工具  | Vite 7 + SWC                           |
| UI 组件库 | @hg-data/ark-components → Ant Design 6 |
| 状态管理  | Jotai                                  |
| 路由      | React Router DOM 7                     |
| 样式      | Less + CSS Modules                     |
| 包管理器  | pnpm                                   |
| 数据请求  | useSWR                                 |
| 工具库    | lodash, dayjs                          |

## 代码规范要点

1. 使用函数式组件和 Hooks
2. 组件命名导出：`export function ComponentName() {}`
3. 组件定义后加展示名：`ComponentName.displayName = 'ComponentName'`
4. 保持文件精简（200-300 行以内）
5. 仅在用户要求时添加注释
6. 优先使用指定的组件库和图标库
7. 遵守 prettier 规范

## 质量检查清单

### 代码质量检查

- [ ] 优先使用指定的组件库和图标库
- [ ] 没有安全漏洞
- [ ] 遵循项目既有的代码风格
- [ ] 代码风格符合 code-standards.md 要求

### 开发流程检查

- [ ] 所有功能点都有明确的验收标准
- [ ] 优先级划分合理（P0/P1/P2）
- [ ] 技术难点已识别
- [ ] 依赖关系清晰
- [ ] 风险点已标注

### 代码提交前检查

- [ ] 本地运行 lint 通过
- [ ] 本地运行 tsc 通过
- [ ] 本地构建成功
- [ ] 功能手动测试通过
- [ ] 检查边界场景
- [ ] 检查兼容性

## 常见问题

### Q: 什么时候需要读取 docs.md？

A: 当目标文件名为 `index.tsx` 或 `index.ts` 时，必须读取同级目录的 `docs.md`。

### Q: 什么时候需要加载技能文件？

A: 根据任务场景判断，例如：

- 写文档时加载 `code-documentation-expert`
- 涉及 Jotai 时加载 `jotai-expert`
- 性能优化时加载 `react-performance-optimization`

### Q: 如何确保代码质量？

A: 遵循以下步骤：

1. 读取 code-standards.md 了解代码规范
2. 开发过程中实时自检
3. 完成后运行 tsc 和 lint 检查
4. 参考 quality-checklist.md 进行质量验收

### Q: 忽略规则如何生效？

A: 忽略规则由 `.agents/ignore-rules.txt` 生成，输出到 `.cursorignore`、`.claudeignore` 和 `opencode.json`，AI 工具会自动忽略这些文件。

## 许可证

MIT License

## 相关链接

- [GitHub 仓库](https://github.com/jiaojianwu/ai-engineering)
- [问题反馈](https://github.com/jiaojianwu/ai-engineering/issues)
- [npm 包](https://www.npmjs.com/package/@anthropic/ai-engineering)

---

**文档版本**：v1.0 **最后更新**：2026-05-07
