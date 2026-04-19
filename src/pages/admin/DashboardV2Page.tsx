import { useQuery } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import { dashboardApi } from '../../api/adminEndpoints';

function MetricCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="stat">
      <div className="stat-lbl">{label}</div>
      <div className="stat-num">{value}</div>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  );
}

export default function DashboardV2Page() {
  const q = useQuery({
    queryKey: ['admin', 'dashboard', 'overview'],
    queryFn: dashboardApi.overview,
    refetchInterval: 60_000,
  });
  const data = q.data;
  const m = data?.metrics ?? {};

  return (
    <AdminShell title="仪表盘" subtitle="社区运营概览 · 聚合数据每 60 秒自动刷新">
      <div className="stats">
        <MetricCard label="总文章数" value={m.totalArticles ?? '—'} sub={`今日 +${m.todayNewArticles ?? 0}`} />
        <MetricCard label="总用户数" value={m.totalUsers ?? '—'} sub={`今日 +${m.todayNewUsers ?? 0}`} />
        <MetricCard label="今日 PV / UV" value={`${m.todayPv ?? 0} / ${m.todayUv ?? 0}`} />
        <MetricCard label="评论" value={m.totalComments ?? '—'} sub={`待审 ${m.pendingComments ?? 0}`} />
        <MetricCard label="点赞 / 收藏" value={`${m.totalLikes ?? 0} / ${m.totalCollects ?? 0}`} />
        <MetricCard label="在线用户" value={m.onlineUsers ?? 0} sub="近 5 分钟" />
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="panel-h">
            <h3>分类占比</h3>
            <span className="muted">按已发布文章数</span>
          </div>
          {data?.categoryDistribution?.length ? (
            <div className="pie-legend">
              {data.categoryDistribution.map((c) => (
                <div className="pie-item" key={c.name}>
                  <span className="dot" style={{ background: 'var(--brand)' }} />
                  {c.name}
                  <span className="pct">{c.percent}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 24, color: 'var(--ink-3)', textAlign: 'center' }}>暂无数据</div>
          )}
        </div>

        <div className="panel">
          <div className="panel-h">
            <h3>近 30 天流量</h3>
            <span className="muted">待 visit_log 采集上线</span>
          </div>
          <div style={{ padding: '48px 0', color: 'var(--ink-3)', textAlign: 'center', fontSize: 13 }}>
            采集管线尚未上线（见 V2_5 / AdminScheduledTasks#aggregateRealtimeMetrics）
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="panel-h"><h3>热门文章 Top 10</h3></div>
          {data?.topArticles?.length ? (
            <table className="atable">
              <thead><tr><th>#</th><th>标题</th><th>作者</th><th style={{ textAlign: 'right' }}>PV</th><th style={{ textAlign: 'right' }}>赞</th></tr></thead>
              <tbody>
                {data.topArticles.map((a, i) => (
                  <tr key={a.id}>
                    <td className={`rank${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</td>
                    <td>{a.title}</td>
                    <td>{a.author}</td>
                    <td className="num-cell">{a.pv}</td>
                    <td className="num-cell">{a.likes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div style={{ padding: 24, color: 'var(--ink-3)', textAlign: 'center' }}>暂无数据</div>}
        </div>

        <div className="panel">
          <div className="panel-h"><h3>活跃作者 Top 10</h3></div>
          {data?.topAuthors?.length ? (
            <table className="atable">
              <thead><tr><th>#</th><th>作者</th><th style={{ textAlign: 'right' }}>文章</th><th style={{ textAlign: 'right' }}>总 PV</th></tr></thead>
              <tbody>
                {data.topAuthors.map((a, i) => (
                  <tr key={a.id}>
                    <td className={`rank${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</td>
                    <td>{a.name}</td>
                    <td className="num-cell">{a.articles}</td>
                    <td className="num-cell">{a.totalPv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div style={{ padding: 24, color: 'var(--ink-3)', textAlign: 'center' }}>暂无数据</div>}
        </div>
      </div>
    </AdminShell>
  );
}
