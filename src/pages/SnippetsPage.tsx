import type { ReactNode } from 'react';
import Layout from '../components/Layout';
import { IconCopy } from '../components/Icon';
import '../styles/snippets.css';

interface Snippet {
  lang: string;
  title: string;
  desc: string;
  code: ReactNode;
  authorInitial: string;
  author: string;
  stars: string;
  copies: string;
}

const SNIPPETS: Snippet[] = [
  {
    lang: 'markdown',
    title: 'CLAUDE.md 团队模板（含领域术语表）',
    desc: '经过 3 个团队验证的 CLAUDE.md 起始模板。包含结构说明、禁区、术语表。',
    code: (
      <>
        <span className="tk-cm"># 项目概览</span>{'\n'}
        本项目是一个基于 Spring Boot 的电商中台...{'\n\n'}
        <span className="tk-cm">## 领域术语</span>{'\n'}
        - <span className="tk-str">&quot;订单主链路&quot;</span> = order-core 模块{'\n'}
        - <span className="tk-str">&quot;小单&quot;</span> = 金额 &lt; 500 的订单{'\n'}
        - <span className="tk-str">&quot;T+1 兜底&quot;</span> = 凌晨补偿任务
      </>
    ),
    authorInitial: 'Z', author: '张未未', stars: '★ 482 收藏', copies: '1,240 复制',
  },
  {
    lang: 'typescript',
    title: 'Reviewer Subagent：只读代码审查',
    desc: '限制写入权限，只做 comment。适合接入 PR 流程。',
    code: (
      <>
        <span className="tk-kw">export const</span> <span className="tk-fn">reviewer</span> = {'{'}{'\n'}
        {'  '}role: <span className="tk-str">&quot;代码审查&quot;</span>,{'\n'}
        {'  '}scope: [<span className="tk-str">&quot;src/**&quot;</span>],{'\n'}
        {'  '}allowWrite: <span className="tk-kw">false</span>,{'\n'}
        {'  '}rules: [{'\n'}
        {'    '}<span className="tk-str">&quot;只在可疑处留 comment&quot;</span>,{'\n'}
        {'    '}<span className="tk-str">&quot;不改动代码本身&quot;</span>,{'\n'}
        {'  '}],{'\n'}
        {'};'}
      </>
    ),
    authorInitial: 'L', author: '林秋白', stars: '★ 318 收藏', copies: '892 复制',
  },
  {
    lang: 'yaml',
    title: 'GitHub Actions：自动 PR 审查工作流',
    desc: '6 行 YAML，即可让 Claude 自动审查每一个 PR。',
    code: (
      <>
        <span className="tk-kw">name:</span> claude-review{'\n'}
        <span className="tk-kw">on:</span> [pull_request]{'\n'}
        <span className="tk-kw">jobs:</span>{'\n'}
        {'  '}review:{'\n'}
        {'    '}<span className="tk-kw">runs-on:</span> ubuntu-latest{'\n'}
        {'    '}<span className="tk-kw">steps:</span>{'\n'}
        {'      '}- <span className="tk-kw">uses:</span> claude-code/review@v1
      </>
    ),
    authorInitial: 'W', author: '吴桥', stars: '★ 264 收藏', copies: '720 复制',
  },
  {
    lang: 'bash',
    title: 'Pre-commit Hook：提交前让 Claude 先过一眼',
    desc: '放进 .git/hooks/pre-commit，提交前自动扫描并阻止明显错误。',
    code: (
      <>
        <span className="tk-cm">#!/usr/bin/env bash</span>{'\n'}
        <span className="tk-kw">set</span> -euo pipefail{'\n\n'}
        DIFF=$(git diff --cached){'\n'}
        <span className="tk-kw">if</span> [ -z <span className="tk-str">&quot;$DIFF&quot;</span> ]; <span className="tk-kw">then</span> <span className="tk-kw">exit</span> 0; <span className="tk-kw">fi</span>{'\n\n'}
        claude review --input - &lt;&lt;&lt; <span className="tk-str">&quot;$DIFF&quot;</span>
      </>
    ),
    authorInitial: 'S', author: '宋行', stars: '★ 198 收藏', copies: '542 复制',
  },
  {
    lang: 'json',
    title: 'MCP 配置：接入本地 PostgreSQL（只读）',
    desc: '安全的只读数据库接入，适合让 Agent 查询业务数据。',
    code: (
      <>
        {'{'}{'\n'}
        {'  '}<span className="tk-str">&quot;mcpServers&quot;</span>: {'{'}{'\n'}
        {'    '}<span className="tk-str">&quot;postgres&quot;</span>: {'{'}{'\n'}
        {'      '}<span className="tk-str">&quot;command&quot;</span>: <span className="tk-str">&quot;mcp-server-pg&quot;</span>,{'\n'}
        {'      '}<span className="tk-str">&quot;args&quot;</span>: [<span className="tk-str">&quot;--readonly&quot;</span>],{'\n'}
        {'      '}<span className="tk-str">&quot;env&quot;</span>: {'{ '}<span className="tk-str">&quot;PG_URL&quot;</span>: <span className="tk-str">&quot;...&quot;</span> {'}'}{'\n'}
        {'    }'}{'\n'}
        {'  }'}{'\n'}
        {'}'}
      </>
    ),
    authorInitial: 'C', author: '陈果', stars: '★ 176 收藏', copies: '428 复制',
  },
  {
    lang: 'markdown',
    title: 'Prompt：让 Claude 生成 Conventional Commits',
    desc: '严格遵守 feat/fix/chore 规范，中文描述，含 scope。',
    code: (
      <>
        <span className="tk-cm"># 目标</span>{'\n'}
        基于 git diff 生成符合 Conventional{'\n'}
        Commits 规范的提交信息。{'\n\n'}
        <span className="tk-cm">## 要求</span>{'\n'}
        - 必须有 type(scope): subject{'\n'}
        - subject 用中文，不超过 50 字{'\n'}
        - 如有 breaking change，加 BREAKING
      </>
    ),
    authorInitial: 'H', author: '何迁', stars: '★ 142 收藏', copies: '387 复制',
  },
];

export default function SnippetsPage() {
  return (
    <Layout active="snippets">
      <main className="container">
        <div className="snippets-head">
          <h1>Snippets 代码片段库</h1>
          <p>1,203 条可复用的 Prompt、配置、脚本。点击复制，即取即用。</p>
        </div>

        <div className="snippets-layout">
          <aside className="snippets-tree">
            <h5>分类</h5>
            <div className="tree-node on">全部 <span className="tree-count">1,203</span></div>

            <div className="tree-group-title">按类型</div>
            <div className="tree-node">Prompt 模板 <span className="tree-count">412</span></div>
            <div className="tree-node">配置片段 <span className="tree-count">287</span></div>
            <div className="tree-node">Shell 脚本 <span className="tree-count">194</span></div>
            <div className="tree-node">Hook 钩子 <span className="tree-count">156</span></div>
            <div className="tree-node">Subagent 定义 <span className="tree-count">98</span></div>
            <div className="tree-node">MCP 配置 <span className="tree-count">56</span></div>

            <div className="tree-group-title">按语言</div>
            <div className="tree-node">TypeScript <span className="tree-count">384</span></div>
            <div className="tree-node">Python <span className="tree-count">276</span></div>
            <div className="tree-node">YAML <span className="tree-count">213</span></div>
            <div className="tree-node">JSON <span className="tree-count">178</span></div>
            <div className="tree-node">Bash <span className="tree-count">152</span></div>

            <div className="tree-group-title">标签</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
              <span className="tag">#review</span>
              <span className="tag">#refactor</span>
              <span className="tag">#test</span>
              <span className="tag">#docs</span>
              <span className="tag">#git</span>
              <span className="tag">#mcp</span>
            </div>
          </aside>

          <div>
            <div className="snippets-toolbar">
              <input className="search-input" placeholder="搜索 Snippets…（支持语言、标签、关键词）" />
              <span className="chip chip-active">最新</span>
              <span className="chip">最多收藏</span>
              <span className="chip">最多复制</span>
            </div>

            <div className="sgrid">
              {SNIPPETS.map((s) => (
                <div className="snip" key={s.title}>
                  <div className="snip-head">
                    <span className="snip-lang">{s.lang}</span>
                    <span className="snip-sp" />
                    <button type="button" className="snip-copy">
                      <IconCopy />复制
                    </button>
                  </div>
                  <div className="snip-title">{s.title}</div>
                  <p className="snip-desc">{s.desc}</p>
                  <pre className="snip-code">{s.code}</pre>
                  <div className="snip-foot">
                    <span className="ava">{s.authorInitial}</span>
                    <span>{s.author}</span>
                    <span className="sp" />
                    <span>{s.stars}</span>
                    <span>{s.copies}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
