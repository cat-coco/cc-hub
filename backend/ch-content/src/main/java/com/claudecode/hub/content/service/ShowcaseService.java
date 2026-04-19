package com.claudecode.hub.content.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.claudecode.hub.common.api.PageResult;
import com.claudecode.hub.content.dto.ContentDtos.AuthorBrief;
import com.claudecode.hub.content.dto.ContentDtos.ShowcaseVO;
import com.claudecode.hub.content.entity.Showcase;
import com.claudecode.hub.content.mapper.ShowcaseMapper;
import com.claudecode.hub.user.entity.User;
import com.claudecode.hub.user.mapper.UserMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ShowcaseService {
    private final ShowcaseMapper mapper;
    private final UserMapper userMapper;
    private final ObjectMapper om;

    public ShowcaseService(ShowcaseMapper mapper, UserMapper userMapper, ObjectMapper om) {
        this.mapper = mapper;
        this.userMapper = userMapper;
        this.om = om;
    }

    public PageResult<ShowcaseVO> list(String sort, long page, long size) {
        Page<Showcase> p = new Page<>(Math.max(1, page), Math.max(1, Math.min(50, size)));
        LambdaQueryWrapper<Showcase> qw = new LambdaQueryWrapper<Showcase>()
                .eq(Showcase::getStatus, "published");
        if ("hot".equals(sort)) qw.orderByDesc(Showcase::getStarCount);
        else qw.orderByDesc(Showcase::getCreatedAt);
        Page<Showcase> paged = mapper.selectPage(p, qw);
        Map<Long, User> authors = batchAuthors(paged.getRecords());
        return PageResult.of(paged, s -> toVO(s, authors.get(s.getAuthorId())));
    }

    public List<ShowcaseVO> top(int limit) {
        return mapper.selectList(new LambdaQueryWrapper<Showcase>()
                        .eq(Showcase::getStatus, "published")
                        .orderByDesc(Showcase::getStarCount)
                        .last("LIMIT " + Math.max(1, limit)))
                .stream()
                .map(s -> toVO(s, userMapper.selectById(s.getAuthorId())))
                .toList();
    }

    private ShowcaseVO toVO(Showcase s, User u) {
        List<String> stack = parseStack(s.getTechStack());
        AuthorBrief author = u == null
                ? new AuthorBrief(0, "匿名", "·", null)
                : new AuthorBrief(u.getId(),
                        u.getNickname() != null ? u.getNickname() : u.getUsername(),
                        String.valueOf(Character.toUpperCase(
                                (u.getNickname() != null ? u.getNickname() : u.getUsername()).charAt(0))),
                        u.getAvatar());
        return new ShowcaseVO(s.getId(), s.getTitle(), s.getDescription(), s.getCoverImage(),
                stack, s.getRepoUrl(), s.getDemoUrl(), author,
                s.getStarCount() == null ? 0 : s.getStarCount());
    }

    private List<String> parseStack(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return om.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }

    private Map<Long, User> batchAuthors(List<Showcase> rows) {
        Set<Long> ids = rows.stream().map(Showcase::getAuthorId).filter(Objects::nonNull).collect(Collectors.toSet());
        if (ids.isEmpty()) return Map.of();
        return userMapper.selectBatchIds(ids).stream().collect(Collectors.toMap(User::getId, u -> u));
    }
}
