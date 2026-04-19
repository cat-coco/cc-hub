package com.claudecode.hub.content.service;

import com.claudecode.hub.common.util.HtmlSanitizer;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Minimal Markdown → HTML renderer for server-side rendering (SEO) and
 * richtext fallback. Not a full commonmark implementation — the browser-side
 * editor/renderer (react-markdown + remark-gfm) produces the authoritative
 * output; this is a safety net for search snippets / SEO meta.
 */
@Component
public class MarkdownRenderer {

    public String render(String md) {
        if (md == null || md.isEmpty()) return "";
        String html = md
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");

        // fenced code
        html = replaceAll(html, Pattern.compile("```(\\w+)?\\n([\\s\\S]*?)```"),
                m -> "<pre><code class=\"lang-" + safe(m.group(1)) + "\">" + m.group(2) + "</code></pre>");
        // inline code
        html = replaceAll(html, Pattern.compile("`([^`]+)`"),
                m -> "<code>" + m.group(1) + "</code>");
        // headings
        html = replaceAll(html, Pattern.compile("(?m)^######\\s+(.*)$"), m -> "<h6>" + m.group(1) + "</h6>");
        html = replaceAll(html, Pattern.compile("(?m)^#####\\s+(.*)$"), m -> "<h5>" + m.group(1) + "</h5>");
        html = replaceAll(html, Pattern.compile("(?m)^####\\s+(.*)$"), m -> "<h4>" + m.group(1) + "</h4>");
        html = replaceAll(html, Pattern.compile("(?m)^###\\s+(.*)$"), m -> "<h3>" + m.group(1) + "</h3>");
        html = replaceAll(html, Pattern.compile("(?m)^##\\s+(.*)$"), m -> "<h2>" + m.group(1) + "</h2>");
        html = replaceAll(html, Pattern.compile("(?m)^#\\s+(.*)$"), m -> "<h1>" + m.group(1) + "</h1>");
        // blockquote
        html = replaceAll(html, Pattern.compile("(?m)^&gt;\\s?(.*)$"), m -> "<blockquote>" + m.group(1) + "</blockquote>");
        // bold / italic
        html = replaceAll(html, Pattern.compile("\\*\\*(.+?)\\*\\*"), m -> "<strong>" + m.group(1) + "</strong>");
        html = replaceAll(html, Pattern.compile("\\*(.+?)\\*"), m -> "<em>" + m.group(1) + "</em>");
        // links
        html = replaceAll(html, Pattern.compile("\\[([^\\]]+)]\\(([^)\\s]+)\\)"),
                m -> "<a href=\"" + m.group(2) + "\">" + m.group(1) + "</a>");
        // line breaks paragraphs
        StringBuilder out = new StringBuilder();
        for (String block : html.split("\\n{2,}")) {
            String b = block.trim();
            if (b.isEmpty()) continue;
            if (b.startsWith("<h") || b.startsWith("<pre") || b.startsWith("<blockquote") || b.startsWith("<ul") || b.startsWith("<ol")) {
                out.append(b).append("\n");
            } else {
                out.append("<p>").append(b.replace("\n", "<br/>")).append("</p>\n");
            }
        }
        return HtmlSanitizer.article(out.toString());
    }

    private static String replaceAll(String s, Pattern p, java.util.function.Function<Matcher, String> f) {
        Matcher m = p.matcher(s);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            m.appendReplacement(sb, Matcher.quoteReplacement(f.apply(m)));
        }
        m.appendTail(sb);
        return sb.toString();
    }

    private static String safe(String s) {
        return s == null ? "" : s.replaceAll("[^a-zA-Z0-9_-]", "");
    }
}
