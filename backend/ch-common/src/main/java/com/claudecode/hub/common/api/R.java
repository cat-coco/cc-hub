package com.claudecode.hub.common.api;

import org.slf4j.MDC;

/**
 * Unified API response envelope.
 */
public record R<T>(int code, String message, T data, String traceId) {

    public static <T> R<T> ok(T data) {
        return new R<>(0, "success", data, MDC.get("traceId"));
    }

    public static <T> R<T> ok() {
        return ok(null);
    }

    public static <T> R<T> fail(int code, String message) {
        return new R<>(code, message, null, MDC.get("traceId"));
    }

    public static <T> R<T> fail(String message) {
        return fail(500, message);
    }
}
