/**
 * Resume data — English (`en`) and Chinese (`zh`) share the same `ResumeData` shape.
 *
 * Highlight rule for `strengths`:
 *   `highlight: true` is reserved for items that map to the *current* primary line
 *   of work (right now: AI Agent / Multi-Agent / LangChain ecosystem). Everything
 *   else stays unhighlighted, even if it's a deep skill — Java is real, but it's
 *   not the current focus, so it does not get the visual emphasis. When you change
 *   primary lines later, sweep this rule rather than spot-toggling tags.
 */

export interface ProjectLink {
  /** Short user-facing label (e.g. 'lessie.ai', 'GitHub', 'arXiv'). */
  label: string;
  url: string;
}

export interface ExperienceProject {
  name: string;
  /** External resources for this project (website, repo, paper, demo, …). */
  links?: ProjectLink[];
  details: string[];
}

export interface ExperienceEntry {
  company: string;
  /** Company website; when set, the company name renders as a clickable link. */
  companyUrl?: string;
  companyLogo?: string;
  /** Set to true for monochrome dark logos that need inversion in dark mode. */
  monoLogo?: boolean;
  role: string;
  date: string;
  /** Org unit within the company (e.g. "CSIG · Security Product Dept. II"). Optional; only rendered when set. */
  department?: string;
  /** Tech / capability tags that span the whole tenure at this company. */
  tags: string[];
  /** One or more projects shipped at this company, listed in importance order. */
  projects: ExperienceProject[];
}

export interface StrengthCategory {
  label: string;
  tags: { text: string; highlight?: boolean }[];
}

export interface ResumeContact {
  type: 'email' | 'phone' | 'linkedin' | 'github';
  /** For social types: handle only (e.g. 'shanezchang'); URL is constructed in the view. */
  value: string;
}

/**
 * One numbered "highlight": a strength claim backed by concrete evidence
 * pointing at the experience timeline. Keeps the resume's claim density honest.
 */
export interface Highlight {
  /** Rendered only when true. Keep exactly three featured per language — the
   *  three that match the roles currently being targeted (now: AI / Agent
   *  engineering). Unfeatured entries stay as a bench for future retargeting. */
  featured?: boolean;
  /** Short, scannable title (e.g. "Learning Agility"). */
  title: string;
  /** One-line statement of what this strength looks like in practice. */
  tagline: string;
  /** Evidence bullets, each pointing at a concrete project / metric. */
  evidence: string[];
}

/**
 * A paper or open-source artifact that deserves its own section. Job-search
 * rule: peer-reviewed / open work is surfaced as a top-level section, never
 * buried inside one employer's project list.
 */
export interface Publication {
  title: string;
  /** Where it landed — a venue for papers, the distribution channel for code. */
  venue?: string;
  /** Role stated plainly — authorship position, or contribution to a repo. */
  authorship?: string;
  summary: string;
  links?: ProjectLink[];
}

export interface ResumeData {
  name: string;
  /** Short factoids rendered first in the hero strip (e.g. years of experience). */
  meta: string[];
  /** One-paragraph positioning statement: who I am, what I do now, what backs it. */
  summary: string;
  /** Structured contacts rendered with mail/phone icons. */
  contacts: ResumeContact[];
  education: {
    school: string;
    schoolLogo: string;
    college: string;
    /** Specific major within the college (e.g. "Mathematics and Applied Mathematics"). */
    major?: string;
    degree: string;
    date: string;
  };
  sectionTitles: {
    education: string;
    experience: string;
    strengths: string;
    highlights: string;
    publications: string;
  };
  experience: ExperienceEntry[];
  /**
   * `strengths` and `highlights` are RETAINED BUT NOT RENDERED. The resume is
   * deliberately plain: hero → experience → publications → education. The tech
   * keywords they used to carry already live on each experience entry's `tags`.
   * Kept as a bench for retargeting (LinkedIn skills, JD-tailored variants);
   * restore the sections in ResumeBody.astro to bring them back.
   */
  strengths: StrengthCategory[];
  /** Optional evidence-backed strength signals; rendered between Strengths and Experience. */
  highlights?: Highlight[];
  /** Papers / open-source artifacts, rendered as their own section. */
  publications?: Publication[];
}

