import { useQuery } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import { adminStatsApi } from '../../api/adminEndpoints';

interface Props {
  kind: 'categories' | 'authors' | 'keywords';
  title: string;
  subtitle?: string;
}

function col(v: unknown) {
  if (v == null) return '—';
  if (typeof v === 'number') return v.toLocaleString();
  return String(v);
}

export default function StatsSimplePage({ kind, title, subtitle }: Props) {
  const q = useQuery({
    queryKey: ['admin', 'stats', kind],
    queryFn: () => {
      if (kind === 'categories') return adminStatsApi.categories();
      if (kind === 'authors') return adminStatsApi.authors(50);
      return adminStatsApi.keywords();
    },
  });
  const rows: Array<Record<string, unknown>> = q.data ?? [];
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <AdminShell title={title} subtitle={subtitle}>
      {rows.length === 0 ? (
        <div className="admin-empty">暂无数据</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>{columns.map((c) => <td key={c}>{col(r[c])}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
