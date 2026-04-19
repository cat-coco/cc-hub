package com.claudecode.hub.common.audit;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Mark an endpoint to have its invocation recorded in {@code audit_log}
 * (by ch-admin/AuditLogAspect; silently a no-op when ch-admin is absent).
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Audit {
    String type();
    String action();
    String resourceType() default "";
}