export const en: ResumeData = {
  name: 'Shane Chang',
  meta: ['4 Years Experience'],
  summary:
    'Backend and data engineer turned AI Agent engineer. Four years shipping production systems — internet-scale monitoring at Tencent, a self-built WMS in cross-border logistics — and now multi-agent architecture, model evaluation and routing, and agent reliability at Superlinear. Led People Search Bench, an open benchmark accepted to EMNLP 2026 (Industry Track).',
  contacts: [
    { type: 'email', value: 'shane.z.chang@gmail.com' },
    { type: 'phone', value: '185-5557-3888' },
    { type: 'linkedin', value: 'shanezchang' },
    { type: 'github', value: 'shanezchang' },
  ],
  education: {
    school: 'Shenzhen University',
    schoolLogo: '/assets/szu-logo.png',
    college: 'School of Mathematical Sciences',
    major: 'Mathematics and Applied Mathematics',
    degree: "Bachelor's",
    date: '2018 - 2022',
  },
  sectionTitles: {
    education: 'Education',
    experience: 'Experience',
    strengths: 'Strengths',
    highlights: 'Highlights',
    publications: 'Open Source & Publications',
  },
  experience: [
    {
      company: 'Superlinear Technology Pte. Ltd.',
      companyLogo: '/assets/superlinear-logo.svg',
      monoLogo: true,
      role: 'AI Agent Engineer',
      date: 'May 2025 - Present',
      department: 'R&D Team',
      tags: ['LangChain', 'LangGraph', 'ReAct', 'Multi-Agent', 'Context Engineering', 'Tool Calling', 'MCP', 'Agent Evaluation', 'Multica'],
      projects: [
        {
          name: 'Lessie AI — Core People-Search Agent System',
          links: [{ label: 'lessie.ai', url: 'https://lessie.ai/' }],
          details: [
            'Led tool-calling optimization for the agent: restructured how tools are organized, applied progressive disclosure to skill knowledge, and injected runtime context through middleware — lifting tool-call pass rate from 26% to 63% on the KOL people-search evaluation',
            'Lead architecture evolution of the flagship product from procedural workflow orchestration to multi-agent collaboration on LangChain and LangGraph, with continuous context-engineering work',
            'Own the search agent\'s tool integration and lifecycle — heterogeneous data sources, search APIs and enrichment tools that compose the agent\'s capability surface for people discovery',
            'Ship three vertical end-to-end search flows — KOL outreach, tech-industry B2B prospecting and academic discovery — each with bespoke retrieval and ranking strategies',
          ],
        },
        {
          name: 'Agent Evaluation & Evidence-Driven Iteration',
          details: [
            'Led People Search Bench end-to-end: designed the cross-platform evaluation dimensions and introduced Criteria-Grounded Verification — decompose a query into independently checkable criteria and verify each externally, reaching Cohen\'s \u03ba = 0.84 against human annotators',
            'Wired evaluation into day-to-day iteration so agent quality became a regressable, comparable metric rather than a matter of opinion — the tool-calling gain above was measured on exactly this harness',
          ],
        },
        {
          name: 'Agent Reliability & Model Layer',
          details: [
            'Drive model evaluation and selection across Claude, Gemini, the GPT family and Chinese frontier models (MiniMax, Kimi, DeepSeek, Qwen) on cost / latency / quality, and own vendor routing across OpenRouter, AWS Bedrock and GCP Vertex AI, rebalancing as price-performance shifts',
            'Built a model-level fallback layer on LangChain ReAct agents — when a model times out or errors, a backup agent takes over the in-flight task, materially lifting production reliability',
            'Apply AI Native methods so the agent auto-detects and remediates production issues, errors and bugs; contribute to data governance and cost reporting',
          ],
        },
        {
          name: 'Developer Surfaces — CLI / MCP Server / Skill',
          details: [
            'Packaged people search and enrichment into three distributable forms: the @lessie/cli command-line tool (14 releases, prebuilt macOS / Linux / Windows binaries), @lessie/mcp-server for Claude Desktop, and lessie-skill for Claude Code / Codex',
            'One agent capability set, exposed through CLI, MCP and Skill entry points so both human users and coding agents can call it directly',
          ],
        },
        {
          name: 'Internal R&D Productivity & Knowledge Agents',
          details: [
            'Built the team\'s internal agent system on Multica (open-source, self-hostable), wiring in Codex, Claude Code and Hermes as execution agents to connect code management, service deployment, log analysis and case follow-up into one flow',
            'Built and maintain an internal knowledge harness — a continuously curated knowledge base and Skill layer that turns context scattered across individuals into capabilities an agent can call directly, dissolving knowledge silos',
            'Materially shortened new-hire landing time: newcomers query and dispatch work through the agents instead of chasing a different person at every step',
          ],
        },
      ],
    },
    {
      company: 'Shenzhen Yangteng Digital Technology Co., Ltd.',
      companyUrl: 'https://www.yangtenginnovation.com/',
      companyLogo: '/assets/yangteng-logo.svg',
      role: 'Backend Engineer',
      date: 'Aug 2023 - May 2025',
      department: 'IT Department',
      tags: ['SpringBoot', 'MyBatis', 'MySQL', 'Distributed Transactions', 'Floyd-Warshall', 'PDA', 'RBAC/ABAC'],
      projects: [
        {
          name: 'WMS Platform — Self-built Replacement for Odoo',
          details: [
            'Led the migration from Odoo, an open-source ERP, to a self-built WMS, grown to 30K+ daily operations; owned the data model and the full flow — inbound, putaway, cycle count, picking, shipping — with inventory consistency under distributed transactions',
            'Led the picking-path optimization engine on Floyd-Warshall across 5,000+ storage locations for millisecond scheduling, shortening average picking paths by 37%; also shipped the handheld PDA app frontline operators use daily',
            'Integrated third-party GPS-guided warehouse robotics at the German site, designing the cross-system scheduling layer between WMS and hardware to lift inbound and picking throughput',
          ],
        },
        {
          name: 'IPO Audit Compliance & Engineering Quality',
          details: [
            'Supported the company\'s Deloitte IPO audit: redesigned the RBAC + ABAC hybrid authorization model to meet GDPR, and implemented unified structured logging across inbound → outbound for audit-grade traceability',
            'Drove slow-SQL remediation against large warehousing tables (index misses, awkward business SQL), cutting slow queries by 80% and critical response time from 3.2s to 0.8s; set up SonarQube, CI/CD and branch conventions',
          ],
        },
      ],
    },
    {
      company: 'Tencent Technology (Shenzhen) Co., Ltd.',
      companyUrl: 'https://www.tencent.com/',
      companyLogo: '/assets/tencent-logo.avif',
      role: 'Backend / Data Engineer',
      date: 'Jul 2022 - Aug 2023',
      department: 'CSIG · Security Product Dept. II',
      tags: ['Selenium', 'Airtest', 'MitmProxy', 'Kafka', 'K8s', 'Redis', 'Hive', 'PySpark', 'Go'],
      projects: [
        {
          name: 'Internet Ad Monitoring',
          details: [
            'Built the ad-collection backbone on Kafka + K8s dynamic scaling, ingesting tens of GB/hour and sustaining 100M+ daily records across web, app and Mini Program; also shipped the screenshot-evidence service (watermark + timestamp for legal admissibility) delivered to government regulators',
            'Built the mobile / Mini Program collection cluster: Airtest + ADB across 50+ concurrent devices with MitmProxy HTTPS decryption, automating VM restart, APK install, login persistence and WeChat account-pool scheduling — 500 app ads and 1,500 Mini Program ads per day',
            'Tuned a Redis Bloom filter over 100M+ daily unique URLs (m/n ≈ 14.4, k=10, sharded per source to stay under the 512MB per-key limit), holding false positives under 0.1%',
          ],
        },
        {
          name: 'Financial Risk Control & Brand Protection',
          details: [
            'Built an enterprise-entity matching service on a Trie over 100M+ company records, extracting entities from violation text in milliseconds and joining them to regulatory rules — lifting fraud lead detection from 50 to 2,000 records/day and valid-advertiser identification from 30% to 95%',
            'Owned big-data governance for financial sentiment monitoring (a complex DAG of SQL and PySpark on Tencent Cloud), and built the Go backend of Tencent Cloud Brand Protection, porting Mini Program ad monitoring into brand protection at ~50 effective infringement leads per brand per day',
          ],
        },
      ],
    },
  ],
  strengths: [
    {
      label: 'Industries',
      tags: [
        { text: 'AI Agents', highlight: true },
        { text: 'People Discovery' },
        { text: 'Cross-border Supply Chain' },
        { text: 'Internet Ad Monitoring' },
        { text: 'Financial Compliance' },
      ],
    },
    {
      label: 'AI Engineering',
      tags: [
        { text: 'Context Engineering', highlight: true },
        { text: 'Multi-Agent Systems', highlight: true },
        { text: 'AI Native', highlight: true },
        { text: 'Progressive Disclosure' },
        { text: 'Agent Reliability' },
        { text: 'Model Evaluation' },
        { text: 'Model Routing & Strategy' },
      ],
    },
    {
      label: 'Languages',
      tags: [
        { text: 'Python', highlight: true },
        { text: 'Java' },
        { text: 'Go' },
      ],
    },
    {
      label: 'Frameworks & Infra',
      tags: [
        { text: 'LangChain', highlight: true },
        { text: 'LangSmith', highlight: true },
        { text: 'LangGraph' },
        { text: 'ReAct' },
        { text: 'SpringBoot' },
        { text: 'SpringCloud' },
        { text: 'Kafka' },
        { text: 'K8s' },
        { text: 'Redis' },
        { text: 'Hive' },
      ],
    },
    {
      label: 'Work Style',
      tags: [
        { text: 'Team Collaboration', highlight: true },
        { text: 'Continuous Learning', highlight: true },
        { text: '0-to-1 Builder' },
        { text: 'Platform-First' },
        { text: 'Result-oriented' },
        { text: 'Self-driven' },
      ],
    },
  ],
  publications: [
    {
      title: 'PeopleSearchBench — the first open benchmark for AI people-search agents',
      venue: 'EMNLP 2026, Industry Track',
      authorship: 'Corresponding author; core engineer end-to-end',
      summary:
        'Introduces Criteria-Grounded Verification: decompose a query into independently checkable criteria and verify each against external sources instead of asking a model for a verdict \u2014 Cohen\'s \u03ba = 0.84 against human annotators across 119 multilingual queries.',
      links: [
        { label: 'arXiv', url: 'https://arxiv.org/abs/2603.27476' },
        { label: 'GitHub', url: 'https://github.com/LessieAI/people-search-bench' },
      ],
    },
    {
      title: 'lessie-skill — people search & enrichment skill for Claude Code / Codex',
      venue: 'Open source',
      summary:
        'Packages people and company discovery, qualification and enrichment as a skill coding agents can invoke directly.',
      links: [{ label: 'GitHub', url: 'https://github.com/LessieAI/lessie-skill' }],
    },
    {
      title: 'Lessie CLI & MCP Server — shipped developer surfaces',
      venue: 'npm \u00b7 @lessie/cli v0.11.0, @lessie/mcp-server',
      summary:
        'People search, enrichment and web research from the terminal, published across 14 releases with prebuilt macOS / Linux / Windows binaries; the MCP server exposes the same capabilities to Claude Desktop in natural language.',
      links: [
        { label: '@lessie/cli', url: 'https://www.npmjs.com/package/@lessie/cli' },
        { label: '@lessie/mcp-server', url: 'https://www.npmjs.com/package/@lessie/mcp-server' },
      ],
    },
  ],
  highlights: [
    {
      title: 'Agent Engineering & Reliability',
      tagline: 'Multi-agent systems that hold up in production, not demos.',
      featured: true,
      evidence: [
        'Rebuilt Lessie AI from procedural workflow orchestration into a LangChain / LangGraph multi-agent system \u2014 the architecture the product runs on today',
        'Model-level fallback on ReAct agents: a backup agent takes over the in-flight task when a model times out or errors',
        'Own model evaluation and vendor routing across Claude, Gemini, GPT and Chinese frontier models over OpenRouter / Bedrock / Vertex, rebalanced on cost, latency and quality',
      ],
    },
    {
      title: 'Learning Agility',
      tagline: 'Three production backend languages and entirely new domains, each shipped within months of starting.',
      evidence: [
        'Java + SpringBoot at Yangteng → 30K-ops/day WMS shipped in 3 months by a 3-person team',
        'Picked up Go mid-tenure at Tencent for the Brand Protection backend',
        'Joined Superlinear in May 2025 and shipped a multi-agent migration on LangChain / LangGraph the same year',
      ],
    },
    {
      title: 'Algorithm-to-Production Fluency',
      featured: true,
      tagline: 'CS algorithms operationalized at production scale, not whiteboarded.',
      evidence: [
        'Floyd-Warshall picking-path engine across 5,000+ storage locations — sub-millisecond scheduling, average paths −37%',
        'Trie tree over 100M+ Tianyancha company names for real-time fraud-entity matching from violation text',
        'Redis Bloom-Filter URL dedup at m/n ≈ 14.4, k=10 — FPR under 0.1% on 100M+ daily entries',
      ],
    },
    {
      title: 'Platform & 0-to-1 Builder',
      featured: true,
      tagline: 'Default to building the floor, not just the room on top of it.',
      evidence: [
        'Built Yangteng\'s WMS from scratch to replace Odoo — 3-person team delivered in 3 months',
        'Stood up Superlinear\'s AI Infrastructure & Tooling Layer as a cross-product platform: model evaluation, vendor strategy, fallback, AI Native ops',
        'Authored an internal Skill platform powering team dashboards and KPI visibility',
      ],
    },
    {
      title: 'Engineering for Scale & Reliability',
      tagline: 'Production systems that don\'t fall over under pressure.',
      evidence: [
        'Sustained 100M+ daily ad records on Kafka + K8s with the Bloom Filter dedup layer',
        'Designed inventory consistency under distributed transactions across the WMS data flow',
        'Built model-level fallback on LangChain ReAct agents — backup agent takes over on model timeout or error',
      ],
    },
    {
      title: 'Multi-Language Backend Stack',
      tagline: 'Python, Java, Go — each in production, not just exposure.',
      evidence: [
        'Python: Tencent ad-collection backbone + Lessie multi-agent core',
        'Java + SpringBoot: Yangteng WMS + PDA + audit standardization',
        'Go: Tencent Cloud Brand Protection backend',
      ],
    },
    {
      title: 'Compliance-Grade Engineering',
      tagline: 'Work that has held up under external audit.',
      evidence: [
        'Tencent screenshot-evidence service with watermarks + timestamps, accepted as legal evidence by government regulators',
        'Yangteng RBAC + ABAC redesign passed Deloitte IPO audit and met GDPR',
        'Yangteng full-chain unified logging for audit-grade traceability across inbound, putaway, picking, count, and outbound',
      ],
    },
    {
      title: 'End-to-End Data → AI Pipeline',
      tagline: 'Whole-pipeline ownership: ingest → governance → model → product.',
      evidence: [
        'Tencent Financial Sentiment: data-canvas governance + Trie matching + fraud model + cloud delivery in one stack',
        'Lessie: model evaluation + vendor strategy + agent reliability + vertical product flows',
        '"AI Native" auto-detection and governance feel like a natural extension of the data work, not a buzzword',
      ],
    },
  ],
};

