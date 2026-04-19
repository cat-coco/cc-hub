package com.claudecode.hub.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class CurrentUser {
    private CurrentUser() {}

    public static AuthPrincipal get() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AuthPrincipal p)) return null;
        return p;
    }

    public static long requireId() {
        AuthPrincipal p = get();
        if (p == null) throw new com.claudecode.hub.common.exception.BizException(401, "未登录");
        return p.userId();
    }
}
