export interface ExperienceEntry {
  company: string;
  companyLogo?: string;
  role: string;
  date: string;
  tags: string[];
  project: string;
  details: string[];
}

export interface StrengthCategory {
  label: string;
  tags: { text: string; highlight?: boolean }[];
}

export interface ResumeData {
  name: string;
  meta: string[];
  education: {
    school: string;
    schoolLogo: string;
    degree: string;
    major: string;
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
  meta: ['4 Years Experience', 'shane.z.chang@hotmail.com'],
  education: {
    school: 'Shenzhen University',
    schoolLogo: '/assets/szu-logo.png',
    degree: "Bachelor's",
    major: 'Mathematics & Statistics',
    date: '2018 - 2022',
  },
  sectionTitles: {
    education: 'Education',
    experience: 'Experience',
    strengths: 'Strengths',
  },
  experience: [
    {
      company: 'Index Gravity Technology Co., Ltd.',
      role: 'Python',
      date: 'May 2025 - Present',
      tags: ['Python', 'Internal Tooling', 'Efficiency Engineering', 'Data Dashboard'],
      project: 'Douyin Influencer Agency — Internal Efficiency Platform',
      details: [
        'The company operates a Douyin (TikTok China) influencer agency business, connecting domestic brands and merchants with KOLs for short-video and live-stream commerce collaborations',
        'Built the internal efficiency platform covering influencer resource management, business liaison workflows, and collaboration progress tracking to improve team coordination and information transparency',
        'Developed internal data dashboards and feature tracking systems, enabling the operations team to monitor business progress in real time and driving process standardization',
      ],
    },
    {
      company: 'Shenzhen Yangteng Digital Technology Co., Ltd.',
      role: 'Java',
      date: 'Aug 2023 - May 2025',
      tags: ['SpringBoot', 'MyBatis', 'MySQL', 'SonarQube', 'Floyd-Warshall', 'RBAC/ABAC'],
      project: 'German Supply Chain Warehouse Management System',
      details: [
        'Built a custom WMS to replace ODOO; a 3-person team delivered the system in 3 months, supporting 30K+ daily warehouse operations; reduced slow queries by 80% through indexing and logic refactoring, cutting response time from 3.2s to 0.8s',
        'Led the picking-path optimization engine using Floyd-Warshall algorithm, achieving millisecond-level scheduling across 5,000+ storage locations and shortening average picking paths by 37%',
        'Set up SonarQube + CI/CD pipeline to enforce code quality; redesigned RBAC + ABAC hybrid authorization model, passing Deloitte audit and meeting GDPR compliance requirements',
      ],
    },
    {
      company: 'Tencent Technology (Shenzhen) Co., Ltd.',
      companyLogo: '/assets/tencent-logo.avif',
      role: 'Python',
      date: 'Jul 2022 - Jul 2023',
      tags: ['Airtest', 'ADB', 'MitmProxy', 'Hive', 'Tencent Cloud'],
      project: 'Internet Big Data Content Detection',
      details: [
        'Built a mobile emulator cluster management platform with Airtest + ADB, enabling concurrent control of 50+ devices for automated multi-platform ad content collection',
        'Decrypted HTTPS traffic via MitmProxy middleware, built a WeChat account token pool and Mini Program ad scoring system, achieving 500 app ads/day, 1,500 Mini Program ads/day, and 2,000+ Official Account entity records/day',
        'Developed the in-app messaging module for Tencent Cloud\'s "Brand Protection" product, providing Mini Program brand protection capabilities with an average of 50 effective data entries per brand per day',
        'Maintained Hive big data workflows for a financial sentiment monitoring project; built an enterprise entity extraction service, increasing fraud detection volume from 50/day to 2,000/day and improving valid advertiser identification rate from 30% to 95%',
      ],
    },
    {
      company: 'Tencent Technology (Shenzhen) Co., Ltd.',
      companyLogo: '/assets/tencent-logo.avif',
      role: 'Python',
      date: 'May 2021 - May 2022',
      tags: ['Kafka', 'Redis', 'Bloom Filter', 'BI Dashboard'],
      project: 'Internet Ad Collection & Monitoring Platform',
      details: [
        'Contributed to the ad collection monitoring system, developing data metrics and integrating them into BI dashboards for end-to-end pipeline observability',
        'Led the optimization of the screenshot evidence service, improving stability and processing throughput',
        'Implemented task distribution via Kafka and URL deduplication using Redis Bloom filters, supporting 100M+ daily ad data collection',
      ],
    },
  ],
  strengths: [
    {
      label: 'Industries',
      tags: [
        { text: 'E-commerce Supply Chain' },
        { text: 'Warehouse Management' },
        { text: 'Big Data Content Detection' },
        { text: 'MCN / Agency' },
      ],
    },
    {
      label: 'Languages',
      tags: [
        { text: 'Python', highlight: true },
        { text: 'Java', highlight: true },
        { text: 'SQL' },
      ],
    },
    {
      label: 'Frameworks',
      tags: [
        { text: 'SpringBoot' },
        { text: 'SpringCloud' },
        { text: 'MyBatis' },
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
        { text: 'CI/CD' },
        { text: 'K8S' },
        { text: 'Code Quality' },
      ],
    },
    {
      label: 'Work Style',
      tags: [
        { text: '0-to-1 Builder' },
        { text: '3 Yrs at Top-tier Tech' },
        { text: 'Result-oriented' },
        { text: 'Self-driven' },
      ],
    },
  ],
};

export const zh: ResumeData = {
  name: '张帅',
  meta: ['男 / 25岁', '4年工作经验', 'shane.z.chang@hotmail.com'],
  education: {
    school: '深圳大学',
    schoolLogo: '/assets/szu-logo.png',
    degree: '本科',
    major: '数学与统计',
    date: '2018 - 2022',
  },
  sectionTitles: {
    education: '教育经历',
    experience: '工作经历',
    strengths: '个人优势',
  },
  experience: [
    {
      company: '深圳指数引力科技有限公司',
      role: 'Python',
      date: '2025.05 - 至今',
      tags: ['Python', '内部工具平台', '效率工程', '数据看板'],
      project: '抖音达人 Agency 业务 — 内部效率工具平台建设',
      details: [
        '公司主营抖音达人 Agency 业务，帮助国内商家与品牌方对接抖音网红达人，完成短视频与直播带货的商业合作',
        '负责搭建内部效率工具平台，涵盖达人资源管理、商务对接流程、合作进度追踪等核心模块，提升业务团队的协作效率与信息透明度',
        '搭建内部数据看板与功能追踪系统，支撑运营团队实时掌握业务进展，推动流程标准化',
      ],
    },
    {
      company: '深圳扬腾数智科技有限公司',
      role: 'Java',
      date: '2023.08 - 2025.05',
      tags: ['SpringBoot', 'MyBatis', 'MySQL', 'SonarQube', 'Floyd-Warshall', 'RBAC/ABAC'],
      project: '德国供应链仓储管理系统研发项目',
      details: [
        '自研 WMS 系统替代 ODOO，3人团队 3 个月上线，支撑日均 3万+ 仓储操作；慢 SQL 优化专项减少 80% 慢查询，响应时间从 3.2s 降至 0.8s',
        '主导拣货路径优化引擎，基于 Floyd-Warshall 算法在 5000+ 库位下实现毫秒级调度，拣货路径平均缩短 37%',
        '搭建 SonarQube + CI/CD 流水线，推动代码质量治理；重构 RBAC + ABAC 混合鉴权模型，通过德勤审计，满足 GDPR 合规要求',
      ],
    },
    {
      company: '腾讯科技（深圳）有限公司',
      companyLogo: '/assets/tencent-logo.avif',
      role: 'Python',
      date: '2022.07 - 2023.07',
      tags: ['Airtest', 'ADB', 'MitmProxy', 'Hive', '腾讯云'],
      project: '互联网大数据内容检测项目',
      details: [
        '负责构建手机模拟器集群管理平台，基于 Airtest + ADB 实现 50+ 设备并发控制，支撑多端广告内容的自动化采集',
        '通过 MitmProxy 中间件解密 HTTPS 流量，建立微信账号 TOKEN 池与小程序广告评分权重体系，实现 APP 广告采集 500条/天、微信小程序广告采集 1500条/天、微信公众号主体数据 2000+条/天',
        '负责腾讯云产品"品牌保护"站内信开发，提供小程序品牌保护能力，平均每个品牌输出有效数据 50条/天',
        '维护金融舆情监管项目 Hive 大数据工作流，搭建企业主体提取服务，支持湖南金融传销监测数据交付，传销数据检出量由 50条/天提升至 2000条/天，有效广告主体识别率从 30% 提升至 95%',
      ],
    },
    {
      company: '腾讯科技（深圳）有限公司',
      companyLogo: '/assets/tencent-logo.avif',
      role: 'Python',
      date: '2021.05 - 2022.05',
      tags: ['Kafka', 'Redis', '布隆过滤器', 'BI 报表'],
      project: '互联网广告采集与监控平台',
      details: [
        '参与广告采集系统监控体系建设，开发数据监控指标并接入 BI 报表，实现采集链路全流程可观测',
        '主导截图存证服务的优化迭代，提升存证稳定性与处理吞吐量',
        '通过 Kafka 处理采集任务分发，使用 Redis 布隆过滤器实现 URL 去重，支撑日均 1亿级广告数据采集',
      ],
    },
  ],
  strengths: [
    {
      label: '行业经验',
      tags: [
        { text: '电商供应链' },
        { text: '仓储管理' },
        { text: '大数据内容检测' },
        { text: 'MCN / Agency' },
      ],
    },
    {
      label: '核心语言',
      tags: [
        { text: 'Python', highlight: true },
        { text: 'Java', highlight: true },
        { text: 'SQL' },
      ],
    },
    {
      label: '框架 & 中间件',
      tags: [
        { text: 'SpringBoot' },
        { text: 'SpringCloud' },
        { text: 'MyBatis' },
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
        { text: 'CI/CD' },
        { text: 'K8S' },
        { text: '代码质量治理' },
      ],
    },
    {
      label: '工作风格',
      tags: [
        { text: '从 0 到 1 架构' },
        { text: '3年大厂经验' },
        { text: '结果导向' },
        { text: '独立解决问题' },
      ],
    },
  ],
};
