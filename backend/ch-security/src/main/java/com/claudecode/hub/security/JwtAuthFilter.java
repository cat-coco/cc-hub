package com.claudecode.hub.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwt;

    public JwtAuthFilter(JwtService jwt) {
        this.jwt = jwt;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse resp, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Claims c = jwt.parse(token);
                long uid = Long.parseLong(c.getSubject());
                String uname = c.get("uname", String.class);
                @SuppressWarnings("unchecked")
                List<String> roles = c.get("roles", List.class);
                Collection<SimpleGrantedAuthority> auths = (roles == null ? List.<String>of() : roles)
                        .stream().map(SimpleGrantedAuthority::new).toList();
                AuthPrincipal principal = new AuthPrincipal(uid, uname, roles == null ? List.of() : roles);
                AbstractAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(principal, token, auths);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JwtException | IllegalArgumentException ignored) {
                // invalid token — leave context unauthenticated
            }
        }
        chain.doFilter(req, resp);
    }
}
