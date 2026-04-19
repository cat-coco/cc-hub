import { Link } from 'react-router-dom';
import type { LockInfo } from '../api/endpoints';

interface Props {
  info: LockInfo | null;
  canForceUnlock: boolean;
  onForceUnlock: () => void;
  onRetry: () => void;
}

export default function LockConflictModal({ info, canForceUnlock, onForceUnlock, onRetry }: Props) {
  const acquired = info?.acquiredAt ? new Date(info.acquiredAt) : null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(31,26,21,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 460,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-lg)',
          padding: 28,
          boxShadow: 'var(--shadow-3)',
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600 }}>文章正在被其他人编辑</h3>
        <p style={{ margin: '0 0 16px', color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.7 }}>
          {info ? (
            <>
              <b>{info.userName}</b> 于{' '}
              {acquired ? acquired.toLocaleString('zh-CN') : '—'} 获取了编辑权。
              为避免双方覆盖彼此的改动，该页面当前只读。
            </>
          ) : (
            <>无法获取当前持有者信息，可能是锁刚刚释放。</>
          )}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Link to="/admin/article/list" className="btn btn-secondary btn-sm">
            返回列表
          </Link>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}>
            重试抢锁
          </button>
          {canForceUnlock && (
            <button type="button" className="btn btn-primary btn-sm" onClick={onForceUnlock}>
              强制解锁（超管）
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
