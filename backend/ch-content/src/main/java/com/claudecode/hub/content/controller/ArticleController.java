package com.claudecode.hub.content.controller;

import com.claudecode.hub.common.api.PageResult;
import com.claudecode.hub.common.api.R;
import com.claudecode.hub.content.dto.ContentDtos.ArticleDetail;
import com.claudecode.hub.content.dto.ContentDtos.ArticleListItem;
import com.claudecode.hub.content.service.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/articles")
@Tag(name = "Articles", description = "文章公共接口")
public class ArticleController {
    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    @Operation(summary = "文章列表 (published)")
    public R<PageResult<ArticleListItem>> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false, defaultValue = "latest") String sort,
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "10") long size) {
        return R.ok(articleService.listPublished(categoryId, tag, sort, page, size));
    }

    @GetMapping("/hot")
    @Operation(summary = "本周热门")
    public R<java.util.List<ArticleListItem>> hot(@RequestParam(defaultValue = "6") int limit) {
        return R.ok(articleService.hot(limit));
    }

    @GetMapping("/{key}")
    @Operation(summary = "按 slug 或 id 获取详情 (自动 +1 阅读)")
    public R<ArticleDetail> detail(@PathVariable String key) {
        return R.ok(articleService.findBySlugOrId(key));
    }
}
