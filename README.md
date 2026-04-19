# ClaudeCode Hub

面向中国开发者的 Claude Code 技术学习社区。前端 React + TypeScript + Vite，后端 Spring Boot 3 Maven 多模块，支持 MySQL + Redis + RabbitMQ，本地开发可用 H2 内存库零依赖启动。

## 架构一览

```
cc-hub/
├── src/                         # C 端前端 (React 18 + TS 5 + Vite 5)
│   ├── api/                     # Axios + TanStack Query API 客户端
│   ├── components/              # Nav / Footer / Tweaks / RichEditor (Tiptap)
│   ├── pages/                   # 11 个页面，全部接入后端 API
│   ├── store/auth.ts            # Zustand 登录态
│   └── styles/                  # 设计令牌 + 每页 CSS
│
├── backend/                     # Spring Boot 3 Maven 多模块
│   ├── ch-common/               # 统一响应 R、异常、XSS 清洗、slug 工具、TraceIdFilter
│   ├── ch-security/             # Spring Security 6 + JWT 过滤器 + SecurityConfig
│   ├── ch-user/                 # 用户、注册 / 登录、角色
│   ├── ch-content/              # 文章 / 分类 / 标签 / Snippets / Showcase / Tool
│   ├── ch-interaction/          # 评论、点赞、收藏
│   ├── ch-qa/                   # 问答模块
│   ├── ch-stats/                # 运营仪表盘统计
│   ├── ch-notification/         # 站内通知
│   └── ch-web/                  # 主启动模块 (ChHubApplication)
│
├── db/
│   ├── schema-mysql.sql         # MySQL 8 完整 DDL (单文件，无迁移)
│   └── seed-mysql.sql           # 初始化数据 (角色 + admin + 6 个分类)
│
├── deploy/nginx.conf            # 前端 Nginx 配置 (API 反向代理到 backend)
├── Dockerfile.frontend          # 前端镜像 (node build + nginx)
├── backend/Dockerfile           # 后端镜像 (maven build + jre)
└── docker-compose.yml           # MySQL + Redis + RabbitMQ + backend + web
```

## 开发启动

### 方式 A：最快（H2 内存库，零依赖）

```bash
# 1. 后端
cd backend
mvn -DskipTests package
java -jar ch-web/target/ch-web.jar --spring.profiles.active=prod
# → http://localhost:8080  (Swagger UI 在 /swagger-ui.html)

# 2. 前端（另开终端）
npm install
npm run dev
# → http://localhost:5173  (Vite 代理 /api 到 8080)
```

默认管理员：`admin` / `ChangeMe123!` — **登录后请立即修改密码**。

### 方式 B：Docker Compose（MySQL + Redis + RabbitMQ）

```bash
docker compose up -d --build
# → http://localhost            (前端 + /api 反代)
# → http://localhost:15672      (RabbitMQ 管理, chhub / chhub_pwd)
```

首次启动 MySQL 会自动执行 `db/schema-mysql.sql` + `db/seed-mysql.sql`。

### 方式 C：外接 MySQL

单文件 schema，请先手动导入后再启动应用：

```bash
# 1. 导入结构 + 种子
mysql -h <host> -uchhub -p chhub < db/schema-mysql.sql
mysql -h <host> -uchhub -p chhub < db/seed-mysql.sql

# 2. 启动后端
export CH_DB_URL="jdbc:mysql://localhost:3306/chhub"
export CH_DB_USER=chhub
export CH_DB_PASSWORD=chhub_pwd
java -jar ch-web/target/ch-web.jar --spring.profiles.active=prod
```

> **说明**：schema 用一个文件管理，不再用 Flyway / Liquibase 迁移。修改表结构直接改 `db/schema-mysql.sql`，然后在空库上重跑；H2 dev 走 `backend/ch-web/src/main/resources/db/schema-h2.sql` 的等价版本。

## 核心接口（v1）

所有接口统一走 `{ code, message, data, traceId }` 响应。`code: 0` 表示成功。

### 认证
| Method | Path | 说明 |
| --- | --- | --- |
| POST | `/api/auth/register/email` | 邮箱注册（返回 token） |
| POST | `/api/auth/login/email` | 邮箱 / 用户名登录 |
| GET  | `/api/auth/me` | 当前用户（需 Bearer token） |
| POST | `/api/auth/logout` | 登出（前端清 token） |

