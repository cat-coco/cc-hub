package com.claudecode.hub.content.admin;

import com.claudecode.hub.common.api.R;
import com.claudecode.hub.content.dto.ContentDtos.ArticleCreateReq;
import com.claudecode.hub.content.dto.ContentDtos.ArticleDetail;
import com.claudecode.hub.content.dto.ContentDtos.RejectReq;
import com.claudecode.hub.content.entity.ArticleVersion;
import com.claudecode.hub.content.service.ArticleService;
import com.claudecode.hub.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/articles")
@Tag(name = "Admin · Articles", description = "后台文章管理 + 生命周期")
public class AdminArticleController {
    private final ArticleService articleService;

    public AdminArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    // ---------- CRUD ----------

    @PostMapping
    @Operation(summary = "创建文章（status 未指定时默认 DRAFT）")
    public R<ArticleDetail> create(@Valid @RequestBody ArticleCreateReq req) {
        return R.ok(articleService.create(CurrentUser.requireId(), req));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新文章（status 变更会走状态机校验）")
    public R<ArticleDetail> update(@PathVariable long id, @Valid @RequestBody ArticleCreateReq req) {
        return R.ok(articleService.update(id, CurrentUser.requireId(), req));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除文章")
    public R<Void> delete(@PathVariable long id) {
        articleService.delete(id);
        return R.ok();
    }

    @GetMapping("/{id}/versions")
    @Operation(summary = "文章历史版本列表")
    public R<List<ArticleVersion>> versions(@PathVariable long id) {
        return R.ok(articleService.versions(id));
    }

    // ---------- Lifecycle transitions (batch 1) ----------

    @PostMapping("/{id}/submit-review")
    @Operation(summary = "提交审核 (DRAFT → PENDING)")
    public R<ArticleDetail> submitReview(@PathVariable long id) {
        return R.ok(articleService.submitReview(id, CurrentUser.requireId()));
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "审核通过 (PENDING → PUBLISHED)")
    public R<ArticleDetail> approve(@PathVariable long id) {
        return R.ok(articleService.approve(id, CurrentUser.requireId()));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "驳回审核 (PENDING → DRAFT)")
    public R<ArticleDetail> reject(@PathVariable long id, @Valid @RequestBody RejectReq req) {
        return R.ok(articleService.reject(id, CurrentUser.requireId(), req.remark()));
    }

    @PostMapping("/{id}/publish")
    @Operation(summary = "直接发布 (DRAFT / OFFLINE → PUBLISHED)")
    public R<ArticleDetail> publish(@PathVariable long id) {
        return R.ok(articleService.publish(id, CurrentUser.requireId()));
    }

    @PostMapping("/{id}/unpublish")
    @Operation(summary = "撤回发布 (PUBLISHED → DRAFT)")
    public R<ArticleDetail> unpublish(@PathVariable long id) {
        return R.ok(articleService.unpublish(id, CurrentUser.requireId()));
    }

    @PostMapping("/{id}/offline")
    @Operation(summary = "下架 (PUBLISHED → OFFLINE)")
    public R<ArticleDetail> offline(@PathVariable long id) {
        return R.ok(articleService.offline(id, CurrentUser.requireId()));
    }
}
