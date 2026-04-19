package com.claudecode.hub.stats;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.claudecode.hub.common.api.R;
import com.claudecode.hub.content.entity.Article;
import com.claudecode.hub.content.entity.Category;
import com.claudecode.hub.content.entity.Showcase;
import com.claudecode.hub.content.entity.Snippet;
import com.claudecode.hub.content.mapper.ArticleMapper;
import com.claudecode.hub.content.mapper.CategoryMapper;
import com.claudecode.hub.content.mapper.ShowcaseMapper;
import com.claudecode.hub.content.mapper.SnippetMapper;
import com.claudecode.hub.user.entity.User;
import com.claudecode.hub.user.mapper.UserMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Stats")
public class StatsController {

    private final ArticleMapper articleMapper;
    private final SnippetMapper snippetMapper;
    private final ShowcaseMapper showcaseMapper;
    private final CategoryMapper categoryMapper;
    private final UserMapper userMapper;

    public StatsController(ArticleMapper articleMapper, SnippetMapper snippetMapper,
                           ShowcaseMapper showcaseMapper, CategoryMapper categoryMapper,
                           UserMapper userMapper) {
        this.articleMapper = articleMapper;
        this.snippetMapper = snippetMapper;
        this.showcaseMapper = showcaseMapper;
        this.categoryMapper = categoryMapper;
        this.userMapper = userMapper;
    }

    /** Public "hero numbers" for the home page. */
    @GetMapping("/stats/public/overview")
    public R<Map<String, Long>> publicOverview() {
        Map<String, Long> m = new HashMap<>();
        m.put("articles", articleMapper.selectCount(new LambdaQueryWrapper<Article>()
                .eq(Article::getStatus, "published")));
        m.put("cases", showcaseMapper.selectCount(new LambdaQueryWrapper<Showcase>()
                .eq(Showcase::getStatus, "published")));
        m.put("snippets", snippetMapper.selectCount(null));
        m.put("users", userMapper.selectCount(null));
        return R.ok(m);
    }

    /** Admin dashboard payload. */
    @GetMapping("/admin/stats/dashboard")
    public R<Map<String, Object>> dashboard() {
        Map<String, Object> out = new HashMap<>();
        out.put("totalArticles", articleMapper.selectCount(null));
        out.put("totalUsers", userMapper.selectCount(null));
        out.put("totalSnippets", snippetMapper.selectCount(null));
        out.put("totalCases", showcaseMapper.selectCount(null));

        // category share
        List<Category> cats = categoryMapper.selectList(null);
        List<Map<String, Object>> share = cats.stream().map(c -> {
            Long count = articleMapper.selectCount(new LambdaQueryWrapper<Article>()
                    .eq(Article::getCategoryId, c.getId())
                    .eq(Article::getStatus, "published"));
            Map<String, Object> row = new HashMap<>();
            row.put("name", c.getName());
            row.put("count", count);
            return row;
        }).toList();
        out.put("categoryShare", share);

        // Top articles
        Page<Article> top = articleMapper.selectPage(new Page<>(1, 8),
                new LambdaQueryWrapper<Article>()
                        .eq(Article::getStatus, "published")
                        .orderByDesc(Article::getViewCount, Article::getLikeCount));
        List<Map<String, Object>> topRows = top.getRecords().stream().map(a -> {
            Map<String, Object> row = new HashMap<>();
            row.put("id", a.getId());
            row.put("title", a.getTitle());
            User u = userMapper.selectById(a.getAuthorId());
            row.put("author", u == null ? "-" : (u.getNickname() != null ? u.getNickname() : u.getUsername()));
            Category c = a.getCategoryId() == null ? null : categoryMapper.selectById(a.getCategoryId());
            row.put("category", c == null ? "" : c.getName());
            row.put("pv", a.getViewCount());
            row.put("likes", a.getLikeCount());
            row.put("comments", a.getCommentCount());
            return row;
        }).toList();
        out.put("topArticles", topRows);

        return R.ok(out);
    }
}
