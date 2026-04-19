package com.claudecode.hub.content.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.claudecode.hub.common.api.PageResult;
import com.claudecode.hub.content.dto.ContentDtos.AuthorBrief;
import com.claudecode.hub.content.dto.ContentDtos.SnippetCreateReq;
import com.claudecode.hub.content.dto.ContentDtos.SnippetVO;
import com.claudecode.hub.content.entity.Snippet;
import com.claudecode.hub.content.mapper.SnippetMapper;
import com.claudecode.hub.user.entity.User;
import com.claudecode.hub.user.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SnippetService {

    private final SnippetMapper mapper;
    private final UserMapper userMapper;

    public SnippetService(SnippetMapper mapper, UserMapper userMapper) {
        this.mapper = mapper;
        this.userMapper = userMapper;
    }

    public PageResult<SnippetVO> list(String language, String sort, long page, long size) {
        Page<Snippet> p = new Page<>(Math.max(1, page), Math.max(1, Math.min(50, size)));
        LambdaQueryWrapper<Snippet> qw = new LambdaQueryWrapper<>();
        if (language != null && !language.isBlank()) qw.eq(Snippet::getLanguage, language);
        switch (sort == null ? "latest" : sort) {
            case "popular" -> qw.orderByDesc(Snippet::getLikeCount);
            case "copied" -> qw.orderByDesc(Snippet::getCopyCount);
            default -> qw.orderByDesc(Snippet::getCreatedAt);
        }
        Page<Snippet> paged = mapper.selectPage(p, qw);
        Map<Long, User> authors = batchAuthors(paged.getRecords());
        List<SnippetVO> items = paged.getRecords().stream().map(s -> toVO(s, authors.get(s.getAuthorId()))).toList();
        return new PageResult<>(items, paged.getTotal(), paged.getCurrent(), paged.getSize());
    }

    public SnippetVO findById(long id) {
        Snippet s = mapper.selectById(id);
        if (s == null) throw new com.claudecode.hub.common.exception.BizException(404, "Snippet 不存在");
        return toVO(s, userMapper.selectById(s.getAuthorId()));
    }

    public SnippetVO create(long authorId, SnippetCreateReq req) {
        Snippet s = new Snippet();
        s.setAuthorId(authorId);
        s.setTitle(req.title());
        s.setDescription(req.description());
        s.setLanguage(req.language());
        s.setCode(req.code());
        s.setCategoryId(req.categoryId());
        s.setViewCount(0); s.setLikeCount(0); s.setCopyCount(0);
        mapper.insert(s);
        return findById(s.getId());
    }

    public void incrCopy(long id) {
        mapper.incrCopy(id);
    }

    private SnippetVO toVO(Snippet s, User u) {
        AuthorBrief author = u == null
                ? new AuthorBrief(0, "匿名", "·", null)
                : new AuthorBrief(u.getId(),
                        u.getNickname() != null ? u.getNickname() : u.getUsername(),
                        String.valueOf(Character.toUpperCase(
                                (u.getNickname() != null ? u.getNickname() : u.getUsername()).charAt(0))),
                        u.getAvatar());
        return new SnippetVO(s.getId(), s.getTitle(), s.getDescription(), s.getLanguage(), s.getCode(),
                author, n(s.getLikeCount()), n(s.getCopyCount()), s.getCreatedAt());
    }

    private Map<Long, User> batchAuthors(List<Snippet> rows) {
        Set<Long> ids = rows.stream().map(Snippet::getAuthorId).filter(Objects::nonNull).collect(Collectors.toSet());
        if (ids.isEmpty()) return Map.of();
        return userMapper.selectBatchIds(ids).stream().collect(Collectors.toMap(User::getId, u -> u));
    }

    private int n(Integer v) {
        return v == null ? 0 : v;
    }
}