export const zh: ResumeData = {
  name: '张帅',
  meta: ['男 / 25岁', '4年工作经验'],
  summary:
    '4 年后端与数据工程经验，现在做 AI Agent 的生产化落地：多智能体架构、模型评测与供应商路由、Agent 可靠性。此前在腾讯做互联网级内容监测，在跨境仓储公司自建 WMS 替换 Odoo。主导的开源评测基准 People Search Bench 被 EMNLP 2026 Industry Track 录用。',
  contacts: [
    { type: 'email', value: 'shane.z.chang@gmail.com' },
    { type: 'phone', value: '185-5557-3888' },
    { type: 'linkedin', value: 'shanezchang' },
    { type: 'github', value: 'shanezchang' },
  ],
  education: {
    school: '深圳大学',
    schoolLogo: '/assets/szu-logo.png',
    college: '数学科学学院',
    major: '数学与应用数学',
    degree: '本科',
    date: '2018 - 2022',
  },
  sectionTitles: {
    education: '教育经历',
    experience: '工作经历',
    strengths: '个人优势',
    highlights: '亮点',
    publications: '开源与论文',
  },
  experience: [
    {
      company: '深圳超线性科技有限公司',
      companyLogo: '/assets/superlinear-logo.svg',
      monoLogo: true,
      role: 'AI Agent 研发工程师',
      date: '2025.05 - 至今',
      department: '研发组',
      tags: ['LangChain', 'LangGraph', 'ReAct', '多 Agent', '上下文工程', '工具调用', 'MCP', 'Agent 评测', 'Multica'],
      projects: [
        {
          name: 'Lessie AI —— 找人 Agent 核心系统',
          links: [{ label: 'lessie.ai', url: 'https://lessie.ai/' }],
          details: [
            '主导 Agent 工具调用（tool calling）效果优化：重构工具的组织方式、对 Skill 知识做渐进式披露、通过 middleware 注入运行时上下文——在 KOL 找人场景的评测中，工具调用通过率从 26% 提升至 63%',
            '主导核心产品的架构演进：从早期流程编排升级为基于 LangChain 与 LangGraph 的多 Agent 协作架构，并持续做上下文工程优化',
            '负责搜索 Agent 的工具对接与生命周期管理——打通异构数据源、搜索 API 与各类 enrichment 工具，构成 Agent 在找人场景下的能力底座',
            '落地三条端到端垂直搜索场景——KOL 达人营销、科技圈 B 端客户搜索、学术圈专业搜索，每条都有针对性的召回与排序策略',
          ],
        },
        {
          name: 'Agent 评测体系与效果驱动迭代',
          details: [
            '主导 People Search Bench 开源评测基准从 0 到 1：设计跨平台评测维度，提出 Criteria-Grounded Verification——把查询拆成可独立核查的判据逐条外部验证，与人工标注一致性达 Cohen\'s \u03ba = 0.84',
            '把评测接入日常迭代，让"Agent 效果"成为可回归、可对比的指标，而不是靠主观感受判断——上述工具调用优化正是在这套评测下量化出来的',
          ],
        },
        {
          name: 'Agent 可靠性与模型层',
          details: [
            '主导模型评测与选型，覆盖 Claude、Gemini、GPT 全系列与 MiniMax、Kimi、DeepSeek、通义千问等国产模型，从成本、速度、效果三维度为不同业务场景选型；并负责 OpenRouter、AWS Bedrock、GCP Vertex AI 的供应商路由策略，随性价比变化持续调整',
            '基于 LangChain ReAct Agent 设计模型兜底机制——模型超时或报错时由备用 Agent 自动接替失败任务，显著提升线上可用性',
            '以 AI Native 方式实现线上效果问题、系统错误与 Bug 的自动识别与修复，参与数据治理与项目成本上报',
          ],
        },
        {
          name: '开发者入口 —— CLI / MCP Server / Skill',
          details: [
            '把找人与信息增强能力沉淀为三种可分发形态：命令行工具 @lessie/cli（已发布 14 个版本，含 macOS / Linux / Windows 预编译二进制）、接入 Claude Desktop 的 @lessie/mcp-server、以及面向 Claude Code / Codex 的 lessie-skill',
            '同一套 Agent 能力对外暴露为 CLI、MCP 与 Skill 三个入口，让人类用户与编程智能体都能直接调用',
          ],
        },
        {
          name: '内部研发效能与知识 Agent 体系',
          details: [
            '基于开源自托管框架 Multica 自建团队内部 agent 体系，接入 Codex、Claude Code、Hermes 等多种编码与执行 agent，打通代码管理、服务部署、日志分析、case 跟进的全流程',
            '建设内部知识 harness agent：持续维护内部知识库与 Skill 体系，把散落在各人手里的上下文沉淀为 agent 可直接调用的能力，打破团队知识壁垒',
            '显著缩短新人 landing 周期——新成员直接向 agent 提问和派活，不必在每个环节逐个找人',
          ],
        },
      ],
    },
    {
      company: '深圳扬腾数智科技有限公司',
      companyUrl: 'https://www.yangtenginnovation.com/',
      companyLogo: '/assets/yangteng-logo.svg',
      role: '后端工程师',
      date: '2023.08 - 2025.05',
      department: 'IT 技术部',
      tags: ['SpringBoot', 'MyBatis', 'MySQL', '分布式事务', 'Floyd-Warshall', 'PDA', 'RBAC/ABAC'],
      projects: [
        {
          name: 'WMS 仓储系统 — 自建替换 Odoo',
          details: [
            '主导从开源 ERP 系统 Odoo 到自建 WMS 的迁移，支撑日均 3 万+ 仓储操作；负责数据模型与采购入库、上架、盘点、拣货出库全链路，在分布式事务下保障库存一致性',
            '主导拣货路径优化引擎，基于 Floyd-Warshall 在 5000+ 库位下实现毫秒级调度，拣货路径平均缩短 37%；同时交付一线使用的手持 PDA 作业端',
            '对接德国站点的三方智能仓储机器人（GPS 导航），设计 WMS 与硬件之间的跨系统调度层，提升入库与拣货出库效率',
          ],
        },
        {
          name: '上市审计合规与工程质量',
          details: [
            '支持公司上市德勤审计：重构 RBAC + ABAC 混合鉴权模型满足 GDPR 合规，并落地覆盖入库到出库全环节的统一日志，提供审计级可追溯性',
            '主导慢 SQL 专项治理（大数据量、索引失效、业务语法不当），慢查询减少 80%，关键响应从 3.2s 降至 0.8s；搭建 SonarQube + CI/CD 与分支规范',
          ],
        },
      ],
    },
    {
      company: '腾讯科技（深圳）有限公司',
      companyUrl: 'https://www.tencent.com/',
      companyLogo: '/assets/tencent-logo.avif',
      role: '后端 / 数据开发',
      date: '2022.07 - 2023.08',
      department: 'CSIG · 安全产品二部',
      tags: ['Selenium', 'Airtest', 'MitmProxy', 'Kafka', 'K8s', 'Redis', 'Hive', 'PySpark', 'Go'],
      projects: [
        {
          name: '互联网广告监测',
          details: [
            '搭建广告采集主链路（Kafka + K8s 动态扩容），承接每小时数十 GB 数据流，支撑日均 1 亿级广告数据采集，覆盖 Web、APP 与小程序多端；并交付落地页截图存证服务（水印 + 时间戳确保证据链法律效力），对接政府监管平台',
            '建设移动端 / 小程序采集集群：Airtest + ADB 50+ 设备并发 + MitmProxy 解密 HTTPS，自动化处理虚拟机重启、APK 安装、登录态与微信账号池调度，稳定输出 APP 广告 500 条/天、小程序 1500 条/天',
            '针对日均 1 亿+ 唯一 URL 调优 Redis 布隆过滤器（m/n ≈ 14.4、k=10，按数据源分片规避单 key 512MB 限制），误判率稳控 0.1% 以内',
          ],
        },
        {
          name: '金融风控与品牌保护',
          details: [
            '基于天眼查 1 亿+ 企业主体数据构建 Trie 匹配服务，从违规文本中毫秒级提取企业实体并与监管规则联动；金融传销线索检出从 50 条/天 提升至 2000 条/天，有效广告主体识别率从 30% 提升至 95%',
            '负责金融舆情大数据治理——由 SQL 与 PySpark 脚本构成的复杂数据画布与依赖编排，运行于腾讯云；并用 Go 开发维护腾讯云品牌保护平台后端，将小程序广告监测能力迁移至品牌保护场景，平均每品牌产出有效侵权线索 50 条/天',
          ],
        },
      ],
    },
  ],
  strengths: [
    {
      label: '行业经验',
      tags: [
        { text: 'AI Agent', highlight: true },
        { text: '找人 / People Discovery' },
        { text: '跨境供应链' },
        { text: '互联网广告监测' },
        { text: '金融合规' },
      ],
    },
    {
      label: 'AI 工程能力',
      tags: [
        { text: '上下文工程', highlight: true },
        { text: '多 Agent 协作架构', highlight: true },
        { text: 'AI Native', highlight: true },
        { text: '渐进式披露能力' },
        { text: 'Agent 兜底机制' },
        { text: '模型测评' },
        { text: '模型路由与策略' },
      ],
    },
    {
      label: '核心语言',
      tags: [
        { text: 'Python', highlight: true },
        { text: 'Java' },
        { text: 'Go' },
      ],
    },
    {
      label: '框架 & 中间件',
      tags: [
        { text: 'LangChain', highlight: true },
        { text: 'LangSmith', highlight: true },
        { text: 'LangGraph' },
        { text: 'ReAct' },
        { text: 'SpringBoot' },
        { text: 'SpringCloud' },
        { text: 'Kafka' },
        { text: 'K8s' },
        { text: 'Redis' },
        { text: 'Hive' },
      ],
    },
    {
      label: '工作风格',
      tags: [
        { text: '高效协作', highlight: true },
        { text: '持续学习', highlight: true },
        { text: '从 0 到 1 架构' },
        { text: '平台思维' },
        { text: '结果导向' },
        { text: '独立解决问题' },
      ],
    },
  ],
  publications: [
    {
      title: 'PeopleSearchBench —— 首个面向 AI 找人智能体的开源评测基准',
      venue: 'EMNLP 2026 Industry Track',
      authorship: '通讯作者；作为核心工程师主导从 0 到 1',
      summary:
        '提出 Criteria-Grounded Verification：把一个查询拆成若干可独立核查的判据，逐条对外部信源验证，而不是让模型直接打分；在 119 条多语言查询上与人工标注的一致性达到 Cohen\'s \u03ba = 0.84。',
      links: [
        { label: 'arXiv', url: 'https://arxiv.org/abs/2603.27476' },
        { label: 'GitHub', url: 'https://github.com/LessieAI/people-search-bench' },
      ],
    },
    {
      title: 'lessie-skill —— 面向 Claude Code / Codex 的找人与信息增强 Skill',
      venue: '开源项目',
      summary:
        '把人物与公司的发现、资质判断与信息增强封装成编程智能体可直接调用的 Skill。',
      links: [{ label: 'GitHub', url: 'https://github.com/LessieAI/lessie-skill' }],
    },
    {
      title: 'Lessie CLI 与 MCP Server —— 已发布的开发者入口',
      venue: 'npm \u00b7 @lessie/cli v0.11.0、@lessie/mcp-server',
      summary:
        '在命令行完成找人、信息增强与网络调研，已发布 14 个版本并提供 macOS / Linux / Windows 预编译二进制；MCP Server 则把同一套能力以自然语言接入 Claude Desktop。',
      links: [
        { label: '@lessie/cli', url: 'https://www.npmjs.com/package/@lessie/cli' },
        { label: '@lessie/mcp-server', url: 'https://www.npmjs.com/package/@lessie/mcp-server' },
      ],
    },
  ],
  highlights: [
    {
      title: 'Agent 工程与可靠性',
      tagline: '能在生产环境里活下来的多智能体系统，不是 demo。',
      featured: true,
      evidence: [
        '把 Lessie AI 的核心从流程编排重构为 LangChain / LangGraph 多智能体架构，是产品现在运行的底层',
        'ReAct agent 的模型级 fallback：模型超时或报错时，备用 agent 自动接管进行中的任务',
        '负责模型评测与供应商路由 \u2014\u2014 Claude / Gemini / GPT 与国产前沿模型，经 OpenRouter / Bedrock / Vertex 按成本、延迟、质量持续调整',
      ],
    },
    {
      title: '快速学习与适配能力',
      tagline: '三门生产级后端语言、跨度极大的业务领域，每段都能在数月内交付。',
      evidence: [
        '扬腾 入职即上手 Java + SpringBoot，3 人团队 3 个月落地 30K+ 仓储日操作的 WMS',
        '腾讯任期内切换到 Go，承接腾讯云品牌保护后端',
        '2025 年 5 月加入超线性，同年内完成多 Agent 架构在 LangChain / LangGraph 上的迁移',
      ],
    },
    {
      title: '算法到工程的落地能力',
      featured: true,
      tagline: '把 CS 算法跑到生产规模，不是停在白板。',
      evidence: [
        'Floyd-Warshall 拣货路径引擎跨 5000+ 库位，毫秒级调度、路径平均缩短 37%',
        '基于 1 亿+ 天眼查企业主体的 Trie 前缀树，毫秒级从违规文本中匹配企业实体',
        'Redis 布隆过滤器（m/n ≈ 14.4、k=10）在日均 1 亿+ URL 流量下将误判率稳控 0.1% 以内',
      ],
    },
    {
      title: '平台型 0-to-1 builder',
      featured: true,
      tagline: '更倾向于建"地板"，而不是只盖上面的房间。',
      evidence: [
        '扬腾 WMS 从 0 自建替代 Odoo，3 人团队 3 个月上线',
        '在超线性 把 AI 基础设施与工具层独立出来作为跨产品平台（模型测评 / 供应商策略 / 兜底 / AI Native）',
        '搭建并维护内部 Skill 平台，支撑团队数据看板与 KPI 可视化',
      ],
    },
    {
      title: '面向规模与可靠性的工程能力',
      tagline: '能在压力下稳住的生产系统。',
      evidence: [
        'Kafka + K8s + 布隆过滤器去重，日均 1 亿+ 广告数据稳定运行',
        'WMS 全链路在分布式事务下保障库存一致性',
        'LangChain ReAct Agent 的模型兜底层——超时 / 报错时备用 Agent 自动接替',
      ],
    },
    {
      title: '多语言后端实战栈',
      tagline: 'Python / Java / Go——都跑过生产，不是"听说过"。',
      evidence: [
        'Python：腾讯广告采集主链路 + Lessie 多 Agent 核心',
        'Java + SpringBoot：扬腾 WMS + PDA + 审计标准化',
        'Go：腾讯云品牌保护后端',
      ],
    },
    {
      title: '可经受审计的工程审美',
      tagline: '做的事经得住外部第三方审查。',
      evidence: [
        '腾讯截图存证服务带水印与时间戳，作为法律证据交付政府监管平台',
        '扬腾 RBAC + ABAC 重构通过德勤上市审计，满足 GDPR',
        '扬腾 全环节统一日志治理（入库 / 上架 / 拣货 / 盘点 / 出库），审计级可追溯',
      ],
    },
    {
      title: '从数据到 AI 的端到端思路',
      tagline: '整条 pipeline 的 ownership：接入 → 治理 → 模型 → 产品。',
      evidence: [
        '腾讯金融舆情：大数据画布治理 + Trie 匹配 + 传销模型 + 腾讯云交付，在同一套体系里跑通',
        'Lessie：模型测评 + 供应商策略 + Agent 兜底 + 垂直场景产品化',
        '让 "AI Native 自动诊断 / 治理" 成为数据工程的自然延伸，而不是 buzzword',
      ],
    },
  ],
};

