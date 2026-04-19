import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import '../styles/admin-editor.css';

type Mode = 'wysiwyg' | 'split' | 'html';

type SwitchKey = 'featured' | 'top' | 'comments' | 'loginOnly';

export default function AdminEditorPage() {
  const [mode, setMode] = useState<Mode>('split');
  const [title, setTitle] = useState('Hook 注入点深度解析：那些容易被忽略的生命周期');
  const [switches, setSwitches] = useState<Record<SwitchKey, boolean>>({
    featured: true,
    top: false,
    comments: true,
    loginOnly: false,
  });

  const toggle = (k: SwitchKey) => setSwitches((s) => ({ ...s, [k]: !s[k] }));

  useEffect(() => {
    document.body.classList.add('admin-editor-body');
    return () => document.body.classList.remove('admin-editor-body');
  }, []);

  return (
    <div className="ed">
      <div className="etop">
        <Link className="brand" to="/admin/dashboard">
          <span className="brand-mark" />
        </Link>
        <Link className="back" to="/admin/dashboard">
          <Icon size="sm"><path d="m15 18-6-6 6-6" /></Icon>
          返回
        </Link>
        <input
          className="etitle-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="save-ind">
          <span className="dot" /> 已保存 · 10 秒前
        </div>

        <div className="modes">
          <button
            type="button"
            className={`mode${mode === 'wysiwyg' ? ' on' : ''}`}
            onClick={() => setMode('wysiwyg')}
          >
            <Icon size="sm"><path d="M12 20h9M4 18l4 4 12-12-4-4z" /></Icon> WYSIWYG
          </button>
          <button
            type="button"
            className={`mode${mode === 'split' ? ' on' : ''}`}
            onClick={() => setMode('split')}
          >
            <Icon size="sm">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M12 4v16" />
            </Icon>{' '}
            分栏
          </button>
          <button
            type="button"
            className={`mode${mode === 'html' ? ' on' : ''}`}
            onClick={() => setMode('html')}
          >
            <Icon size="sm">
              <path d="m8 6-6 6 6 6" />
              <path d="m16 6 6 6-6 6" />
            </Icon>{' '}
            HTML 源码
          </button>
        </div>

        <div className="right">
          <button type="button" className="btn btn-ghost btn-sm">预览</button>
          <button type="button" className="btn btn-primary btn-sm">发布</button>
        </div>
      </div>

      <div className="earea">
        <div className="esub">
          <button type="button" className="tool-btn" title="撤销">
            <Icon size="sm">
              <path d="M9 14 4 9l5-5" />
              <path d="M4 9h10a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6h-3" />
            </Icon>
          </button>
          <button type="button" className="tool-btn">
            <Icon size="sm">
              <path d="m15 14 5-5-5-5" />
              <path d="M20 9H10a6 6 0 0 0-6 6v0a6 6 0 0 0 6 6h3" />
            </Icon>
          </button>
          <span className="tool-sep" />
          <button type="button" className="tool-btn" style={{ fontWeight: 700 }}>H1</button>
          <button type="button" className="tool-btn" style={{ fontWeight: 600 }}>H2</button>
          <button type="button" className="tool-btn" style={{ fontWeight: 600 }}>H3</button>
          <span className="tool-sep" />
          <button type="button" className="tool-btn" style={{ fontWeight: 700 }}>B</button>
          <button type="button" className="tool-btn" style={{ fontStyle: 'italic' }}>I</button>
          <button type="button" className="tool-btn" style={{ textDecoration: 'underline' }}>U</button>
          <button type="button" className="tool-btn" style={{ textDecoration: 'line-through' }}>S</button>
          <span className="tool-sep" />
          <button type="button" className="tool-btn">
            <Icon size="sm">
              <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
              <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
            </Icon>
          </button>
          <button type="button" className="tool-btn" title="引用">
            <Icon size="sm">
              <path d="M3 21V10a5 5 0 0 1 5-5h1v5H5v6h5v5zM14 21V10a5 5 0 0 1 5-5h1v5h-4v6h5v5z" />
            </Icon>
          </button>
          <button type="button" className="tool-btn" title="代码块">
            <Icon size="sm">
              <path d="m8 6-6 6 6 6" />
              <path d="m16 6 6 6-6 6" />
            </Icon>
          </button>
          <button type="button" className="tool-btn" title="图片">
            <Icon size="sm">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5-11 11" />
            </Icon>
          </button>
          <button type="button" className="tool-btn" title="公式">
            <Icon size="sm">
              <path d="M5 3h14M9 3v10l-4 8h10M15 9l4 4M19 9l-4 4" />
            </Icon>
          </button>
          <button type="button" className="tool-btn" title="表格">
            <Icon size="sm">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
            </Icon>
          </button>
          <button type="button" className="tool-btn" title="Mermaid 图">
            <Icon size="sm">
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="12" cy="18" r="3" />
              <path d="M7.5 8 12 15" />
              <path d="M16.5 8 12 15" />
            </Icon>
          </button>
          <div className="tool-spacer" />
          <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
            2,340 字 · 约 7 分钟阅读
          </span>
        </div>

        <div className="splits">
          <div className="pane" style={{ position: 'relative' }}>
            <div className="pane-label">
              <Icon size="sm">
                <path d="M3 4h18v16H3z" />
                <path d="M7 15V9l3 3 3-3v6" />
                <path d="m17 9 3 3-3 3" />
              </Icon>
              Markdown
              <span className="sp" />
              <span>UTF-8 · LF · 行 42</span>
            </div>
            <div className="mdeditor">
              <div className="gutter">
                {Array.from({ length: 20 }, (_, i) => (
                  <span className="ln" key={i}>{i + 1}</span>
                ))}
              </div>
              <div className="src">
<span className="md-h1"># Hook 注入点深度解析：那些容易被忽略的生命周期</span>
{'\n\n'}
&gt; <span className="md-quote">本文面向已经熟悉 Claude Code 基础用法的读者，重点是挖掘几个<br />&nbsp; 在文档里一笔带过、但实际非常有用的 Hook 注入点。</span>
{'\n\n'}
<span className="md-head">## 一、Hook 机制为什么重要</span>
{'\n\n'}
很多团队把 Hook 当作&ldquo;一次性的拦截器&rdquo;来用。这低估了它。
{'\n\n'}
一个写得好的 Hook，可以承担起整个团队的 <span className="md-bold">**工作流约束**</span>：
{'\n\n'}
- 提交前 lint 与测试{'\n'}
- 调用外部工具时的审计日志{'\n'}
- <span className="md-code">`forbidden paths`</span> 的硬拦截{'\n'}
- CI 与本地行为一致性保证<span className="cursor" />
{'\n\n'}
<span className="md-head">## 二、被低估的三个注入点</span>
{'\n\n'}
<span className="md-head">### 1. `pre-tool-call`</span>
{'\n\n'}
在任何工具被调用之前触发，可以 <span className="md-bold">**阻断**</span> 或 <span className="md-bold">**改写**</span> 参数。
{'\n\n'}
<span className="md-head">### 2. `post-file-write`</span>
{'\n\n'}
文件写入后触发。适合做自动 [格式化](<span className="md-link">#fmt</span>)。
{'\n\n'}
<span className="md-head">### 3. `session-end`</span>
{'\n\n'}
会话结束时触发。适合做归档、埋点。
{'\n\n'}
<span className="md-hr">---</span>
              </div>
            </div>

            <div className="slash-menu" style={{ top: 410, left: 160 }}>
              <div style={{ padding: '6px 8px 8px', fontSize: 11, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)' }}>基础块</div>
              <div className="slash-item sel">
                <span className="slash-ico">
                  <Icon size="sm"><path d="M7 4h10M7 20h10M10 4v16M14 4v16" /></Icon>
                </span>
                <div>
                  <div className="slash-title">标题 2</div>
                  <div className="slash-desc">中等标题 · ## 或 Ctrl+2</div>
                </div>
              </div>
              <div className="slash-item">
                <span className="slash-ico">
                  <Icon size="sm">
                    <path d="m8 6-6 6 6 6" />
                    <path d="m16 6 6 6-6 6" />
                  </Icon>
                </span>
                <div>
                  <div className="slash-title">代码块</div>
                  <div className="slash-desc">语法高亮 · ``` 或 Ctrl+E</div>
                </div>
              </div>
              <div className="slash-item">
                <span className="slash-ico">
                  <Icon size="sm"><path d="M3 21V10a5 5 0 0 1 5-5h1v5H5v6z" /></Icon>
                </span>
                <div>
                  <div className="slash-title">引用</div>
                  <div className="slash-desc">侧边缘高亮 · &gt;</div>
                </div>
              </div>
              <div className="slash-item">
                <span className="slash-ico">
                  <Icon size="sm">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 3v18" />
                  </Icon>
                </span>
                <div>
                  <div className="slash-title">表格</div>
                  <div className="slash-desc">可调整行列</div>
                </div>
              </div>
              <div className="slash-item">
                <span className="slash-ico">
                  <Icon size="sm">
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="18" cy="6" r="3" />
                    <circle cx="12" cy="18" r="3" />
                  </Icon>
                </span>
                <div>
                  <div className="slash-title">Mermaid 图</div>
                  <div className="slash-desc">流程图 · 时序图</div>
                </div>
              </div>
            </div>
          </div>

          <div className="drag" />

          <div className="pane">
            <div className="pane-label">
              <Icon size="sm">
                <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                <circle cx="12" cy="12" r="3" />
              </Icon>
              预览 · 实时渲染
              <span className="sp" />
              <span>排版：文章正文样式</span>
            </div>
            <div className="preview">
              <h1>Hook 注入点深度解析：那些容易被忽略的生命周期</h1>
              <p className="lead">
                本文面向已经熟悉 Claude Code 基础用法的读者，重点是挖掘几个在文档里一笔带过、但实际非常有用的 Hook 注入点。
              </p>
              <blockquote>工具不会让烂代码变好。但工具会让团队的工作节奏，彻底换一种形态。</blockquote>

              <h2>一、Hook 机制为什么重要</h2>
              <p>很多团队把 Hook 当作&ldquo;一次性的拦截器&rdquo;来用。这低估了它。</p>
              <p>一个写得好的 Hook，可以承担起整个团队的 <strong>工作流约束</strong>：</p>
              <ul>
                <li>提交前 lint 与测试</li>
                <li>调用外部工具时的审计日志</li>
                <li><code>forbidden paths</code> 的硬拦截</li>
                <li>CI 与本地行为一致性保证</li>
              </ul>

              <h2>二、被低估的三个注入点</h2>
              <h3>1. <code>pre-tool-call</code></h3>
              <p>在任何工具被调用之前触发，可以 <strong>阻断</strong> 或 <strong>改写</strong> 参数。</p>
              <pre>{`hooks: {
  `}<span style={{ color: '#8F3427' }}>&quot;pre-tool-call&quot;</span>{`: (ctx) => {
    `}<span style={{ color: '#8F3427' }}>if</span>{` (ctx.tool === `}<span style={{ color: '#5F6B3F' }}>&quot;Bash&quot;</span>{`)
      `}<span style={{ color: '#8F3427' }}>if</span>{` (ctx.args.cmd.includes(`}<span style={{ color: '#5F6B3F' }}>&quot;rm -rf&quot;</span>{`))
        `}<span style={{ color: '#8F3427' }}>return</span>{` { deny: `}<span style={{ color: '#8F3427' }}>true</span>{` };
  }
}`}</pre>
              <h3>2. <code>post-file-write</code></h3>
              <p>
                文件写入后触发。适合做自动 <a href="#fmt">格式化</a>。
              </p>
              <h3>3. <code>session-end</code></h3>
              <p>会话结束时触发。适合做归档、埋点。</p>
            </div>
          </div>
        </div>

        <div className="bottom-bar">
          <span>自动保存 · 每 10 秒</span>
          <span>· 2,340 字 / 7 min</span>
          <span>· Markdown v0.14</span>
          <div className="sp" />
          <span>当前版本 v1.3 · 3 个历史版本</span>
          <span>·</span>
          <span>最后编辑 3 小时前</span>
        </div>
      </div>

      <aside className="drawer">
        <div className="drawer-sec">
          <h4>封面图</h4>
          <div className="cover-up">
            <Icon size="md"><path d="M12 5v14M5 12h14" /></Icon>
            <div>点击或拖拽上传</div>
            <div style={{ color: 'var(--ink-4)', fontSize: 11 }}>建议 1200×630 · JPG/PNG</div>
          </div>
        </div>

        <div className="drawer-sec">
          <h4>分类与标签</h4>
          <div style={{ marginBottom: 12 }}>
            <div className="field-label">分类</div>
            <select className="field-in" defaultValue="源码分析">
              <option>源码分析</option>
              <option>最佳实践</option>
              <option>实战教学</option>
            </select>
          </div>
          <div>
            <div className="field-label">标签 · 最多 5 个</div>
            <div className="tag-pick">
              <span className="chip chip-active">#Hooks</span>
              <span className="chip chip-active">#源码</span>
              <span className="chip chip-active">#生命周期</span>
              <span className="chip">+ 添加</span>
            </div>
          </div>
        </div>

        <div className="drawer-sec">
          <h4>摘要</h4>
          <textarea
            className="field-ta"
            placeholder="一句话简介（会展示在列表页）"
            defaultValue="挖掘几个文档中一笔带过、但实际非常有用的 Hook 注入点，附完整代码示例。"
          />
        </div>

        <div className="drawer-sec">
          <h4>SEO 设置</h4>
          <div style={{ marginBottom: 10 }}>
            <div className="field-label">Meta Title</div>
            <input className="field-in" defaultValue="Hook 注入点深度解析 - ClaudeCode Hub" />
          </div>
          <div style={{ marginBottom: 10 }}>
            <div className="field-label">Meta Description</div>
            <textarea
              className="field-ta"
              style={{ minHeight: 56 }}
              defaultValue="深度剖析 Claude Code Hook 机制中那些容易被忽略的生命周期注入点。"
            />
          </div>
          <div>
            <div className="field-label">Keywords</div>
            <input className="field-in" defaultValue="Claude Code, Hook, 生命周期, 源码分析" />
          </div>
        </div>

        <div className="drawer-sec">
          <h4>发布选项</h4>
          <div className="swc">
            <span className="lbl">设为精华</span>
            <span className={`switch${switches.featured ? ' on' : ''}`} onClick={() => toggle('featured')} />
          </div>
          <div className="swc">
            <span className="lbl">置顶</span>
            <span className={`switch${switches.top ? ' on' : ''}`} onClick={() => toggle('top')} />
          </div>
          <div className="swc">
            <span className="lbl">允许评论</span>
            <span className={`switch${switches.comments ? ' on' : ''}`} onClick={() => toggle('comments')} />
          </div>
          <div className="swc">
            <span className="lbl">仅登录可见</span>
            <span className={`switch${switches.loginOnly ? ' on' : ''}`} onClick={() => toggle('loginOnly')} />
          </div>
        </div>

        <div className="drawer-sec">
          <h4>版本历史</h4>
          <button type="button" className="btn-hist">
            <Icon size="sm">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </Icon>
            查看 3 个历史版本 · diff 对比
          </button>
          <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
            v1.3 · 3 小时前 · +184 -12
            <br />
            v1.2 · 昨天 22:40 · +562 -84
            <br />
            v1.1 · 2 天前 · 初稿
          </div>
        </div>
      </aside>
    </div>
  );
}
