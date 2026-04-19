package com.claudecode.hub.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public final class ContentDtos {
    private ContentDtos() {}

    public record RejectReq(@NotBlank @Size(max = 500) String remark) {}

    public record AuthorBrief(long id, String name, String initial, String avatar) {}

    public record CategoryVO(long id, Long parentId, String name, String slug, String icon,
                             String description, int articleCount) {}

    public record TagVO(long id, String name, String slug, int articleCount) {}

    public record ArticleListItem(
            long id,
            String title,
            String slug,
            String category,
            String summary,
            String coverImage,
            AuthorBrief author,
            int viewCount,
            int likeCount,
            int commentCount,
            List<String> tags,
            LocalDateTime publishedAt,
            int readMinutes) {
    }

    public record ArticleDetail(
            long id,
            String title,
            String slug,
            String summary,
            String coverImage,
            String contentMd,
            String contentHtml,
            AuthorBrief author,
            CategoryVO category,
            List<TagVO> tags,
            String status,
            int viewCount,
            int likeCount,
            int commentCount,
            int collectCount,
            LocalDateTime publishedAt,
            int readMinutes,
            String seoTitle,
            String seoDescription,
            String seoKeywords) {
    }

    public record ArticleCreateReq(
            @NotBlank @Size(max = 200) String title,
            String slug,
            String summary,
            String coverImage,
            @NotBlank String contentMd,
            Long categoryId,
            List<String> tags,
            String status,
            String seoTitle,
            String seoDescription,
            String seoKeywords,
            Boolean isFeatured,
            Boolean isTop) {
    }

    public record SnippetVO(
            long id,
            String title,
            String description,
            String language,
            String code,
            AuthorBrief author,
            int likeCount,
            int copyCount,
            LocalDateTime createdAt) {}

    public record SnippetCreateReq(
            @NotBlank String title,
            String description,
            @NotBlank String language,
            @NotBlank String code,
            Long categoryId) {}

    public record ShowcaseVO(
            long id,
            String title,
            String description,
            String coverImage,
            List<String> techStack,
            String repoUrl,
            String demoUrl,
            AuthorBrief author,
            int starCount) {}

    public record ToolVO(
            long id,
            String name,
            String description,
            String icon,
            String url,
            String category,
            List<String> tags,
            String version,
            String license,
            String stars) {}
}
