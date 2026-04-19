package com.claudecode.hub.interaction.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.claudecode.hub.common.util.HtmlSanitizer;
import com.claudecode.hub.content.mapper.ArticleMapper;
import com.claudecode.hub.interaction.dto.InteractionDtos.CommentCreateReq;
import com.claudecode.hub.interaction.dto.InteractionDtos.CommentVO;
import com.claudecode.hub.interaction.entity.Comment;
import com.claudecode.hub.interaction.mapper.CommentMapper;
import com.claudecode.hub.user.entity.User;
import com.claudecode.hub.user.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CommentService {
    private final CommentMapper mapper;
    private final UserMapper userMapper;
    private final ArticleMapper articleMapper;

    public CommentService(CommentMapper mapper, UserMapper userMapper, ArticleMapper articleMapper) {
        this.mapper = mapper;
        this.userMapper = userMapper;
        this.articleMapper = articleMapper;
    }

    public List<CommentVO> listTree(String targetType, long targetId) {
        List<Comment> all = mapper.selectList(new LambdaQueryWrapper<Comment>()
                .eq(Comment::getTargetType, targetType)
                .eq(Comment::getTargetId, targetId)
                .eq(Comment::getStatus, 0)
                .orderByAsc(Comment::getCreatedAt));
        if (all.isEmpty()) return List.of();
        var userIds = all.stream().map(Comment::getUserId).collect(Collectors.toSet());
        Map<Long, User> authors = userIds.isEmpty()
                ? Map.of()
                : userMapper.selectBatchIds(userIds).stream()
                        .collect(Collectors.toMap(User::getId, u -> u));

        Map<Long, List<CommentVO>> childrenByParent = new HashMap<>();
        List<CommentVO> roots = new ArrayList<>();
        for (Comment c : all) {
            CommentVO vo = toVO(c, authors.get(c.getUserId()), new ArrayList<>());
            if (c.getParentId() == null || c.getParentId() == 0) {
                roots.add(vo);
            } else {
                childrenByParent.computeIfAbsent(c.getParentId(), k -> new ArrayList<>()).add(vo);
            }
        }
        // attach
        return roots.stream().map(r -> attach(r, childrenByParent)).toList();
    }

    @Transactional
    public CommentVO create(long userId, String targetType, long targetId, CommentCreateReq req) {
        Comment c = new Comment();
        c.setTargetType(targetType);
        c.setTargetId(targetId);
        c.setParentId(req.parentId());
        c.setUserId(userId);
        c.setContent(HtmlSanitizer.comment(req.content()));
        c.setLikeCount(0);
        c.setStatus(0);
        mapper.insert(c);

        if ("article".equals(targetType)) {
            articleMapper.addComment(targetId, 1);
        }
        return toVO(c, userMapper.selectById(userId), List.of());
    }

    private CommentVO attach(CommentVO v, Map<Long, List<CommentVO>> byParent) {
        List<CommentVO> kids = byParent.getOrDefault(v.id(), List.of()).stream()
                .map(k -> attach(k, byParent)).toList();
        return new CommentVO(v.id(), v.parentId(), v.userId(), v.userName(), v.userInitial(),
                v.userAvatar(), v.content(), v.likeCount(), v.createdAt(), kids);
    }

    private CommentVO toVO(Comment c, User u, List<CommentVO> replies) {
        String name = u == null ? "匿名" : (u.getNickname() != null ? u.getNickname() : u.getUsername());
        String initial = name.isEmpty() ? "·" : name.substring(0, 1).toUpperCase();
        return new CommentVO(c.getId(), c.getParentId(), c.getUserId(), name, initial,
                u == null ? null : u.getAvatar(),
                c.getContent(),
                c.getLikeCount() == null ? 0 : c.getLikeCount(),
                c.getCreatedAt(), replies);
    }
}
