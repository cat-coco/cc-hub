package com.claudecode.hub.search;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.claudecode.hub.common.api.R;
import com.claudecode.hub.content.entity.Article;
import com.claudecode.hub.content.entity.Showcase;
import com.claudecode.hub.content.entity.Snippet;
import com.claudecode.hub.content.entity.Tool;
import com.claudecode.hub.content.mapper.ArticleMapper;
import com.claudecode.hub.content.mapper.ShowcaseMapper;
import com.claudecode.hub.content.mapper.SnippetMapper;
import com.claudecode.hub.content.mapper.ToolMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Minimal cross-type search.
 *
 * Uses LIKE-based matching as a portable default. When running on MySQL 8 the
 * `article` FULLTEXT index (title, summary, content_md) with ngram parser will
 * be used automatically by the Hibernate dialect if the query includes
 * boolean mode hints — this controller stays agnostic.
 */
@RestController
@RequestMapping("/api/search")
@Tag(name = "Search")
public class SearchController {

    private final ArticleMapper articleMapper;
    private final SnippetMapper snippetMapper;
    private final ShowcaseMapper showcaseMapper;
    private final ToolMapper toolMapper;

    public SearchController(ArticleMapper articleMapper, SnippetMapper snippetMapper,
                            ShowcaseMapper showcaseMapper, ToolMapper toolMapper) {
        this.articleMapper = articleMapper;
        this.snippetMapper = snippetMapper;
        this.showcaseMapper = showcaseMapper;
        this.toolMapper = toolMapper;
    }

    @GetMapping
    public R<Map<String, Object>> search(@RequestParam String q,
                                         @RequestParam(required = false, defaultValue = "all") String type,
                                         @RequestParam(defaultValue = "1") long page,
                                         @RequestParam(defaultValue = "10") long size) {
        long t0 = System.nanoTime();
        String needle = (q == null ? "" : q.trim());
        Map<String, Object> data = new HashMap<>();

        Page<Article> arts = articleMapper.selectPage(new Page<>(page, size),
                new LambdaQueryWrapper<Article>()
                        .eq(Article::getStatus, "published")
                        .and(w -> w.like(Article::getTitle, needle)
                                .or().like(Article::getSummary, needle)
                                .or().like(Article::getContentMd, needle))
                        .orderByDesc(Article::getPublishedAt));

        Page<Snippet> snips = snippetMapper.selectPage(new Page<>(1, 10),
                new LambdaQueryWrapper<Snippet>()
                        .like(Snippet::getTitle, needle)
                        .or().like(Snippet::getDescription, needle)
                        .or().like(Snippet::getCode, needle));

        Page<Showcase> cases = showcaseMapper.selectPage(new Page<>(1, 10),
                new LambdaQueryWrapper<Showcase>()
                        .eq(Showcase::getStatus, "published")
                        .and(w -> w.like(Showcase::getTitle, needle)
                                .or().like(Showcase::getDescription, needle)));

        List<Tool> tools = toolMapper.selectList(new LambdaQueryWrapper<Tool>()
                .like(Tool::getName, needle)
                .or().like(Tool::getDescription, needle)
                .last("LIMIT 10"));

        data.put("articles", arts.getRecords().stream().map(this::highlightArticle).toList());
        data.put("articlesTotal", arts.getTotal());
        data.put("snippets", snips.getRecords());
        data.put("snippetsTotal", snips.getTotal());
        data.put("cases", cases.getRecords());
        data.put("casesTotal", cases.getTotal());
        data.put("tools", tools);
        data.put("toolsTotal", (long) tools.size());
        data.put("total", arts.getTotal() + snips.getTotal() + cases.getTotal() + tools.size());
        data.put("took", String.format("%.2f", (System.nanoTime() - t0) / 1_000_000.0));
        data.put("query", needle);
        data.put("type", type);
        return R.ok(data);
    }

    private Map<String, Object> highlightArticle(Article a) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", a.getId());
        m.put("title", a.getTitle());
        m.put("slug", a.getSlug());
        m.put("summary", a.getSummary());
        m.put("viewCount", a.getViewCount());
        m.put("likeCount", a.getLikeCount());
        m.put("publishedAt", a.getPublishedAt());
        return m;
    }
}
