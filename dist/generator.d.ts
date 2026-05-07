export interface AIDocsConfig {
    projectName: string;
    template: 'react-ts' | 'react-js' | 'vue-ts' | 'vue-js';
    includeSkills: boolean;
}
/**
 * 生成AI工程化说明文档
 */
export declare function generateAIDocs(targetDir: string, config: AIDocsConfig): Promise<string>;
//# sourceMappingURL=generator.d.ts.map