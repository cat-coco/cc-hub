package com.claudecode.hub.admin.audit;

import com.claudecode.hub.admin.audit.mapper.AuditLogMapper;
import com.claudecode.hub.common.audit.Audit;
import com.claudecode.hub.security.AuthPrincipal;
import com.claudecode.hub.security.CurrentUser;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class AuditLogAspect {

    private static final Logger log = LoggerFactory.getLogger(AuditLogAspect.class);

    private final AuditLogMapper mapper;

    public AuditLogAspect(AuditLogMapper mapper) {
        this.mapper = mapper;
    }

    @Around("@annotation(audit)")
    public Object around(ProceedingJoinPoint pjp, Audit audit) throws Throwable {
        Object result = null;
        String outcome = "SUCCESS";
        Throwable error = null;
        long start = System.currentTimeMillis();
        try {
            result = pjp.proceed();
            return result;
        } catch (Throwable t) {
            outcome = "FAILURE";
            error = t;
            throw t;
        } finally {
            try {
                persist(audit, pjp, result, outcome, error, System.currentTimeMillis() - start);
            } catch (Exception e) {
                // Never let logging fail a business call
                log.warn("audit log persistence failed: {}", e.getMessage());
            }
        }
    }

    @Async
    protected void persist(Audit audit, ProceedingJoinPoint pjp, Object result,
                           String outcome, Throwable err, long elapsedMs) {
        AuditLog row = new AuditLog();
        row.setLogType(audit.type());
        row.setAction(audit.action());
        row.setResourceType(audit.resourceType().isEmpty() ? null : audit.resourceType());
        AuthPrincipal p = CurrentUser.get();
        if (p != null) {
            row.setUserId(p.userId());
            row.setUserName(p.username());
        }
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attr != null) {
            HttpServletRequest req = attr.getRequest();
            row.setIp(clientIp(req));
            row.setUserAgent(req.getHeader("User-Agent"));
        }
        row.setResult(outcome);
        row.setResourceId(inferResourceId(pjp));
        row.setDetail(buildDetail(pjp, err, elapsedMs));
        mapper.insert(row);
    }

    private Long inferResourceId(ProceedingJoinPoint pjp) {
        for (Object a : pjp.getArgs()) {
            if (a instanceof Long l) return l;
            if (a instanceof Integer i) return i.longValue();
        }
        return null;
    }

    private String buildDetail(ProceedingJoinPoint pjp, Throwable err, long elapsedMs) {
        MethodSignature sig = (MethodSignature) pjp.getSignature();
        StringBuilder sb = new StringBuilder("{");
        sb.append("\"method\":\"").append(sig.toShortString()).append("\",");
        sb.append("\"tookMs\":").append(elapsedMs);
        if (err != null) {
            sb.append(",\"error\":\"").append(err.getClass().getSimpleName())
              .append(": ").append(safe(err.getMessage())).append("\"");
        }
        sb.append("}");
        return sb.toString();
    }

    private static String safe(String s) {
        return s == null ? "" : s.replace("\"", "\\\"").replace("\n", " ");
    }

    private static String clientIp(HttpServletRequest req) {
        String h = req.getHeader("X-Forwarded-For");
        if (h != null && !h.isBlank()) return h.split(",")[0].trim();
        h = req.getHeader("X-Real-IP");
        if (h != null && !h.isBlank()) return h;
        return req.getRemoteAddr();
    }
}
