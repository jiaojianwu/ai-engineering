"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDir = ensureDir;
exports.copyTemplates = copyTemplates;
exports.generateAgentsMd = generateAgentsMd;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.fileExists = fileExists;
exports.getFiles = getFiles;
exports.mkdirp = mkdirp;
exports.rmrf = rmrf;
exports.copy = copy;
exports.move = move;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
/**
 * 确保目录存在
 */
async function ensureDir(dir) {
    await fs.ensureDir(dir);
}
/**
 * 复制模板文件到目标目录
 */
async function copyTemplates(templatesDir, targetDir, options) {
    // 复制 rules 目录
    const rulesDir = path.join(templatesDir, 'rules');
    if (fs.existsSync(rulesDir)) {
        await fs.copy(rulesDir, path.join(targetDir, 'rules'), {
            overwrite: options.force
        });
    }
    // 复制 skills 目录
    if (options.skills) {
        const skillsDir = path.join(templatesDir, 'skills');
        if (fs.existsSync(skillsDir)) {
            await fs.copy(skillsDir, path.join(targetDir, 'skills'), {
                overwrite: options.force
            });
        }
    }
    // 复制根目录文件
    const rootFiles = ['AI_WORKFLOW.md', 'README.md', 'ignore-rules.txt', 'generate-ignore.js'];
    for (const file of rootFiles) {
        const srcFile = path.join(templatesDir, file);
        const destFile = path.join(targetDir, file);
        if (fs.existsSync(srcFile)) {
            if (fs.existsSync(destFile) && !options.force) {
                // 文件已存在且未强制覆盖，跳过
                continue;
            }
            await fs.copy(srcFile, destFile, { overwrite: options.force });
        }
    }
    // 生成 AGENTS.md
    const agentsMdPath = path.join(targetDir, 'AGENTS.md');
    if (!fs.existsSync(agentsMdPath) || options.force) {
        const agentsMdContent = generateAgentsMd(options);
        await fs.writeFile(agentsMdPath, agentsMdContent, 'utf-8');
    }
}
/**
 * 生成 AGENTS.md 文件内容
 */
function generateAgentsMd(options) {
    return `# AI 开发助手规则

## 角色

你是一个资深前端技术专家，尤其精通 React + Typescript 技术栈开发。

## 📁 规则分层架构

**本文件为系统提示层（已自动注入），其他规则需按需读取，禁止一次性加载所有规则。**

| 层级 | 文件 | 加载方式 |
|------|------|----------|
| 系统提示层 | \`AGENTS.md\` | 自动注入 |
| 关键读取层 | \`.agents/rules/checklist.md\` / \`.agents/rules/file-priority.md\` / \`docs.md\` | 处理代码前主动读取 |
| 按需读取层 | \`.agents/rules/code-standards.md\` / \`.agents/skills/*\` / \`.agents/AI_WORKFLOW.md\` | 按场景触发读取 |

## 🔴 处理代码前的强制步骤

无论任何任务，只要涉及代码读写，必须按顺序执行：

1. **读取 \`.agents/rules/checklist.md\`** — 确认检查流程
2. **读取 \`.agents/rules/file-priority.md\`** — 确认当前场景需要加载哪些规则
3. **按需加载对应规则** — 根据场景判断，禁止加载无关规则
4. **如果目标文件是 \`index.tsx\`/\`index.ts\`，按 \`.agents/rules/checklist.md\` 中的规则读取同级 \`docs.md\`**

## 📊 项目结构速览

\`\`\`
src/
├── pages/       # 页面模块（20 个，均为 index.tsx 目录结构）
├── components/  # 通用组件（44 个，均为 index.tsx 目录结构）
├── hooks/       # 自定义 Hooks（14 个，大部分为扁平文件）
├── utils/       # 工具函数（23 个，扁平文件）
├── services/    # API 服务
├── store/       # 状态管理
└── types/       # 类型定义
\`\`\`

**AI 声明引用**：回答问题时声明读取过哪些 rules 和 skills 和 docs.md（仅展示名称），未读取则如实告知

**固定回执格式**（每轮对话必须输出）：
\`\`\`
已读取：[rules 文件名] / [skills 名称] / [docs.md 路径]
未读取：[未读取的文件]
\`\`\`

Skills provide specialized instructions and workflows for specific tasks.
Use the skill tool to load a skill when a task matches its description.
<available_skills>
  <skill>
    <name>code-documentation-expert</name>
    <description>Expert for reading and documenting React + TypeScript code. Analyzes code relationships, explains functionality, identifies complexities and risks, producing concise and accurate documentation.</description>
    <location>file:///path/to/.agents/skills/code-documentation-expert/SKILL.md</location>
  </skill>
  <skill>
    <name>find-skills</name>
    <description>Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express interest in extending capabilities.</description>
    <location>file:///path/to/.agents/skills/find-skills/SKILL.md</location>
  </skill>
  <skill>
    <name>jotai-expert</name>
    <description>Expert guidance for Jotai state management in React applications.</description>
    <location>file:///path/to/.agents/skills/jotai-expert/SKILL.md</location>
  </skill>
  <skill>
    <name>less-best-practices</name>
    <description>Less CSS best practices and coding guidelines for maintainable, modular stylesheets</description>
    <location>file:///path/to/.agents/skills/less-best-practices/SKILL.md</location>
  </skill>
  <skill>
    <name>react-performance-optimization</name>
    <description>React performance optimization patterns using memoization, code splitting, and efficient rendering strategies.</description>
    <location>file:///path/to/.agents/skills/react-performance-optimization/SKILL.md</location>
  </skill>
  <skill>
    <name>react-router-data-mode</name>
    <description>Build React applications using React Router's data mode with createBrowserRouter and RouterProvider.</description>
    <location>file:///path/to/.agents/skills/react-router-data-mode/SKILL.md</location>
  </skill>
  <skill>
    <name>typescript-expert</name>
    <description>TypeScript and JavaScript expert with deep knowledge of type-level programming, performance optimization, monorepo management, migration strategies, and modern tooling.</description>
    <location>file:///path/to/.agents/skills/typescript-expert/SKILL.md</location>
  </skill>
</available_skills>
`;
}
/**
 * 读取文件内容
 */
async function readFile(filePath) {
    return await fs.readFile(filePath, 'utf-8');
}
/**
 * 写入文件内容
 */
async function writeFile(filePath, content) {
    await fs.writeFile(filePath, content, 'utf-8');
}
/**
 * 检查文件是否存在
 */
async function fileExists(filePath) {
    return await fs.pathExists(filePath);
}
/**
 * 获取目录下的所有文件
 */
async function getFiles(dir) {
    const files = [];
    const items = await fs.readdir(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        if (stat.isFile()) {
            files.push(fullPath);
        }
        else if (stat.isDirectory()) {
            const subFiles = await getFiles(fullPath);
            files.push(...subFiles);
        }
    }
    return files;
}
/**
 * 递归创建目录
 */
async function mkdirp(dir) {
    await fs.mkdirp(dir);
}
/**
 * 删除目录
 */
async function rmrf(dir) {
    await fs.remove(dir);
}
/**
 * 复制文件或目录
 */
async function copy(src, dest) {
    await fs.copy(src, dest);
}
/**
 * 移动文件或目录
 */
async function move(src, dest) {
    await fs.move(src, dest);
}
//# sourceMappingURL=file.js.map