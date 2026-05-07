import { InitOptions } from '../cli';
/**
 * 确保目录存在
 */
export declare function ensureDir(dir: string): Promise<void>;
/**
 * 复制模板文件到目标目录
 */
export declare function copyTemplates(templatesDir: string, targetDir: string, options: InitOptions): Promise<void>;
/**
 * 生成 AGENTS.md 文件内容
 */
export declare function generateAgentsMd(options: InitOptions): string;
/**
 * 读取文件内容
 */
export declare function readFile(filePath: string): Promise<string>;
/**
 * 写入文件内容
 */
export declare function writeFile(filePath: string, content: string): Promise<void>;
/**
 * 检查文件是否存在
 */
export declare function fileExists(filePath: string): Promise<boolean>;
/**
 * 获取目录下的所有文件
 */
export declare function getFiles(dir: string): Promise<string[]>;
/**
 * 递归创建目录
 */
export declare function mkdirp(dir: string): Promise<void>;
/**
 * 删除目录
 */
export declare function rmrf(dir: string): Promise<void>;
/**
 * 复制文件或目录
 */
export declare function copy(src: string, dest: string): Promise<void>;
/**
 * 移动文件或目录
 */
export declare function move(src: string, dest: string): Promise<void>;
//# sourceMappingURL=file.d.ts.map