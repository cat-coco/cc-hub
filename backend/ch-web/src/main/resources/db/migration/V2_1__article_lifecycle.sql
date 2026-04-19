-- V2_1: article lifecycle columns + status upgrade to uppercase enum
-- Reference spec: 批次 1 · ArticleStatus { DRAFT, PENDING, PUBLISHED, OFFLINE }

ALTER TABLE article
  ADD COLUMN subtitle           VARCHAR(300) NULL                      COMMENT '副标题'   AFTER title,
  ADD COLUMN summary_type       VARCHAR(10)  NOT NULL DEFAULT 'MANUAL' COMMENT 'MANUAL/AUTO' AFTER summary,
  ADD COLUMN read_time_minutes  INT          NOT NULL DEFAULT 0        COMMENT '预估阅读时长(分钟)',
  ADD COLUMN review_remark      VARCHAR(500) NULL                      COMMENT '审核驳回原因',
  ADD COLUMN reviewer_id        BIGINT       NULL                      COMMENT '审核人',
  ADD COLUMN reviewed_at        DATETIME     NULL,
  ADD COLUMN last_editor_id     BIGINT       NULL                      COMMENT '最后编辑者',
  MODIFY COLUMN status          VARCHAR(20)  NOT NULL DEFAULT 'DRAFT'  COMMENT 'DRAFT/PENDING/PUBLISHED/OFFLINE';

-- Migrate existing rows from old lowercase literals.
UPDATE article
SET status = CASE LOWER(status)
  WHEN 'draft'     THEN 'DRAFT'
  WHEN 'pending'   THEN 'PENDING'
  WHEN 'published' THEN 'PUBLISHED'
  WHEN 'offline'   THEN 'OFFLINE'
  ELSE UPPER(status)
END
WHERE status IS NOT NULL AND BINARY status <> UPPER(status);

-- New indexes.
CREATE INDEX idx_status          ON article (status);
CREATE INDEX idx_author_status   ON article (author_id, status);
CREATE INDEX idx_reviewer        ON article (reviewer_id);
