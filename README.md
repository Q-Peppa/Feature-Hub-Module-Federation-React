# Feature Hub + Module Federation + React@19

基于 [Feature Hub](https://github.com/feature-hub/feature-hub) 的 Module Federation 演示项目，展示如何使用 Feature Hub 框架实现微前端架构。

## 项目结构

```
src/
├── index.tsx      # 集成器入口文件，包含 Feature Hub 设置
├── feature-app.tsx # 远程 Feature App 定义
└── App.tsx        # 远程 Feature App UI 组件
```

## 快速开始

### 1. 安装依赖（使用 pnpm）

```bash
pnpm bootstrap
```

### 2. 启动开发服务器

```bash
pnpm start
```

访问 http://localhost:9000 查看演示应用。

## 可用命令

```bash
pnpm start          # 启动开发服务器 (http://localhost:9000)
pnpm build          # 生产环境构建
pnpm type-check     # 运行 TypeScript 类型检查
pnpm lint           # 运行 ESLint
pnpm lint:fix       # 自动修复 ESLint 问题
pnpm format         # 格式化代码 (Prettier)
pnpm format:check   # 检查代码格式
pnpm ci             # CI 流程 (lint + format + type-check)
```

## 参考资料

- [Feature Hub 官方文档](https://feature-hub.io/)
- [Feature Hub GitHub](https://github.com/feature-hub/feature-hub)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
