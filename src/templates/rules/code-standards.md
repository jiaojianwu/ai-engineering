# 代码规范

> **职责说明**：本文件定义代码风格和模板规范。React 性能优化（memo/useCallback 等）见 `react-performance-optimization` skill。

## 通用规范

- 遵守 prettier 以及 .prettierrc设定的规范

## React 组件规范

- 使用函数式组件和 Hooks
- 组件命名导出: `export function ComponentName() {}`
- 组件定义后边加展示名: `ComponentName.displayName = 'ComponentName'`
- 组件职责单一
- 一个文件内只定义一个组件
- 保持文件精简（200-300行以内）
- **注释**：仅在用户要求时添加注释
- **状态处理**：API 请求需要 loading 状态

## 安全最佳实践

- 在非富文本编辑器内容设置场景下，避免使用 dangerouslySetInnerHTML
- 对用户输入进行严格验证
- 不在前端存储敏感信息
- 定期更新依赖，使用 pnpm audit 检查漏洞

---

## 代码生成模板

### 目录结构

#### 创建新组件

```
src/components/ComponentName/
├── index.tsx           # 组件主文件
├── index.module.less   # 样式文件
├── types.ts           # 类型定义（如需要）
└── index.ts           # 导出文件
```

#### 创建新页面

```
src/pages/PageName/
├── index.tsx
├── index.module.less
└── index.ts
```

然后使用 react router(data mode) 在 `src/routes.tsx` 中添加路由。

```javascript
/**
*空间级项目添加路由示例
*需要用 ProjectEntryPage 组件包裹,并提供 accessKey 作为入参
*填写path路由名称
*/
...
 {
   path: "[pathName]",
   element: (
   <ProjectEntryPage
   		accessKey="[accessKey]"
   		emptyDescription="该空间下暂无实收率管理项目"
   >
     	<ModeNeme />
   </ProjectEntryPage>
            ),
  }
...

/**
* 非空间级项目添加路由示例
* 填写path名称
*/
 {
   path: "[pathName]",
   element: <ModeNeme />
  }
...
```



#### API 服务

```
// 使用 import { request } from "@/utils/request"
src/services/
├── serviceName.ts     # 服务实现
└── mock/             # Mock 数据
```

### TypeScript 类型定义

```typescript
// 优先使用 type
type User = {
    id: string
    name: string
}

// interface 用于可能需要扩展的对象
interface UserService {
    getUser(id: string): Promise<User>
}

// 函数显式返回类型
export function getUserName(user: User): string {
    return user.name
}

// 使用 import type
import type { User } from "@/types"
```

### React 组件模板

```typescript
import type { FC } from 'react';
import styles from './index.module.less';

export interface ComponentNameProps {
  title: string;
  onAction: (id: string) => void;
}

export function ComponentName({ title, onAction }: ComponentNameProps) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
    </div>
  );
}

ComponentName.displayName = 'ComponentName';
```

> **性能优化提示**：如需使用 useMemo/useCallback，详见 `react-performance-optimization` skill。

### 样式编写

```less
// ComponentName/index.module.less
.container {
    padding: 16px;

    .title {
        font-size: 16px;
        font-weight: 600;
    }

    // 使用 @hg-data/ark-components 主题令牌
    .button {
        background-color: @primary-color;

        &:hover {
            background-color: darken(@primary-color, 10%);
        }
    }
}
```

---

## 自动化检查命令

```bash
# 代码检查
pnpm run lint

# 类型检查并修复
pnpm run lint:fix

# typescript类型检查

pnpm run tsc
```
