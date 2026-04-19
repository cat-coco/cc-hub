package com.claudecode.hub.content.admin;

import com.claudecode.hub.common.api.R;
import com.claudecode.hub.common.audit.Audit;
import com.claudecode.hub.common.lock.EditLockService;
import com.claudecode.hub.common.lock.LockInfo;
import com.claudecode.hub.common.lock.LockResult;
import com.claudecode.hub.content.dto.ContentDtos.ArticleCreateReq;
import com.claudecode.hub.content.dto.ContentDtos.ArticleDetail;
import com.claudecode.hub.content.dto.ContentDtos.RejectReq;
import com.claudecode.hub.content.entity.ArticleVersion;
import com.claudecode.hub.content.service.ArticleService;
import com.claudecode.hub.security.AuthPrincipal;
import com.claudecode.hub.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/articles")
@Tag(name = "Admin · Articles", description = "后台文章管理 + 生命周期")
public class AdminArticleController {
    private final ArticleService articleService;
    private final EditLockService lockService;

    public AdminArticleController(ArticleService articleService, EditLockService lockService) {
        this.articleService = articleService;
        this.lockService = lockService;
    }

    // ---------- CRUD ----------

    @GetMapping
    @Operation(summary = "后台文章列表（任意状态；status=PENDING 供待审核队列）")
    public R<com.claudecode.hub.common.api.PageResult<com.claudecode.hub.content.dto.ContentDtos.ArticleListItem>> list(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String status,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Long categoryId,
            @org.springframework.web.bind.annotation.RequestParam(required = false, defaultValue = "updated") String sort,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "1") long page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "20") long size) {
        return R.ok(articleService.listForAdmin(status, categoryId, sort, page, size));
    }

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

    @GetMapping("/{id}/versions/{versionNo}")
    @Operation(summary = "获取某个历史版本正文（用于 diff 或回填）")
    public R<ArticleVersion> version(@PathVariable long id, @PathVariable int versionNo) {
        return R.ok(articleService.version(id, versionNo));
    }

    // ---------- Lifecycle transitions (batch 1) ----------

    @Audit(type = "ARTICLE_OP", action = "SUBMIT_REVIEW", resourceType = "Article")
    @PostMapping("/{id}/submit-review")
    @Operation(summary = "提交审核 (DRAFT → PENDING)")
    public R<ArticleDetail> submitReview(@PathVariable long id) {
        return R.ok(articleService.submitReview(id, CurrentUser.requireId()));
    }

    @Audit(type = "ARTICLE_OP", action = "APPROVE", resourceType = "Article")
    @PostMapping("/{id}/approve")
    @Operation(summary = "审核通过 (PENDING → PUBLISHED)")
    public R<ArticleDetail> approve(@PathVariable long id) {
        return R.ok(articleService.approve(id, CurrentUser.requireId()));
    }

    @Audit(type = "ARTICLE_OP", action = "REJECT", resourceType = "Article")
    @PostMapping("/{id}/reject")
    @Operation(summary = "驳回审核 (PENDING → DRAFT)")
    public R<ArticleDetail> reject(@PathVariable long id, @Valid @RequestBody RejectReq req) {
        return R.ok(articleService.reject(id, CurrentUser.requireId(), req.remark()));
    }

    @Audit(type = "ARTICLE_OP", action = "PUBLISH", resourceType = "Article")
    @PostMapping("/{id}/publish")
    @Operation(summary = "直接发布 (DRAFT / OFFLINE → PUBLISHED)")
    public R<ArticleDetail> publish(@PathVariable long id) {
        return R.ok(articleService.publish(id, CurrentUser.requireId()));
    }

    @Audit(type = "ARTICLE_OP", action = "UNPUBLISH", resourceType = "Article")
    @PostMapping("/{id}/unpublish")
    @Operation(summary = "撤回发布 (PUBLISHED → DRAFT)")
    public R<ArticleDetail> unpublish(@PathVariable long id) {
        return R.ok(articleService.unpublish(id, CurrentUser.requireId()));
    }

    @Audit(type = "ARTICLE_OP", action = "OFFLINE", resourceType = "Article")
    @PostMapping("/{id}/offline")
    @Operation(summary = "下架 (PUBLISHED → OFFLINE)")
    public R<ArticleDetail> offline(@PathVariable long id) {
        return R.ok(articleService.offline(id, CurrentUser.requireId()));
    }

    @Audit(type = "ARTICLE_OP", action = "DUPLICATE", resourceType = "Article")
    @PostMapping("/{id}/duplicate")
    @Operation(summary = "复制为新文章（草稿）")
    public R<ArticleDetail> duplicate(@PathVariable long id) {
        return R.ok(articleService.duplicate(id, CurrentUser.requireId()));
    }

    // ---------- Edit lock (batch 2) ----------

    @PostMapping("/{id}/acquire-lock")
    @Operation(summary = "抢锁。成功返回 {acquired:true, info}；冲突返回 {acquired:false, info}")
    public R<LockResult> acquireLock(@PathVariable long id) {
        AuthPrincipal p = CurrentUser.get();
        if (p == null) throw new com.claudecode.hub.common.exception.BizException(401, "未登录");
        return R.ok(lockService.acquire(id, p.userId(), p.username()));
    }

    @PostMapping("/{id}/heartbeat")
    @Operation(summary = "心跳续期（60s 调一次）")
    public R<Void> heartbeat(@PathVariable long id) {
        lockService.heartbeat(id, CurrentUser.requireId());
        return R.ok();
    }

    @PostMapping("/{id}/release-lock")
    @Operation(summary = "主动释放")
    public R<Void> releaseLock(@PathVariable long id) {
        lockService.release(id, CurrentUser.requireId());
        return R.ok();
    }

    @Audit(type = "ARTICLE_OP", action = "FORCE_UNLOCK", resourceType = "Article")
    @PostMapping("/{id}/force-unlock")
    @Operation(summary = "强制解锁（仅超管）")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public R<Void> forceUnlock(@PathVariable long id) {
        lockService.forceUnlock(id);
        return R.ok();
    }

    @GetMapping("/{id}/lock")
    @Operation(summary = "查看当前锁持有者")
    public R<LockInfo> peekLock(@PathVariable long id) {
        return R.ok(lockService.peek(id));
    }
}
