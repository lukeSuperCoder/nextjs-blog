# Repository Guidelines

## 项目结构与模块组织

- `src/app/`：Next.js App Router 页面与路由（推荐将页面逻辑放在这里）。
- `src/components/`：可复用 UI 组件（优先小组件、可组合）。
- `src/lib/`：服务端/客户端通用工具、数据访问封装（例如鉴权、数据库调用）。
- `src/types/`：共享类型定义。
- `prisma/`：数据库 schema、迁移与种子数据脚本。
- `public/`：静态资源。
- `docs/`：补充文档与说明。

## 构建、测试与开发命令

使用 npm（仓库包含 `package-lock.json`）：

- `npm run dev`：本地开发（默认 `http://localhost:3000`）。
- `npm run build`：生产构建。
- `npm run start`：运行生产构建产物。
- `npm run lint`：运行 Next.js ESLint 规则。
- `npm run format`：Prettier 格式化（覆盖 `js/ts/json/css/md`）。

数据库（Prisma）：

- `npm run db:generate`：生成 Prisma Client。
- `npm run db:push`：将 schema 推送到数据库（适合原型阶段）。
- `npm run db:migrate`：创建/应用迁移（推荐团队协作）。
- `npm run db:studio`：打开 Prisma Studio。
- `npm run db:seed`：执行 `prisma/seed.ts` 初始化数据。

## 代码风格与命名约定

- 缩进：2 空格（由 Prettier 统一处理）。
- TypeScript：开启 `strict`（见 `tsconfig.json`），避免 `any`。
- 导入别名：使用 `@/*` 指向 `src/*`，例如 `import { x } from "@/lib/x"`。
- 命名：组件用 `PascalCase`，变量/函数用 `camelCase`，常量用 `UPPER_SNAKE_CASE`。

## 架构概览（快速上手）

- Next.js（App Router）代码主要集中在 `src/app/`，优先使用 Server Components；需要交互时再使用 Client Components。
- 鉴权与用户相关逻辑通常与 NextAuth + Prisma 绑定；新增字段时同步更新 `prisma/schema.prisma` 与相关类型/表单校验。
- 公共工具优先放在 `src/lib/`，避免在页面里直接写重复的数据库/鉴权逻辑。

## 测试指南

当前未配置专用测试框架（无 `jest/vitest/playwright` 配置）。如新增测试：
- 单元测试建议放在同目录 `__tests__/` 或 `*.test.ts(x)`。
- 提交前至少保证 `npm run lint` 与 `npm run build` 通过。

## 提交与 Pull Request 规范

- 提交信息遵循 Conventional Commits 风格：`feat: ...`、`fix: ...`（本仓库历史已有该模式）。
- PR 需包含：变更说明、关联 Issue（如有）、关键页面截图/录屏（UI 变更时）、数据库变更说明（Prisma 迁移/seed 影响）。

## 配置与安全提示

- 本地配置放在 `.env.local`，不要提交真实密钥；以 `.env.example` 作为模板同步字段。
- 变更鉴权/跨域相关配置时，同时检查 `next.config.mjs` 的 `serverActions.allowedOrigins` 与部署环境域名。

## Agent 协作提示（给 Codex / 自动化改动）

- 优先小步提交：一次 PR 聚焦一个主题（UI / 数据库 / 鉴权）并写清回归点。
- 修改依赖或 Prisma schema 后，建议本地跑：`npm run lint && npm run build && npm run db:generate`。
