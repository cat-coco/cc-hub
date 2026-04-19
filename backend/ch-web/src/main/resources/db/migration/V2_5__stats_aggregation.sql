-- V2_5: daily stats aggregation tables.
-- Populated by scheduled jobs (batch 5).

CREATE TABLE stats_daily (
  id             BIGINT PRIMARY KEY AUTO_INCREMENT,
  stat_date      DATE NOT NULL UNIQUE,
  total_pv       BIGINT DEFAULT 0,
  total_uv       BIGINT DEFAULT 0,
  new_users      INT    DEFAULT 0,
  new_articles   INT    DEFAULT 0,
  new_comments   INT    DEFAULT 0,
  new_likes      INT    DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE stats_article_daily (
  id                 BIGINT PRIMARY KEY AUTO_INCREMENT,
  article_id         BIGINT NOT NULL,
  stat_date          DATE NOT NULL,
  pv                 INT DEFAULT 0,
  uv                 INT DEFAULT 0,
  avg_read_time_sec  INT DEFAULT 0,
  bounce_rate        DECIMAL(5,2) DEFAULT 0,
  UNIQUE KEY uk_article_date (article_id, stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE stats_referer_daily (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  stat_date       DATE NOT NULL,
  referer_domain  VARCHAR(200),
  visit_count     INT DEFAULT 0,
  INDEX idx_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE stats_region_daily (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  stat_date    DATE NOT NULL,
  province     VARCHAR(50),
  city         VARCHAR(50),
  visit_count  INT DEFAULT 0,
  user_count   INT DEFAULT 0,
  INDEX idx_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE stats_device_daily (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  stat_date    DATE NOT NULL,
  device_type  VARCHAR(20),
  browser      VARCHAR(50),
  os           VARCHAR(50),
  visit_count  INT DEFAULT 0,
  INDEX idx_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE search_keyword_stats (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  keyword       VARCHAR(100) NOT NULL,
  stat_date     DATE NOT NULL,
  search_count  INT DEFAULT 0,
  result_count  INT DEFAULT 0,
  UNIQUE KEY uk_word_date (keyword, stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
