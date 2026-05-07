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
export declare function init(options: InitOptions): Promise<void>;
/**
 * 生成AI工程化说明文档
 */
export declare function generateDocs(options: GenerateDocsOptions): Promise<void>;
/**
 * 列出所有可用的技能
 */
export declare function listSkills(): Promise<void>;
//# sourceMappingURL=cli.d.ts.map