-- V2_2: upgrade existing article_version (created in V1 baseline) to the
-- richer shape specified in batch 3. Columns become:
--   id, article_id, version_no, title, content_md, content_html,
--   editor_id, editor_name, change_summary, created_at

ALTER TABLE article_version
  CHANGE COLUMN version version_no INT NOT NULL,
  ADD COLUMN title           VARCHAR(300) NOT NULL DEFAULT '' AFTER version_no,
  MODIFY COLUMN content_md   LONGTEXT     NOT NULL,
  ADD COLUMN content_html    LONGTEXT     NULL                AFTER content_md,
  ADD COLUMN editor_name     VARCHAR(50)  NULL                AFTER editor_id,
  ADD COLUMN change_summary  VARCHAR(500) NULL                AFTER editor_name;

DROP INDEX idx_av_article ON article_version;
CREATE INDEX idx_article ON article_version (article_id, version_no DESC);
