package com.claudecode.hub.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ch.security.jwt")
public class JwtProps {
    /** HMAC-SHA secret, at least 32 chars. */
    private String secret = "change-me-change-me-change-me-please-very-long";
    /** Access token TTL in seconds. */
    private long accessTtl = 60L * 60 * 24 * 7;
    private String issuer = "claudecode-hub";

    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }
    public long getAccessTtl() { return accessTtl; }
    public void setAccessTtl(long accessTtl) { this.accessTtl = accessTtl; }
    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }
}
