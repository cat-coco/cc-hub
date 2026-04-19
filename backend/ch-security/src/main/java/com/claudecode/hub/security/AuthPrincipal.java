package com.claudecode.hub.security;

import java.util.Collection;

public record AuthPrincipal(long userId, String username, Collection<String> roles) {
}
