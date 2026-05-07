#!/usr/bin/env node

'use strict';

const { Command } = require('commander');
const chalk = require('chalk');
const pkg = require('../package.json');

const program = new Command();

program
  .name('ai-rule-init')
  .description('AI工程化配置生成器 - 为React+TypeScript项目生成标准化的AI开发助手配置')
  .version(pkg.version);

program
  .command('init')
  .description('初始化AI工程化配置')
  .option('-d, --dir <dir>', '目标目录', '.')
  .option('-t, --template <template>', '模板类型 (react-ts|react-js|vue-ts|vue-js)', 'react-ts')
  .option('-f, --force', '强制覆盖已有文件', false)
  .option('--no-docs', '跳过文档生成')
  .option('--no-skills', '跳过技能文件生成')
  .action(async (options) => {
    try {
      const { init } = require('../dist/cli');
      await init(options);
    } catch (error) {
      console.error(chalk.red('初始化失败:'), error.message);
      process.exit(1);
    }
  });

program
  .command('generate-docs')
  .description('生成AI工程化说明文档')
  .option('-d, --dir <dir>', '目标目录', '.')
  .option('-o, --output <output>', '输出文件名', 'AI_ENGINEERING.md')
  .action(async (options) => {
    try {
      const { generateDocs } = require('../dist/cli');
      await generateDocs(options);
    } catch (error) {
      console.error(chalk.red('文档生成失败:'), error.message);
      process.exit(1);
    }
  });

program
  .command('list-skills')
  .description('列出所有可用的技能')
  .action(async () => {
    try {
      const { listSkills } = require('../dist/cli');
      await listSkills();
    } catch (error) {
      console.error(chalk.red('获取技能列表失败:'), error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
