-- ClaudeCode Hub — MySQL 8 consolidated schema (single file, no migration).
-- All admin/batches 2-6 additions are baked in. Targeting utf8mb4 + ngram
-- FULLTEXT parser. Run once on a fresh database, e.g. via
-- docker-entrypoint-initdb.d mount or `mysql < db/schema-mysql.sql`.
-- Seed rows live in db/seed-mysql.sql.
SET NAMES utf8mb4;
SET time_zone = '+08:00';

-- =======================================================================
-- User domain
-- =======================================================================
CREATE TABLE IF NOT EXISTS `user` (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  username        VARCHAR(32)  NOT NULL UNIQUE,
  nickname        VARCHAR(64),
  avatar          VARCHAR(255),
  email           VARCHAR(128) UNIQUE,
  phone           VARCHAR(32)  UNIQUE,
  password_hash   VARCHAR(100),
  bio             VARCHAR(500),
  github_id       VARCHAR(64),
  wechat_openid   VARCHAR(64),
  status          TINYINT      NOT NULL DEFAULT 0,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_user_github (github_id),
  KEY idx_user_wechat (wechat_openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_profile (
  user_id          BIGINT PRIMARY KEY,
  followers_count  INT NOT NULL DEFAULT 0,
  following_count  INT NOT NULL DEFAULT 0,
  article_count    INT NOT NULL DEFAULT 0,
  `level`          INT NOT NULL DEFAULT 1,
  points           INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS role (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  code         VARCHAR(32)  NOT NULL UNIQUE,
  name         VARCHAR(64)  NOT NULL,
  description  VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS permission (
  id        BIGINT AUTO_INCREMENT PRIMARY KEY,
  code      VARCHAR(64) NOT NULL UNIQUE,
  name      VARCHAR(64) NOT NULL,
  resource  VARCHAR(64) NOT NULL,
  action    VARCHAR(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS role_permission (
  role_id        BIGINT NOT NULL,
  permission_id  BIGINT NOT NULL,
  PRIMARY KEY (role_id, permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_role (
  user_id  BIGINT NOT NULL,
  role_id  BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================================
-- Content domain
-- =======================================================================
CREATE TABLE IF NOT EXISTS category (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  parent_id    BIGINT,
  name         VARCHAR(64) NOT NULL,
  slug         VARCHAR(64) NOT NULL UNIQUE,
  icon         VARCHAR(64),
  sort_order   INT NOT NULL DEFAULT 0,
  description  VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tag (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(64) NOT NULL UNIQUE,
  slug           VARCHAR(64) NOT NULL UNIQUE,
  article_count  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tag_alias (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  tag_id      BIGINT NOT NULL,
  alias       VARCHAR(50) NOT NULL UNIQUE,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- article (V2_1 lifecycle columns baked in; status defaults to 'DRAFT')
CREATE TABLE IF NOT EXISTS article (
  id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
  title               VARCHAR(200) NOT NULL,
  subtitle            VARCHAR(300)             COMMENT '副标题',
  slug                VARCHAR(255) NOT NULL UNIQUE,
  summary             VARCHAR(500),
  summary_type        VARCHAR(10)  NOT NULL DEFAULT 'MANUAL'  COMMENT 'MANUAL/AUTO',
  cover_image         VARCHAR(255),
  content_md          LONGTEXT,
  content_html        LONGTEXT,
  author_id           BIGINT       NOT NULL,
  category_id         BIGINT,
  status              VARCHAR(20)  NOT NULL DEFAULT 'DRAFT'    COMMENT 'DRAFT/PENDING/PUBLISHED/OFFLINE',
  is_featured         TINYINT(1)   NOT NULL DEFAULT 0,
  is_top              TINYINT(1)   NOT NULL DEFAULT 0,
  view_count          INT          NOT NULL DEFAULT 0,
  like_count          INT          NOT NULL DEFAULT 0,
  comment_count       INT          NOT NULL DEFAULT 0,
  collect_count       INT          NOT NULL DEFAULT 0,
  read_time_minutes   INT          NOT NULL DEFAULT 0                COMMENT '预估阅读时长(分钟)',
  review_remark       VARCHAR(500)                                     COMMENT '审核驳回原因',
  reviewer_id         BIGINT                                           COMMENT '审核人',
  reviewed_at         DATETIME,
  last_editor_id      BIGINT                                           COMMENT '最后编辑者',
  published_at        DATETIME,
  created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  seo_title           VARCHAR(200),
  seo_description     VARCHAR(500),
  seo_keywords        VARCHAR(255),
  KEY idx_status (status),
  KEY idx_author_status (author_id, status),
  KEY idx_reviewer (reviewer_id),
  KEY idx_article_status_published (status, published_at),
  KEY idx_article_category (category_id, status),
  FULLTEXT KEY ft_article_title_summary (title, summary) WITH PARSER ngram
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS article_tag (
  article_id BIGINT NOT NULL,
  tag_id     BIGINT NOT NULL,
  PRIMARY KEY (article_id, tag_id),
  KEY idx_tag_article (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- article_version (V2_2 final shape — version_no, title, HTML, editor_name, change_summary)
CREATE TABLE IF NOT EXISTS article_version (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  article_id      BIGINT NOT NULL,
  version_no      INT    NOT NULL,
  title           VARCHAR(300) NOT NULL DEFAULT '',
  content_md      LONGTEXT NOT NULL,
  content_html    LONGTEXT,
  editor_id       BIGINT NOT NULL,
  editor_name     VARCHAR(50),
  change_summary  VARCHAR(500),
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_article (article_id, version_no DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS snippet (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  description  VARCHAR(500),
  language     VARCHAR(32)  NOT NULL,
  code         MEDIUMTEXT   NOT NULL,
  author_id    BIGINT NOT NULL,
  category_id  BIGINT,
  view_count   INT NOT NULL DEFAULT 0,
  like_count   INT NOT NULL DEFAULT 0,
  copy_count   INT NOT NULL DEFAULT 0,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_snippet_lang (language),
  KEY idx_snippet_author (author_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS showcase (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  description  VARCHAR(500),
  cover_image  VARCHAR(255),
  content      MEDIUMTEXT,
  tech_stack   JSON,
  repo_url     VARCHAR(255),
  demo_url     VARCHAR(255),
  author_id    BIGINT NOT NULL,
  status       VARCHAR(16) NOT NULL DEFAULT 'published',
  star_count   INT NOT NULL DEFAULT 0,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tool (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(128) NOT NULL,
  description  VARCHAR(500),
  icon         VARCHAR(16),
  url          VARCHAR(255),
  category     VARCHAR(64) NOT NULL,
  tags         VARCHAR(255),
  version      VARCHAR(32),
  license      VARCHAR(32),
  stars        VARCHAR(32),
  sort_order   INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================================
-- QA domain
-- =======================================================================
CREATE TABLE IF NOT EXISTS question (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  content       MEDIUMTEXT,
  author_id     BIGINT NOT NULL,
  view_count    INT NOT NULL DEFAULT 0,
  answer_count  INT NOT NULL DEFAULT 0,
  status        VARCHAR(16) NOT NULL DEFAULT 'open',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS answer (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  question_id  BIGINT NOT NULL,
  content      MEDIUMTEXT,
  author_id    BIGINT NOT NULL,
  vote_up      INT NOT NULL DEFAULT 0,
  vote_down    INT NOT NULL DEFAULT 0,
  is_accepted  TINYINT(1) NOT NULL DEFAULT 0,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_answer_q (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================================
-- Interaction domain
-- =======================================================================
CREATE TABLE IF NOT EXISTS comment (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  target_id    BIGINT NOT NULL,
  target_type  VARCHAR(16) NOT NULL,
  parent_id    BIGINT,
  user_id      BIGINT NOT NULL,
  content      TEXT NOT NULL,
  like_count   INT NOT NULL DEFAULT 0,
  status       TINYINT NOT NULL DEFAULT 0,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_comment_target (target_id, target_type),
  KEY idx_comment_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_like (
  user_id      BIGINT NOT NULL,
  target_id    BIGINT NOT NULL,
  target_type  VARCHAR(16) NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, target_id, target_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS collect (
  user_id      BIGINT NOT NULL,
  target_id    BIGINT NOT NULL,
  target_type  VARCHAR(16) NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, target_id, target_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS follow (
  follower_id   BIGINT NOT NULL,
  following_id  BIGINT NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, following_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================================
-- Admin: reports · sensitive words · audit log
-- =======================================================================
CREATE TABLE IF NOT EXISTS report (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  reporter_id    BIGINT NOT NULL,
  target_type    VARCHAR(20) NOT NULL COMMENT 'ARTICLE/COMMENT',
  target_id      BIGINT NOT NULL,
  reason_type    VARCHAR(30),
  reason_detail  TEXT,
  status         VARCHAR(20) DEFAULT 'PENDING' COMMENT 'PENDING/APPROVED/REJECTED',
  handler_id     BIGINT,
  handle_remark  VARCHAR(500),
  handled_at     DATETIME,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status_time (status, created_at),
  INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sensitive_word (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  word        VARCHAR(100) NOT NULL UNIQUE,
  `level`     TINYINT NOT NULL COMMENT '1-提示 2-替换 3-拦截',
  category    VARCHAR(50),
  enabled     BOOLEAN DEFAULT TRUE,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_log (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  log_type       VARCHAR(30) NOT NULL COMMENT 'ADMIN_LOGIN/USER_LOGIN/USER_REGISTER/ARTICLE_OP/...',
  user_id        BIGINT,
  user_name      VARCHAR(50),
  action         VARCHAR(50),
  resource_type  VARCHAR(30),
  resource_id    BIGINT,
  detail         JSON,
  ip             VARCHAR(50),
  user_agent     VARCHAR(500),
  result         VARCHAR(20),
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type_time (log_type, created_at),
  INDEX idx_user_time (user_id, created_at),
  INDEX idx_resource  (resource_type, resource_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================================
-- Stats aggregation (populated by scheduled jobs)
-- =======================================================================
CREATE TABLE IF NOT EXISTS stats_daily (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  stat_date     DATE   NOT NULL UNIQUE,
  total_pv      BIGINT DEFAULT 0,
  total_uv      BIGINT DEFAULT 0,
  new_users     INT    DEFAULT 0,
  new_articles  INT    DEFAULT 0,
  new_comments  INT    DEFAULT 0,
  new_likes     INT    DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS stats_article_daily (
  id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
  article_id         BIGINT NOT NULL,
  stat_date          DATE NOT NULL,
  pv                 INT DEFAULT 0,
  uv                 INT DEFAULT 0,
  avg_read_time_sec  INT DEFAULT 0,
  bounce_rate        DECIMAL(5,2) DEFAULT 0,
  UNIQUE KEY uk_article_date (article_id, stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS stats_referer_daily (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  stat_date       DATE NOT NULL,
  referer_domain  VARCHAR(200),
  visit_count     INT DEFAULT 0,
  INDEX idx_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS stats_region_daily (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  stat_date    DATE NOT NULL,
  province     VARCHAR(50),
  city         VARCHAR(50),
  visit_count  INT DEFAULT 0,
  user_count   INT DEFAULT 0,
  INDEX idx_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS stats_device_daily (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  stat_date    DATE NOT NULL,
  device_type  VARCHAR(20),
  browser      VARCHAR(50),
  os           VARCHAR(50),
  visit_count  INT DEFAULT 0,
  INDEX idx_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS search_keyword_stats (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  keyword       VARCHAR(100) NOT NULL,
  stat_date     DATE NOT NULL,
  search_count  INT DEFAULT 0,
  result_count  INT DEFAULT 0,
  UNIQUE KEY uk_word_date (keyword, stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================================
-- Notification + system
-- =======================================================================
CREATE TABLE IF NOT EXISTS notification (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  type        VARCHAR(16) NOT NULL,
  title       VARCHAR(200),
  content     VARCHAR(500),
  link        VARCHAR(255),
  is_read     TINYINT(1) NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_notif_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS system_config (
  `key`        VARCHAR(64) PRIMARY KEY,
  value        VARCHAR(1000),
  description  VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
