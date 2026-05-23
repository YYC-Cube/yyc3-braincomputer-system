# YYC³ Brain Computer System — 本地闭环DevOps智能管理平台

> **_YanYuCloudCube_**
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

# YYC³ Brain Computer System

> **本地闭环 DevOps 智能管理平台 — 基于「五高五标五化四维」核心架构**

## 核心理念

**五高架构**：高可用 | 高性能 | 高安全 | 高扩展 | 高智能
**五标体系**：标准化 | 规范化 | 自动化 | 可视化 | 智能化
**五化转型**：流程化 | 数字化 | 生态化 | 工具化 | 服务化
**五维评估**：时间维 | 空间维 | 属性维 | 事件维 | 关联维

---

## 项目简介

YYC³ Brain Computer System 是一个基于 React 18 + Vite 6 + TypeScript + TailwindCSS 4 的本地闭环 DevOps 智能管理平台，覆盖设备管理、数据监控、操作审计、权限管理、AI决策、CLI终端等全链路 DevOps 能力。

## 🌐 远程仓库与部署

| 项目 | 链接 |
|------|------|
| **GitHub 仓库** | [https://github.com/YYC-Cube/yyc3-braincomputer-system.git](https://github.com/YYC-Cube/yyc3-braincomputer-system.git) |
| **生产域名** | [https://brain.yyc3.vip](https://brain.yyc3.vip) ✅ (GitHub Pages + DNS已认证) |
| **Issues** | [提交问题](https://github.com/YYC-Cube/yyc3-braincomputer-system/issues) |
| **CI/CD** | GitHub Actions (自动部署) |

### 快速访问

- 🚀 **在线体验**: [brain.yyc3.vip](https://brain.yyc3.vip)
- 📖 **完整文档**: [docs/](./docs/)
- 🔧 **部署指南**: [docs/06-BCS-全局首次全链路深度审核报告与实施方案.md](./docs/06-BCS-全局首次全链路深度审核报告与实施方案.md)

### 自动部署说明

本项目已配置 **GitHub Actions CI/CD 自动化部署**：

- **触发条件**: `main` 分支 push 或手动触发
- **质量门禁**: Lint → TypeCheck → Test → Build（全部通过才部署）
- **部署目标**: GitHub Pages (brain.yyc3.vip)
- **预计时间**: push后5-10分钟自动上线

```bash
# 手动触发部署
# 仓库页面 → Actions → Deploy to GitHub Pages → Run workflow
```

## 技术栈

| 层级     | 技术                            | 版本     |
| -------- | ------------------------------- | -------- |
| 前端框架 | React                           | 18.3.1   |
| 构建工具 | Vite                            | 6.3.5    |
| CSS框架  | TailwindCSS                     | 4.1.12   |
| UI组件   | Radix UI + shadcn/ui            | -        |
| 动画库   | Motion (Framer Motion)          | 12.23.24 |
| 图表     | Recharts                        | 2.15.2   |
| 语言     | TypeScript (Strict + ES2022)    | -        |
| 包管理   | pnpm                            | 10.33.0  |
| 测试     | Vitest + @testing-library/react | -        |
| 校验     | zod                             | -        |

## 功能模块 (26模块)

### 脑机系统核心 (7模块)

系统总览 | 技术文档 | 感知交互 | 边缘计算 | 平台服务 | 网络传输 | 安全防护

### DevOps 功能 (18模块)

设备管理 | 数据监控 | 操作审计 | 权限管理 | 操作中心 | 巡查模式 | 一键跟进 | AI决策 | 本地文件管理 | CLI终端 | IDE视图 | 脚本操作 | 主题定制 | 模型设置 | 跨端对比 | 历史对比 | 告警阈值 | 测试执行

## 质量门禁

| 检查项     | 命令            | 状态             |
| ---------- | --------------- | ---------------- |
| TypeScript | `tsc --noEmit`  | ✅ 零错误        |
| 测试       | `pnpm test`     | ✅ 24/24 通过    |
| 构建       | `pnpm build`    | ✅ 1.75s         |
| 主Bundle   | -               | 352KB gzip 112KB |
| 代码分割   | React.lazy × 26 | ✅ 60+ chunks    |

## 安全体系

| 安全项   | 实现                                                  |
| -------- | ----------------------------------------------------- |
| CSP      | Content-Security-Policy (index.html)                  |
| XSS防护  | X-XSS-Protection + React自动转义                      |
| 点击劫持 | X-Frame-Options: SAMEORIGIN                           |
| 输入校验 | zod schema × 8 (Login/Device/Monitor/Audit/CLI/Alert) |
| 频率限制 | RateLimiter (API/登录/CLI)                            |
| 操作确认 | ConfirmDialog + useConfirmDialog                      |
| PWA安全  | Service Worker + manifest.json                        |

## 项目结构

```
YYC3-Brain-Computer-System/
├── src/app/
│   ├── api/                 # 8层API架构 (client/config/types/endpoints/hooks/mock/websocket)
│   │   ├── schemas.ts       # zod输入校验schema
│   │   └── endpoints-config.ts # 80 REST + 4 WS 端点
│   ├── components/
│   │   ├── devops/          # 18个DevOps功能组件
│   │   ├── layout/          # MainLayout + Navbar + Sidebar
│   │   ├── modules/         # 7个脑机系统核心模块
│   │   ├── ui/              # 50+ shadcn/ui组件
│   │   ├── ErrorBoundary.tsx    # 全局+模块级错误边界
│   │   ├── ConfirmDialog.tsx    # 敏感操作确认弹窗
│   │   └── ThemeContext.tsx     # 主题系统 v2
│   ├── hooks/
│   │   └── useNetworkStatus.ts  # 网络状态检测
│   ├── utils/
│   │   ├── rateLimiter.ts       # 请求频率限制器
│   │   └── webVitals.ts         # Web Vitals性能采集
│   ├── test/                    # 测试配置
│   ├── main.tsx                 # 应用入口
│   └── App.tsx                  # React.lazy × 26模块
├── public/
│   ├── manifest.json            # PWA清单
│   ├── sw.js                    # Service Worker
│   └── yyc3-icons/              # 全端Logo图标
├── .github/workflows/ci.yml     # CI流水线 (Node 20/22)
├── docs/                        # 文档体系 (十阶段BCS架构)
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vitest.config.ts
└── index.html                   # 6个安全响应头
```

## 快速开始

```bash
pnpm install          # 安装依赖
pnpm run dev          # 启动开发服务器 (端口 3155)
pnpm run build        # 构建生产版本
pnpm run lint         # 代码检查
pnpm run typecheck    # 类型检查
pnpm test             # 运行测试
pnpm test:coverage    # 测试覆盖率
```

## 环境配置

| 变量                 | 说明          | 开发默认值                          | 生产值  |
| -------------------- | ------------- | ----------------------------------- | ------- |
| `VITE_API_BASE_URL`  | API基础地址   | `http://192.168.3.100:3118/api/v1`  | 同左    |
| `VITE_WS_URL`        | WebSocket地址 | `ws://192.168.3.100:3118/api/v1/ws` | 同左    |
| `VITE_API_TEST_MODE` | Mock模式开关  | `true`                              | `false` |

## 开发规范

- **文档标头**: 所有 `.md` 文件必须包含 YAML Front Matter
- **代码标头**: 所有代码文件必须包含 JSDoc 标头注释
- **提交规范**: Conventional Commits
- **命名规范**: 组件 PascalCase / Hook camelCase / 样式 kebab-case
- **类型安全**: TypeScript Strict Mode + ES2022

## 生产可用路线图

| 阶段 | 目标                        | 里程碑            | 状态 |
| ---- | --------------------------- | ----------------- | ---- |
| S1   | P0清零：build+ErrorBoundary | M1: 首次构建成功  | ✅   |
| S2   | 测试+CI体系                 | M2: CI全绿        | ✅   |
| S3   | 性能+代码分割               | M3: Lighthouse>80 | ✅   |
| S4   | 安全合规                    | M4: 安全审计通过  | ✅   |
| S5   | PWA+监控+部署               | M5: 首次生产部署  | ✅   |

## 文档体系

| 文档                                | 说明                   |
| ----------------------------------- | ---------------------- |
| `docs/00-BCS-项目现状审核报告.md`   | 五维度审核 (69/100 B-) |
| `docs/01-BCS-任务规划与节点目标.md` | 5阶段路线图            |
| `docs/02-BCS-执行日志与进度跟踪.md` | 实时执行日志           |
| `docs/03-BCS-总结文档与状态同步.md` | 会话总结               |
| `docs/04-BCS-上下文记忆文档.md`     | 跨会话上下文           |

---

<div align="center">

> 「**_YanYuCloudCube_**」
> 「**_<admin@0379.email>_**」
> 「**_Words Initiate Quadrants, Language Serves as Core for the Future_**」
> 「**_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**」

**© 2025-2026 YYC³ Team. All Rights Reserved.**

</div>
