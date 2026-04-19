package com.claudecode.hub.admin.dashboard;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.claudecode.hub.common.domain.ArticleStatus;
import com.claudecode.hub.content.entity.Article;
import com.claudecode.hub.content.entity.Category;
import com.claudecode.hub.content.entity.Showcase;
import com.claudecode.hub.content.entity.Snippet;
import com.claudecode.hub.content.mapper.ArticleMapper;
import com.claudecode.hub.content.mapper.CategoryMapper;
import com.claudecode.hub.content.mapper.ShowcaseMapper;
import com.claudecode.hub.admin.online.OnlineUsersService;
import com.claudecode.hub.content.mapper.SnippetMapper;
import com.claudecode.hub.interaction.entity.Comment;
import com.claudecode.hub.interaction.mapper.CommentMapper;
import com.claudecode.hub.user.entity.User;
import com.claudecode.hub.user.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ArticleMapper articleMapper;
    private final UserMapper userMapper;
    private final CategoryMapper categoryMapper;
    private final SnippetMapper snippetMapper;
    private final ShowcaseMapper showcaseMapper;
    private final CommentMapper commentMapper;
    private final OnlineUsersService onlineUsersService;

    public DashboardService(ArticleMapper articleMapper, UserMapper userMapper,
                            CategoryMapper categoryMapper, SnippetMapper snippetMapper,
                            ShowcaseMapper showcaseMapper, CommentMapper commentMapper,
                            OnlineUsersService onlineUsersService) {
        this.articleMapper = articleMapper;
        this.userMapper = userMapper;
        this.categoryMapper = categoryMapper;
        this.snippetMapper = snippetMapper;
        this.showcaseMapper = showcaseMapper;
        this.commentMapper = commentMapper;
        this.onlineUsersService = onlineUsersService;
    }

    public Map<String, Object> overview() {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalArticles", articleMapper.selectCount(null));
        metrics.put("todayNewArticles", articleMapper.selectCount(new LambdaQueryWrapper<Article>()
                .ge(Article::getCreatedAt, todayStart)));
        metrics.put("totalUsers", userMapper.selectCount(null));
        metrics.put("todayNewUsers", userMapper.selectCount(new LambdaQueryWrapper<User>()
                .ge(User::getCreatedAt, todayStart)));
        long pvSum = articleMapper.selectList(null).stream()
                .mapToLong(a -> a.getViewCount() == null ? 0 : a.getViewCount()).sum();
        metrics.put("todayPv", pvSum); // placeholder until visit_log pipeline lands
        metrics.put("todayUv", onlineUsersService.getOnlineCount());
        metrics.put("totalComments", commentMapper.selectCount(null));
        metrics.put("pendingComments", commentMapper.selectCount(
                new LambdaQueryWrapper<Comment>().eq(Comment::getStatus, 1)));
        metrics.put("totalLikes", articleMapper.selectList(null).stream()
                .mapToLong(a -> a.getLikeCount() == null ? 0 : a.getLikeCount()).sum());
        metrics.put("totalCollects", articleMapper.selectList(null).stream()
                .mapToLong(a -> a.getCollectCount() == null ? 0 : a.getCollectCount()).sum());
        metrics.put("onlineUsers", onlineUsersService.getOnlineCount());

        // Category distribution
        List<Category> cats = categoryMapper.selectList(null);
        long total = cats.stream().mapToLong(c -> articleMapper.selectCount(new LambdaQueryWrapper<Article>()
                .eq(Article::getCategoryId, c.getId())
                .eq(Article::getStatus, ArticleStatus.PUBLISHED.name()))).sum();
        List<Map<String, Object>> catShare = cats.stream().map(c -> {
            long count = articleMapper.selectCount(new LambdaQueryWrapper<Article>()
                    .eq(Article::getCategoryId, c.getId())
                    .eq(Article::getStatus, ArticleStatus.PUBLISHED.name()));
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("name", c.getName());
            row.put("count", count);
            row.put("percent", total > 0 ? Math.round(count * 1000.0 / total) / 10.0 : 0.0);
            return row;
        }).toList();

        // Top articles
        Page<Article> top = articleMapper.selectPage(new Page<>(1, 10),
                new LambdaQueryWrapper<Article>()
                        .eq(Article::getStatus, ArticleStatus.PUBLISHED.name())
                        .orderByDesc(Article::getViewCount, Article::getLikeCount));
        List<Map<String, Object>> topArticles = top.getRecords().stream().map(a -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", a.getId());
            row.put("title", a.getTitle());
            row.put("pv", a.getViewCount());
            row.put("likes", a.getLikeCount());
            User u = userMapper.selectById(a.getAuthorId());
            row.put("author", u == null ? "-" : (u.getNickname() != null ? u.getNickname() : u.getUsername()));
            return row;
        }).toList();

        // Top authors (by published article count)
        List<Article> published = articleMapper.selectList(new LambdaQueryWrapper<Article>()
                .eq(Article::getStatus, ArticleStatus.PUBLISHED.name()));
        Map<Long, long[]> byAuthor = new HashMap<>();
        for (Article a : published) {
            long[] agg = byAuthor.computeIfAbsent(a.getAuthorId(), k -> new long[]{0, 0});
            agg[0] += 1;
            agg[1] += (a.getViewCount() == null ? 0 : a.getViewCount());
        }
        List<Map<String, Object>> topAuthors = byAuthor.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue()[0], a.getValue()[0]))
                .limit(10)
                .map(e -> {
                    User u = userMapper.selectById(e.getKey());
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", e.getKey());
                    row.put("name", u == null ? "-" : (u.getNickname() != null ? u.getNickname() : u.getUsername()));
                    row.put("articles", e.getValue()[0]);
                    row.put("totalPv", e.getValue()[1]);
                    return row;
                })
                .collect(Collectors.toList());

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("metrics", metrics);
        out.put("categoryDistribution", catShare);
        out.put("topArticles", topArticles);
        out.put("topAuthors", topAuthors);
        // Placeholders until visit_log / search_keyword_stats pipelines are implemented
        out.put("trend", Map.of("pv", List.of(), "uv", List.of(), "newUsers", List.of(), "newArticles", List.of()));
        out.put("hotKeywords", List.of());
        out.put("refererDistribution", List.of());
        out.put("regionDistribution", List.of());
        out.put("deviceDistribution", List.of());
        return out;
    }
}
