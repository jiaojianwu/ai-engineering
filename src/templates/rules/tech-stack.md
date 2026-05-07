# 技术栈

## 前端框架

- React 18 with TypeScript
- 构建工具: Vite 7 with SWC

## UI 组件库

- 优先使用 src/components/ 文件夹下的通用组件
- 其次使用 Ant Design 6
- 最后使用原生 HTML 元素

## 包管理器

- 使用 pnpm 作为包管理器

## 图标

- 优先使用 @hg-data/hg-web-icon
- 其次使用 @ant-design/icons
- 最后自行绘制 SVG 图标

## 状态管理

- Jotai 及其插件
- 本地状态: useState
- 全局状态: Jotai (存放在 src/stores/)
- 命名规范: xxxAtom

## 其他

- 路由: React Router DOM 7
- 样式: Less with CSS Modules
- Hooks: react-use
- 数据处理: lodash
- 请求管理: useSWR
- 日期处理: dayjs
- base64 转换工具: js-base64
- canvas 表格:vtable