### 内容
| Method | Path | 说明 |
| --- | --- | --- |
| GET  | `/api/articles` | 分页列表 (categoryId/tag/sort/page/size) |
| GET  | `/api/articles/hot` | 热门文章 |
| GET  | `/api/articles/{slugOrId}` | 详情（自动 +1 阅读） |
| GET  | `/api/articles/{id}/comments` | 评论树 |
| POST | `/api/articles/{id}/comments` | 发表评论（登录） |
| POST | `/api/articles/{id}/like` | 点赞 / 取消（登录） |
| POST | `/api/articles/{id}/collect` | 收藏 / 取消（登录） |
| GET  | `/api/categories` · `/api/tags` · `/api/tags/top` | 分类 & 标签 |
| GET  | `/api/snippets` · `/api/snippets/{id}` · POST `/copy` | Snippet CRUD + 复制计数 |
| GET  | `/api/cases` · `/api/cases/top` | 实战案例 |
| GET  | `/api/tools` · `/api/tools/grouped` | 工具导航 |
| GET  | `/api/search?q=&type=` | 跨类型聚合搜索 |

### 后台（需 `ROLE_ADMIN` 或 `ROLE_SUPER_ADMIN`）
| Method | Path | 说明 |
| --- | --- | --- |
| POST | `/api/admin/articles` | 创建文章 (Markdown) |
| PUT  | `/api/admin/articles/{id}` | 更新文章（自动写历史版本） |
| DELETE | `/api/admin/articles/{id}` | 删除文章 |
| GET  | `/api/admin/articles/{id}/versions` | 文章版本列表 |
| GET  | `/api/admin/stats/dashboard` | 仪表盘数据 |

Swagger UI：`http://localhost:8080/swagger-ui.html`

## 前端页面与数据流

| 页面 | 路由 | 数据来源 |
| --- | --- | --- |
| 首页 | `/home` | `/api/stats/public/overview` + `/api/articles` + `/api/articles/hot` + `/api/tags/top` + `/api/cases/top` |
| 文章列表 | `/articles` | `/api/articles` + `/api/categories` + `/api/tags` |
| 文章详情 | `/article/:slug` | `/api/articles/:slug` + `/api/articles/:id/comments` + 互动 |
| 实战案例 | `/cases` | `/api/cases` |
| Snippets | `/snippets` | `/api/snippets` + 复制计数 |
| 工具导航 | `/tools` | `/api/tools/grouped` |
| 登录 / 注册 | `/login` | `/api/auth/register/email` · `/login/email` |
| 个人中心 | `/profile` | `/api/auth/me` |
| 搜索 | `/search?q=` | `/api/search` |
| 后台仪表盘 | `/admin/dashboard` | `/api/admin/stats/dashboard` |
| 文章编辑器 | `/admin/editor` · `/admin/editor/:id` | `/api/admin/articles` + `/api/categories` + Tiptap WYSIWYG |

## 编辑器（三模式）

`/admin/editor` 支持三种编辑模式，统一以 **Markdown** 为底层存储：

- **WYSIWYG**：Tiptap + StarterKit + CodeBlockLowlight（自动语法高亮）+ Link + Placeholder
- **分栏 Markdown**：左原文 / 右 `react-markdown` + `remark-gfm` + `rehype-highlight` 实时渲染
- **HTML 源码**：可直接粘贴已有 HTML，切回其他模式会重新转换为 Markdown

每 10 秒 `localStorage` 自动保存草稿；点击“发布”时调用 `/api/admin/articles` 并写入 `article_version` 历史版本。

## 安全与约束

- 密码使用 BCrypt 强度 12。
- XSS：用户评论 / 文章 HTML 通过 OWASP Java HTML Sanitizer 清洗。
- JWT：HS384 签名，默认 TTL 7 天，前端存 localStorage。
- CORS：开发环境允许所有来源，生产部署请收紧 `SecurityConfig#corsSource`。
- Trace：每个请求生成 `X-Trace-Id` 并注入 `MDC`，响应头回带便于排障。

## 接下来的扩展方向

- OAuth：GitHub / 微信扫码（已在 LoginPage 留 UI 位）
- 图片上传：阿里云 OSS / MinIO（ch-storage 接口）
- 实时通知：Spring WebSocket + STOMP + RabbitMQ 消费者
- PV/UV 采集：RabbitMQ 投递 + Redis HyperLogLog + visit_log 分区
- 搜索升级：当文章数超过 10 万时切到 Elasticsearch

## 技术栈

- **前端**：React 18 · TypeScript 5 · Vite 5 · React Router v6 · TanStack Query 5 · Axios · Zustand · Tiptap 2 · react-markdown + remark-gfm + rehype-highlight · lowlight
- **后端**：Java 17 · Spring Boot 3.2 · Spring Security 6 · MyBatis-Plus 3.5 · JJWT 0.12 · SpringDoc OpenAPI 3 · OWASP Html Sanitizer · H2 (dev) / MySQL 8 (prod)
- **部署**：Docker + docker-compose · Nginx 反向代理
