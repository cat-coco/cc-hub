import { useEffect, useRef, useState } from 'react';
import { adminArticlesApi, type LockInfo } from '../api/endpoints';
import { ApiError } from '../api/client';

export type LockStatus =
  | { state: 'pending' }
  | { state: 'acquired' }
  | { state: 'conflict'; info: LockInfo | null }
  | { state: 'lost'; reason?: string };

interface UseEditLockOpts {
  /** article id, 0/null means "new article — no lock needed" */
  articleId: number | null | undefined;
  currentUserId: number | null;
  /** in ms, default 60_000. Server TTL is 180s, heartbeat every 60s is safe. */
  heartbeatMs?: number;
  /** idle warning threshold in ms. Default 5 minutes. */
  idleWarnMs?: number;
}

interface UseEditLockResult {
  status: LockStatus;
  /** call to extend after confirming "yes I'm still editing". */
  keepAlive: () => void;
  /** manually release (normally done on unmount). */
  release: () => void;
  /** "touch" this when the editor content changes, so idle warning resets. */
  touchActivity: () => void;
  showIdlePrompt: boolean;
}

export function useEditLock({
  articleId,
  currentUserId,
  heartbeatMs = 60_000,
  idleWarnMs = 5 * 60_000,
}: UseEditLockOpts): UseEditLockResult {
  const [status, setStatus] = useState<LockStatus>({ state: 'pending' });
  const [showIdlePrompt, setShowIdlePrompt] = useState(false);
  const lastActivityRef = useRef<number>(Date.now());
  const stoppedRef = useRef(false);

  useEffect(() => {
    stoppedRef.current = false;
    if (!articleId || !currentUserId) {
      setStatus({ state: 'acquired' }); // nothing to lock for a new article
      return () => { stoppedRef.current = true; };
    }

    let idleTimer: ReturnType<typeof setInterval> | null = null;
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

    (async () => {
      try {
        const r = await adminArticlesApi.acquireLock(articleId);
        if (stoppedRef.current) return;
        if (r.acquired) {
          setStatus({ state: 'acquired' });
          // heartbeat loop
          heartbeatTimer = setInterval(async () => {
            try {
              await adminArticlesApi.heartbeat(articleId);
            } catch (e) {
              setStatus({ state: 'lost', reason: e instanceof ApiError ? e.message : '锁丢失' });
              if (heartbeatTimer) clearInterval(heartbeatTimer);
            }
          }, heartbeatMs);
          // idle detection
          idleTimer = setInterval(() => {
            if (Date.now() - lastActivityRef.current > idleWarnMs) {
              setShowIdlePrompt(true);
            }
          }, 30_000);
        } else {
          setStatus({ state: 'conflict', info: r.info });
        }
      } catch (e) {
        if (!stoppedRef.current) {
          setStatus({ state: 'lost', reason: e instanceof ApiError ? e.message : '抢锁失败' });
        }
      }
    })();

    return () => {
      stoppedRef.current = true;
      if (idleTimer) clearInterval(idleTimer);
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      // best-effort release
      adminArticlesApi.releaseLock(articleId).catch(() => {});
    };
  }, [articleId, currentUserId, heartbeatMs, idleWarnMs]);

  return {
    status,
    showIdlePrompt,
    keepAlive: () => {
      lastActivityRef.current = Date.now();
      setShowIdlePrompt(false);
      if (articleId) adminArticlesApi.heartbeat(articleId).catch(() => {});
    },
    release: () => {
      if (articleId) adminArticlesApi.releaseLock(articleId).catch(() => {});
    },
    touchActivity: () => {
      lastActivityRef.current = Date.now();
      if (showIdlePrompt) setShowIdlePrompt(false);
    },
  };
}
