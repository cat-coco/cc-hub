import { useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Icon from '../components/Icon';
import '../styles/admin.css';

interface TopArticle {
  rank: string;
  topRank?: boolean;
  title: string;
  author: string;
  cat: string;
  pv: string;
  likes: string;
  comments: string;
  trend: string;
  trendColor: string;
}

const TOP_ARTICLES: TopArticle[] = [
  { rank: '01', topRank: true, title: '把 CLAUDE.md 写到这个程度，团队新人上手只要一天', author: '陈果', cat: '最佳实践', pv: '12,428', likes: '892', comments: '137', trend: '0,14 10,12 20,10 30,6 40,8 50,4 60,2', trendColor: 'var(--success)' },
  { rank: '02', topRank: true, title: '我用 Claude Code 重写了自己 5 年前的毕业设计', author: '何迁', cat: '案例', pv: '9,842', likes: '621', comments: '94', trend: '0,12 10,14 20,8 30,10 40,6 50,5 60,3', trendColor: 'var(--success)' },
  { rank: '03', topRank: true, title: 'Subagent 到底怎么用才不是玩具？六个真实场景', author: '何迁', cat: '实战教学', pv: '8,126', likes: '512', comments: '78', trend: '0,10 10,12 20,8 30,10 40,8 50,6 60,5', trendColor: 'var(--success)' },
  { rank: '04', title: '用 Claude Code 重构一个十年历史的 Java 单体', author: '张未未', cat: '最佳实践', pv: '8,243', likes: '482', comments: '42', trend: '0,8 10,10 20,6 30,8 40,10 50,7 60,8', trendColor: 'var(--ink-3)' },
  { rank: '05', title: '一份被低估的 Prompt 审查 checklist', author: '宋行', cat: '最佳实践', pv: '6,341', likes: '398', comments: '56', trend: '0,6 10,8 20,10 30,8 40,12 50,10 60,12', trendColor: 'var(--danger)' },
  { rank: '06', title: 'Hook 机制读源码笔记（上）：生命周期与注入点', author: '余声', cat: '源码分析', pv: '5,712', likes: '346', comments: '38', trend: '0,12 10,10 20,11 30,8 40,9 50,7 60,6', trendColor: 'var(--success)' },
  { rank: '07', title: '读懂 MCP 协议：从握手到工具调用的一次完整走读', author: '林秋白', cat: '源码分析', pv: '5,412', likes: '328', comments: '42', trend: '0,10 10,12 20,8 30,6 40,10 50,8 60,9', trendColor: 'var(--ink-3)' },
  { rank: '08', title: '为什么我们放弃了 Copilot 切到 Claude Code', author: '李倚晓', cat: '技术洞察', pv: '4,912', likes: '284', comments: '71', trend: '0,8 10,10 20,8 30,6 40,8 50,5 60,7', trendColor: 'var(--ink-3)' },
];

export default function AdminDashboardPage() {
  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => document.body.classList.remove('admin-body');
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar active="dashboard" />

      <div className="amain">
        <div className="atop">
          <div className="admin-crumb">首页 / <b>仪表盘</b></div>
          <div className="atop-search">
            <Icon size="sm">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </Icon>
            全站搜索 ⌘K
          </div>
          <div className="atop-ico-wrap">
            <button type="button" className="atop-ico">
              <Icon size="md">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M9 19a3 3 0 0 0 6 0" />
              </Icon>
            </button>
            <span className="atop-ico-dot" />
          </div>
          <button type="button" className="atop-ico">
            <Icon size="md">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </Icon>
          </button>
          <span className="nav-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>Z</span>
        </div>

        <div className="acontent">
          <div className="aheader">
            <h1>仪表盘</h1>
            <span className="sub">社区运营概览 · 实时数据</span>
            <div className="range">
              <span className="chip">今日</span>
              <span className="chip chip-active">近 7 天</span>
              <span className="chip">近 30 天</span>
              <span className="chip">自定义</span>
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-lbl">
                <Icon size="sm">
                  <path d="M14 3v5h5M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                </Icon>
                总文章数
              </div>
              <div className="stat-num">2,847</div>
              <span className="stat-delta delta-up">↑ 38</span>
              <span className="stat-sub">vs 上周 · +1.3%</span>
            </div>
            <div className="stat">
              <div className="stat-lbl">
                <Icon size="sm"><path d="M12 5v14M5 12h14" /></Icon>
                今日新增
              </div>
              <div className="stat-num">14</div>
              <span className="stat-delta delta-up">↑ 2</span>
              <span className="stat-sub">vs 昨天</span>
            </div>
            <div className="stat">
              <div className="stat-lbl">
                <Icon size="sm">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                </Icon>
                总用户数
              </div>
              <div className="stat-num">38,592</div>
              <span className="stat-delta delta-up">↑ 412</span>
              <span className="stat-sub">vs 上周 · +1.1%</span>
            </div>
            <div className="stat">
              <div className="stat-lbl">
                <Icon size="sm">
                  <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                  <circle cx="12" cy="12" r="3" />
                </Icon>
                今日 PV
              </div>
              <div className="stat-num">87,214</div>
              <span className="stat-delta delta-down">↓ 3.2%</span>
              <span className="stat-sub">vs 昨天</span>
            </div>
          </div>

          <div className="grid-2">
            <div className="panel">
              <div className="panel-h">
                <h3>近 30 天流量</h3>
                <span className="muted">PV · UV</span>
                <div className="right">
                  <div className="legend">
                    <span><span className="legend-dot" style={{ background: 'var(--brand)' }} />PV</span>
                    <span><span className="legend-dot" style={{ background: '#446A7A' }} />UV</span>
                  </div>
                </div>
              </div>
              <svg viewBox="0 0 640 220" style={{ width: '100%', height: 220 }}>
                <g stroke="var(--line)" strokeWidth="1">
                  <line x1="40" y1="20" x2="640" y2="20" />
                  <line x1="40" y1="70" x2="640" y2="70" />
                  <line x1="40" y1="120" x2="640" y2="120" />
                  <line x1="40" y1="170" x2="640" y2="170" />
                  <line x1="40" y1="200" x2="640" y2="200" />
                </g>
                <g fill="var(--ink-4)" fontSize="10" fontFamily="ui-monospace,monospace" textAnchor="end">
                  <text x="34" y="24">100k</text>
                  <text x="34" y="74">75k</text>
                  <text x="34" y="124">50k</text>
                  <text x="34" y="174">25k</text>
                  <text x="34" y="204">0</text>
                </g>
                <path
                  d="M 40 160 L 60 155 L 80 140 L 100 145 L 120 130 L 140 125 L 160 115 L 180 110 L 200 105 L 220 90 L 240 95 L 260 85 L 280 70 L 300 80 L 320 65 L 340 55 L 360 70 L 380 60 L 400 45 L 420 55 L 440 40 L 460 50 L 480 35 L 500 45 L 520 30 L 540 40 L 560 25 L 580 35 L 600 20 L 620 30 L 620 200 L 40 200 Z"
                  fill="var(--brand)"
                  opacity="0.08"
                />
                <path
                  d="M 40 160 L 60 155 L 80 140 L 100 145 L 120 130 L 140 125 L 160 115 L 180 110 L 200 105 L 220 90 L 240 95 L 260 85 L 280 70 L 300 80 L 320 65 L 340 55 L 360 70 L 380 60 L 400 45 L 420 55 L 440 40 L 460 50 L 480 35 L 500 45 L 520 30 L 540 40 L 560 25 L 580 35 L 600 20 L 620 30"
                  fill="none"
                  stroke="var(--brand)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 40 180 L 60 178 L 80 170 L 100 175 L 120 168 L 140 165 L 160 160 L 180 158 L 200 155 L 220 148 L 240 150 L 260 145 L 280 138 L 300 142 L 320 135 L 340 130 L 360 138 L 380 132 L 400 125 L 420 130 L 440 122 L 460 128 L 480 120 L 500 125 L 520 118 L 540 123 L 560 115 L 580 120 L 600 112 L 620 118"
                  fill="none"
                  stroke="#446A7A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="3 3"
                />
                <g fill="var(--ink-4)" fontSize="10" fontFamily="ui-monospace,monospace" textAnchor="middle">
                  <text x="60" y="218">-29d</text>
                  <text x="200" y="218">-22d</text>
                  <text x="340" y="218">-15d</text>
                  <text x="480" y="218">-8d</text>
                  <text x="620" y="218">today</text>
                </g>
              </svg>
            </div>

            <div className="panel">
              <div className="panel-h">
                <h3>分类占比</h3>
                <span className="muted">按文章数</span>
              </div>
              <div className="pie-wrap">
                <svg viewBox="0 0 120 120" width="140" height="140">
                  <circle r="48" cx="60" cy="60" fill="transparent" stroke="var(--brand)" strokeWidth="24" strokeDasharray="90.5 210.5" transform="rotate(-90 60 60)" />
                  <circle r="48" cx="60" cy="60" fill="transparent" stroke="#C96547" strokeWidth="24" strokeDasharray="54.3 246.7" strokeDashoffset="-90.5" transform="rotate(-90 60 60)" />
                  <circle r="48" cx="60" cy="60" fill="transparent" stroke="#D88560" strokeWidth="24" strokeDasharray="45.2 255.8" strokeDashoffset="-144.8" transform="rotate(-90 60 60)" />
                  <circle r="48" cx="60" cy="60" fill="transparent" stroke="#446A7A" strokeWidth="24" strokeDasharray="36.2 264.8" strokeDashoffset="-190" transform="rotate(-90 60 60)" />
                  <circle r="48" cx="60" cy="60" fill="transparent" stroke="#4F7A4F" strokeWidth="24" strokeDasharray="30.2 270.8" strokeDashoffset="-226.2" transform="rotate(-90 60 60)" />
                  <circle r="48" cx="60" cy="60" fill="transparent" stroke="#B88824" strokeWidth="24" strokeDasharray="24.1 276.9" strokeDashoffset="-256.4" transform="rotate(-90 60 60)" />
                  <circle r="48" cx="60" cy="60" fill="transparent" stroke="var(--ink-3)" strokeWidth="24" strokeDasharray="21.1 279.9" strokeDashoffset="-280.5" transform="rotate(-90 60 60)" />
                </svg>
                <div className="pie-legend">
                  <div className="pie-item"><span className="dot" style={{ background: 'var(--brand)' }} />最佳实践<span className="pct">30%</span></div>
                  <div className="pie-item"><span className="dot" style={{ background: '#C96547' }} />实战教学<span className="pct">18%</span></div>
                  <div className="pie-item"><span className="dot" style={{ background: '#D88560' }} />问答<span className="pct">15%</span></div>
                  <div className="pie-item"><span className="dot" style={{ background: '#446A7A' }} />技术洞察<span className="pct">12%</span></div>
                  <div className="pie-item"><span className="dot" style={{ background: '#4F7A4F' }} />源码分析<span className="pct">10%</span></div>
                  <div className="pie-item"><span className="dot" style={{ background: '#B88824' }} />案例<span className="pct">8%</span></div>
                  <div className="pie-item"><span className="dot" style={{ background: 'var(--ink-3)' }} />其他<span className="pct">7%</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h">
              <h3>热门文章 Top 10</h3>
              <span className="muted">近 7 天</span>
              <div className="right">
                <button type="button" className="chip">导出</button>
                <button type="button" className="chip">刷新</button>
              </div>
            </div>
            <table className="atable">
              <thead>
                <tr>
                  <th className="rank">#</th>
                  <th>标题</th>
                  <th>作者</th>
                  <th>分类</th>
                  <th style={{ textAlign: 'right' }}>PV</th>
                  <th style={{ textAlign: 'right' }}>点赞</th>
                  <th style={{ textAlign: 'right' }}>评论</th>
                  <th style={{ width: 80 }}>趋势</th>
                  <th style={{ width: 120 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {TOP_ARTICLES.map((a) => (
                  <tr key={a.rank}>
                    <td className={`rank${a.topRank ? ' top' : ''}`}>{a.rank}</td>
                    <td>
                      <a style={{ color: 'var(--ink)', fontWeight: 500 }}>{a.title}</a>
                    </td>
                    <td>{a.author}</td>
                    <td><span className="tag">{a.cat}</span></td>
                    <td className="num-cell">{a.pv}</td>
                    <td className="num-cell">{a.likes}</td>
                    <td className="num-cell">{a.comments}</td>
                    <td>
                      <svg className="trend" viewBox="0 0 60 18">
                        <polyline points={a.trend} fill="none" stroke={a.trendColor} strokeWidth="1.5" />
                      </svg>
                    </td>
                    <td>
                      <button type="button" className="btn btn-ghost btn-sm">查看</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