/* ────────────────────────────────────────────────────────────────────────────
 * One-page variant — the version you actually send.
 *
 * An editorial rewrite of the full resume above, not a filtered view of it:
 * merge, cut, lead with the number. The full resume stays the archive; this is
 * the pitch. When a fact changes, update both.
 *
 * Narrative arc the page is built around (so the three jobs read as one path,
 * not three unrelated stints): data & backend at Tencent → backend systems at
 * Yangteng → AI Agent at Superlinear. Each job's `scope` line carries that arc.
 *
 * `**text**` inside a bullet renders bold — the lead-in, plus at most one
 * number per bullet a reader must not miss.
 * ────────────────────────────────────────────────────────────────────────── */

export interface OnePageProject {
  name: string;
  /** Tech actually used on this project, in this period — not a global skills list. */
  stack: string;
  bullets: string[];
}

export interface OnePageResume {
  name: string;
  meta: string[];
  contacts: { label: string; href?: string; icon?: 'mail' | 'phone' | 'linkedin' | 'github' }[];
  /** Profile paragraph: identity → capability → current remit → earlier depth. */
  summary: string;
  sectionTitles: { summary: string; education: string; openSource: string; experience: string };
  education: { school: string; logo: string; detail: string; date: string };
  openSource: {
    title: string;
    inline?: string;
    meta?: string;
    detail?: string;
    links: ProjectLink[];
  }[];
  experience: {
    company: string;
    logo?: string;
    mono?: boolean;
    role: string;
    date: string;
    /** Company-level stack, for roles described with flat bullets. */
    stack?: string;
    /** Flat bullets — used by earlier roles. */
    bullets?: string[];
    /** Project breakdown — used where depth matters (the current role). */
    projects?: OnePageProject[];
  }[];
}

