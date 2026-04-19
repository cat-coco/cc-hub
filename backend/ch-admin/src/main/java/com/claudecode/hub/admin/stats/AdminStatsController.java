package com.claudecode.hub.admin.stats;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.claudecode.hub.common.api.PageResult;
import com.claudecode.hub.common.api.R;
import com.claudecode.hub.common.domain.ArticleStatus;
import com.claudecode.hub.content.entity.Article;
import com.claudecode.hub.content.entity.Category;
import com.claudecode.hub.content.mapper.ArticleMapper;
import com.claudecode.hub.content.mapper.CategoryMapper;
import com.claudecode.hub.user.entity.User;
import com.claudecode.hub.user.mapper.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/stats")
@Tag(name = "Admin · Stats")
public class AdminStatsController {

    private final ArticleMapper articleMapper;
    private final CategoryMapper categoryMapper;
    private final UserMapper userMapper;

    public AdminStatsController(ArticleMapper articleMapper, CategoryMapper categoryMapper, UserMapper userMapper) {
        this.articleMapper = articleMapper;
        this.categoryMapper = categoryMapper;
        this.userMapper = userMapper;
    }

    // ---------- /api/admin/stats/articles ----------

    @GetMapping("/articles")
    @Operation(summary = "文章维度分析")
    public R<PageResult<Map<String, Object>>> articles(
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "20") long size) {
        LambdaQueryWrapper<Article> qw = new LambdaQueryWrapper<Article>()
                .eq(Article::getStatus, ArticleStatus.PUBLISHED.name());
        switch (sort == null ? "pv" : sort) {
            case "likes" -> qw.orderByDesc(Article::getLikeCount);
            case "comments" -> qw.orderByDesc(Article::getCommentCount);
            default -> qw.orderByDesc(Article::getViewCount);
        }
        Page<Article> paged = articleMapper.selectPage(new Page<>(page, size), qw);
        List<Map<String, Object>> rows = paged.getRecords().stream().map(a -> {
            User u = userMapper.selectById(a.getAuthorId());
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", a.getId());
            row.put("title", a.getTitle());
            row.put("author", u == null ? "-" : (u.getNickname() != null ? u.getNickname() : u.getUsername()));
            row.put("pv", a.getViewCount());
            row.put("likes", a.getLikeCount());
            row.put("comments", a.getCommentCount());
            row.put("publishedAt", a.getPublishedAt());
            return row;
        }).toList();
        return R.ok(new PageResult<>(rows, paged.getTotal(), paged.getCurrent(), paged.getSize()));
    }

    // ---------- /api/admin/stats/categories ----------

    @GetMapping("/categories")
    public R<List<Map<String, Object>>> categories() {
        return R.ok(categoryMapper.selectList(null).stream().map(this::catStat).toList());
    }

    private Map<String, Object> catStat(Category c) {
        List<Article> arts = articleMapper.selectList(new LambdaQueryWrapper<Article>()
                .eq(Article::getCategoryId, c.getId())
                .eq(Article::getStatus, ArticleStatus.PUBLISHED.name()));
        long pv = arts.stream().mapToLong(a -> a.getViewCount() == null ? 0 : a.getViewCount()).sum();
        long likes = arts.stream().mapToLong(a -> a.getLikeCount() == null ? 0 : a.getLikeCount()).sum();
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", c.getId());
        row.put("name", c.getName());
        row.put("articles", arts.size());
        row.put("totalPv", pv);
        row.put("totalLikes", likes);
        return row;
    }

    // ---------- /api/admin/stats/authors ----------

    @GetMapping("/authors")
    public R<List<Map<String, Object>>> authors(@RequestParam(defaultValue = "20") int limit) {
        List<Article> all = articleMapper.selectList(new LambdaQueryWrapper<Article>()
                .eq(Article::getStatus, ArticleStatus.PUBLISHED.name()));
        Map<Long, long[]> agg = new HashMap<>();
        for (Article a : all) {
            long[] slot = agg.computeIfAbsent(a.getAuthorId(), k -> new long[]{0, 0, 0});
            slot[0] += 1;
            slot[1] += n(a.getViewCount());
            slot[2] += n(a.getLikeCount());
        }
        return R.ok(agg.entrySet().stream()
                .sorted((x, y) -> Long.compare(y.getValue()[1], x.getValue()[1]))
                .limit(limit)
                .map(e -> {
                    User u = userMapper.selectById(e.getKey());
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", e.getKey());
                    row.put("name", u == null ? "-" : (u.getNickname() != null ? u.getNickname() : u.getUsername()));
                    row.put("articles", e.getValue()[0]);
                    row.put("totalPv", e.getValue()[1]);
                    row.put("totalLikes", e.getValue()[2]);
                    return row;
                })
                .collect(Collectors.toList()));
    }

    // ---------- /api/admin/stats/keywords ----------

    @GetMapping("/keywords")
    @Operation(summary = "搜索词热榜（待 search_keyword_stats 采集上线；当前返回空列表）")
    public R<List<Map<String, Object>>> keywords() {
        return R.ok(List.of());
    }

    // ---------- /api/admin/stats/export ----------

    @GetMapping(value = "/export", produces = "text/csv; charset=UTF-8")
    public ResponseEntity<String> exportCsv() {
        StringBuilder sb = new StringBuilder("id,title,author,pv,likes,comments,publishedAt\n");
        for (Article a : articleMapper.selectList(null)) {
            User u = userMapper.selectById(a.getAuthorId());
            sb.append(a.getId()).append(',')
              .append('"').append((a.getTitle() == null ? "" : a.getTitle()).replace("\"", "\"\"")).append('"').append(',')
              .append(u == null ? "-" : (u.getNickname() != null ? u.getNickname() : u.getUsername())).append(',')
              .append(n(a.getViewCount())).append(',')
              .append(n(a.getLikeCount())).append(',')
              .append(n(a.getCommentCount())).append(',')
              .append(a.getPublishedAt() == null ? "" : a.getPublishedAt()).append('\n');
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .header("Content-Disposition", "attachment; filename=articles.csv")
                .body(sb.toString());
    }

    private long n(Integer v) { return v == null ? 0 : v; }
}
