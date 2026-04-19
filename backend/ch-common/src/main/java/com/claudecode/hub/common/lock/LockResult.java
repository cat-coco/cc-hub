package com.claudecode.hub.common.lock;

public record LockResult(boolean acquired, LockInfo info) {
    public static LockResult success(LockInfo info) { return new LockResult(true, info); }
    public static LockResult conflict(LockInfo current) { return new LockResult(false, current); }
}
