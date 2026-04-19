package com.claudecode.hub.content.controller;

import com.claudecode.hub.common.api.R;
import com.claudecode.hub.common.exception.BizException;
import com.claudecode.hub.content.dto.ContentDtos.ArticleCreateReq;
import com.claudecode.hub.content.dto.ContentDtos.ArticleDetail;
import com.claudecode.hub.content.entity.Article;
import com.claudecode.hub.content.service.ArticleService;
import com.claudecode.hub.security.AuthPrincipal;
import com.claudecode.hub.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Set;

/**
 * Author self-service endpoints (any logged-in user).
 * Admin power (direct publish, offline, duplicate, batch ops) lives in
 * {@link com.claudecode.hub.content.admin.AdminArticleController}.
 */
@RestController
@RequestMapping("/api/articles")
@Tag(name = "Articles · Author", description = "作者自助投稿：创建 / 更新 / 提交审核")
public class AuthorArticleController {

    private static final Set<String> ADMIN_ROLES = Set.of("ROLE_ADMIN", "ROLE_SUPER_ADMIN");

    private final ArticleService articleService;

    public AuthorArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @PostMapping
    @Operation(summary = "创建文章（作者）—— status 强制为 DRAFT，需通过 submit-review 走审核")
    public R<ArticleDetail> create(@Valid @RequestBody ArticleCreateReq req) {
        AuthPrincipal p = requireAuth();
        ArticleCreateReq forced = force(req, "DRAFT");
        return R.ok(articleService.create(p.userId(), forced));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新自己的文章（不能改到 PUBLISHED；PUBLISHED 文章需回到 DRAFT 再改）")
    public R<ArticleDetail> update(@PathVariable long id, @Valid @RequestBody ArticleCreateReq req) {
        AuthPrincipal p = requireAuth();
        boolean isAdmin = isAdmin(p.roles());
        Article existing = articleService.requireOwnerOrAdmin(id, p.userId(), isAdmin);
        if (!isAdmin) {
            // author can't self-publish; force status to stay / revert to DRAFT
            if ("PUBLISHED".equalsIgnoreCase(req.status()) || "OFFLINE".equalsIgnoreCase(req.status())) {
                throw new BizException("作者不能直接发布或下架，请提交审核");
            }
            // keep non-author fields they shouldn't be able to set
            req = new ArticleCreateReq(req.title(), req.slug(), req.summary(), req.coverImage(),
                    req.contentMd(), req.categoryId(), req.tags(),
                    req.status() == null ? existing.getStatus() : req.status(),
                    req.seoTitle(), req.seoDescription(), req.seoKeywords(),
                    false, false);
        }
        return R.ok(articleService.update(id, p.userId(), req));
    }

    @PostMapping("/{id}/submit-review")
    @Operation(summary = "提交审核（作者 DRAFT → PENDING）")
    public R<ArticleDetail> submitReview(@PathVariable long id) {
        AuthPrincipal p = requireAuth();
        articleService.requireOwnerOrAdmin(id, p.userId(), isAdmin(p.roles()));
        return R.ok(articleService.submitReview(id, p.userId()));
    }

    // ---------- helpers ----------

    private static AuthPrincipal requireAuth() {
        AuthPrincipal p = CurrentUser.get();
        if (p == null) throw new BizException(401, "请先登录");
        return p;
    }

    private static boolean isAdmin(Collection<String> roles) {
        if (roles == null) return false;
        for (String r : roles) if (ADMIN_ROLES.contains(r)) return true;
        return false;
    }

    private static ArticleCreateReq force(ArticleCreateReq req, String status) {
        return new ArticleCreateReq(req.title(), req.slug(), req.summary(), req.coverImage(),
                req.contentMd(), req.categoryId(), req.tags(), status,
                req.seoTitle(), req.seoDescription(), req.seoKeywords(),
                false, false);
    }
}
