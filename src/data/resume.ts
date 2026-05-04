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
  companyLogo?: string;
  /** Set to true for monochrome dark logos that need inversion in dark mode. */
  monoLogo?: boolean;
  role: string;
  date: string;
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
  type: 'email' | 'phone';
  value: string;
}

export interface ResumeData {
  name: string;
  /** Short factoids rendered first in the hero strip (e.g. years of experience). */
  meta: string[];
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
  };
  experience: ExperienceEntry[];
  strengths: StrengthCategory[];
}

export const en: ResumeData = {
  name: 'Shane Chang',
  meta: ['4 Years Experience'],
  contacts: [
    { type: 'email', value: 'shane.z.chang@hotmail.com' },
    { type: 'phone', value: '138-XXXX-1234' },
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
  },
  experience: [
    {
      company: 'Superlinear Technology Pte. Ltd.',
      companyLogo: '/assets/superlinear-logo.svg',
      monoLogo: true,
      role: 'AI Agent',
      date: 'May 2025 - Present',
      tags: ['LangChain', 'LangGraph', 'ReAct', 'Multi-Agent', 'Context Engineering', 'AI Native'],
      projects: [
        {
          name: 'Lessie AI — AI Agent for People Discovery',
          links: [{ label: 'lessie.ai', url: 'https://lessie.ai/' }],
          details: [
            'Lead architecture evolution of Lessie AI, the company\'s flagship people-search agent, migrating from procedural workflow orchestration to multi-agent collaboration on LangChain and LangGraph; refined context engineering and introduced a progressive disclosure capability mechanism, lifting single-agent intelligence, latency, and end-to-end quality',
            'Drive end-to-end model evaluation and selection across Claude (Opus / Sonnet / Haiku), Gemini (Flash), the GPT family, and Chinese frontier models (MiniMax, Kimi, DeepSeek, Qwen); benchmark on cost / latency / quality and match the right model to each business scenario',
            'Own LLM vendor strategy across OpenRouter (primary aggregator), AWS Bedrock, GCP Vertex AI, and smaller providers; continuously rebalance routing on price-performance shifts to optimize cost and capacity',
            'Built a model-level fallback layer on top of LangChain ReAct agents — when a model times out or errors, a backup agent automatically takes over the in-flight task, materially lifting Lessie\'s production reliability under upstream instability',
            'Own the search agent\'s tool integration and lifecycle; ship three vertical end-to-end search flows — KOL / influencer outreach, tech-industry B2B prospecting, and academic discovery',
            'Apply AI Native methods so the agent auto-detects and remediates production effect issues, system errors, and bugs; contribute to data governance and project cost reporting',
            'Build Lark-bot integrations for internal business workflows and maintain an internal Skill platform powering team dashboards and KPI visibility',
          ],
        },
        {
          name: 'People Search Bench — Open Benchmark for People Discovery',
          links: [
            { label: 'GitHub', url: 'https://github.com/LessieAI/people-search-bench' },
            { label: 'arXiv', url: 'https://arxiv.org/abs/2603.27476' },
          ],
          details: [
            'Led the People Search Benchmark end-to-end as the core engineer; designed cross-platform evaluation dimensions and combined engineering practice with academic study to demonstrate Lessie\'s state-of-the-art performance on people discovery; open-sourced the benchmark and co-authored the accompanying arXiv paper',
          ],
        },
      ],
    },
    {
      company: 'Shenzhen Yangteng Digital Technology Co., Ltd.',
      companyLogo: '/assets/yangteng-logo.svg',
      role: 'Java',
      date: 'Aug 2023 - May 2025',
      tags: ['SpringBoot', 'MyBatis', 'MySQL', 'Distributed Transactions', 'Floyd-Warshall', 'PDA', 'RBAC/ABAC'],
      projects: [
        {
          name: 'WMS Platform — ODOO Migration & Frontline Devices',
          details: [
            'Led the migration from a legacy ODOO open-source warehouse system to a self-built WMS; a 3-person team delivered the new platform in 3 months and grew it to support 30K+ daily warehouse operations',
            'Owned the WMS data model and end-to-end operational flow — procurement inbound, putaway, in-warehouse inventory ops (cycle count / adjustment), picking outbound, and shipping handoff to sales orders — with inventory consistency under distributed transactions',
            'Built and shipped the warehouse-floor PDA device application frontline operators use daily, optimizing the scan / pick / putaway / counting experience',
            'Led the picking-path optimization engine using Floyd-Warshall over 5,000+ storage locations for millisecond-level scheduling, shortening average picking paths by 37%',
          ],
        },
        {
          name: 'German Warehouse Robotics Integration',
          details: [
            'Integrated a third-party smart warehouse robotics system (GPS-guided robots) with the self-built WMS at the German site, designing the cross-system scheduling layer between software and hardware',
            'Lifted inbound throughput and picking-outbound efficiency through tightly-coupled WMS + robotics workflows under complex multi-system business scenarios',
          ],
        },
        {
          name: 'IPO Audit Compliance & Standardization',
          details: [
            'Supported the company\'s IPO Deloitte audit by redesigning the RBAC + ABAC hybrid authorization model (user / role / department permissions) as a standardized identity layer, meeting GDPR compliance requirements',
            'Implemented unified, structured logging across the full operational chain — inbound, putaway, picking, cycle count, outbound — for end-to-end traceability and audit-grade observability',
          ],
        },
        {
          name: 'Engineering Quality & SQL Performance',
          details: [
            'Set up SonarQube alongside the CI/CD pipeline and Git branch-management conventions to enforce code standards and consistent delivery quality',
            'Drove the slow-SQL remediation effort against large-volume warehousing tables (index misses, complex table structures, awkward business SQL), cutting slow queries by 80% and dropping critical response time from 3.2s to 0.8s',
          ],
        },
      ],
    },
    {
      company: 'Tencent Technology (Shenzhen) Co., Ltd.',
      companyLogo: '/assets/tencent-logo.avif',
      role: 'Python',
      date: 'May 2021 - Jul 2023',
      tags: ['Kafka', 'Redis', 'Airtest', 'MitmProxy', 'Hive', 'Tencent Cloud'],
      projects: [
        {
          name: 'Internet Ad Monitoring',
          details: [
            'Built and scaled the ad-collection backbone — Kafka task distribution, Redis Bloom-filter URL dedup, and an Airtest + ADB mobile emulator cluster (50+ concurrent devices) — sustaining 100M+ daily ad records across web, app, and Mini Program platforms',
            'Decrypted HTTPS traffic via MitmProxy and built a WeChat token pool plus a Mini Program ad scoring system, delivering 500 app ads / 1,500 Mini Program ads / 2,000+ Official Account entity records per day',
            'Optimized the screenshot evidence service for stability and throughput; instrumented data-quality metrics into BI dashboards for end-to-end pipeline observability',
          ],
        },
        {
          name: 'Financial Sentiment Monitoring',
          details: [
            'Built an enterprise-entity extraction service on Hive workflows, lifting fraud detection from 50 to 2,000 records/day and valid-advertiser identification from 30% to 95%',
          ],
        },
        {
          name: 'Tencent Cloud — Brand Protection',
          details: [
            'Shipped the in-app messaging module providing Mini Program brand-protection capabilities (avg ~50 effective entries per brand/day)',
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
        { text: 'Supply Chain' },
        { text: 'Big Data Content Detection' },
      ],
    },
    {
      label: 'AI Engineering',
      tags: [
        { text: 'Multi-Agent Systems', highlight: true },
        { text: 'Context Engineering', highlight: true },
        { text: 'Progressive Disclosure', highlight: true },
        { text: 'Model Evaluation', highlight: true },
        { text: 'Model Strategy', highlight: true },
        { text: 'Agent Reliability', highlight: true },
        { text: 'AI Native', highlight: true },
      ],
    },
    {
      label: 'Languages',
      tags: [
        { text: 'Python', highlight: true },
        { text: 'Java' },
      ],
    },
    {
      label: 'Frameworks',
      tags: [
        { text: 'LangChain' },
        { text: 'LangGraph' },
        { text: 'ReAct' },
        { text: 'SpringBoot' },
        { text: 'SpringCloud' },
        { text: 'Kafka' },
        { text: 'Redis' },
        { text: 'Hive' },
      ],
    },
    {
      label: 'Engineering',
      tags: [
        { text: 'System Architecture' },
        { text: 'Algorithm Engineering' },
      ],
    },
    {
      label: 'Work Style',
      tags: [
        { text: '0-to-1 Builder' },
        { text: 'Result-oriented' },
        { text: 'Self-driven' },
      ],
    },
  ],
};

export const zh: ResumeData = {
  name: '张帅',
  meta: ['男 / 25岁', '4年工作经验'],
  contacts: [
    { type: 'email', value: 'shane.z.chang@hotmail.com' },
    { type: 'phone', value: '138-XXXX-1234' },
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
  },
  experience: [
    {
      company: '深圳超线性科技有限公司',
      companyLogo: '/assets/superlinear-logo.svg',
      monoLogo: true,
      role: 'AI Agent',
      date: '2025.05 - 至今',
      tags: ['LangChain', 'LangGraph', 'ReAct', '多 Agent', '上下文工程', 'AI Native'],
      projects: [
        {
          name: 'Lessie AI — 找人领域 AI Agent',
          links: [{ label: 'lessie.ai', url: 'https://lessie.ai/' }],
          details: [
            '主导核心产品 Lessie AI（找人领域 AI Agent）的架构演进，从早期流程编排升级为基于 LangChain 与 LangGraph 的多 Agent 协作架构；通过上下文工程优化与"渐进式披露能力"机制，提升单 Agent 智能水平、响应速度与整体效果',
            '主导业务模型测评与选型——覆盖 Claude（Opus / Sonnet / Haiku）、Gemini（Flash）、GPT 全系列等国际主流模型，以及 MiniMax、Kimi、DeepSeek、通义千问等国内主流模型，从成本、速度、效果三个维度做综合评估，为不同业务场景选择最适配的模型方案',
            '负责对接 OpenRouter（最大第三方聚合平台）、AWS Bedrock、GCP Vertex AI 及其他中小型供应商，对比折扣与性能持续优化路由策略，平衡 LLM 成本与容量',
            '基于 LangChain ReAct Agent 设计并实现模型兜底机制——当模型出现超时或报错时，由备用 Agent 自动接替失败任务，显著提升 Lessie 在上游不稳定情况下的线上可用性',
            '负责搜索 Agent 找人能力的工具对接、开发与管理；落地三条端到端垂直搜索场景——KOL 网红达人营销、科技圈 B 端客户精准搜索、学术圈专业搜索',
            '以 AI Native 方式实现 AI 对线上效果问题、系统错误及 Bug 的自动识别与高效修复；参与大数据治理与项目成本上报管理',
            '基于飞书机器人搭建业务智能机器人；开发并维护内部 Skill 平台，通过更新各类 Skill 支持数据看板建设与业务指标可视化',
          ],
        },
        {
          name: 'People Search Bench — 找人领域开源评测基准',
          links: [
            { label: 'GitHub', url: 'https://github.com/LessieAI/people-search-bench' },
            { label: 'arXiv', url: 'https://arxiv.org/abs/2603.27476' },
          ],
          details: [
            '作为核心研发主导 People Search Benchmark 项目从 0 到 1 的实施；横向对比多平台并设计多维度评估方法，结合工程实践与学术产出共同论证 Lessie 在找人领域达到 SOTA 水平；开源代码仓库并参与 arXiv 论文撰写',
          ],
        },
      ],
    },
    {
      company: '深圳扬腾数智科技有限公司',
      companyLogo: '/assets/yangteng-logo.svg',
      role: 'Java',
      date: '2023.08 - 2025.05',
      tags: ['SpringBoot', 'MyBatis', 'MySQL', '分布式事务', 'Floyd-Warshall', 'PDA', 'RBAC/ABAC'],
      projects: [
        {
          name: 'WMS 仓储管理系统建设与演进',
          details: [
            '主导旧仓储系统（基于 ODOO 开源社区版）到自建 WMS 的渐进式迁移；3 人团队 3 个月上线新平台，并稳步扩展支撑日均 3万+ 仓储操作',
            '负责 WMS 数据模型与全链路操作流程——采购入库、上架、库内库存管理（盘点 / 库存调整）、拣货出库、发货对接销售订单，在分布式事务下保障库存一致性',
            '主导仓库手持 PDA 设备软件的开发与上线，优化一线作业人员的扫码 / 拣货 / 上架 / 盘点体验',
            '主导拣货路径优化引擎，基于 Floyd-Warshall 算法在 5000+ 库位下实现毫秒级调度，拣货路径平均缩短 37%',
          ],
        },
        {
          name: '德国智能仓储机器人对接项目',
          details: [
            '对接三方智能仓储机器人系统（GPS 智能机器人），将自研 WMS 与智能硬件能力结合，设计跨系统的高效调度层',
            '在多系统对接的复杂业务场景下，通过 WMS 与机器人协同工作流显著提升入库与拣货出库效率',
          ],
        },
        {
          name: '上市审计与标准化治理专项',
          details: [
            '支持公司上市德勤审计，重构 RBAC + ABAC 混合鉴权模型（用户 / 角色 / 部门权限），形成标准化身份能力层，满足 GDPR 合规要求',
            '落地覆盖全环节（入库、上架、拣货、盘点、出库）的统一日志治理与落表，为审计提供端到端的可追溯性与审计级可观测性',
          ],
        },
        {
          name: '工程质量与性能优化',
          details: [
            '搭建 SonarQube 并结合 CI/CD 流水线，规范 Git 分支管理机制，确保代码标准与交付质量',
            '主导慢 SQL 专项治理，针对国内仓储系统大数据量、复杂表结构、索引失效与业务语法不当等问题深度优化，慢查询减少 80%，关键响应时间从 3.2s 降至 0.8s',
          ],
        },
      ],
    },
    {
      company: '腾讯科技（深圳）有限公司',
      companyLogo: '/assets/tencent-logo.avif',
      role: 'Python',
      date: '2021.05 - 2023.07',
      tags: ['Kafka', 'Redis', 'Airtest', 'MitmProxy', 'Hive', '腾讯云'],
      projects: [
        {
          name: '互联网广告监测项目',
          details: [
            '搭建并扩展广告采集主链路——基于 Kafka 的任务分发、Redis 布隆过滤器 URL 去重、Airtest + ADB 手机模拟器集群（50+ 设备并发），支撑日均 1 亿级广告数据采集，覆盖 Web、APP 与小程序多端',
            '通过 MitmProxy 解密 HTTPS 流量，建立微信账号 TOKEN 池与小程序广告评分权重体系，稳定输出 APP 广告 500条/天、小程序广告 1500条/天、公众号主体数据 2000+条/天',
            '主导截图存证服务的稳定性与吞吐量优化；建设广告采集系统监控指标体系并接入 BI 报表，实现采集链路全流程可观测',
          ],
        },
        {
          name: '金融舆情监测项目',
          details: [
            '在金融舆情监管项目中基于 Hive 工作流搭建企业主体提取服务，传销数据检出量由 50条/天提升至 2000条/天，有效广告主体识别率从 30% 提升至 95%',
          ],
        },
        {
          name: '腾讯云 — 品牌保护',
          details: [
            '负责腾讯云"品牌保护"产品站内信模块开发，提供小程序品牌保护能力，平均每个品牌输出有效数据 50条/天',
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
        { text: '供应链' },
        { text: '大数据内容检测' },
      ],
    },
    {
      label: 'AI 工程能力',
      tags: [
        { text: '多 Agent 协作架构', highlight: true },
        { text: '上下文工程', highlight: true },
        { text: '渐进式披露能力', highlight: true },
        { text: '模型测评', highlight: true },
        { text: '模型策略', highlight: true },
        { text: 'Agent 兜底机制', highlight: true },
        { text: 'AI Native', highlight: true },
      ],
    },
    {
      label: '核心语言',
      tags: [
        { text: 'Python', highlight: true },
        { text: 'Java' },
      ],
    },
    {
      label: '框架 & 中间件',
      tags: [
        { text: 'LangChain' },
        { text: 'LangGraph' },
        { text: 'ReAct' },
        { text: 'SpringBoot' },
        { text: 'SpringCloud' },
        { text: 'Kafka' },
        { text: 'Redis' },
        { text: 'Hive' },
      ],
    },
    {
      label: '工程能力',
      tags: [
        { text: '系统架构设计' },
        { text: '算法工程化' },
      ],
    },
    {
      label: '工作风格',
      tags: [
        { text: '从 0 到 1 架构' },
        { text: '结果导向' },
        { text: '独立解决问题' },
      ],
    },
  ],
};
