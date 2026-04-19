package com.claudecode.hub.interaction.controller;

import com.claudecode.hub.common.api.R;
import com.claudecode.hub.interaction.dto.InteractionDtos.CollectStatus;
import com.claudecode.hub.interaction.dto.InteractionDtos.CommentCreateReq;
import com.claudecode.hub.interaction.dto.InteractionDtos.CommentVO;
import com.claudecode.hub.interaction.dto.InteractionDtos.LikeStatus;
import com.claudecode.hub.interaction.service.CommentService;
import com.claudecode.hub.interaction.service.LikeService;
import com.claudecode.hub.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Interactions", description = "点赞 / 收藏 / 评论")
public class InteractionController {
    private final CommentService commentService;
    private final LikeService likeService;

    public InteractionController(CommentService commentService, LikeService likeService) {
        this.commentService = commentService;
        this.likeService = likeService;
    }

    @GetMapping("/api/articles/{id}/comments")
    public R<List<CommentVO>> listArticleComments(@PathVariable long id) {
        return R.ok(commentService.listTree("article", id));
    }

    @PostMapping("/api/articles/{id}/comments")
    @Operation(summary = "发表文章评论 (登录)")
    public R<CommentVO> postArticleComment(@PathVariable long id, @Valid @RequestBody CommentCreateReq req) {
        return R.ok(commentService.create(CurrentUser.requireId(), "article", id, req));
    }

    @PostMapping("/api/articles/{id}/like")
    @Operation(summary = "文章点赞 / 取消")
    public R<LikeStatus> toggleArticleLike(@PathVariable long id) {
        return R.ok(likeService.toggleLike(CurrentUser.requireId(), "article", id));
    }

    @PostMapping("/api/articles/{id}/collect")
    @Operation(summary = "文章收藏 / 取消")
    public R<CollectStatus> toggleArticleCollect(@PathVariable long id) {
        return R.ok(likeService.toggleCollect(CurrentUser.requireId(), "article", id));
    }
}
