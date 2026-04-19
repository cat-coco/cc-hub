package com.claudecode.hub.content.admin;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.claudecode.hub.common.api.R;
import com.claudecode.hub.common.exception.BizException;
import com.claudecode.hub.content.entity.Article;
import com.claudecode.hub.content.entity.Category;
import com.claudecode.hub.content.mapper.ArticleMapper;
import com.claudecode.hub.content.mapper.CategoryMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@Tag(name = "Admin · Categories")
public class AdminCategoryController {

    private final CategoryMapper categoryMapper;
    private final ArticleMapper articleMapper;

    public AdminCategoryController(CategoryMapper categoryMapper, ArticleMapper articleMapper) {
        this.categoryMapper = categoryMapper;
        this.articleMapper = articleMapper;
    }

    public record MergeReq(@NotNull Long sourceId, @NotNull Long targetId) {}
    public record ReorderItem(@NotNull Long id, Long parentId, Integer sortOrder) {}
    public record ImpactResp(long affectedArticles) {}

    @PostMapping("/merge/preview")
    @Operation(summary = "合并预览 —— 返回会影响的文章数")
    public R<ImpactResp> mergePreview(@Valid @RequestBody MergeReq req) {
        validate(req);
        long affected = articleMapper.selectCount(new LambdaQueryWrapper<Article>()
                .eq(Article::getCategoryId, req.sourceId()));
        return R.ok(new ImpactResp(affected));
    }

    @PostMapping("/merge")
    @Operation(summary = "合并分类：sourceId 下所有文章迁移到 targetId，并删除 source")
    @Transactional
    public R<ImpactResp> merge(@Valid @RequestBody MergeReq req) {
        validate(req);
        Article patch = new Article();
        patch.setCategoryId(req.targetId());
        int affected = articleMapper.update(patch,
                Wrappers.<Article>lambdaUpdate().eq(Article::getCategoryId, req.sourceId()));
        categoryMapper.deleteById(req.sourceId());
        return R.ok(new ImpactResp(affected));
    }

    @PostMapping("/reorder")
    @Operation(summary = "拖拽排序 / 改父级（批量）")
    @Transactional
    public R<Void> reorder(@RequestBody List<ReorderItem> items) {
        for (ReorderItem it : items) {
            Category c = categoryMapper.selectById(it.id());
            if (c == null) continue;
            if (it.sortOrder() != null) c.setSortOrder(it.sortOrder());
            if (it.parentId() != null || (it.parentId() == null && c.getParentId() != null)) {
                c.setParentId(it.parentId());
            }
            categoryMapper.updateById(c);
        }
        return R.ok();
    }

    private void validate(MergeReq req) {
        if (req.sourceId().equals(req.targetId())) throw new BizException("源分类与目标分类不能相同");
        if (categoryMapper.selectById(req.sourceId()) == null) throw new BizException(404, "源分类不存在");
        if (categoryMapper.selectById(req.targetId()) == null) throw new BizException(404, "目标分类不存在");
    }
}
