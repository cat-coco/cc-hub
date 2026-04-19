package com.claudecode.hub.common.lock;

import com.claudecode.hub.common.exception.BizException;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Dev / single-node fallback. Same semantics as the Redis impl but process-local.
 */
public class InMemoryEditLockService implements EditLockService {

    private static final class Entry {
        final LockInfo info;
        final Instant expiresAt;
        Entry(LockInfo info, Instant expiresAt) {
            this.info = info;
            this.expiresAt = expiresAt;
        }
        boolean alive(Instant now) { return now.isBefore(expiresAt); }
    }

    private final ConcurrentHashMap<Long, Entry> locks = new ConcurrentHashMap<>();

    @Override
    public LockResult acquire(long articleId, long userId, String userName) {
        Instant now = Instant.now();
        Instant newExpiry = now.plus(DEFAULT_TTL);
        Entry next = new Entry(new LockInfo(userId, userName, now), newExpiry);
        Entry prev = locks.compute(articleId, (k, cur) -> {
            if (cur == null || !cur.alive(now)) return next;
            return cur; // someone else holds it
        });
        if (prev == next) return LockResult.success(next.info);
        if (prev.info.getUserId() == userId) {
            // re-entrant: refresh + return success
            Entry refreshed = new Entry(prev.info, now.plus(DEFAULT_TTL));
            refreshed.info.setLastHeartbeatAt(now);
            locks.put(articleId, refreshed);
            return LockResult.success(refreshed.info);
        }
        return LockResult.conflict(prev.info);
    }

    @Override
    public void heartbeat(long articleId, long userId) {
        Instant now = Instant.now();
        Entry cur = locks.get(articleId);
        if (cur == null || !cur.alive(now) || cur.info.getUserId() != userId) {
            throw new BizException("锁已丢失或已被他人获取，请刷新页面");
        }
        cur.info.setLastHeartbeatAt(now);
        locks.put(articleId, new Entry(cur.info, now.plus(DEFAULT_TTL)));
    }

    @Override
    public void release(long articleId, long userId) {
        locks.computeIfPresent(articleId, (k, cur) ->
                cur.info.getUserId() == userId ? null : cur);
    }

    @Override
    public void forceUnlock(long articleId) {
        locks.remove(articleId);
    }

    @Override
    public LockInfo peek(long articleId) {
        Entry cur = locks.get(articleId);
        return cur != null && cur.alive(Instant.now()) ? cur.info : null;
    }

    /** Exposed so the ~`cleanExpiredLocks`~ scheduled task can prune. */
    public int pruneExpired() {
        Instant now = Instant.now();
        int[] removed = {0};
        locks.entrySet().removeIf(e -> {
            if (!e.getValue().alive(now)) { removed[0]++; return true; }
            return false;
        });
        return removed[0];
    }
}
