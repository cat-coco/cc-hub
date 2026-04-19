package com.claudecode.hub.interaction.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public final class InteractionDtos {
    private InteractionDtos() {}

    public record CommentCreateReq(
            @NotBlank @Size(min = 1, max = 2000) String content,
            Long parentId) {}

    public record CommentVO(
            long id,
            Long parentId,
            long userId,
            String userName,
            String userInitial,
            String userAvatar,
            String content,
            int likeCount,
            LocalDateTime createdAt,
            List<CommentVO> replies) {}

    public record LikeStatus(boolean liked, int total) {}

    public record CollectStatus(boolean collected, int total) {}
}
