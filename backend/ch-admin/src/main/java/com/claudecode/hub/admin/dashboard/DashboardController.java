package com.claudecode.hub.admin.dashboard;

import com.claudecode.hub.admin.online.OnlineUsersService;
import com.claudecode.hub.common.api.R;
import com.claudecode.hub.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@Tag(name = "Admin · Dashboard")
public class DashboardController {

    private static final String CACHE_KEY = "cache:admin:dashboard:overview";
    private static final Duration CACHE_TTL = Duration.ofSeconds(60);

    private final DashboardService service;
    private final OnlineUsersService online;
    private final ObjectProvider<StringRedisTemplate> redis;
    private final com.fasterxml.jackson.databind.ObjectMapper om;

    private volatile CachedOverview memoCache;
    private record CachedOverview(Map<String, Object> body, long expiresAt) {}

    public DashboardController(DashboardService service, OnlineUsersService online,
                               ObjectProvider<StringRedisTemplate> redis,
                               com.fasterxml.jackson.databind.ObjectMapper om) {
        this.service = service;
        this.online = online;
        this.redis = redis;
        this.om = om;
    }

    @GetMapping("/overview")
    @Operation(summary = "仪表盘聚合数据（60s 缓存）")
    @SuppressWarnings("unchecked")
    public R<Map<String, Object>> overview() {
        StringRedisTemplate r = redis.getIfAvailable();
        // Try Redis first
        if (r != null) {
            String cached = r.opsForValue().get(CACHE_KEY);
            if (cached != null) {
                try { return R.ok(om.readValue(cached, Map.class)); }
                catch (Exception ignored) { /* fallthrough */ }
            }
        } else {
            CachedOverview m = memoCache;
            if (m != null && m.expiresAt() > System.currentTimeMillis()) {
                return R.ok(m.body());
            }
        }
        Map<String, Object> fresh = service.overview();
        if (r != null) {
            try { r.opsForValue().set(CACHE_KEY, om.writeValueAsString(fresh), CACHE_TTL); }
            catch (Exception ignored) { /* skip cache on ser error */ }
        } else {
            memoCache = new CachedOverview(fresh, System.currentTimeMillis() + CACHE_TTL.toMillis());
        }
        return R.ok(fresh);
    }

    @GetMapping("/online-users")
    public R<Map<String, Long>> onlineUsers() {
        return R.ok(Map.of("online", online.getOnlineCount()));
    }

    @PostMapping("/heartbeat")
    @Operation(summary = "C 端 30s 心跳；每个登录用户增加 HLL 样本")
    public R<Void> heartbeat() {
        Long uid = CurrentUser.get() == null ? null : CurrentUser.get().userId();
        if (uid != null) online.heartbeat(uid);
        return R.ok();
    }
}
