import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminSidebar from '../components/AdminSidebar';
import Icon from '../components/Icon';
import { statsApi } from '../api/endpoints';
import '../styles/admin.css';

interface TopArticle {
  id: number;
  title: string;
  author: string;
  category: string;
  pv: number;
  likes: number;
  comments: number;
}

interface DashboardData {
  totalArticles: number;
  totalUsers: number;
  totalSnippets: number;
  totalCases: number;
  categoryShare?: Array<{ name: string; count: number }>;
  topArticles?: TopArticle[];
}

export default function AdminDashboardPage() {
  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => document.body.classList.remove('admin-body');
  }, []);

  const q = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => statsApi.dashboard() as unknown as Promise<DashboardData>,
  });

  const data = q.data;
  const cats = data?.categoryShare ?? [];
  const catsTotal = cats.reduce((sum, c) => sum + (c.count ?? 0), 0);
  const topArticles = data?.topArticles ?? [];

  const pieColors = ['var(--brand)', '#C96547', '#D88560', '#446A7A', '#4F7A4F', '#B88824', 'var(--ink-3)'];

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
        </div>

        <div className="acontent">
          <div className="aheader">
            <h1>仪表盘</h1>
            <span className="sub">社区运营概览 · 实时数据</span>
            <div className="range">
              <span className="chip chip-active">近 7 天</span>
              <span className="chip">近 30 天</span>
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-lbl">总文章数</div>
              <div className="stat-num">{data?.totalArticles ?? '—'}</div>
              <span className="stat-sub">包含草稿</span>
            </div>
            <div className="stat">
              <div className="stat-lbl">总用户数</div>
              <div className="stat-num">{data?.totalUsers ?? '—'}</div>
              <span className="stat-sub">含管理员</span>
            </div>
            <div className="stat">
              <div className="stat-lbl">Snippets</div>
              <div className="stat-num">{data?.totalSnippets ?? '—'}</div>
              <span className="stat-sub">代码片段</span>
            </div>
            <div className="stat">
              <div className="stat-lbl">实战案例</div>
              <div className="stat-num">{data?.totalCases ?? '—'}</div>
              <span className="stat-sub">已发布</span>
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
              <div style={{ padding: '32px 0', color: 'var(--ink-3)', textAlign: 'center', fontSize: 13 }}>
                PV/UV 采集依赖 RabbitMQ + visit_log，采集开始后此图将自动填充。
              </div>
            </div>

            <div className="panel">
              <div className="panel-h">
                <h3>分类占比</h3>
                <span className="muted">按文章数</span>
              </div>
              {cats.length === 0 || catsTotal === 0 ? (
                <div style={{ padding: '32px 0', color: 'var(--ink-3)', textAlign: 'center', fontSize: 13 }}>
                  暂无数据
                </div>
              ) : (
                <div className="pie-legend">
                  {cats.map((c, i) => (
                    <div className="pie-item" key={c.name}>
                      <span className="dot" style={{ background: pieColors[i % pieColors.length] }} />
                      {c.name}
                      <span className="pct">
                        {catsTotal > 0 ? Math.round((c.count / catsTotal) * 100) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-h">
              <h3>热门文章 Top 10</h3>
              <span className="muted">近 7 天</span>
            </div>
            {topArticles.length === 0 ? (
              <div style={{ padding: '24px 0', color: 'var(--ink-3)', textAlign: 'center', fontSize: 13 }}>
                暂无已发布文章
              </div>
            ) : (
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
                  </tr>
                </thead>
                <tbody>
                  {topArticles.map((a, i) => (
                    <tr key={a.id}>
                      <td className={`rank${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</td>
                      <td>{a.title}</td>
                      <td>{a.author}</td>
                      <td><span className="tag">{a.category}</span></td>
                      <td className="num-cell">{a.pv}</td>
                      <td className="num-cell">{a.likes}</td>
                      <td className="num-cell">{a.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
