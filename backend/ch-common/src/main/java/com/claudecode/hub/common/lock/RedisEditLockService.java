package com.claudecode.hub.common.lock;

import com.claudecode.hub.common.exception.BizException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.time.Duration;
import java.time.Instant;

/**
 * Atomic Redis-backed lock. {@code SETNX} with TTL; heartbeat refreshes
 * TTL after verifying the holder.
 */
public class RedisEditLockService implements EditLockService {

    private static final String KEY = "lock:article:edit:";
    private final StringRedisTemplate redis;
    private final ObjectMapper om;

    public RedisEditLockService(StringRedisTemplate redis, ObjectMapper om) {
        this.redis = redis;
        this.om = om;
    }

    private String key(long articleId) { return KEY + articleId; }

    @Override
    public LockResult acquire(long articleId, long userId, String userName) {
        String key = key(articleId);
        Instant now = Instant.now();
        LockInfo info = new LockInfo(userId, userName, now);
        String payload = toJson(info);

        Boolean ok = redis.opsForValue().setIfAbsent(key, payload, DEFAULT_TTL);
        if (Boolean.TRUE.equals(ok)) return LockResult.success(info);

        LockInfo current = parse(redis.opsForValue().get(key));
        if (current != null && current.getUserId() == userId) {
            current.setLastHeartbeatAt(now);
            redis.opsForValue().set(key, toJson(current), DEFAULT_TTL);
            return LockResult.success(current);
        }
        return LockResult.conflict(current);
    }

    @Override
    public void heartbeat(long articleId, long userId) {
        String key = key(articleId);
        LockInfo current = parse(redis.opsForValue().get(key));
        if (current == null || current.getUserId() != userId) {
            throw new BizException("锁已丢失或已被他人获取，请刷新页面");
        }
        current.setLastHeartbeatAt(Instant.now());
        redis.opsForValue().set(key, toJson(current), DEFAULT_TTL);
    }

    @Override
    public void release(long articleId, long userId) {
        String key = key(articleId);
        LockInfo current = parse(redis.opsForValue().get(key));
        if (current != null && current.getUserId() == userId) {
            redis.delete(key);
        }
    }

    @Override
    public void forceUnlock(long articleId) {
        redis.delete(key(articleId));
    }

    @Override
    public LockInfo peek(long articleId) {
        return parse(redis.opsForValue().get(key(articleId)));
    }

    // ---------- helpers ----------
    private String toJson(LockInfo info) {
        try { return om.writeValueAsString(info); }
        catch (Exception e) { throw new RuntimeException(e); }
    }

    private LockInfo parse(String raw) {
        if (raw == null) return null;
        try { return om.readValue(raw, LockInfo.class); }
        catch (Exception e) { return null; }
    }
}