export const zhOnePage: OnePageResume = {
  name: '张帅',
  meta: ['男 / 25岁', '4 年工作经验', '深圳'],
  contacts: [
    { icon: 'mail', label: 'shane.z.chang@gmail.com', href: 'mailto:shane.z.chang@gmail.com' },
    { icon: 'phone', label: '185-5557-3888' },
    { icon: 'linkedin', label: 'LinkedIn · shanezchang', href: 'https://www.linkedin.com/in/shanezchang/' },
    { icon: 'github', label: 'GitHub · shanezchang', href: 'https://github.com/shanezchang' },
  ],
  summary:
    'AI Agent 研发工程师，具备后端、大数据与智能体全链路工程能力，能独立推进 Agent 架构、工具与上下文工程、效果评测到线上稳定性的完整落地。现于超线性科技负责找人 AI Agent（Lessie AI）核心系统，主导多 Agent 架构、工具调用优化与评测体系建设，开源评测基准被 EMNLP 2026 录用；此前深耕后端与大数据，先后在扬腾自研仓储 WMS、在腾讯做亿级数据采集与风控。',
  sectionTitles: { summary: '个人简介', education: '教育经历', openSource: '开源与论文', experience: '工作经历' },
  education: {
    school: '深圳大学',
    logo: '/assets/szu-logo.png',
    detail: '数学与应用数学 · 本科',
    date: '2018 – 2022',
  },
  openSource: [
    {
      title: 'PeopleSearchBench',
      inline: '首个 AI 找人智能体开源评测基准',
      meta: 'EMNLP 2026 Industry Track · 通讯作者',
      links: [
        { label: 'arXiv', url: 'https://arxiv.org/abs/2603.27476' },
        { label: 'GitHub', url: 'https://github.com/LessieAI/people-search-bench' },
      ],
    },
    {
      title: 'lessie-skill',
      inline: 'Claude Code / Codex 的找人与信息增强 Skill',
      links: [{ label: 'GitHub', url: 'https://github.com/LessieAI/lessie-skill' }],
    },
    {
      title: '@lessie/cli · @lessie/mcp-server',
      inline: 'CLI 与 MCP 两种形态分发 Agent 能力',
      meta: 'npm · 14 个版本',
      links: [{ label: 'npm', url: 'https://www.npmjs.com/package/@lessie/cli' }],
    },
  ],
  experience: [
    {
      company: '深圳超线性科技有限公司',
      logo: '/assets/superlinear-logo.svg',
      mono: true,
      role: 'AI Agent 研发工程师 · 研发组',
      date: '2025.05 – 至今',
      projects: [
        {
          name: 'Lessie AI — 找人 Agent 核心系统',
          stack: 'Python、LangChain、LangGraph、ReAct、Tool Calling、上下文工程、Middleware',
          bullets: [
            '主导 Agent 工具调用效果优化：重构工具的组织方式、对 Skill 知识做渐进式披露、通过 middleware 注入运行时上下文，KOL 找人场景评测中工具调用通过率 **26% → 63%**',
            '主导核心产品架构演进，从早期流程编排升级为基于 LangChain 与 LangGraph 的多 Agent 协作架构，并持续优化上下文工程',
            '落地 KOL 达人营销、科技圈 B 端客户搜索、学术圈专业搜索三条端到端垂直场景，每条配套针对性的召回与排序策略',
          ],
        },
        {
          name: 'PeopleSearchBench — Agent 评测体系',
          stack: 'Python、评测基准设计、Criteria-Grounded Verification、外部检索验证',
          bullets: [
            '主导开源评测基准从 0 到 1，提出判据验证方法：把查询拆成可独立核查的判据逐条外部验证，与人工标注一致性 **κ = 0.84**',
            '把评测接入日常迭代，让 Agent 效果成为可回归、可对比的指标，上述工具调用优化即在这套评测下量化',
          ],
        },
        {
          name: 'AI SDR — 国内 B 端外贸获客',
          stack: 'Agent 编排、Tool Calling、上下文工程、LLM 内容生成、邮件 / LinkedIn / WhatsApp 多渠道触达',
          bullets: [
            '主导把整套 AI 获客服务体系从海外版复制到国内，适配 B 端外贸获客场景并上线，累计触达 **50+** 家外贸工厂与客户',
            '打通获客全流程：客户画像分析与市场大盘 AI 探矿 → 目标公司样本深度探索 → 个性化触达内容生成与发送策略定义',
            '打造 AI SDR 能力：自建邮箱域名与预热，支持 LinkedIn / WhatsApp 建联；全程由 Agent 运营，以「AI 获客员工」落地',
            '深度跟进商务负责人与客户讨论、吸收反馈，持续调优前期分析、思路梳理、邮件质量与发送策略等各环节效果',
          ],
        },
        {
          name: '内部研发效能与知识 Agent 体系',
          stack: 'Multica、Codex、Claude Code、Hermes、Skill、知识库',
          bullets: [
            '基于开源框架 Multica 自建内部 agent 体系，接入 Codex / Claude Code / Hermes，打通代码、部署、日志、case 全流程',
            '建设内部知识 harness agent，维护知识库与 Skill 体系，把个人经验沉淀为 agent 可调用的能力，显著缩短新人上手周期',
          ],
        },
      ],
    },
    {
      company: '深圳扬腾数智科技有限公司',
      logo: '/assets/yangteng-logo.svg',
      role: '后端工程师 · IT 技术部',
      date: '2023.08 – 2025.05',
      scope: '跨境仓储业务：用自研系统替掉开源 ERP，支撑国内外站点的日常履约，并让仓储数据经得起上市审计',
      stack: 'Java、SpringBoot、MyBatis、MySQL、分布式事务、Floyd-Warshall、RBAC / ABAC',
      bullets: [
        '**自研 WMS 替换开源 ERP**：主导从 [Odoo](https://www.odoo.com/) 迁移到自研 WMS，覆盖入库到出库全链路、日均 **3 万+** 作业，以分布式事务保障库存一致；用 Floyd-Warshall 做拣货路径引擎，5000+ 库位毫秒级调度、路径缩短 **37%**',
        '**支撑海外站点与上市审计**：对接德国站点仓储机器人，设计软硬件跨系统调度；重构 RBAC + ABAC 鉴权与全链路审计日志通过德勤 IPO 审计，慢 SQL 治理使关键响应 **3.2s → 0.8s**',
      ],
    },
    {
      company: '腾讯科技（深圳）有限公司',
      logo: '/assets/tencent-logo.avif',
      role: '后端 / 数据开发 · CSIG 安全产品二部',
      date: '2022.07 – 2023.08',
      scope: '内容安全方向：把全网违规广告做成可交付的数据产品，服务政府监管取证、金融风控与品牌方维权',
      stack: 'Python、Go、Kafka、K8s、Redis、Airtest、MitmProxy、PySpark、SQL',
      bullets: [
        '**面向监管的违规广告取证**：建成覆盖 Web / APP / 小程序的采集体系（Kafka + K8s 主链路日均 **1 亿+** 条、Airtest 50+ 设备并发抓移动端、布隆过滤器去重），并把落地页截图做成带水印与时间戳的证据链，直接交付政府监管平台',
        '**面向风控与品牌方的线索生产**：用 Trie 把违规文本关联到 1 亿+ 企业主体，金融传销线索 **50 → 2000 条/天**、有效识别率 **30% → 95%**；同一套能力用 Go 落到腾讯云品牌保护，每品牌 **50 条/天** 侵权线索',
      ],
    },
  ],
};

