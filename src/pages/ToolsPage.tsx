import Layout from '../components/Layout';
import '../styles/tools.css';

interface Tool {
  ico: string;
  name: string;
  ver: string;
  desc: string;
  tags: string[];
  foot: string[];
}

const MCP_TOOLS: Tool[] = [
  { ico: 'PG', name: 'postgres-mcp', ver: 'v1.4.2', desc: '只读 PostgreSQL 接入，支持 schema 查询、SQL 执行、结果格式化。', tags: ['#database', '#readonly'], foot: ['★ 12.4k', 'MIT'] },
  { ico: 'NT', name: 'notion-mcp', ver: 'v0.9.1', desc: '双向同步 Notion 笔记，支持增量、冲突解决、数据库视图。', tags: ['#note', '#sync'], foot: ['★ 8.2k', 'Apache-2.0'] },
  { ico: 'FL', name: 'feishu-mcp', ver: 'v2.1.0', desc: '接入飞书文档、多维表格、消息推送。支持多租户鉴权。', tags: ['#feishu', '#enterprise'], foot: ['★ 4.6k', 'MIT'] },
  { ico: 'GH', name: 'github-mcp', ver: 'v3.0.0', desc: '官方 GitHub MCP。仓库、Issue、PR、Actions 全覆盖。', tags: ['#github', '#official'], foot: ['★ 24.1k', 'MIT'] },
  { ico: 'SL', name: 'slack-mcp', ver: 'v1.2.7', desc: '读写 Slack 消息、频道管理、DM 推送。支持企业版 SSO。', tags: ['#chat'], foot: ['★ 3.1k', 'MIT'] },
  { ico: 'FS', name: 'filesystem-mcp', ver: 'v1.0.5', desc: '受控文件系统访问，白名单路径、readonly 模式。', tags: ['#core', '#sandbox'], foot: ['★ 18.7k', 'MIT'] },
];

const IDE_TOOLS: Tool[] = [
  { ico: 'VS', name: 'Claude Code for VS Code', ver: 'v0.14.3', desc: '官方 VS Code 扩展，原生侧边栏、差异预览、多 Agent 面板。', tags: ['#vscode', '#official'], foot: ['4M+ 安装'] },
  { ico: 'JB', name: 'Claude Code for JetBrains', ver: 'v0.8.1', desc: 'IntelliJ/PyCharm/GoLand 全家桶支持。', tags: ['#jetbrains'], foot: ['820k 安装'] },
  { ico: 'VI', name: 'claude.nvim', ver: 'v1.2.0', desc: 'Neovim 原生集成。Lua 配置，支持浮动窗口与 LSP 协同。', tags: ['#neovim'], foot: ['★ 6.4k'] },
];

const CLI_TOOLS: Tool[] = [
  { ico: 'CC', name: 'claude-code', ver: 'v1.8.0', desc: '官方 CLI。交互模式、pipe 模式、session 管理。', tags: ['#cli', '#official'], foot: ['★ 48.2k'] },
  { ico: 'CR', name: 'claude-review', ver: 'v0.6.2', desc: '把 git diff 输给 Claude 做审查，输出 markdown 评审报告。', tags: ['#review'], foot: ['★ 3.8k'] },
  { ico: 'CD', name: 'claude-doc', ver: 'v0.4.1', desc: '批量为代码补写 TSDoc / JSDoc / Javadoc 注释。', tags: ['#docs'], foot: ['★ 1.9k'] },
];

function ToolGrid({ tools }: { tools: Tool[] }) {
  return (
    <div className="tgrid">
      {tools.map((t) => (
        <a className="tool" href="#" key={t.name}>
          <div className="tool-ico">{t.ico}</div>
          <div className="tool-b">
            <div className="tool-name">
              <h3>{t.name}</h3>
              <span className="ver">{t.ver}</span>
            </div>
            <p className="tool-desc">{t.desc}</p>
            <div className="tool-tags">
              {t.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
            </div>
            <div className="tool-foot">
              {t.foot.map((f) => <span key={f}>{f}</span>)}
              <span className="sp" />
              <span className="tool-arr">↗</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Layout active="tools">
      <main className="container">
        <div className="tools-head">
          <h1>工具导航</h1>
          <p>264 款由社区精选与维护的 Claude Code 生态工具。MCP Server、IDE 扩展、CLI、Agent 模板、生产力脚本。</p>
          <div className="tools-filters">
            <span className="chip chip-active">全部</span>
            <span className="chip">MCP Servers</span>
            <span className="chip">IDE 扩展</span>
            <span className="chip">CLI 工具</span>
            <span className="chip">Agent 模板</span>
            <span className="chip">自动化脚本</span>
            <span className="chip">可视化面板</span>
          </div>
        </div>

        <section>
          <div className="tools-sec-h">
            <h2>MCP Servers</h2>
            <span className="cnt">· 98 款</span>
            <a className="more" href="#">查看全部 →</a>
          </div>
          <ToolGrid tools={MCP_TOOLS} />
        </section>

        <section>
          <div className="tools-sec-h">
            <h2>IDE 扩展</h2>
            <span className="cnt">· 42 款</span>
            <a className="more" href="#">查看全部 →</a>
          </div>
          <ToolGrid tools={IDE_TOOLS} />
        </section>

        <section>
          <div className="tools-sec-h">
            <h2>CLI 工具</h2>
            <span className="cnt">· 58 款</span>
            <a className="more" href="#">查看全部 →</a>
          </div>
          <ToolGrid tools={CLI_TOOLS} />
        </section>
      </main>
    </Layout>
  );
}
