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

/**
 * One numbered "highlight": a strength claim backed by concrete evidence
 * pointing at the experience timeline. Keeps the resume's claim density honest.
 */
export interface Highlight {
  /** Short, scannable title (e.g. "Learning Agility"). */
  title: string;
  /** One-line statement of what this strength looks like in practice. */
  tagline: string;
  /** Evidence bullets, each pointing at a concrete project / metric. */
  evidence: string[];
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
    highlights: string;
  };
  experience: ExperienceEntry[];
  strengths: StrengthCategory[];
  /** Optional evidence-backed strength signals; rendered between Strengths and Experience. */
  highlights?: Highlight[];
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
    highlights: 'Highlights',
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
          name: 'Lessie AI — Core Technical Pipeline',
          links: [{ label: 'lessie.ai', url: 'https://lessie.ai/' }],
          details: [
            'Lead architecture evolution of Lessie AI, the company\'s flagship people-search agent, migrating from procedural workflow orchestration to multi-agent collaboration on LangChain and LangGraph; refined context engineering and introduced a progressive disclosure capability mechanism, lifting single-agent intelligence, latency, and end-to-end quality',
            'Own the search agent\'s tool integration and lifecycle — connecting heterogeneous data sources, search APIs, and enrichment tools that compose the agent\'s capability surface for people discovery',
            'Ship three vertical end-to-end search flows under Lessie — KOL / influencer outreach, tech-industry B2B prospecting, and academic discovery — each with bespoke retrieval and ranking strategies',
          ],
        },
        {
          name: 'AI Infrastructure & Tooling Layer',
          details: [
            'Drive end-to-end model evaluation and selection across Claude (Opus / Sonnet / Haiku), Gemini (Flash), the GPT family, and Chinese frontier models (MiniMax, Kimi, DeepSeek, Qwen); benchmark on cost / latency / quality and match the right model to each business scenario',
            'Own LLM vendor strategy across OpenRouter (primary aggregator), AWS Bedrock, GCP Vertex AI, and smaller providers; continuously rebalance routing on price-performance shifts to optimize cost and capacity',
            'Built a model-level fallback layer on top of LangChain ReAct agents — when a model times out or errors, a backup agent automatically takes over the in-flight task, materially lifting production reliability under upstream instability',
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
      tags: ['Selenium', 'Airtest', 'MitmProxy', 'Kafka', 'K8s', 'Redis', 'Hive', 'PySpark', 'Go'],
      projects: [
        {
          name: 'Internet Ad Monitoring',
          details: [
            'Built the ad-collection backbone on Kafka + K8s dynamic node scaling, ingesting tens of GB/hour from Tencent Cloud Lookup (URLs aggregated from Tencent Manager / Browser / WeChat) and sustaining 100M+ daily records across web, app, and Mini Program',
            'Built the web-side collection pipeline on Selenium virtual browsers + ADBlock interception, with Python multi-process / multi-thread concurrency for high-throughput crawling',
            'Built the screenshot-evidence service: dynamic browser sizing + scrolling capture stitched into full-page long images, watermarked and timestamped for legal admissibility before delivery to government regulators',
            'Built the mobile / Mini Program collection track on an Airtest + ADB emulator cluster (50+ devices) with MitmProxy HTTPS decryption; automated VM restart, APK install, login persistence, and WeChat account-pool scheduling across news portals, ad alliances (ByteDance Pangle, Baidu Union), and WeChat Mini Programs — 500 app ads / 1,500 Mini Program ads / 2,000+ Official Account entities per day',
            'Designed the Mini Program ad scoring & weighting system, balancing breadth vs frequency to maximize high-value violation leads',
            'Engineered Redis Bloom-Filter URL dedup over a 100M+ daily URL stream — bitmap sized at m/n ≈ 14.4 with k=10 hash functions, sharded into per-source bitmaps to stay within Redis\'s 512MB per-key limit and hold false-positive rate under 0.1%',
          ],
        },
        {
          name: 'Tencent Cloud — Brand Protection',
          details: [
            'Built and maintained the Brand Protection platform\'s Go backend — interface upkeep, scheduled-job pipelines, and strategic-module development',
            'Adapted the WeChat Mini Program ad-monitoring capability into a brand-protection use case, surfacing counterfeit-product Mini Programs (e.g., Burberry, Maxim\'s Mooncake) as actionable leads for brand owners — averaging ~50 effective leads per brand per day',
          ],
        },
        {
          name: 'Financial Sentiment Monitoring',
          details: [
            'Owned the financial-sentiment monitoring pipeline; drove big-data governance across a complex DAG of SQL and PySpark scripts on Tencent Cloud',
            'Built an enterprise-entity extraction service backed by a Trie over 100M+ Tianyancha company-name records; matched candidate entities from violation text in milliseconds and joined them against fraud-monitoring rules',
            'Owned model development for fraud lead generation — entity-anchored signals targeting financial pyramid schemes — lifting fraud detection from 50 to 2,000 records/day and valid-advertiser identification rate from 30% to 95%',
            'Anchored the pipeline on URL + text content processing with Tencent Cloud services — optimizing data freshness, lead validity, and entity-precise attribution in the financial-fraud vertical',
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
        { text: 'Multi-Agent Systems', highlight: true },
        { text: 'Progressive Disclosure', highlight: true },
        { text: 'Agent Reliability', highlight: true },
        { text: 'Context Engineering' },
        { text: 'Model Evaluation' },
        { text: 'Model Routing & Strategy' },
        { text: 'AI Native' },
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
        { text: 'LangChain' },
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
      label: 'Engineering',
      tags: [
        { text: 'Algorithm Engineering', highlight: true },
        { text: 'Compliance Engineering', highlight: true },
        { text: 'System Architecture' },
        { text: 'Big Data Governance' },
        { text: 'Distributed Transactions' },
      ],
    },
    {
      label: 'Work Style',
      tags: [
        { text: '0-to-1 Builder', highlight: true },
        { text: 'Platform-First', highlight: true },
        { text: 'Fast Learner' },
        { text: 'Result-oriented' },
        { text: 'Self-driven' },
      ],
    },
  ],
  highlights: [
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
      tagline: 'CS algorithms operationalized at production scale, not whiteboarded.',
      evidence: [
        'Floyd-Warshall picking-path engine across 5,000+ storage locations — sub-millisecond scheduling, average paths −37%',
        'Trie tree over 100M+ Tianyancha company names for real-time fraud-entity matching from violation text',
        'Redis Bloom-Filter URL dedup at m/n ≈ 14.4, k=10 — FPR under 0.1% on 100M+ daily entries',
      ],
    },
    {
      title: 'Platform & 0-to-1 Builder',
      tagline: 'Default to building the floor, not just the room on top of it.',
      evidence: [
        'Built Yangteng\'s WMS from scratch to replace ODOO — 3-person team delivered in 3 months',
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
    highlights: '亮点',
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
          name: 'Lessie AI — 核心技术链路',
          links: [{ label: 'lessie.ai', url: 'https://lessie.ai/' }],
          details: [
            '主导核心产品 Lessie AI（找人领域 AI Agent）的架构演进，从早期流程编排升级为基于 LangChain 与 LangGraph 的多 Agent 协作架构；通过上下文工程优化与"渐进式披露能力"机制，提升单 Agent 智能水平、响应速度与整体效果',
            '负责搜索 Agent 找人能力的工具对接与生命周期管理——打通异构数据源、搜索 API 与各类 enrichment 工具，构成 Agent 在找人场景下的能力底座',
            '落地 Lessie 三条端到端垂直搜索场景——KOL 网红达人营销、科技圈 B 端客户精准搜索、学术圈专业搜索——每条场景都有针对性的召回与排序策略',
          ],
        },
        {
          name: 'AI 基础设施与工具层',
          details: [
            '主导业务模型测评与选型——覆盖 Claude（Opus / Sonnet / Haiku）、Gemini（Flash）、GPT 全系列等国际主流模型，以及 MiniMax、Kimi、DeepSeek、通义千问等国内主流模型，从成本、速度、效果三个维度做综合评估，为不同业务场景选择最适配的模型方案',
            '负责对接 OpenRouter（最大第三方聚合平台）、AWS Bedrock、GCP Vertex AI 及其他中小型供应商，对比折扣与性能持续优化路由策略，平衡 LLM 成本与容量',
            '基于 LangChain ReAct Agent 设计并实现模型兜底机制——当模型出现超时或报错时，由备用 Agent 自动接替失败任务，显著提升线上可用性',
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
      tags: ['Selenium', 'Airtest', 'MitmProxy', 'Kafka', 'K8s', 'Redis', 'Hive', 'PySpark', 'Go'],
      projects: [
        {
          name: '互联网广告监测项目',
          details: [
            '搭建广告采集主链路（Kafka + K8s 动态扩容），承接腾讯云查每小时数十 GB 数据流（聚合腾讯管家 / 腾讯浏览器 / 微信等多渠道 URL），支撑日均 1 亿级广告数据采集，覆盖 Web、APP 与小程序多端',
            '网页端采集链路基于 Selenium 虚拟浏览器 + ADBlock 拦截广告链接，配合 Python 多进程多线程实现高并发采集',
            '落地页截图存证服务：动态浏览器宽高 + 分屏滑动拼接长图，自动加水印与时间戳确保证据链法律效力，对接政府监管平台',
            '移动端 / 小程序采集集群：Airtest + ADB 50+ 设备并发模拟器 + MitmProxy 解密 HTTPS；覆盖新闻门户、主流广告联盟（穿山甲、百度联盟等）与微信小程序，自动化处理虚拟机重启 / APK 安装 / 登录态 / 微信账号池调度，稳定输出 APP 广告 500条/天、小程序 1500条/天、公众号主体 2000+条/天',
            '设计小程序广告评分权重体系，平衡采集广度与频次以最大化高价值违规线索产出',
            '针对日均 1 亿+ 唯一 URL 调优 Redis 布隆过滤器：bitmap 按 m/n ≈ 14.4 配置、哈希函数 k=10，按数据源分片以规避 Redis 单 key 512MB 限制，将误判率稳控 0.1% 以内',
          ],
        },
        {
          name: '腾讯云 — 品牌保护',
          details: [
            '基于 Go 语言开发与维护腾讯云品牌保护平台后端：日常接口维护、定时任务编排与战略性模块开发',
            '将微信小程序广告监测能力改造迁移到品牌保护场景——例如针对"巴宝莉"、"美心月饼"等品牌方，输出在小程序中售卖盗版产品的违法线索，平均每个品牌产出有效数据 50条/天',
          ],
        },
        {
          name: '金融舆情监测项目',
          details: [
            '负责金融舆情监测项目，深入参与大数据治理——处理由 SQL、PySpark 等脚本组成的复杂大数据画布与节点间依赖关系，运行于腾讯云之上',
            '基于天眼查 1 亿+ 全国企业主体数据构建前缀树（Trie）匹配服务——从违规文本中毫秒级提取候选企业实体，与金融传销监管规则联动判定',
            '承接简易模型开发，结合企业主体产出金融传销相关违规线索；传销数据检出量由 50条/天 提升至 2000条/天，有效广告主体识别率从 30% 提升至 95%',
            '依托腾讯云完成 URL 与文本全链路处理，方案聚焦数据实时性、线索有效性与企业主体精准归因，专注金融传销细分方向',
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
        { text: '多 Agent 协作架构', highlight: true },
        { text: '渐进式披露能力', highlight: true },
        { text: 'Agent 兜底机制', highlight: true },
        { text: '上下文工程' },
        { text: '模型测评' },
        { text: '模型路由与策略' },
        { text: 'AI Native' },
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
        { text: 'LangChain' },
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
      label: '工程能力',
      tags: [
        { text: '算法工程化', highlight: true },
        { text: '合规级工程', highlight: true },
        { text: '系统架构设计' },
        { text: '大数据治理' },
        { text: '分布式事务' },
      ],
    },
    {
      label: '工作风格',
      tags: [
        { text: '从 0 到 1 架构', highlight: true },
        { text: '平台思维', highlight: true },
        { text: '快速学习' },
        { text: '结果导向' },
        { text: '独立解决问题' },
      ],
    },
  ],
  highlights: [
    {
      title: '快速学习与适配能力',
      tagline: '三门生产级后端语言、跨度极大的业务领域，每段都能在数月内交付。',
      evidence: [
        'Yangteng 入职即上手 Java + SpringBoot，3 人团队 3 个月落地 30K+ 仓储日操作的 WMS',
        '腾讯任期内切换到 Go，承接腾讯云品牌保护后端',
        '2025 年 5 月加入 Superlinear，同年内完成多 Agent 架构在 LangChain / LangGraph 上的迁移',
      ],
    },
    {
      title: '算法到工程的落地能力',
      tagline: '把 CS 算法跑到生产规模，不是停在白板。',
      evidence: [
        'Floyd-Warshall 拣货路径引擎跨 5000+ 库位，毫秒级调度、路径平均缩短 37%',
        '基于 1 亿+ 天眼查企业主体的 Trie 前缀树，毫秒级从违规文本中匹配企业实体',
        'Redis 布隆过滤器（m/n ≈ 14.4、k=10）在日均 1 亿+ URL 流量下将误判率稳控 0.1% 以内',
      ],
    },
    {
      title: '平台型 0-to-1 builder',
      tagline: '更倾向于建"地板"，而不是只盖上面的房间。',
      evidence: [
        'Yangteng WMS 从 0 自建替代 ODOO，3 人团队 3 个月上线',
        '在 Superlinear 把 AI 基础设施与工具层独立出来作为跨产品平台（模型测评 / 供应商策略 / 兜底 / AI Native）',
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
        'Java + SpringBoot：Yangteng WMS + PDA + 审计标准化',
        'Go：腾讯云品牌保护后端',
      ],
    },
    {
      title: '可经受审计的工程审美',
      tagline: '做的事经得住外部第三方审查。',
      evidence: [
        '腾讯截图存证服务带水印与时间戳，作为法律证据交付政府监管平台',
        'Yangteng RBAC + ABAC 重构通过德勤上市审计，满足 GDPR',
        'Yangteng 全环节统一日志治理（入库 / 上架 / 拣货 / 盘点 / 出库），审计级可追溯',
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
