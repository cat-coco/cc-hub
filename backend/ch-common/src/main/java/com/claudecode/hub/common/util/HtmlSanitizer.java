package com.claudecode.hub.common.util;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;

/**
 * XSS-safe HTML sanitizer for user-authored article / comment HTML.
 */
public final class HtmlSanitizer {

    private static final PolicyFactory ARTICLE_POLICY = Sanitizers.FORMATTING
            .and(Sanitizers.LINKS)
            .and(Sanitizers.BLOCKS)
            .and(Sanitizers.IMAGES)
            .and(Sanitizers.TABLES)
            .and(new HtmlPolicyBuilder()
                    .allowElements("pre", "code", "hr", "h1", "h2", "h3", "h4", "h5", "h6")
                    .allowAttributes("class").onElements("pre", "code", "span", "div")
                    .allowAttributes("id").onElements("h1", "h2", "h3", "h4", "h5", "h6")
                    .toFactory());

    private static final PolicyFactory COMMENT_POLICY = Sanitizers.FORMATTING
            .and(Sanitizers.LINKS)
            .and(new HtmlPolicyBuilder()
                    .allowElements("code", "pre", "blockquote", "br")
                    .toFactory());

    private HtmlSanitizer() {}

    public static String article(String raw) {
        return raw == null ? null : ARTICLE_POLICY.sanitize(raw);
    }

    public static String comment(String raw) {
        return raw == null ? null : COMMENT_POLICY.sanitize(raw);
    }
}
