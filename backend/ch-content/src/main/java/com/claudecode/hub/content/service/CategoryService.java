package com.claudecode.hub.content.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.claudecode.hub.content.dto.ContentDtos.CategoryVO;
import com.claudecode.hub.content.entity.Category;
import com.claudecode.hub.content.mapper.CategoryMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryMapper mapper;

    public CategoryService(CategoryMapper mapper) {
        this.mapper = mapper;
    }

    public List<CategoryVO> list() {
        return mapper.selectList(new LambdaQueryWrapper<Category>()
                .orderByAsc(Category::getSortOrder))
                .stream()
                .map(c -> new CategoryVO(c.getId(), c.getParentId(), c.getName(),
                        c.getSlug(), c.getIcon(), c.getDescription(), 0))
                .toList();
    }

    public Category findBySlug(String slug) {
        return mapper.selectOne(new LambdaQueryWrapper<Category>().eq(Category::getSlug, slug));
    }
}
