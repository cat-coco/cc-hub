-- Minimal seed: roles + admin user + 6 default categories.
-- Admin credentials: admin / ChangeMe123!  (BCrypt 12, rotate on first login)
SET NAMES utf8mb4;

INSERT IGNORE INTO role (id, code, name, description) VALUES
  (1, 'ROLE_USER',        '普通用户',   '已注册用户'),
  (2, 'ROLE_AUTHOR',      '认证作者',   '可发表文章、案例、Snippets'),
  (3, 'ROLE_ADMIN',       '管理员',     '可审核内容、管理用户'),
  (4, 'ROLE_SUPER_ADMIN', '超级管理员', '全部权限');

INSERT IGNORE INTO `user` (id, username, nickname, email, password_hash, bio, status)
VALUES (1, 'admin', '站长',
        'admin@claudecodehub.local',
        '$2b$12$mFY7opmQbdHqe7A/MzS6D.Uxz9Gm/FRlGDSMtbfw1xpfPy1DMMzOy',
        '默认超级管理员，请登录后立即修改密码。', 0);

INSERT IGNORE INTO user_profile (user_id, followers_count, following_count, article_count, `level`, points)
VALUES (1, 0, 0, 0, 10, 0);

INSERT IGNORE INTO user_role (user_id, role_id) VALUES (1, 3), (1, 4);

INSERT IGNORE INTO category (id, parent_id, name, slug, icon, sort_order, description) VALUES
  (1, NULL, '最佳实践', 'practice',  'book',    10, '社区精选高质量实战经验'),
  (2, NULL, '技术洞察', 'insight',   'trend',   20, '前沿趋势与深度分析'),
  (3, NULL, '源码分析', 'internals', 'code',    30, 'Claude Code / SDK / MCP 源码剖析'),
  (4, NULL, '实战教学', 'tutorial',  'step',    40, '手把手教程'),
  (5, NULL, '问答',     'qa',        'help',    50, '社区问答'),
  (6, NULL, '案例',     'case',      'monitor', 60, '真实项目案例');
