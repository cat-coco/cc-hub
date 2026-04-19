package com.claudecode.hub.content.admin;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.claudecode.hub.common.api.R;
import com.claudecode.hub.common.exception.BizException;
import com.claudecode.hub.common.util.SlugUtils;
import com.claudecode.hub.content.entity.ArticleTag;
// imported fully-qualified below to avoid clash with Swagger @Tag
import com.claudecode.hub.content.entity.TagAlias;
import com.claudecode.hub.content.mapper.ArticleTagMapper;
import com.claudecode.hub.content.mapper.TagAliasMapper;
import com.claudecode.hub.content.mapper.TagMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("/api/admin/tags")
@Tag(name = "Admin · Tags")
public class AdminTagController {

    private final TagMapper tagMapper;
    private final TagAliasMapper aliasMapper;
    private final ArticleTagMapper articleTagMapper;

    public AdminTagController(TagMapper tagMapper, TagAliasMapper aliasMapper, ArticleTagMapper articleTagMapper) {
        this.tagMapper = tagMapper;
        this.aliasMapper = aliasMapper;
        this.articleTagMapper = articleTagMapper;
    }

    public record MergeReq(@NotEmpty List<Long> sourceIds, @NotNull Long targetId) {}
    public record AliasReq(@NotBlank String alias) {}
    public record BatchReplaceReq(@NotNull Long fromTagId, @NotNull Long toTagId) {}
    public record MergeResp(long movedArticles) {}

    @PostMapping("/merge")
    @Operation(summary = "合并标签 —— 所有 sourceIds 文章挂到 targetId，并删除 source")
    @Transactional
    public R<MergeResp> merge(@Valid @RequestBody MergeReq req) {
        if (req.sourceIds().contains(req.targetId())) throw new BizException("目标不能出现在源列表中");
        if (tagMapper.selectById(req.targetId()) == null) throw new BizException(404, "目标标签不存在");
        long moved = 0;
        for (Long sourceId : new HashSet<>(req.sourceIds())) {
            if (sourceId == null || sourceId.equals(req.targetId())) continue;
            moved += moveArticleTags(sourceId, req.targetId());
            aliasMapper.delete(new LambdaQueryWrapper<TagAlias>().eq(TagAlias::getTagId, sourceId));
            tagMapper.deleteById(sourceId);
        }
        recountArticles(req.targetId());
        return R.ok(new MergeResp(moved));
    }

    @PostMapping("/batch-replace")
    @Operation(summary = "批量替换 —— 把某个旧标签统一替换为新标签（不删除源标签）")
    @Transactional
    public R<MergeResp> batchReplace(@Valid @RequestBody BatchReplaceReq req) {
        if (req.fromTagId().equals(req.toTagId())) throw new BizException("fromTagId 与 toTagId 相同");
        long moved = moveArticleTags(req.fromTagId(), req.toTagId());
        recountArticles(req.fromTagId());
        recountArticles(req.toTagId());
        return R.ok(new MergeResp(moved));
    }

    @PostMapping("/{id}/aliases")
    @Operation(summary = "添加别名")
    public R<TagAlias> addAlias(@PathVariable long id, @Valid @RequestBody AliasReq req) {
        if (tagMapper.selectById(id) == null) throw new BizException(404, "标签不存在");
        if (aliasMapper.selectCount(new LambdaQueryWrapper<TagAlias>().eq(TagAlias::getAlias, req.alias())) > 0) {
            throw new BizException("该别名已被使用");
        }
        TagAlias a = new TagAlias();
        a.setTagId(id);
        a.setAlias(req.alias().trim());
        aliasMapper.insert(a);
        return R.ok(a);
    }

    @DeleteMapping("/aliases/{aliasId}")
    public R<Void> removeAlias(@PathVariable long aliasId) {
        aliasMapper.deleteById(aliasId);
        return R.ok();
    }

    @GetMapping("/{id}/aliases")
    public R<List<TagAlias>> aliases(@PathVariable long id) {
        return R.ok(aliasMapper.selectList(new LambdaQueryWrapper<TagAlias>().eq(TagAlias::getTagId, id)));
    }

    // ---------- helpers ----------

    private long moveArticleTags(Long sourceId, Long targetId) {
        List<ArticleTag> rows = articleTagMapper.selectList(
                new LambdaQueryWrapper<ArticleTag>().eq(ArticleTag::getTagId, sourceId));
        long moved = 0;
        for (ArticleTag row : rows) {
            // avoid dup; if article already tagged with target, just drop source
            Long existing = articleTagMapper.selectCount(new LambdaQueryWrapper<ArticleTag>()
                    .eq(ArticleTag::getArticleId, row.getArticleId())
                    .eq(ArticleTag::getTagId, targetId));
            articleTagMapper.delete(new LambdaQueryWrapper<ArticleTag>()
                    .eq(ArticleTag::getArticleId, row.getArticleId())
                    .eq(ArticleTag::getTagId, sourceId));
            if (existing == 0) {
                ArticleTag at = new ArticleTag();
                at.setArticleId(row.getArticleId());
                at.setTagId(targetId);
                articleTagMapper.insert(at);
            }
            moved++;
        }
        return moved;
    }

    private void recountArticles(Long tagId) {
        com.claudecode.hub.content.entity.Tag t = tagMapper.selectById(tagId);
        if (t == null) return;
        Long cnt = articleTagMapper.selectCount(new LambdaQueryWrapper<ArticleTag>().eq(ArticleTag::getTagId, tagId));
        t.setArticleCount(cnt.intValue());
        t.setSlug(t.getSlug() == null ? SlugUtils.slugify(t.getName()) : t.getSlug());
        tagMapper.updateById(t);
    }
}
