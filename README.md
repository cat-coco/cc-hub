# ClaudeCode Hub

面向中国开发者的 Claude Code 技术学习社区。基于 Claude Design 交付的 HTML/CSS/JS 原型，使用 React 18 + TypeScript + Vite 实现的高保真多页面站点。

## 技术栈

- React 18 + TypeScript 5
- Vite 5 构建
- React Router v6 多页路由
- 原生 CSS（tokens.css 设计变量，支持 Tweaks 圆角主题切换）

## 项目结构

```
src/
├── main.tsx              # 入口 + Router 挂载
├── App.tsx               # 路由声明
├── styles/
│   ├── tokens.css        # 设计令牌（陶土红 + 米白 · 来自 Claude Design 原型）
│   └── *.css             # 各页面样式
├── components/
│   ├── Layout.tsx        # 顶部导航 + 页脚 + Tweaks 组合
│   ├── Nav.tsx           # 前台顶部导航栏
│   ├── Footer.tsx        # 前台页脚
│   ├── Tweaks.tsx        # 右下角圆角风格切换面板
│   ├── Icon.tsx          # SVG 图标包装
│   └── AdminSidebar.tsx  # 后台侧边栏
└── pages/
    ├── IndexPage.tsx            # /            原型导航
    ├── HomePage.tsx             # /home        首页
    ├── ArticlesPage.tsx         # /articles    文章列表
    ├── ArticlePage.tsx          # /article     文章详情
    ├── CasesPage.tsx            # /cases       实战案例馆
    ├── SnippetsPage.tsx         # /snippets    代码片段
    ├── ToolsPage.tsx            # /tools       工具导航
    ├── LoginPage.tsx            # /login       登录 / 注册
    ├── ProfilePage.tsx          # /profile     个人中心
    ├── SearchPage.tsx           # /search      搜索结果
    ├── AdminDashboardPage.tsx   # /admin/dashboard 后台仪表盘
    └── AdminEditorPage.tsx      # /admin/editor    文章编辑器
```

## 设计系统

来自 Claude Design 原创配色，**砖红 `#B54A3A` + 米白 `#F7F2EA`** 暖色系；字体使用系统中文栈（PingFang SC / HarmonyOS / 苹方 / 微软雅黑）；支持三档圆角切换（尖锐 / 柔和 / 圆润）——右下角 Tweaks 面板可实时预览。

所有设计令牌集中定义在 `src/styles/tokens.css`，与原始原型的 `tokens.css` 完全一致。

## 开发

```bash
npm install
npm run dev      # 本地 http://localhost:5173
npm run build    # 产物写入 dist/
npm run preview  # 本地预览构建产物
```

## 路由

进入 `/` 为原型导航页，可跳转到所有页面。单页面直接访问路由即可，如 `/home`、`/articles`、`/article`、`/admin/editor` 等。

## 关于实现

这一轮实现专注于 **设计还原**：把 Claude Design 提供的 11 个 HTML 原型逐页映射为独立的 React 组件，保留原始的 CSS 结构、变量、布局与动效。后端接入、数据取数、登录鉴权、编辑器富文本能力等按需求文档 (`chats/chat1.md`) 中的规划属于后续迭代，不在本轮还原范围。
