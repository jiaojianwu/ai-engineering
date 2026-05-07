# 代码处理检查清单

## 强制检查流程

**每次处理代码前必须执行，无条件遵守：**

### 1. 确定文件类型和路径
- 确认要处理的文件属于以下哪种类型
- 记录文件的完整路径和文件名

### 2. 判断是否需要强制读取 docs.md

**关键判定：目标文件名是否为 `index.tsx` 或 `index.ts`**

```
目标文件: src/pages/TagManage/index.tsx
文件名: index.tsx → ✅ 强制检查同级 docs.md

目标文件: src/hooks/usePaginationConfig.tsx
文件名: usePaginationConfig.tsx → ❌ 不强制检查 docs.md，读取文件头部 JSDoc/注释即可
```

#### 2a. 文件名为 index → 强制检查 docs.md
- 使用 Read 工具检查目标文件**同级目录**下是否存在 `docs.md`
- **如果存在**：必须先读取完整的 `docs.md` 内容
- **如果不存在**：记录"此模块缺少 docs.md"，然后读取目标文件头部 JSDoc/注释，开发完成后询问是否需要补全文档

#### 2b. 文件名不是 index → 降级读取 JSDoc/注释
- 不强制查找 `docs.md`
- 直接读取目标文件，关注文件头部的 JSDoc/注释或业务说明
- 如果同目录下恰好存在 `docs.md`，可主动读取作为补充参考

### 3. 读取相关文档
- 如果强制/主动读取了 `docs.md`：仔细阅读文档中的业务需求、技术要求、使用说明
- 如果读取了 JSDoc/注释：关注函数签名、参数说明、业务约束
- 根据文档内容制定具体的实现方案

### 4. 开始代码处理
- 只有完成以上步骤后，才能开始编写或修改代码
- 在处理过程中严格遵守文档中的所有要求

## 强制文档读取规则表

| 文件类型 | 典型路径 | 文件名 | docs.md 位置示例 | 强制检查 |
| -------- | -------- | ------ | ---------------- | -------- |
| 页面 | `src/pages/**/` | `index.tsx` | `src/pages/TagManage/docs.md` | ✅ 是 |
| 组件 | `src/components/**/` | `index.tsx` | `src/components/ArkModal/docs.md` | ✅ 是 |
| Hooks（目录） | `src/hooks/useXxx/` | `index.tsx` | `src/hooks/useQueryParams/docs.md` | ✅ 是 |
| Hooks（扁平） | `src/hooks/` | `useXxx.tsx` | 无 | ❌ 否 |
| 工具函数 | `src/utils/` | `xxx.ts` | 无 | ❌ 否 |
| Services | `src/services/` | `xxx.ts` | 无 | ❌ 否 |

## 严重警告

**违反上述文档检查规则属于严重失误，会导致：**

1. 代码不符合实际业务需求
2. 遗漏重要的技术要求和约束
3. 产生不可预知的 bug
4. 浪费开发和调试时间

## 特殊技能调用

**如果用户要求写 `说明文档/技术文档`，触发 `code-documentation-expert` 技能（触发条件详见 `file-priority.md`）**

**调用前注意**：该技能对非 `index.tsx` 文件会触发**文件移动和目录重构**（将 `Foo.tsx` 变为 `Foo/index.tsx`），涉及引用路径变更。执行前需评估影响面并告知用户。
