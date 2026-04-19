package com.claudecode.hub.admin.schedule;

import com.claudecode.hub.common.lock.EditLockService;
import com.claudecode.hub.common.lock.InMemoryEditLockService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Recurring admin jobs. Real data-pipeline implementations (PV/UV roll-up,
 * alerting, daily reports) depend on the visit_log / RabbitMQ pipeline that
 * is out of scope until PV采集 lands. These methods log so operators can
 * verify the scheduler is alive; concrete work goes in follow-ups.
 */
@Component
public class AdminScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(AdminScheduledTasks.class);

    private final EditLockService lockService;

    public AdminScheduledTasks(EditLockService lockService) {
        this.lockService = lockService;
    }

    @Scheduled(cron = "0 */5 * * * ?")
    public void aggregateRealtimeMetrics() {
        log.debug("[schedule] aggregateRealtimeMetrics — placeholder for PV/UV 5-min rollup");
    }

    @Scheduled(cron = "0 5 0 * * ?")
    public void aggregateDailyStats() {
        log.info("[schedule] aggregateDailyStats — build yesterday's stats_daily row");
    }

    @Scheduled(cron = "0 0 8 * * ?")
    public void sendDailyReport() {
        log.info("[schedule] sendDailyReport — send yesterday summary to admin emails");
    }

    @Scheduled(cron = "0 0 8 ? * MON")
    public void sendWeeklyReport() {
        log.info("[schedule] sendWeeklyReport — send last-week summary to admin emails");
    }

    @Scheduled(cron = "0 */10 * * * ?")
    public void checkAnomalies() {
        log.debug("[schedule] checkAnomalies — PV anomaly threshold check");
    }

    @Scheduled(cron = "0 0 * * * ?")
    public void cleanExpiredLocks() {
        if (lockService instanceof InMemoryEditLockService mem) {
            int removed = mem.pruneExpired();
            if (removed > 0) log.info("[schedule] cleanExpiredLocks — pruned {} in-memory locks", removed);
        }
        // Redis-backed locks expire naturally via TTL; nothing to do.
    }

    @Scheduled(cron = "0 30 3 * * ?")
    public void cleanOrphanImages() {
        log.info("[schedule] cleanOrphanImages — scan temp/ in OSS for 3-day-old orphans");
    }

    @Scheduled(cron = "0 0 4 * * ?")
    public void pruneArticleVersions() {
        log.info("[schedule] pruneArticleVersions — cap each article to 10 history rows (enforced inline)");
    }
}
