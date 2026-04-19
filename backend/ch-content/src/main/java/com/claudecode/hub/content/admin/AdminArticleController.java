package com.claudecode.hub.content.admin;

import com.claudecode.hub.common.api.R;
import com.claudecode.hub.content.dto.ContentDtos.ArticleCreateReq;
import com.claudecode.hub.content.dto.ContentDtos.ArticleDetail;
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
@Tag(name = "Admin · Articles", description = "后台文章管理")
public class AdminArticleController {
    private final ArticleService articleService;

    public AdminArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @PostMapping
    @Operation(summary = "创建文章")
    public R<ArticleDetail> create(@Valid @RequestBody ArticleCreateReq req) {
        return R.ok(articleService.create(CurrentUser.requireId(), req));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新文章")
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
}
