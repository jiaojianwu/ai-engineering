# @anthropic/ai-engineering

AI工程化配置生成器 - 为React+TypeScript项目生成标准化的AI开发助手配置。

## 功能特性

- 完整的AI工程化配置生成
- 支持多种模板（React TS/JS, Vue TS/JS）
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

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-d, --dir <dir>` | 目标目录 | `.` |
| `-t, --template <template>` | 模板类型 | `react-ts` |
| `-f, --force` | 强制覆盖已有文件 | `false` |
| `--no-docs` | 跳过文档生成 | `false` |
| `--no-skills` | 跳过技能文件生成 | `false` |

### generate-docs 命令

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-d, --dir <dir>` | 目标目录 | `.` |
| `-o, --output <output>` | 输出文件名 | `AI_ENGINEERING.md` |

### 模板类型

- `react-ts` - React + TypeScript（默认）
- `react-js` - React + JavaScript
- `vue-ts` - Vue + TypeScript
- `vue-js` - Vue + JavaScript

## 生成的文件

运行 `ai-rule-init init` 后会生成以下文件：

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
AGENTS.md                        # 核心规则入口
AI_ENGINEERING.md                # AI工程化说明文档
.cursorignore                    # Cursor AI忽略规则
.claudeignore                    # Claude忽略规则
opencode.json                    # OpenCode忽略规则
```

## 分层架构

### 系统提示层（自动注入）

- `AGENTS.md` - 核心规则入口，定义角色、项目结构、强制步骤

### 关键读取层（必须读取）

- `checklist.md` - 代码处理检查清单
- `file-priority.md` - 文件优先级与分层读取架构
- `docs.md` - 模块业务文档（目标文件为 index.tsx/ts 时）

### 按需读取层（场景触发）

- `tech-stack.md` - 技术栈信息
- `code-standards.md` - 代码规范
- `quality-checklist.md` - 质量检查清单
- `logging.md` - 日志记录规范
- `AI_WORKFLOW.md` - Vibe Coding 工作流
- `skills/*` - 专业技能文件

## 技能系统

| 技能名称 | 触发场景 | 用途 |
|----------|----------|------|
| `code-documentation-expert` | 写说明/技术文档时 | 生成 docs.md 文档 |
| `jotai-expert` | 涉及 Jotai 状态管理时 | Jotai 最佳实践 |
| `react-performance-optimization` | React 性能优化 | React 性能优化 |
| `react-router-data-mode` | 涉及路由配置时 | React Router 数据模式 |
| `typescript-expert` | 复杂 TypeScript 类型问题 | TypeScript 专家 |
| `less-best-practices` | 编写/重构 Less 样式时 | Less 最佳实践 |
| `find-skills` | 询问如何做某事时 | 技能发现工具 |

## 工作流程

### 快速流程（<30分钟）

适用于小修复/小改动：改文案、修 bug、调样式、改类型、删废弃代码。

### 标准流程（30分钟-2小时）

适用于中等任务：新增/修改组件、对接 API、实现独立小功能。

### 完整流程（>2小时）

适用于大功能开发：新增页面、复杂功能、跨模块改动。

## 固定回执格式

每轮对话必须输出：

```
已读取：[rules 文件名] / [skills 名称] / [docs.md 路径]
未读取：[未读取的文件]
```

## 开发

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/jiaojianwu/ai-engineering.git

# 安装依赖
cd ai-engineering
npm install

# 构建
npm run build

# 本地测试
node bin/ai-rule-init.js --help
```

### 发布

```bash
# 构建
npm run build

# 发布到npm
npm publish
```

## 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

MIT License

## 相关链接

- [GitHub 仓库](https://github.com/jiaojianwu/ai-engineering)
- [问题反馈](https://github.com/jiaojianwu/ai-engineering/issues)
- [npm 包](https://www.npmjs.com/package/@anthropic/ai-engineering)
