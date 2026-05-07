import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { generateAIDocs, AIDocsConfig } from './generator';
import { copyTemplates, ensureDir, generateAgentsMd } from './utils/file';
import { logger } from './utils/logger';

export interface InitOptions {
  dir: string;
  template: string;
  force: boolean;
  docs: boolean;
  skills: boolean;
}

export interface GenerateDocsOptions {
  dir: string;
  output: string;
}

/**
 * 初始化AI工程化配置
 */
export async function init(options: InitOptions): Promise<void> {
  const spinner = ora('正在初始化AI工程化配置...').start();
  
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
      
      const { overwrite } = await inquirer.prompt([
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
    await ensureDir(agentsDir);
    await ensureDir(path.join(agentsDir, 'rules'));
    await ensureDir(path.join(agentsDir, 'skills'));
    
    // 复制模板文件
    spinner.text = '正在复制模板文件...';
    // 模板目录位于包的根目录下的src/templates
    const packageRoot = path.resolve(__dirname, '..');
    const templatesDir = path.join(packageRoot, 'src', 'templates');
    await copyTemplates(templatesDir, agentsDir, options);
    
    // 生成 AGENTS.md 到项目根目录
    const agentsMdPath = path.join(targetDir, 'AGENTS.md');
    if (!fs.existsSync(agentsMdPath) || options.force) {
      const agentsMdContent = generateAgentsMd(options);
      await fs.writeFile(agentsMdPath, agentsMdContent, 'utf-8');
    }
    
    // 生成AI文档
    if (options.docs) {
      spinner.text = '正在生成AI工程化文档...';
      const config: AIDocsConfig = {
        projectName: path.basename(targetDir),
        template: options.template as any,
        includeSkills: options.skills
      };
      await generateAIDocs(targetDir, config);
    }
    
    // 生成忽略规则
    spinner.text = '正在生成忽略规则...';
    await generateIgnoreRules(targetDir);
    
    spinner.succeed(chalk.green('AI工程化配置初始化完成！'));
    
    // 输出成功信息
    console.log('\n' + chalk.bold('已生成的文件：'));
    console.log(chalk.cyan('  .agents/                 # AI配置目录'));
    console.log(chalk.cyan('  AGENTS.md                # 核心规则入口'));
    console.log(chalk.cyan('  AI_ENGINEERING.md        # AI工程化说明文档'));
    console.log(chalk.cyan('  .cursorignore            # Cursor AI忽略规则'));
    console.log(chalk.cyan('  .claudeignore            # Claude忽略规则'));
    
    console.log('\n' + chalk.bold('下一步：'));
    console.log('  1. 阅读 ' + chalk.cyan('AGENTS.md') + ' 了解核心规则');
    console.log('  2. 阅读 ' + chalk.cyan('AI_ENGINEERING.md') + ' 了解工程化配置');
    console.log('  3. 根据项目需求调整 ' + chalk.cyan('.agents/rules/') + ' 下的规则文件');
    
  } catch (error) {
    spinner.fail(chalk.red('初始化失败'));
    throw error;
  }
}

/**
 * 生成AI工程化说明文档
 */
export async function generateDocs(options: GenerateDocsOptions): Promise<void> {
  const spinner = ora('正在生成AI工程化文档...').start();
  
  try {
    const targetDir = path.resolve(options.dir);
    const outputPath = path.join(targetDir, options.output);
    
    const config: AIDocsConfig = {
      projectName: path.basename(targetDir),
      template: 'react-ts',
      includeSkills: true
    };
    
    const content = await generateAIDocs(targetDir, config);
    await fs.writeFile(outputPath, content, 'utf-8');
    
    spinner.succeed(chalk.green(`文档已生成: ${options.output}`));
    
  } catch (error) {
    spinner.fail(chalk.red('文档生成失败'));
    throw error;
  }
}

/**
 * 列出所有可用的技能
 */
export async function listSkills(): Promise<void> {
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
  
  console.log('\n' + chalk.bold('可用的技能：'));
  console.log('─'.repeat(60));
  
  for (const skill of skills) {
    console.log(chalk.cyan(`  ${skill.name}`));
    console.log(`    ${chalk.gray('描述：')}${skill.description}`);
    console.log(`    ${chalk.gray('触发：')}${skill.trigger}`);
    console.log('');
  }
  
  console.log('─'.repeat(60));
  console.log(chalk.gray('使用方式：在对话中触发相应场景，AI会自动加载对应技能'));
}

/**
 * 生成忽略规则文件
 */
async function generateIgnoreRules(targetDir: string): Promise<void> {
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
  await fs.writeFile(
    path.join(targetDir, 'opencode.json'),
    JSON.stringify(opencodeConfig, null, 2),
    'utf-8'
  );
}
