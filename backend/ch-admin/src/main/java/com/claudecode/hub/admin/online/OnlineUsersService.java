package com.claudecode.hub.admin.online;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Online-user counter.
 *
 * <p>Prod: Redis HyperLogLog sharded by 1-minute slot; a 5-minute
 * rolling union yields "approximate active users in the last 5 min".
 * Dev (no Redis): in-process {@code ConcurrentHashMap<slot, Set<userId>>}.
 */
@Service
public class OnlineUsersService {

    private static final String KEY_PREFIX = "online:users:";
    private static final DateTimeFormatter SLOT_FMT = DateTimeFormatter.ofPattern("yyyyMMdd-HHmm");
    private static final int WINDOW_MIN = 5;

    private final ObjectProvider<StringRedisTemplate> redis;
    private final ConcurrentHashMap<String, Set<String>> fallback = new ConcurrentHashMap<>();

    public OnlineUsersService(ObjectProvider<StringRedisTemplate> redis) {
        this.redis = redis;
    }

    public void heartbeat(long userId) {
        String slot = slotNow();
        StringRedisTemplate r = redis.getIfAvailable();
        if (r != null) {
            String key = KEY_PREFIX + slot;
            r.opsForHyperLogLog().add(key, String.valueOf(userId));
            r.expire(key, Duration.ofMinutes(WINDOW_MIN + 2));
        } else {
            fallback.computeIfAbsent(slot, k -> ConcurrentHashMap.newKeySet()).add(String.valueOf(userId));
        }
    }

    public long getOnlineCount() {
        List<String> slots = lastSlots();
        StringRedisTemplate r = redis.getIfAvailable();
        if (r != null) {
            List<String> keys = slots.stream().map(s -> KEY_PREFIX + s).toList();
            Long count = r.opsForHyperLogLog().size(keys.toArray(new String[0]));
            return count == null ? 0 : count;
        }
        // fallback
        Set<String> all = new HashSet<>();
        for (String slot : slots) {
            Set<String> snap = fallback.get(slot);
            if (snap != null) all.addAll(snap);
        }
        // prune old slots
        fallback.keySet().removeIf(k -> !slots.contains(k));
        return all.size();
    }

    private static String slotNow() {
        return LocalDateTime.now().format(SLOT_FMT);
    }

    private static List<String> lastSlots() {
        LocalDateTime now = LocalDateTime.now();
        List<String> out = new ArrayList<>(WINDOW_MIN);
        for (int i = 0; i < WINDOW_MIN; i++) {
            out.add(now.minusMinutes(i).format(SLOT_FMT));
        }
        return out;
    }
}
