-- V2_3: tag alias · user reports · sensitive words

CREATE TABLE tag_alias (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  tag_id     BIGINT NOT NULL,
  alias      VARCHAR(50) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE report (
  id             BIGINT PRIMARY KEY AUTO_INCREMENT,
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

CREATE TABLE sensitive_word (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  word       VARCHAR(100) NOT NULL UNIQUE,
  `level`    TINYINT NOT NULL COMMENT '1-提示 2-替换 3-拦截',
  category   VARCHAR(50),
  enabled    BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