/** English one-page — same structure and claims as `zhOnePage`, written for an
 *  English reader rather than translated line by line. No age / gender. */
export const enOnePage: OnePageResume = {
  name: 'Shane Chang',
  meta: ['4 years of experience', 'Shenzhen, China'],
  contacts: [
    { icon: 'mail', label: 'shane.z.chang@gmail.com', href: 'mailto:shane.z.chang@gmail.com' },
    { icon: 'phone', label: '+86 185-5557-3888' },
    { icon: 'linkedin', label: 'shanezchang', href: 'https://www.linkedin.com/in/shanezchang/' },
    { icon: 'github', label: 'shanezchang', href: 'https://github.com/shanezchang' },
  ],
  summary:
    'AI Agent engineer with end-to-end depth across backend, big data and agents — from architecture, tool and context engineering and evaluation to production reliability. At Superlinear I own the core agent system of Lessie AI, an AI people-search product; its open benchmark was accepted to EMNLP 2026. Previously: WMS backend at Yangteng; data collection and risk analytics at Tencent.',
  sectionTitles: {
    summary: 'Summary',
    education: 'Education',
    openSource: 'Open Source & Publications',
    experience: 'Experience',
  },
  education: {
    school: 'Shenzhen University',
    logo: '/assets/szu-logo.png',
    detail: 'B.Sc. in Mathematics and Applied Mathematics',
    date: '2018 – 2022',
  },
  openSource: [
    {
      title: 'PeopleSearchBench',
      inline: 'people-search agent benchmark',
      meta: 'EMNLP 2026 (Industry) · Corresponding author',
      links: [
        { label: 'arXiv', url: 'https://arxiv.org/abs/2603.27476' },
        { label: 'GitHub', url: 'https://github.com/LessieAI/people-search-bench' },
      ],
    },
    {
      title: 'lessie-skill',
      inline: 'people search & enrichment skill for Claude Code / Codex',
      links: [{ label: 'GitHub', url: 'https://github.com/LessieAI/lessie-skill' }],
    },
    {
      title: '@lessie/cli · @lessie/mcp-server',
      inline: 'agent capabilities shipped as a CLI and an MCP server',
      meta: 'npm · 14 releases',
      links: [{ label: 'npm', url: 'https://www.npmjs.com/package/@lessie/cli' }],
    },
  ],
  experience: [
    {
      company: 'Superlinear Technology Pte. Ltd.',
      logo: '/assets/superlinear-logo.svg',
      mono: true,
      role: 'AI Agent Engineer · R&D',
      date: 'May 2025 – Present',
      projects: [
        {
          name: 'Lessie AI — Core People-Search Agent System',
          stack: 'Python, LangChain, LangGraph, ReAct, Tool Calling, Context Engineering, Middleware',
          bullets: [
            'Led tool-calling optimization — restructured tools, progressive disclosure of skill knowledge, middleware context injection — lifting pass rate from **26% to 63%** on the KOL people-search eval',
            'Moved the product from procedural workflows to multi-agent collaboration on LangChain / LangGraph',
            'Shipped three vertical flows — KOL outreach, B2B prospecting, academic search — each with its own retrieval and ranking',
          ],
        },
        {
          name: 'PeopleSearchBench — Agent Evaluation',
          stack: 'Python, benchmark design, Criteria-Grounded Verification, external retrieval verification',
          bullets: [
            'Built the benchmark from zero: queries split into checkable criteria, each verified externally — **κ = 0.84** vs. human raters',
            'Wired it into daily iteration as a regression metric — the tool-calling gain above was measured on it',
          ],
        },
        {
          name: 'AI SDR — B2B Export Lead Generation (China)',
          stack: 'Agent orchestration, Tool Calling, Context Engineering, LLM content generation, email / LinkedIn / WhatsApp outreach',
          bullets: [
            'Led the port of the AI acquisition stack from the overseas product to China\'s B2B export market; reached **50+** clients',
            'End-to-end flow: customer profiling and market-wide AI prospecting → target-company deep dives → personalized outreach',
            'AI SDR: email domain setup and warm-up plus LinkedIn and WhatsApp outreach, run entirely by agents as an "AI sales rep"',
            'Worked with the business lead and clients to tune every stage on feedback: analysis, reasoning, email quality, sending strategy',
          ],
        },
        {
          name: 'Internal R&D Productivity & Knowledge Agents',
          stack: 'Multica, Codex, Claude Code, Hermes, Skills, knowledge base',
          bullets: [
            'Built an internal agent system on Multica, wiring Codex / Claude Code / Hermes into code, deploys, logs and cases',
            'Built a knowledge harness — a curated knowledge base and skills agents call directly — shortening new-hire ramp-up',
          ],
        },
      ],
    },
    {
      company: 'Shenzhen Yangteng Digital Technology Co., Ltd.',
      logo: '/assets/yangteng-logo.svg',
      role: 'Backend Engineer · IT Department',
      date: 'Aug 2023 – May 2025',
      scope: 'Cross-border warehousing: replacing an off-the-shelf ERP with an in-house system that runs daily fulfilment and holds up under an IPO audit',
      stack: 'Java, SpringBoot, MyBatis, MySQL, distributed transactions, Floyd-Warshall, RBAC / ABAC',
      bullets: [
        '**In-house WMS replacing the open-source ERP**: led the migration from [Odoo](https://www.odoo.com/) to a WMS covering inbound through outbound at **30K+** daily operations with distributed-transaction consistency; a Floyd-Warshall picking engine over 5,000+ locations cut average paths **37%**',
        '**Overseas sites and the IPO audit**: built the scheduling interface to warehouse robots at the German site; RBAC + ABAC plus full-chain audit logging passed the Deloitte IPO audit, and slow-SQL work cut response time **3.2s → 0.8s**',
      ],
    },
    {
      company: 'Tencent Technology (Shenzhen) Co., Ltd.',
      logo: '/assets/tencent-logo.avif',
      role: 'Backend / Data Engineer · CSIG',
      date: 'Jul 2022 – Aug 2023',
      scope: 'Content safety: turning internet-wide ad violations into deliverable data products for regulators, risk teams and brand owners',
      stack: 'Python, Go, Kafka, K8s, Redis, Airtest, MitmProxy, PySpark, SQL',
      bullets: [
        '**Evidence for regulators**: built collection across web, app and Mini Program (Kafka + K8s at **100M+** records a day, Airtest on 50+ concurrent devices, Bloom-filter dedup) and turned landing-page captures into watermarked, timestamped evidence delivered to government platforms',
        '**Leads for risk teams and brand owners**: Trie matching tied violation text to **100M+** companies — fraud leads **50 → 2,000/day**, valid identification **30% → 95%**; the same capability shipped in Go as Tencent Cloud Brand Protection, ~**50 leads/day per brand**',
      ],
    },
  ],
};
