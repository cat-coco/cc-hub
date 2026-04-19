import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Icon from '../components/Icon';
import '../styles/profile.css';

type Tab = 'articles' | 'fav' | 'follow' | 'notif' | 'settings';

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>('articles');

  return (
    <Layout active="">
      <div className="container" style={{ paddingTop: 24 }}>
        <div className="profile-banner">
          <button type="button" className="profile-banner-edit">更换封面</button>
        </div>

        <div className="prof-head">
          <div className="prof-ava">Z</div>
          <div className="prof-info">
            <h1>
              张未未
              <span className="tag tag-brand" style={{ marginLeft: 8, verticalAlign: 'middle' }}>认证作者</span>
            </h1>
            <p className="bio">十年 Java 开发经验 · 某电商平台架构师 · 爱记录 · 爱折腾 · 不爱写周报</p>
            <div className="prof-stats">
              <span><b>127</b> 文章</span>
              <span><b>2,140</b> 粉丝</span>
              <span><b>318</b> 关注</span>
              <span><b>18.4k</b> 获赞</span>
            </div>
          </div>
          <div className="prof-cta">
            <button type="button" className="btn btn-secondary btn-sm">编辑资料</button>
            <Link className="btn btn-primary btn-sm" to="/admin/editor">写文章</Link>
          </div>
        </div>

        <div className="tabs-bar">
          <button type="button" className={`ptab${tab === 'articles' ? ' on' : ''}`} onClick={() => setTab('articles')}>
            我的文章 <span className="ptab-count">127</span>
          </button>
          <button type="button" className={`ptab${tab === 'fav' ? ' on' : ''}`} onClick={() => setTab('fav')}>
            我的收藏 <span className="ptab-count">48</span>
          </button>
          <button type="button" className={`ptab${tab === 'follow' ? ' on' : ''}`} onClick={() => setTab('follow')}>
            关注的人 <span className="ptab-count">318</span>
          </button>
          <button type="button" className={`ptab${tab === 'notif' ? ' on' : ''}`} onClick={() => setTab('notif')}>
            消息通知 <span className="ptab-count" style={{ color: 'var(--brand)' }}>12</span>
          </button>
          <button type="button" className={`ptab${tab === 'settings' ? ' on' : ''}`} onClick={() => setTab('settings')}>
            账号设置
          </button>
        </div>

        <div className="prof-panel">
          <div>
            {tab === 'articles' && (
              <div>
                <div className="sub-tabs">
                  <span className="chip chip-active">全部 127</span>
                  <span className="chip">已发布 119</span>
                  <span className="chip">草稿 5</span>
                  <span className="chip">审核中 3</span>
                </div>

                <div className="myart-row">
                  <div className="ph ph-brand">cover</div>
                  <div className="myart-body">
                    <span className="myart-status st-published">PUBLISHED</span>
                    <h3 className="myart-title">用 Claude Code 重构一个十年历史的 Java 单体：完整复盘</h3>
                    <p style={{ color: 'var(--ink-3)', fontSize: 13, margin: 0 }}>
                      六周，四十万行，一次彻底迁移的完整记录。
                    </p>
                    <div className="myart-meta">
                      <span>2026-04-17</span>
                      <span>8.2k 阅读</span>
                      <span>482 点赞</span>
                      <span>42 评论</span>
                    </div>
                    <div className="myart-actions">
                      <button type="button" className="btn btn-secondary btn-sm">编辑</button>
                      <button type="button" className="btn btn-ghost btn-sm">查看数据</button>
                      <button type="button" className="btn btn-ghost btn-sm">下架</button>
                    </div>
                  </div>
                </div>

                <div className="myart-row">
                  <div className="ph">cover</div>
                  <div className="myart-body">
                    <span className="myart-status st-published">PUBLISHED</span>
                    <h3 className="myart-title">把 CLAUDE.md 写到这个程度，团队新人上手只要一天</h3>
                    <p style={{ color: 'var(--ink-3)', fontSize: 13, margin: 0 }}>
                      团队版 CLAUDE.md 的 6 个关键字段。
                    </p>
                    <div className="myart-meta">
                      <span>2026-04-08</span>
                      <span>12.4k 阅读</span>
                      <span>892 点赞</span>
                      <span>137 评论</span>
                    </div>
                    <div className="myart-actions">
                      <button type="button" className="btn btn-secondary btn-sm">编辑</button>
                      <button type="button" className="btn btn-ghost btn-sm">查看数据</button>
                      <button type="button" className="btn btn-ghost btn-sm">下架</button>
                    </div>
                  </div>
                </div>

                <div className="myart-row">
                  <div className="ph">cover</div>
                  <div className="myart-body">
                    <span className="myart-status st-draft">DRAFT</span>
                    <h3 className="myart-title">[草稿] Hook 注入点深度解析：那些容易被忽略的生命周期</h3>
                    <p style={{ color: 'var(--ink-3)', fontSize: 13, margin: 0 }}>
                      最后编辑于 3 小时前 · 当前 2,340 字 · 自动保存
                    </p>
                    <div className="myart-actions">
                      <button type="button" className="btn btn-primary btn-sm">继续写作</button>
                      <button type="button" className="btn btn-ghost btn-sm">预览</button>
                      <button type="button" className="btn btn-ghost btn-sm">删除</button>
                    </div>
                  </div>
                </div>

                <div className="myart-row">
                  <div className="ph">cover</div>
                  <div className="myart-body">
                    <span className="myart-status st-review">IN REVIEW</span>
                    <h3 className="myart-title">我们为什么放弃了自研 Agent 框架，转用 Claude Code</h3>
                    <p style={{ color: 'var(--ink-3)', fontSize: 13, margin: 0 }}>
                      已提交审核 · 预计 2 小时内完成。
                    </p>
                    <div className="myart-actions">
                      <button type="button" className="btn btn-ghost btn-sm">查看</button>
                      <button type="button" className="btn btn-ghost btn-sm">撤回</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab !== 'articles' && (
              <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>
                当前面板仅为原型演示，切换至&ldquo;我的文章&rdquo;查看完整示例。
              </div>
            )}
          </div>

          <aside>
            <div className="prof-side-block">
              <h4>最近 7 天数据</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>4,820</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>阅读量</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>+127</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>新增粉丝</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>382</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>点赞</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>26</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>新评论</div>
                </div>
              </div>
            </div>

            <div className="prof-side-block">
              <h4>最新通知 · 12 未读</h4>

              <div className="notif notif-unread">
                <div className="notif-ico ni-like">
                  <Icon size="sm">
                    <path d="M7 10v11H4V10zM20 9h-6l1-5c.2-1-.5-2-1.5-2-.5 0-1 .3-1.3.8L7 10v11h11a2 2 0 0 0 2-1.8l1-7A2 2 0 0 0 20 9z" />
                  </Icon>
                </div>
                <div>
                  <div className="notif-text">
                    <b>林秋白</b> 点赞了你的文章 <em>《用 Claude Code 重构…》</em>
                  </div>
                  <div className="notif-time">2 小时前</div>
                </div>
              </div>

              <div className="notif notif-unread">
                <div className="notif-ico ni-cmt">
                  <Icon size="sm">
                    <path d="M21 12a8 8 0 1 1-3-6l3-1-1 3a8 8 0 0 1 1 4z" />
                  </Icon>
                </div>
                <div>
                  <div className="notif-text">
                    <b>吴桥</b> 在你的文章下评论了
                  </div>
                  <div className="notif-time">4 小时前</div>
                </div>
              </div>

              <div className="notif">
                <div className="notif-ico ni-follow">
                  <Icon size="sm">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                  </Icon>
                </div>
                <div>
                  <div className="notif-text">
                    <b>何迁</b> 关注了你
                  </div>
                  <div className="notif-time">昨天</div>
                </div>
              </div>

              <div className="notif">
                <div className="notif-ico ni-sys">
                  <Icon size="sm">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v5" />
                    <circle cx="12" cy="16" r=".5" fill="currentColor" />
                  </Icon>
                </div>
                <div>
                  <div className="notif-text">
                    你的文章被选入 <em>本周精选</em>
                  </div>
                  <div className="notif-time">2 天前</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
