# 文件优先级与分层读取架构

**AI 必须按以下分层读取文件，避免一次性加载所有规则浪费 token。**

---

## 第一层：系统提示层（已自动注入，无需手动读取）

| 文件        | 位置       | 说明                             |
| ----------- | ---------- | -------------------------------- |
| `AGENTS.md` | 项目根目录 | 核心规则入口，已自动注入系统提示 |

> ⚠️ **禁止**将其他规则文件加载到系统提示层。系统提示应保持在 100 行以内。

---

## 第二层：关键读取层（处理代码前必须读取）

以下文件在涉及代码处理时，**必须主动读取**：

| 文件                       | 位置             | 触发条件                                       | 用途                   |
| -------------------------- | ---------------- | ---------------------------------------------- | ---------------------- |
| `rules/checklist.md`       | `.agents/rules/` | 每次处理代码前                                 | 强制检查流程           |
| 目标文件同目录的 `docs.md` | 与目标文件同级   | 目标文件名为 `index.tsx`/`index.ts` 时强制读取（详见 `checklist.md`） | 模块业务文档           |

---

## 第三层：按需读取层（按场景触发，禁止预加载）

以下文件**仅在对应场景下读取**，不得在处理无关任务时加载：

| 文件                                          | 触发场景                       | 用途                  |
| --------------------------------------------- | ------------------------------ | --------------------- |
| `rules/tech-stack.md`                         | 首次处理代码或技术栈相关时     | 技术栈信息            |
| `rules/code-standards.md`                     | 编写/修改代码时                | 代码规范和生成模板    |
| `rules/quality-checklist.md`                  | 代码审查或自检时               | 质量检查清单          |
| `rules/logging.md`                            | 需要生成对话日志时             | 日志记录规范          |
| `.agents/AI_WORKFLOW.md`                      | 大功能开发需要走完整流程时     | Vibe Coding 工作流    |
| `skills/code-documentation-expert/SKILL.md`   | 用户要求写说明/技术文档时      | 代码文档专家          |
| `skills/jotai-expert/SKILL.md`                | 涉及 Jotai 状态管理时          | Jotai 最佳实践        |
| `skills/typescript-expert/SKILL.md`           | 涉及复杂 TypeScript 类型问题时 | TypeScript 专家       |
| `.agents/skills/react-performance-optimization/SKILL.md` | React 性能优化/减少不必要 re-render/虚拟列表/代码分割 | React 性能优化        |
| `skills/react-router-data-mode/SKILL.md`      | 涉及路由配置时                 | React Router 数据模式 |
| `skills/less-best-practices/SKILL.md`         | 编写/重构 Less 样式时          | Less 最佳实践         |

---

## 🟢 无需读取文件（已自动忽略）

| 文件/目录             | 原因                     |
| --------------------- | ------------------------ |
| `node_modules/`       | 依赖包，AI 不应修改      |
| `dist/` `build/`      | 构建产物                 |
| `pnpm-lock.yaml`      | 锁文件，无需关注         |
| `.git/`               | Git 内部文件             |
| `*.test.*` `*.spec.*` | 测试文件（除非明确要求） |
| `.cursorignore`       | 配置文件本身             |
| `config/config.json`  | 环境配置，含敏感信息     |

> AI 忽略配置由 `.agents/ignore-rules.txt` 生成，输出到项目根目录的 `.cursorignore`、`.claudeignore` 和 `opencode.json`。
