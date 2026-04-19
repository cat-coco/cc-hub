import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Icon, { IconCopy } from '../components/Icon';
import '../styles/article.css';

export default function ArticlePage() {
  return (
    <Layout active="articles">
      <main className="container">
        <div className="art-crumb">
          <Link to="/home">首页</Link>
          <span className="sep">/</span>
          <Link to="/articles">文章</Link>
          <span className="sep">/</span>
          <Link to="/articles">最佳实践</Link>
          <span className="sep">/</span>
          <span className="cur">用 Claude Code 重构一个十年历史的 Java 单体</span>
        </div>

        <div className="art-layout">
          <aside className="art-rail">
            <button type="button" className="rail-btn liked" title="点赞">
              <Icon>
                <path d="M7 10v11H4V10zM20 9h-6l1-5c.2-1-.5-2-1.5-2-.5 0-1 .3-1.3.8L7 10v11h11a2 2 0 0 0 2-1.8l1-7A2 2 0 0 0 20 9z" />
              </Icon>
              <span>482</span>
            </button>
            <button type="button" className="rail-btn" title="收藏">
              <Icon>
                <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </Icon>
              <span>127</span>
            </button>
            <button type="button" className="rail-btn" title="分享">
              <Icon>
                <circle cx="18" cy="5" r="2.5" />
                <circle cx="6" cy="12" r="2.5" />
                <circle cx="18" cy="19" r="2.5" />
                <path d="m8.2 10.8 7.6-4.6" />
                <path d="m8.2 13.2 7.6 4.6" />
              </Icon>
              <span>36</span>
            </button>
            <button type="button" className="rail-btn" title="评论">
              <Icon>
                <path d="M21 12a8 8 0 1 1-3-6l3-1-1 3a8 8 0 0 1 1 4z" />
              </Icon>
              <span>42</span>
            </button>
          </aside>

          <article className="art">
            <div className="art-cat">最佳实践 · PRACTICE</div>
            <h1>用 Claude Code 重构一个十年历史的 Java 单体：完整复盘</h1>
            <p className="sub">
              40 万行代码、23 个模块、四代技术栈共存。我们用六周做了一次彻底的结构迁移。这里是全部细节。
            </p>

            <div className="art-byline">
              <span className="ava">Z</span>
              <div>
                <div className="bl-name">
                  张未未
                  <button type="button" className="btn btn-secondary btn-sm" style={{ marginLeft: 10 }}>
                    + 关注
                  </button>
                </div>
                <div className="bl-meta">高级架构师 · 2026-04-17 发布</div>
              </div>
              <div className="bl-spacer" />
              <div className="bl-stat">
                <span>12 分钟阅读</span>
                <span>8,243 浏览</span>
              </div>
            </div>

            <div className="art-body">
              <p>
                项目一开始时大概是这样的：一个 2016 年立项的后台管理系统，用 Spring MVC 3.x 启动，后来陆续接入 Spring Boot 1.x、2.x，中间还混了一段基于 JSP 的前端代码。数据库迁移过两次但没迁干净，三个版本的 Dubbo 同时在生产上跑。
              </p>
              <p>
                每一次我们想动一处，都要把整个链路重跑一遍。团队里最熟悉这个项目的同事，在我加入时已经离职两年了。
              </p>

              <h2 id="h-1">一、为什么选择 Claude Code</h2>
              <p>
                要说&ldquo;为什么选择 AI&rdquo;，这个问题在 2026 年其实已经不再值得讨论。真正值得记录的是另外一个问题：<em>为什么我们敢让 AI 深入到这么复杂的代码里</em>？
              </p>
              <p>
                答案是我们分阶段建立了信任。第一周只用它做代码阅读和注释生成；第二周让它提 PR，但所有改动必须由人工合并；第三周之后才放开直接提交权限，但限定在测试覆盖率 90% 以上的模块。
              </p>
              <blockquote>分阶段建立信任，远比&ldquo;一次性全开放&rdquo;更能让团队适应新工作流。</blockquote>

              <h2 id="h-2">二、前期准备：让 AI 真正&ldquo;看懂&rdquo;项目</h2>
              <h3 id="h-2-1">CLAUDE.md 的关键字段</h3>
              <p>
                一个写得好的 <code>CLAUDE.md</code>，价值胜过十页文档。我们最终定版包含以下几个区块：
              </p>
              <ul>
                <li>项目总体结构与模块边界</li>
                <li>领域术语对照表（业务缩写、代号、历史遗留命名）</li>
                <li>代码风格与提交规范</li>
                <li>常见任务的标准流程（比如&ldquo;如何加一个新的 API 字段&rdquo;）</li>
                <li>禁区列表：哪些目录不能动、哪些函数是兜底逻辑</li>
              </ul>

              <div className="code-wrap">
                <div className="code-head">
                  <span className="code-lang">markdown</span>
                  <button type="button" className="code-copy">
                    <IconCopy /> 复制
                  </button>
                </div>
                <pre>
<span className="tk-cm"># 领域术语对照表</span>
{'\n\n'}
<span className="tk-kw">-</span> <span className="tk-str">&quot;订单主链路&quot;</span>     <span className="tk-kw">=</span> order-core 模块下的 OrderService{'\n'}
<span className="tk-kw">-</span> <span className="tk-str">&quot;小单&quot;</span>             <span className="tk-kw">=</span> 金额 &lt; 500 的订单，走异步对账{'\n'}
<span className="tk-kw">-</span> <span className="tk-str">&quot;T+1 兜底&quot;</span>         <span className="tk-kw">=</span> 每日凌晨 2:00 的补偿任务，不可删除{'\n'}
<span className="tk-kw">-</span> <span className="tk-str">&quot;老结算&quot;</span>           <span className="tk-kw">=</span> settlement-legacy，2028 年前不能下线
                </pre>
              </div>

              <h3 id="h-2-2">测试覆盖率这一关</h3>
              <p>我们花了整整一周，只做一件事：把测试覆盖率从 34% 拉到 72%。这之后 AI 的改动才敢让它自动合并。</p>

              <figure className="figure">
                <div className="ph ph-brand">架构演进图 · before / after</div>
                <figcaption>迁移前后的模块依赖图对比</figcaption>
              </figure>

              <h2 id="h-3">三、工作流设计</h2>
              <h3 id="h-3-1">三类 Subagent 的划分</h3>
              <p>我们为这个项目专门训练了三个 Subagent：</p>

              <div className="code-wrap">
                <div className="code-head">
                  <span className="code-lang">typescript</span>
                  <button type="button" className="code-copy">
                    <IconCopy /> 复制
                  </button>
                </div>
                <pre>
<span className="tk-kw">const</span> <span className="tk-var">agents</span> <span className="tk-kw">=</span> {'{'}
  {'\n  '}<span className="tk-fn">reviewer</span>: {'{'}
    {'\n    '}role: <span className="tk-str">&quot;代码审查&quot;</span>,
    {'\n    '}scope: [<span className="tk-str">&quot;src/**&quot;</span>],
    {'\n    '}allowWrite: <span className="tk-kw">false</span>,
  {'\n  }'},
  {'\n  '}<span className="tk-fn">refactorer</span>: {'{'}
    {'\n    '}role: <span className="tk-str">&quot;模块重构&quot;</span>,
    {'\n    '}scope: [<span className="tk-str">&quot;src/order-core/**&quot;</span>],
    {'\n    '}allowWrite: <span className="tk-kw">true</span>,
    {'\n    '}requireTests: <span className="tk-kw">true</span>,
  {'\n  }'},
  {'\n  '}<span className="tk-fn">migrator</span>: {'{'}
    {'\n    '}role: <span className="tk-str">&quot;依赖升级&quot;</span>,
    {'\n    '}scope: [<span className="tk-str">&quot;pom.xml&quot;</span>, <span className="tk-str">&quot;build.gradle&quot;</span>],
    {'\n    '}allowWrite: <span className="tk-kw">true</span>,
    {'\n    '}humanApproval: <span className="tk-kw">true</span>,
  {'\n  }'},
{'\n};'}
                </pre>
              </div>

              <p>
                这里的关键是 <code>scope</code>——我们严格限制了每个 Agent 能看到的代码范围。<a href="#">相关讨论见这里</a>。
              </p>

              <h2 id="h-4">四、踩过的坑</h2>
              <p>不是每一件事都顺利。这里列出三个最让我们印象深刻的问题。</p>
              <h3 id="h-4-1">1. 过度修改历史代码</h3>
              <p>AI 看到一段 2016 年的&ldquo;不优雅&rdquo;代码，第一反应是全部重写。但这段代码可能承载着我们已经遗忘的业务约束。</p>
              <h3 id="h-4-2">2. 测试的假阳性</h3>
              <p>AI 生成的测试跑通了，并不等于业务逻辑是对的。我们多次发现测试本身写错了断言。</p>
              <h3 id="h-4-3">3. 缓存的隐性依赖</h3>
              <p>最阴险的一类问题：代码本身没问题，但依赖了一个被移除的 Redis Key。</p>

              <h2 id="h-5">五、最终沉淀的工作流</h2>
              <p>六周之后，团队完成了重构。更宝贵的，是沉淀下了一整套&ldquo;AI 协作规范&rdquo;。</p>
              <blockquote>工具不会让烂代码变好。但工具会让团队的工作节奏，彻底换一种形态。</blockquote>
            </div>

            <div className="author-card">
              <span className="ava">Z</span>
              <div style={{ flex: 1 }}>
                <h4>张未未</h4>
                <p className="abio">十年 Java 开发经验，现就职于某电商平台。近期把 80% 的工作流交给了 AI。</p>
                <div className="astats">
                  <span>127 篇文章</span>
                  <span>2,140 粉丝</span>
                  <span>入驻 2 年</span>
                </div>
              </div>
              <button type="button" className="btn btn-primary btn-sm">+ 关注</button>
            </div>

            <div className="related">
              <Link className="r-card" to="/article">
                <div className="acat">最佳实践</div>
                <div className="rtitle">把 CLAUDE.md 写到这个程度，团队新人上手只要一天</div>
              </Link>
              <Link className="r-card" to="/article">
                <div className="acat">技术洞察</div>
                <div className="rtitle">Agent 时代的代码审查：我们重新定义了 PR 的意义</div>
              </Link>
            </div>

            <section className="comments">
              <h3>评论 · 42</h3>
              <div className="cmt-box">
                <textarea placeholder="写下你的想法…（支持 Markdown）" />
                <div className="cmt-box-foot">
                  遵守 <a href="#" style={{ color: 'var(--brand)' }}>社区公约</a>
                  <button type="button" className="btn btn-primary btn-sm">发表评论</button>
                </div>
              </div>

              <div className="cmt">
                <span className="ava">L</span>
                <div style={{ flex: 1 }}>
                  <div className="cmt-head">
                    <span className="cmt-name">林秋白</span>
                    <span className="cmt-time">2 小时前</span>
                  </div>
                  <div className="cmt-text">
                    测试覆盖率这段太真实了。我们上个月也是卡在这里，最后专门拉了两个人只做测试补齐。
                  </div>
                  <div className="cmt-actions">
                    <a href="#">👍 24</a>
                    <a href="#">回复</a>
                  </div>

                  <div className="cmt-reply">
                    <div className="cmt" style={{ padding: 0, border: 'none' }}>
                      <span className="ava">Z</span>
                      <div>
                        <div className="cmt-head">
                          <span className="cmt-name">
                            张未未
                            <span className="tag tag-brand" style={{ marginLeft: 6 }}>作者</span>
                          </span>
                          <span className="cmt-time">1 小时前</span>
                        </div>
                        <div className="cmt-text">对，这块没法偷懒。我的建议是先补关键路径，不要追求 100%。</div>
                        <div className="cmt-actions">
                          <a href="#">👍 12</a>
                          <a href="#">回复</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cmt">
                <span className="ava">W</span>
                <div style={{ flex: 1 }}>
                  <div className="cmt-head">
                    <span className="cmt-name">吴桥</span>
                    <span className="cmt-time">4 小时前</span>
                  </div>
                  <div className="cmt-text">
                    请教一下，Subagent 的 scope 是怎么配置生效的？是在 CLAUDE.md 里声明，还是通过 config 文件？
                  </div>
                  <div className="cmt-actions">
                    <a href="#">👍 8</a>
                    <a href="#">回复</a>
                  </div>
                </div>
              </div>

              <div className="cmt">
                <span className="ava">H</span>
                <div style={{ flex: 1 }}>
                  <div className="cmt-head">
                    <span className="cmt-name">何迁</span>
                    <span className="cmt-time">6 小时前</span>
                  </div>
                  <div className="cmt-text">
                    &ldquo;分阶段建立信任&rdquo;这个思路给我很大启发。准备在我们团队也这样试一下。
                  </div>
                  <div className="cmt-actions">
                    <a href="#">👍 15</a>
                    <a href="#">回复</a>
                  </div>
                </div>
              </div>
            </section>
          </article>

          <aside className="toc">
            <h5>目录</h5>
            <a href="#h-1" className="active">一、为什么选择 Claude Code</a>
            <a href="#h-2">二、前期准备：让 AI 真正&ldquo;看懂&rdquo;项目</a>
            <a href="#h-2-1" className="lvl-3">CLAUDE.md 的关键字段</a>
            <a href="#h-2-2" className="lvl-3">测试覆盖率这一关</a>
            <a href="#h-3">三、工作流设计</a>
            <a href="#h-3-1" className="lvl-3">三类 Subagent 的划分</a>
            <a href="#h-4">四、踩过的坑</a>
            <a href="#h-4-1" className="lvl-3">1. 过度修改历史代码</a>
            <a href="#h-4-2" className="lvl-3">2. 测试的假阳性</a>
            <a href="#h-4-3" className="lvl-3">3. 缓存的隐性依赖</a>
            <a href="#h-5">五、最终沉淀的工作流</a>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
