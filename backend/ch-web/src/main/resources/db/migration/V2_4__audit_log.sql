-- V2_4: audit log. Populated asynchronously by AuditLogAspect (batch 6).
-- As the row count grows, move to monthly partitions.

CREATE TABLE audit_log (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  log_type      VARCHAR(30) NOT NULL COMMENT 'ADMIN_LOGIN/USER_LOGIN/USER_REGISTER/ARTICLE_OP/...',
  user_id       BIGINT,
  user_name     VARCHAR(50),
  action        VARCHAR(50),
  resource_type VARCHAR(30),
  resource_id   BIGINT,
  detail        JSON,
  ip            VARCHAR(50),
  user_agent    VARCHAR(500),
  result        VARCHAR(20),
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type_time (log_type, created_at),
  INDEX idx_user_time (user_id, created_at),
  INDEX idx_resource  (resource_type, resource_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
