package com.claudecode.hub.common.lock;

import com.claudecode.hub.common.exception.BizException;

import java.time.Duration;

/**
 * Edit-lock abstraction for the article editor.
 *
 * <p>Spec: {@code setIfAbsent("lock:article:edit:{id}", info, TTL=180s)};
 * re-entrant heartbeat by the same user extends TTL; a different user
 * gets {@link LockResult#conflict} with the current holder info.
 */
public interface EditLockService {

    Duration DEFAULT_TTL = Duration.ofSeconds(180);

    /** Try to acquire the lock for {@code articleId}; atomic. */
    LockResult acquire(long articleId, long userId, String userName);

    /**
     * Extend TTL if the caller is the current holder. Throws
     * {@link BizException} when the lock has expired or been taken over.
     */
    void heartbeat(long articleId, long userId);

    /** Release only when caller is the holder. Silent no-op otherwise. */
    void release(long articleId, long userId);

    /** Super-admin escape hatch. */
    void forceUnlock(long articleId);

    /** Peek, {@code null} if absent. */
    LockInfo peek(long articleId);
}
