package com.claudecode.hub.common.domain;

import com.claudecode.hub.common.exception.BizException;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

/**
 * Article lifecycle state machine.
 *
 * <pre>
 *    DRAFT ──submit──▶ PENDING ──approve──▶ PUBLISHED
 *      │                  │                     │
 *      ├──publish (admin) │                     ├──unpublish──▶ DRAFT
 *      │                  └──reject──▶ DRAFT    └──offline────▶ OFFLINE
 *      │
 *      └◀────offline──────────────────────────────────────── (admin)
 *
 *    OFFLINE ──republish──▶ PUBLISHED
 *    OFFLINE ──to-draft────▶ DRAFT
 * </pre>
 */
public enum ArticleStatus {
    /** 草稿（作者可继续编辑）。 */
    DRAFT,
    /** 已提交审核，等待管理员处理。 */
    PENDING,
    /** 已发布，C 端可见。 */
    PUBLISHED,
    /** 已下架，仅后台可见。 */
    OFFLINE;

    private static final Map<ArticleStatus, Set<ArticleStatus>> TRANSITIONS = Map.of(
            DRAFT,     EnumSet.of(PENDING, PUBLISHED),
            PENDING,   EnumSet.of(DRAFT, PUBLISHED),
            PUBLISHED, EnumSet.of(DRAFT, OFFLINE),
            OFFLINE,   EnumSet.of(PUBLISHED, DRAFT)
    );

    public boolean canTransitionTo(ArticleStatus target) {
        if (target == null || target == this) return false;
        return TRANSITIONS.getOrDefault(this, Set.of()).contains(target);
    }

    /**
     * Validates the transition or throws a {@link BizException} that the
     * global handler turns into `{code:400,message:"非法的状态变更…"}`.
     */
    public ArticleStatus transitionTo(ArticleStatus target) {
        if (!canTransitionTo(target)) {
            throw new BizException("非法的状态变更：" + this + " → " + target);
        }
        return target;
    }

    /** Lenient parser; accepts legacy lowercase values too. */
    public static ArticleStatus of(String raw) {
        if (raw == null) return null;
        try {
            return ArticleStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BizException("未知的文章状态：" + raw);
        }
    }
}
