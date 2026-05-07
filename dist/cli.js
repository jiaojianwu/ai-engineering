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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
exports.generateDocs = generateDocs;
exports.listSkills = listSkills;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = __importDefault(require("inquirer"));
const generator_1 = require("./generator");
const file_1 = require("./utils/file");
/**
 * 初始化AI工程化配置
 */
async function init(options) {
    const spinner = (0, ora_1.default)('正在初始化AI工程化配置...').start();
    try {
        const targetDir = path.resolve(options.dir);
        const agentsDir = path.join(targetDir, '.agents');
        // 检查目标目录是否存在
        if (!fs.existsSync(targetDir)) {
            throw new Error(`目标目录不存在: ${targetDir}`);
        }
        // 检查是否已存在 .agents 目录
        if (fs.existsSync(agentsDir) && !options.force) {
            spinner.stop();
            const { overwrite } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: '已存在 .agents 目录，是否覆盖？',
                    default: false
                }
            ]);
            if (!overwrite) {
                spinner.warn('已取消初始化');
                return;
            }
            spinner.start('正在覆盖已有配置...');
        }
        // 创建目录结构
        spinner.text = '正在创建目录结构...';
        await (0, file_1.ensureDir)(agentsDir);
        await (0, file_1.ensureDir)(path.join(agentsDir, 'rules'));
        await (0, file_1.ensureDir)(path.join(agentsDir, 'skills'));
        // 复制模板文件
        spinner.text = '正在复制模板文件...';
        // 模板目录位于包的根目录下的src/templates
        const packageRoot = path.resolve(__dirname, '..');
        const templatesDir = path.join(packageRoot, 'src', 'templates');
        await (0, file_1.copyTemplates)(templatesDir, agentsDir, options);
        // 生成 AGENTS.md 到项目根目录
        const agentsMdPath = path.join(targetDir, 'AGENTS.md');
        if (!fs.existsSync(agentsMdPath) || options.force) {
            const agentsMdContent = (0, file_1.generateAgentsMd)(options);
            await fs.writeFile(agentsMdPath, agentsMdContent, 'utf-8');
        }
        // 生成AI文档
        if (options.docs) {
            spinner.text = '正在生成AI工程化文档...';
            const config = {
                projectName: path.basename(targetDir),
                template: options.template,
                includeSkills: options.skills
            };
            await (0, generator_1.generateAIDocs)(targetDir, config);
        }
        // 生成忽略规则
        spinner.text = '正在生成忽略规则...';
        await generateIgnoreRules(targetDir);
        spinner.succeed(chalk_1.default.green('AI工程化配置初始化完成！'));
        // 输出成功信息
        console.log('\n' + chalk_1.default.bold('已生成的文件：'));
        console.log(chalk_1.default.cyan('  .agents/                 # AI配置目录'));
        console.log(chalk_1.default.cyan('  AGENTS.md                # 核心规则入口'));
        console.log(chalk_1.default.cyan('  AI_ENGINEERING.md        # AI工程化说明文档'));
        console.log(chalk_1.default.cyan('  .cursorignore            # Cursor AI忽略规则'));
        console.log(chalk_1.default.cyan('  .claudeignore            # Claude忽略规则'));
        console.log('\n' + chalk_1.default.bold('下一步：'));
        console.log('  1. 阅读 ' + chalk_1.default.cyan('AGENTS.md') + ' 了解核心规则');
        console.log('  2. 阅读 ' + chalk_1.default.cyan('AI_ENGINEERING.md') + ' 了解工程化配置');
        console.log('  3. 根据项目需求调整 ' + chalk_1.default.cyan('.agents/rules/') + ' 下的规则文件');
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('初始化失败'));
        throw error;
    }
}
/**
 * 生成AI工程化说明文档
 */
async function generateDocs(options) {
    const spinner = (0, ora_1.default)('正在生成AI工程化文档...').start();
    try {
        const targetDir = path.resolve(options.dir);
        const outputPath = path.join(targetDir, options.output);
        const config = {
            projectName: path.basename(targetDir),
            template: 'react-ts',
            includeSkills: true
        };
        const content = await (0, generator_1.generateAIDocs)(targetDir, config);
        await fs.writeFile(outputPath, content, 'utf-8');
        spinner.succeed(chalk_1.default.green(`文档已生成: ${options.output}`));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('文档生成失败'));
        throw error;
    }
}
/**
 * 列出所有可用的技能
 */
async function listSkills() {
    const skills = [
        {
            name: 'code-documentation-expert',
            description: '代码文档专家 - 生成docs.md文档',
            trigger: '写说明/技术文档时'
        },
        {
            name: 'jotai-expert',
            description: 'Jotai状态管理专家',
            trigger: '涉及Jotai状态管理时'
        },
        {
            name: 'react-performance-optimization',
            description: 'React性能优化专家',
            trigger: 'React性能优化/减少re-render'
        },
        {
            name: 'react-router-data-mode',
            description: 'React Router数据模式专家',
            trigger: '涉及路由配置时'
        },
        {
            name: 'typescript-expert',
            description: 'TypeScript专家',
            trigger: '涉及复杂TypeScript类型问题时'
        },
        {
            name: 'less-best-practices',
            description: 'Less最佳实践专家',
            trigger: '编写/重构Less样式时'
        },
        {
            name: 'find-skills',
            description: '技能发现工具',
            trigger: '询问如何做某事时'
        }
    ];
    console.log('\n' + chalk_1.default.bold('可用的技能：'));
    console.log('─'.repeat(60));
    for (const skill of skills) {
        console.log(chalk_1.default.cyan(`  ${skill.name}`));
        console.log(`    ${chalk_1.default.gray('描述：')}${skill.description}`);
        console.log(`    ${chalk_1.default.gray('触发：')}${skill.trigger}`);
        console.log('');
    }
    console.log('─'.repeat(60));
    console.log(chalk_1.default.gray('使用方式：在对话中触发相应场景，AI会自动加载对应技能'));
}
/**
 * 生成忽略规则文件
 */
async function generateIgnoreRules(targetDir) {
    const ignoreContent = `# AI 忽略规则
# 构建产物
dist/
build/
node_modules/
.cache/
.parcel-cache/

# 锁文件
pnpm-lock.yaml
package-lock.json
yarn.lock
bun.lockb

# Git相关
.git/
.gitignore
.github/
.gitlab/
.husky/

# IDE配置
.vscode/
.idea/
*.swp
*.swo
*~

# 系统文件
.DS_Store
Thumbs.db

# 测试文件
src/test/
**/*.test.ts
**/*.test.tsx
**/*.spec.ts
**/*.spec.tsx
__tests__/
coverage/
.nyc_output/

# 环境配置
.env
.env.*
!.env.example
config/config.json

# 日志和临时文件
logs/
log.md
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
`;
    // 生成 .cursorignore
    await fs.writeFile(path.join(targetDir, '.cursorignore'), ignoreContent, 'utf-8');
    // 生成 .claudeignore
    await fs.writeFile(path.join(targetDir, '.claudeignore'), ignoreContent, 'utf-8');
    // 生成 opencode.json
    const opencodeConfig = {
        ignore: ignoreContent.split('\n').filter(line => line && !line.startsWith('#'))
    };
    await fs.writeFile(path.join(targetDir, 'opencode.json'), JSON.stringify(opencodeConfig, null, 2), 'utf-8');
}
//# sourceMappingURL=cli.js.map