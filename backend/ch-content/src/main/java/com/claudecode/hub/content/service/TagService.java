package com.claudecode.hub.content.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.claudecode.hub.common.util.SlugUtils;
import com.claudecode.hub.content.dto.ContentDtos.TagVO;
import com.claudecode.hub.content.entity.Tag;
import com.claudecode.hub.content.mapper.TagMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {
    private final TagMapper mapper;

    public TagService(TagMapper mapper) {
        this.mapper = mapper;
    }

    public List<TagVO> top(int limit) {
        return mapper.selectList(new LambdaQueryWrapper<Tag>()
                        .orderByDesc(Tag::getArticleCount)
                        .last("LIMIT " + Math.max(1, limit)))
                .stream()
                .map(this::toVO)
                .toList();
    }

    public List<TagVO> all() {
        return mapper.selectList(new LambdaQueryWrapper<Tag>()
                        .orderByDesc(Tag::getArticleCount))
                .stream()
                .map(this::toVO)
                .toList();
    }

    public Tag upsert(String name) {
        Tag exist = mapper.selectOne(new LambdaQueryWrapper<Tag>().eq(Tag::getName, name));
        if (exist != null) return exist;
        Tag t = new Tag();
        t.setName(name);
        t.setSlug(SlugUtils.slugify(name));
        t.setArticleCount(0);
        mapper.insert(t);
        return t;
    }

    private TagVO toVO(Tag t) {
        return new TagVO(t.getId(), t.getName(), t.getSlug(),
                t.getArticleCount() == null ? 0 : t.getArticleCount());
    }
}
