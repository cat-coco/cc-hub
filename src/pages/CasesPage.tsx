import Layout from '../components/Layout';
import '../styles/cases.css';

interface Case {
  tag: string;
  title: string;
  desc?: string;
  stack?: string[];
  authorInitial: string;
  author: string;
  stars: string;
  brand?: boolean;
  height: 'h-short' | 'h-mid' | 'h-tall';
  aspectLabel: string;
}

const CASES: Case[] = [
  {
    tag: 'ENTERPRISE',
    title: '企业知识库 Agent：接入飞书 + 内部 Wiki',
    desc: '对接 12 种内部系统的 Agent，日均处理 3,200 次提问，替代 60% 的内部 IT 工单。',
    stack: ['TypeScript', 'MCP', 'Redis'],
    authorInitial: 'Z', author: '张未未', stars: '★ 482',
    brand: true, height: 'h-tall', aspectLabel: 'project screenshot · 4:5',
  },
  {
    tag: 'DEV TOOLS', title: 'Code Review Bot',
    desc: '接入 GitLab 流水线，每周节省 40 人时。',
    stack: ['Python', 'GitLab CI'],
    authorInitial: 'L', author: '林秋白', stars: '★ 318',
    height: 'h-short', aspectLabel: 'project screenshot · 4:3',
  },
  {
    tag: 'AGENT', title: 'SQL 智能助手：让产品经理自己写报表',
    desc: '通过受控 MCP 接入只读数据库，一周上线，解放了数据团队 70% 的临时需求。',
    stack: ['Go', 'PostgreSQL', 'MCP'],
    authorInitial: 'W', author: '吴桥', stars: '★ 276',
    height: 'h-mid', aspectLabel: 'project screenshot',
  },
  {
    tag: 'MCP SERVER', title: 'Notion MCP Server：双向同步你的笔记',
    desc: '支持增量同步、冲突解决、版本历史。开源两周 GitHub 1.2k star。',
    stack: ['TypeScript', 'Notion API'],
    authorInitial: 'S', author: '宋行', stars: '★ 1,204',
    height: 'h-mid', aspectLabel: 'project screenshot',
  },
  {
    tag: 'PERSONAL', title: '用 Claude 重写了我 5 年前的毕业设计',
    desc: '从 PHP 4 重构到现代 TypeScript 全栈，周末两天完成。',
    authorInitial: 'H', author: '何迁', stars: '★ 892',
    brand: true, height: 'h-short', aspectLabel: 'project screenshot',
  },
  {
    tag: 'OPEN SOURCE', title: 'claude-review-action：一个轻量的 PR 审查 Action',
    desc: 'GitHub Actions 里只需要 6 行 YAML。支持自定义规则、中文评审报告、增量 review。',
    stack: ['TypeScript', 'GitHub Actions', 'Docker'],
    authorInitial: 'Y', author: '余声', stars: '★ 642',
    height: 'h-tall', aspectLabel: 'project screenshot · 4:5',
  },
  {
    tag: 'ENTERPRISE', title: '内部测试用例生成平台',
    desc: '把团队的测试覆盖率从 42% 提到 78%。',
    stack: ['Java', 'JUnit'],
    authorInitial: 'C', author: '陈果', stars: '★ 421',
    height: 'h-mid', aspectLabel: 'project screenshot',
  },
  {
    tag: 'AGENT', title: '值班机器人',
    desc: '接入监控告警，自动定位并修复 70% 的常见问题。',
    authorInitial: 'Z', author: '张未未', stars: '★ 531',
    height: 'h-short', aspectLabel: 'project screenshot',
  },
  {
    tag: 'OPEN SOURCE', title: 'claude-doc：把代码注释批量升级为 TSDoc',
    desc: '一条命令跑完整个仓库。保留原始风格，支持自定义模板。已被 40+ 团队集成到 CI。',
    stack: ['Node.js', 'CLI'],
    authorInitial: 'L', author: '林秋白', stars: '★ 1,876',
    height: 'h-tall', aspectLabel: 'project screenshot · 4:5',
  },
];

export default function CasesPage() {
  return (
    <Layout active="cases">
      <main className="container">
        <div className="cases-head">
          <h1>实战案例馆</h1>
          <p>416 个真实项目，完整的技术决策过程与代码。从个人工具到服务百万用户的系统。</p>
          <div className="cases-filters">
            <span className="chip chip-active">全部</span>
            <span className="chip">企业应用</span>
            <span className="chip">开发工具</span>
            <span className="chip">Agent</span>
            <span className="chip">MCP 服务</span>
            <span className="chip">开源项目</span>
            <span className="chip">个人项目</span>
            <div className="cases-filters-right">
              <span className="chip chip-active">最新</span>
              <span className="chip">最热</span>
            </div>
          </div>
        </div>

        <div className="masonry">
          {CASES.map((c) => (
            <a className="masonry-case" href="#" key={c.title}>
              <div className={`ph ${c.brand ? 'ph-brand' : ''} ${c.height}`}>{c.aspectLabel}</div>
              <div className="case-body">
                <span className="c-tag">{c.tag}</span>
                <h3 className="c-title">{c.title}</h3>
                {c.desc && <p className="c-desc">{c.desc}</p>}
                {c.stack && (
                  <div className="c-stack">
                    {c.stack.map((s) => <span className="tag" key={s}>{s}</span>)}
                  </div>
                )}
                <div className="c-foot">
                  <span className="ava">{c.authorInitial}</span>
                  <span>{c.author}</span>
                  <span className="sp" />
                  <span>{c.stars}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </Layout>
  );
}
