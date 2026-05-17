# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `apps/api`: a [Hono](https://hono.dev/) API on Cloudflare Workers (`@repo/api`)
- `apps/web`: a [Next.js](https://nextjs.org/) app (port 3000)
- `apps/admin`: a [Next.js](https://nextjs.org/) app (port 3001)
- `@repo/contracts`: shared request/response types, zod schemas, and envelope helpers
- `@repo/ui`: shared React component library (Button, Card, Input, Label, Badge, etc.)
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Zod](https://zod.dev/) for runtime schema validation (shared contracts)
- [Hono RPC](https://hono.dev/docs/guides/rpc) for typed API communication

### Build

To build all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo build
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo build
pnpm dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=docs
```

Without global `turbo`:

```sh
npx turbo build --filter=docs
pnpm exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
pnpm exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=web
```

Without global `turbo`:

```sh
npx turbo dev --filter=web
pnpm exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
pnpm exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
pnpm exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)

## Design System Constraints

页面代码必须遵守以下约束，避免样式体系被打散。

### 颜色约束

- 页面代码不直接写 `#xxxxxx` 或 `rgba(...)`，先补充 token
- 文本颜色优先使用 `content-*`
- 背景颜色优先使用 `surface-*`
- 风险、成功、警告等反馈统一使用 `state-*`

### 组件约束

- 主按钮、次按钮、风险按钮都从 `Button` 变体中选
- 表单容器优先用 `Card` 组合，不重新手写面板结构
- 标签和状态优先用 `Badge`，不临时拼一段颜色 class
- 表单标签和输入框配对使用 `Label` + `Input`

### 扩展约束

- 新增颜色、圆角、阴影，先更新 `theme.css`
- 新增组件变体，优先扩展共享组件
- 页面局部特殊样式要有明确原因，避免把例外写成常态

## Contract & RPC 约定

API 与前端之间通过共享 contract 通信，类型和 schema 统一定义在 `packages/contracts`。

### 架构分层

```
packages/contracts   共享类型、schema、envelope helper（@repo/contracts）
apps/api/src/app.ts  路由定义、入参校验、错误处理、导出 AppType
apps/api/src/index.ts  仅 re-export app（Cloudflare Workers 入口）
apps/web             通过 hc<AppType>() 消费 API route 类型
```

### 共享 contract 只放跨端稳定约定

`packages/contracts` 中只包含以下内容：

- 业务异常码 `BizCode`
- 统一响应元信息 `ApiMeta`
- 成功结构 `ApiSuccess<T>` / 失败结构 `ApiFailure<E>` / 总类型 `ApiResponse<T, E>`
- envelope helper：`buildSuccess` / `buildFailure`
- 最小链路的输入输出 schema（如 `PingRequestSchema` / `PingResponseSchema`）

不放业务实现、不放运行时逻辑。

### 输入输出必须有 schema

只写 TypeScript type 不够——type 只在编译期存在。所有跨端请求参数用 zod 定义 schema，API 侧用 schema 校验入参，前端侧复用同一份类型。

### 统一响应 envelope

接口返回值分为两层语义：

- **HTTP status**：传输层结果（200、400、404、500 …）
- **error.code**：业务语义（`BizCode` 枚举）

成功结构：`{ ok: true, data: T, meta: ApiMeta }`

失败结构：`{ ok: false, error: { code, message, details? }, meta: ApiMeta }`

`meta` 中的 `requestId` 用于日志串联，`timestamp` 用于排查定位。

### 业务异常码命名规范

采用 `DOMAIN.ACTION` 格式，当前定义：

| Code | 含义 |
|------|------|
| `COMMON.INVALID_REQUEST` | 请求参数校验失败 |
| `COMMON.NOT_FOUND` | 资源不存在 |
| `AUTH.UNAUTHORIZED` | 未认证 |
| `AUTH.FORBIDDEN` | 无权限 |
| `BIZ.CONFLICT` | 业务冲突 |
| `BIZ.RULE_VIOLATION` | 业务规则违反 |
| `SYSTEM.INTERNAL_ERROR` | 服务端内部错误 |
| `SYSTEM.UPSTREAM_TIMEOUT` | 上游超时 |

新增业务 route 时直接在此集合扩展，保持命名风格和职责边界稳定。

### 路由开发流程

新增业务接口按以下顺序：

1. 在 `packages/contracts` 补 schema 和类型
2. 在 `apps/api/src/app.ts` 补 route（含 `validator('json', ...)` 校验）
3. 前端通过 `hc<AppType>()` 消费，自动获得参数和返回值类型推导

### 错误处理

`apps/api/src/app.ts` 中统一处理三类异常：

- `AppError`：业务异常，携带 `BizCode` 和 HTTP status
- `HTTPException`：Hono 内置异常
- 未捕获异常：统一返回 `SYSTEM.INTERNAL_ERROR` + 500

`notFound` 处理器统一返回 `COMMON.NOT_FOUND` + 404。

### 前端 RPC 调用

前端使用 `hc<AppType>(apiBaseUrl)` 创建 typed client，通过 `client.rpc.system.ping.$post({ json })` 调用。调用失败时 fallback 到统一的 `ApiResponse` 错误结构。

不要过早抽象通用 rpcClient / fetcher / service layer——当前目标是验证方向，最小链路跑通后再按需抽取。
