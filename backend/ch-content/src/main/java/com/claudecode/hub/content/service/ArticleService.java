package com.claudecode.hub.content.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.claudecode.hub.common.api.PageResult;
import com.claudecode.hub.common.exception.BizException;
import com.claudecode.hub.common.util.SlugUtils;
import com.claudecode.hub.content.dto.ContentDtos;
import com.claudecode.hub.content.dto.ContentDtos.ArticleCreateReq;
import com.claudecode.hub.content.dto.ContentDtos.ArticleDetail;
import com.claudecode.hub.content.dto.ContentDtos.ArticleListItem;
import com.claudecode.hub.content.dto.ContentDtos.AuthorBrief;
import com.claudecode.hub.content.dto.ContentDtos.CategoryVO;
import com.claudecode.hub.content.dto.ContentDtos.TagVO;
import com.claudecode.hub.content.entity.Article;
import com.claudecode.hub.content.entity.ArticleTag;
import com.claudecode.hub.content.entity.ArticleVersion;
import com.claudecode.hub.content.entity.Category;
import com.claudecode.hub.content.entity.Tag;
import com.claudecode.hub.content.mapper.ArticleMapper;
import com.claudecode.hub.content.mapper.ArticleTagMapper;
import com.claudecode.hub.content.mapper.ArticleVersionMapper;
import com.claudecode.hub.content.mapper.CategoryMapper;
import com.claudecode.hub.user.entity.User;
import com.claudecode.hub.user.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ArticleService {
    private final ArticleMapper articleMapper;
    private final ArticleTagMapper articleTagMapper;
    private final ArticleVersionMapper versionMapper;
    private final CategoryMapper categoryMapper;
    private final UserMapper userMapper;
    private final TagService tagService;
    private final MarkdownRenderer markdown;

    public ArticleService(ArticleMapper articleMapper,
                          ArticleTagMapper articleTagMapper,
                          ArticleVersionMapper versionMapper,
                          CategoryMapper categoryMapper,
                          UserMapper userMapper,
                          TagService tagService,
                          MarkdownRenderer markdown) {
        this.articleMapper = articleMapper;
        this.articleTagMapper = articleTagMapper;
        this.versionMapper = versionMapper;
        this.categoryMapper = categoryMapper;
        this.userMapper = userMapper;
        this.tagService = tagService;
        this.markdown = markdown;
    }

    public PageResult<ArticleListItem> listPublished(Long categoryId, String tag, String sort,
                                                    long page, long size) {
        Page<Article> p = new Page<>(Math.max(1, page), Math.max(1, Math.min(50, size)));
        LambdaQueryWrapper<Article> qw = new LambdaQueryWrapper<Article>()
                .eq(Article::getStatus, "published");
        if (categoryId != null) qw.eq(Article::getCategoryId, categoryId);
        switch (sort == null ? "latest" : sort) {
            case "hot" -> qw.orderByDesc(Article::getLikeCount, Article::getViewCount);
            case "featured" -> qw.eq(Article::getIsFeatured, true).orderByDesc(Article::getPublishedAt);
            default -> qw.orderByDesc(Article::getPublishedAt, Article::getId);
        }
        Page<Article> paged = articleMapper.selectPage(p, qw);

        // fetch author + tag info in one pass
        Map<Long, User> authors = batchAuthors(paged.getRecords());
        Map<Long, Category> cats = batchCats(paged.getRecords());
        Map<Long, List<String>> tagsByArticle = batchTags(paged.getRecords());

        List<ArticleListItem> items = paged.getRecords().stream().map(a ->
                new ArticleListItem(
                        a.getId(), a.getTitle(), a.getSlug(),
                        catName(cats.get(a.getCategoryId())),
                        a.getSummary(), a.getCoverImage(),
                        briefAuthor(authors.get(a.getAuthorId())),
                        n(a.getViewCount()), n(a.getLikeCount()), n(a.getCommentCount()),
                        tagsByArticle.getOrDefault(a.getId(), List.of()),
                        a.getPublishedAt(),
                        readMinutes(a.getContentMd()))
        ).filter(i -> tag == null || i.tags().contains(tag)).toList();

        return new PageResult<>(items, paged.getTotal(), paged.getCurrent(), paged.getSize());
    }

    public ArticleDetail findBySlugOrId(String key) {
        Article a = articleMapper.selectOne(new LambdaQueryWrapper<Article>().eq(Article::getSlug, key));
        if (a == null) {
            try {
                long id = Long.parseLong(key);
                a = articleMapper.selectById(id);
            } catch (NumberFormatException ignored) {
                // not an id either
            }
        }
        if (a == null) throw new BizException(404, "文章不存在");
        articleMapper.incrView(a.getId());

        User author = userMapper.selectById(a.getAuthorId());
        Category cat = a.getCategoryId() == null ? null : categoryMapper.selectById(a.getCategoryId());
        List<Tag> tags = articleTagMapper.findTagsByArticleId(a.getId());

        return new ArticleDetail(
                a.getId(), a.getTitle(), a.getSlug(), a.getSummary(), a.getCoverImage(),
                a.getContentMd(), a.getContentHtml(),
                briefAuthor(author),
                cat == null ? null : new CategoryVO(cat.getId(), cat.getParentId(), cat.getName(),
                        cat.getSlug(), cat.getIcon(), cat.getDescription(), 0),
                tags.stream().map(t -> new TagVO(t.getId(), t.getName(), t.getSlug(),
                        t.getArticleCount() == null ? 0 : t.getArticleCount())).toList(),
                n(a.getViewCount()) + 1, n(a.getLikeCount()), n(a.getCommentCount()), n(a.getCollectCount()),
                a.getPublishedAt(), readMinutes(a.getContentMd()),
                a.getSeoTitle(), a.getSeoDescription(), a.getSeoKeywords());
    }

    @Transactional
    public ArticleDetail create(long authorId, ArticleCreateReq req) {
        Article a = new Article();
        a.setAuthorId(authorId);
        a.setTitle(req.title());
        a.setSlug(req.slug() == null || req.slug().isBlank()
                ? SlugUtils.slugify(req.title()) + "-" + System.currentTimeMillis() % 100000
                : req.slug());
        a.setSummary(req.summary());
        a.setCoverImage(req.coverImage());
        a.setContentMd(req.contentMd());
        a.setContentHtml(markdown.render(req.contentMd()));
        a.setCategoryId(req.categoryId());
        String status = req.status() == null ? "draft" : req.status();
        a.setStatus(status);
        a.setIsFeatured(Boolean.TRUE.equals(req.isFeatured()));
        a.setIsTop(Boolean.TRUE.equals(req.isTop()));
        a.setViewCount(0); a.setLikeCount(0); a.setCommentCount(0); a.setCollectCount(0);
        a.setSeoTitle(req.seoTitle());
        a.setSeoDescription(req.seoDescription());
        a.setSeoKeywords(req.seoKeywords());
        if ("published".equals(status)) a.setPublishedAt(LocalDateTime.now());
        articleMapper.insert(a);

        attachTags(a.getId(), req.tags());
        snapshot(a, authorId);
        return findBySlugOrId(String.valueOf(a.getId()));
    }

    @Transactional
    public ArticleDetail update(long id, long editorId, ArticleCreateReq req) {
        Article a = articleMapper.selectById(id);
        if (a == null) throw new BizException(404, "文章不存在");
        a.setTitle(req.title());
        if (req.slug() != null && !req.slug().isBlank()) a.setSlug(req.slug());
        a.setSummary(req.summary());
        a.setCoverImage(req.coverImage());
        a.setContentMd(req.contentMd());
        a.setContentHtml(markdown.render(req.contentMd()));
        a.setCategoryId(req.categoryId());
        String status = req.status() == null ? a.getStatus() : req.status();
        if (!status.equals(a.getStatus()) && "published".equals(status) && a.getPublishedAt() == null) {
            a.setPublishedAt(LocalDateTime.now());
        }
        a.setStatus(status);
        a.setIsFeatured(Boolean.TRUE.equals(req.isFeatured()));
        a.setIsTop(Boolean.TRUE.equals(req.isTop()));
        a.setSeoTitle(req.seoTitle());
        a.setSeoDescription(req.seoDescription());
        a.setSeoKeywords(req.seoKeywords());
        articleMapper.updateById(a);

        // re-attach tags (delete + insert)
        articleTagMapper.delete(new LambdaQueryWrapper<ArticleTag>().eq(ArticleTag::getArticleId, id));
        attachTags(id, req.tags());

        snapshot(a, editorId);
        return findBySlugOrId(String.valueOf(id));
    }

    @Transactional
    public void delete(long id) {
        articleMapper.deleteById(id);
        articleTagMapper.delete(new LambdaQueryWrapper<ArticleTag>().eq(ArticleTag::getArticleId, id));
    }

    public List<ArticleVersion> versions(long articleId) {
        return versionMapper.selectList(new LambdaQueryWrapper<ArticleVersion>()
                .eq(ArticleVersion::getArticleId, articleId)
                .orderByDesc(ArticleVersion::getVersion));
    }

    public List<ArticleListItem> hot(int limit) {
        Page<Article> p = new Page<>(1, limit);
        Page<Article> paged = articleMapper.selectPage(p, new LambdaQueryWrapper<Article>()
                .eq(Article::getStatus, "published")
                .orderByDesc(Article::getLikeCount, Article::getViewCount));
        Map<Long, User> authors = batchAuthors(paged.getRecords());
        Map<Long, Category> cats = batchCats(paged.getRecords());
        Map<Long, List<String>> tagsByArticle = batchTags(paged.getRecords());
        return paged.getRecords().stream().map(a ->
                new ArticleListItem(a.getId(), a.getTitle(), a.getSlug(),
                        catName(cats.get(a.getCategoryId())), a.getSummary(), a.getCoverImage(),
                        briefAuthor(authors.get(a.getAuthorId())),
                        n(a.getViewCount()), n(a.getLikeCount()), n(a.getCommentCount()),
                        tagsByArticle.getOrDefault(a.getId(), List.of()),
                        a.getPublishedAt(), readMinutes(a.getContentMd()))
        ).toList();
    }

    private void attachTags(long articleId, List<String> names) {
        if (names == null) return;
        for (String name : names.stream().filter(s -> s != null && !s.isBlank()).distinct().limit(5).toList()) {
            Tag t = tagService.upsert(name.trim());
            ArticleTag at = new ArticleTag();
            at.setArticleId(articleId);
            at.setTagId(t.getId());
            articleTagMapper.insert(at);
        }
    }

    private void snapshot(Article a, long editorId) {
        Long maxV = versionMapper.selectCount(new LambdaQueryWrapper<ArticleVersion>()
                .eq(ArticleVersion::getArticleId, a.getId()));
        ArticleVersion v = new ArticleVersion();
        v.setArticleId(a.getId());
        v.setVersion(maxV.intValue() + 1);
        v.setContentMd(a.getContentMd());
        v.setEditorId(editorId);
        versionMapper.insert(v);
    }

    private Map<Long, User> batchAuthors(List<Article> rows) {
        Set<Long> ids = rows.stream().map(Article::getAuthorId).filter(Objects::nonNull).collect(Collectors.toSet());
        if (ids.isEmpty()) return Map.of();
        return userMapper.selectBatchIds(ids).stream().collect(Collectors.toMap(User::getId, u -> u));
    }

    private Map<Long, Category> batchCats(List<Article> rows) {
        Set<Long> ids = rows.stream().map(Article::getCategoryId).filter(Objects::nonNull).collect(Collectors.toSet());
        if (ids.isEmpty()) return Map.of();
        return categoryMapper.selectBatchIds(ids).stream().collect(Collectors.toMap(Category::getId, c -> c));
    }

    private Map<Long, List<String>> batchTags(List<Article> rows) {
        Map<Long, List<String>> out = new HashMap<>();
        for (Article a : rows) {
            List<Tag> ts = articleTagMapper.findTagsByArticleId(a.getId());
            out.put(a.getId(), ts.stream().map(Tag::getName).toList());
        }
        return out;
    }

    private AuthorBrief briefAuthor(User u) {
        if (u == null) return new AuthorBrief(0, "匿名", "·", null);
        String name = u.getNickname() != null && !u.getNickname().isBlank() ? u.getNickname() : u.getUsername();
        String initial = name == null || name.isEmpty() ? "·" : name.substring(0, 1);
        return new AuthorBrief(u.getId(), name, initial.toUpperCase(), u.getAvatar());
    }

    private String catName(Category c) {
        return c == null ? null : c.getName();
    }

    private int n(Integer v) {
        return v == null ? 0 : v;
    }

    private int readMinutes(String md) {
        if (md == null) return 1;
        return Math.max(1, (int) Math.ceil(md.length() / 400.0));
    }
}
