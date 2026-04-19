package com.claudecode.hub.interaction.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.claudecode.hub.content.entity.Article;
import com.claudecode.hub.content.mapper.ArticleMapper;
import com.claudecode.hub.interaction.dto.InteractionDtos.CollectStatus;
import com.claudecode.hub.interaction.dto.InteractionDtos.LikeStatus;
import com.claudecode.hub.interaction.entity.Collect;
import com.claudecode.hub.interaction.entity.LikeRecord;
import com.claudecode.hub.interaction.mapper.CollectMapper;
import com.claudecode.hub.interaction.mapper.LikeMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LikeService {
    private final LikeMapper likeMapper;
    private final CollectMapper collectMapper;
    private final ArticleMapper articleMapper;

    public LikeService(LikeMapper likeMapper, CollectMapper collectMapper, ArticleMapper articleMapper) {
        this.likeMapper = likeMapper;
        this.collectMapper = collectMapper;
        this.articleMapper = articleMapper;
    }

    @Transactional
    public LikeStatus toggleLike(long userId, String targetType, long targetId) {
        LambdaQueryWrapper<LikeRecord> qw = new LambdaQueryWrapper<LikeRecord>()
                .eq(LikeRecord::getUserId, userId)
                .eq(LikeRecord::getTargetType, targetType)
                .eq(LikeRecord::getTargetId, targetId);
        boolean existing = likeMapper.selectCount(qw) > 0;
        if (existing) {
            likeMapper.delete(qw);
            if ("article".equals(targetType)) articleMapper.addLike(targetId, -1);
        } else {
            LikeRecord r = new LikeRecord();
            r.setUserId(userId);
            r.setTargetType(targetType);
            r.setTargetId(targetId);
            likeMapper.insert(r);
            if ("article".equals(targetType)) articleMapper.addLike(targetId, 1);
        }
        int total = 0;
        if ("article".equals(targetType)) {
            Article a = articleMapper.selectById(targetId);
            total = a == null || a.getLikeCount() == null ? 0 : a.getLikeCount();
        }
        return new LikeStatus(!existing, total);
    }

    @Transactional
    public CollectStatus toggleCollect(long userId, String targetType, long targetId) {
        LambdaQueryWrapper<Collect> qw = new LambdaQueryWrapper<Collect>()
                .eq(Collect::getUserId, userId)
                .eq(Collect::getTargetType, targetType)
                .eq(Collect::getTargetId, targetId);
        boolean existing = collectMapper.selectCount(qw) > 0;
        if (existing) {
            collectMapper.delete(qw);
            if ("article".equals(targetType)) articleMapper.addCollect(targetId, -1);
        } else {
            Collect c = new Collect();
            c.setUserId(userId);
            c.setTargetType(targetType);
            c.setTargetId(targetId);
            collectMapper.insert(c);
            if ("article".equals(targetType)) articleMapper.addCollect(targetId, 1);
        }
        int total = 0;
        if ("article".equals(targetType)) {
            Article a = articleMapper.selectById(targetId);
            total = a == null || a.getCollectCount() == null ? 0 : a.getCollectCount();
        }
        return new CollectStatus(!existing, total);
    }
}
