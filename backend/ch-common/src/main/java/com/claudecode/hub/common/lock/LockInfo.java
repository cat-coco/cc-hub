package com.claudecode.hub.common.lock;

import java.time.Instant;

public class LockInfo {
    private long userId;
    private String userName;
    private Instant acquiredAt;
    private Instant lastHeartbeatAt;

    public LockInfo() {}

    public LockInfo(long userId, String userName, Instant acquiredAt) {
        this.userId = userId;
        this.userName = userName;
        this.acquiredAt = acquiredAt;
        this.lastHeartbeatAt = acquiredAt;
    }

    public long getUserId() { return userId; }
    public void setUserId(long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Instant getAcquiredAt() { return acquiredAt; }
    public void setAcquiredAt(Instant acquiredAt) { this.acquiredAt = acquiredAt; }
    public Instant getLastHeartbeatAt() { return lastHeartbeatAt; }
    public void setLastHeartbeatAt(Instant lastHeartbeatAt) { this.lastHeartbeatAt = lastHeartbeatAt; }
}
