export interface DomainWritingProfile {
  category: string;
  deliverablesTemplates: string[];
  toolkitTemplates: string[];
  dutiesTemplates: string[];
  impactTemplates: string[];
  projectDeliverablesTemplates: string[];
  projectToolkitTemplates: string[];
  projectDutiesTemplates: string[];
  projectImpactTemplates: string[];
}

export const WRITING_PROFILES: Record<string, DomainWritingProfile> = {
  developer: {
    category: 'developer',
    deliverablesTemplates: [
      "Architected and engineered high-throughput software modules encompassing {items}.",
      "Engineered core technical architecture and API suites spanning {items}.",
      "Constructed modular, resilient system components focusing on {items}.",
      "Spearheaded software engineering initiatives and system layers including {items}.",
      "Formulated scalable backend services and frontend architectures around {items}.",
      "Designed and implemented high-availability application features including {items}."
    ],
    toolkitTemplates: [
      "Powered core infrastructure using a technical stack comprising {items}.",
      "Leveraged a modern development toolkit consisting of {items} to ensure system reliability.",
      "Engineered solutions utilizing {items} to maintain low-latency metrics.",
      "Built resilient software environments leveraging {items}.",
      "Driven by a robust engineering technology suite including {items}.",
      "Deployed application services integrated with {items}."
    ],
    dutiesTemplates: [
      "Maintained rigorous code quality and system performance through {items}.",
      "Optimized codebase maintainability and release velocity by executing {items}.",
      "Sustained 99.9% operational uptime via continuous practices across {items}.",
      "Drove engineering excellence and structural integrity by conducting {items}.",
      "Streamlined CI/CD automation and test coverage by implementing {items}.",
      "Navigated technical refactoring and load optimization by executing {items}."
    ],
    impactTemplates: [
      "Delivered measurable engineering milestones, achieving {items}.",
      "Accelerated system performance output and reliability, successfully {items}.",
      "Drove critical technical impact across production systems, resulting in {items}.",
      "Calculated tangible operational improvements including {items}.",
      "Hit key software stability metrics, successfully {items}.",
      "Elevated application processing capabilities, achieving {items}."
    ],
    projectDeliverablesTemplates: [
      "Architected and deployed open-source / production project software encompassing {items}.",
      "Engineered fullstack project modules and custom software features spanning {items}.",
      "Developed an interactive application software suite focusing on {items}.",
      "Constructed custom technical project infrastructure including {items}.",
      "Built an end-to-end software application system incorporating {items}."
    ],
    projectToolkitTemplates: [
      "Built and deployed the project codebase using a stack comprising {items}.",
      "Powered project features leveraging tools and frameworks like {items}.",
      "Driven by an agile project technology stack consisting of {items}.",
      "Integrated project service layers with software technologies such as {items}."
    ],
    projectDutiesTemplates: [
      "Validated system architectural integrity by performing {items}.",
      "Ensured project codebase stability and test coverage through {items}.",
      "Streamlined production deployment and version control via {items}.",
      "Optimized load speeds and API response benchmarks by executing {items}."
    ],
    projectImpactTemplates: [
      "Successfully launched production project deliverables, achieving {items}.",
      "Exceeded target software performance benchmarks, successfully {items}.",
      "Delivered verified project software metrics, resulting in {items}.",
      "Hit major technical release milestones including {items}."
    ]
  },
  designer: {
    category: 'designer',
    deliverablesTemplates: [
      "Designed intuitive, human-centered digital interfaces and visual assets including {items}.",
      "Crafted cohesive visual design systems and user experiences encompassing {items}.",
      "Conceptualized and prototyped end-to-end design solutions spanning {items}.",
      "Spearheaded user experience strategy and interactive assets focusing on {items}.",
      "Formulated design system component libraries and layouts around {items}.",
      "Engineered visually polished UI frameworks including {items}."
    ],
    toolkitTemplates: [
      "Brought design concepts to life leveraging industry-standard creative tools like {items}.",
      "Utilized a comprehensive design and prototyping toolkit comprising {items}.",
      "Crafted pixel-perfect visual components utilizing {items}.",
      "Powered interactive prototyping and visual design using {items}.",
      "Driven by a modern creative tech suite including {items}.",
      "Constructed interactive wireframes and UI components with {items}."
    ],
    dutiesTemplates: [
      "Elevated user journey flows and visual consistency by conducting {items}.",
      "Streamlined engineering handoffs and design fidelity through {items}.",
      "Iterated interface usability and visual accessibility via practices across {items}.",
      "Fostered design system adoption and user empathy by managing {items}.",
      "Standardized visual tokens and layout grid guidelines by auditing {items}.",
      "Enhanced digital product accessibility (WCAG) by validating {items}."
    ],
    impactTemplates: [
      "Elevated key product engagement and conversion metrics, achieving {items}.",
      "Enhanced user satisfaction and developer handoff efficiency, successfully {items}.",
      "Drove measurable design impact across core user flows, resulting in {items}.",
      "Transformed product usability metrics including {items}.",
      "Accelerated design sprint completion speed, achieving {items}.",
      "Hit benchmark user experience validation scores, successfully {items}."
    ],
    projectDeliverablesTemplates: [
      "Designed and prototyped comprehensive design project case studies encompassing {items}.",
      "Created a complete visual brand identity and UI component kit spanning {items}.",
      "Crafted interactive prototype flows and web design concepts focusing on {items}.",
      "Produced responsive digital design project assets including {items}.",
      "Conceptualized end-to-end product design project deliverables incorporating {items}."
    ],
    projectToolkitTemplates: [
      "Executed project visual designs and component kits utilizing {items}.",
      "Powered interactive project prototypes leveraging design tools like {items}.",
      "Driven by a creative project software suite comprising {items}.",
      "Constructed visual project assets and layout wireframes using {items}."
    ],
    projectDutiesTemplates: [
      "Validated design project usability and navigation clarity through {items}.",
      "Streamlined developer handoff specifications for this project via {items}.",
      "Iterated visual layout fidelity based on user feedback by conducting {items}.",
      "Ensured brand alignment and color accessibility across project assets via {items}."
    ],
    projectImpactTemplates: [
      "Successfully validated design project prototypes with users, achieving {items}.",
      "Delivered an approved visual design case study, successfully {items}.",
      "Hit target usability and user delight scores, resulting in {items}.",
      "Achieved high design system component adoption metrics including {items}."
    ]
  },
  data: {
    category: 'data',
    deliverablesTemplates: [
      "Constructed automated analytical pipelines and intelligence models encompassing {items}.",
      "Developed executive reporting dashboards and data solutions spanning {items}.",
      "Engineered predictive data pipelines and statistical evaluations focusing on {items}.",
      "Spearheaded business intelligence initiatives and data architectures including {items}.",
      "Formulated data warehouse schemas and automated ETL workflows around {items}.",
      "Designed machine learning data models and reporting views including {items}."
    ],
    toolkitTemplates: [
      "Leveraged a high-throughput data analytics stack comprising {items}.",
      "Powered predictive modeling and database querying utilizing {items}.",
      "Transformed raw datasets into intelligence leveraging tools like {items}.",
      "Driven by an analytical technology suite including {items}.",
      "Queried complex databases and built BI dashboards with {items}.",
      "Engineered statistical models and data cleansing routines using {items}."
    ],
    dutiesTemplates: [
      "Ensured data integrity and algorithmic accuracy through {items}.",
      "Extracted actionable business intelligence by executing {items}.",
      "Optimized query execution speed and database hygiene via practices across {items}.",
      "Validated predictive model accuracy and reporting precision by conducting {items}.",
      "Streamlined automated reporting schedules by maintaining {items}.",
      "Analyzed customer behavioral metrics and churn trends by performing {items}."
    ],
    impactTemplates: [
      "Transformed data into strategic business value, successfully {items}.",
      "Unlocked predictive insights and reporting automation, achieving {items}.",
      "Drove measurable analytical impact across department KPIs, resulting in {items}.",
      "Calculated significant efficiency gains including {items}.",
      "Hit benchmark model accuracy and prediction scores, successfully {items}.",
      "Saved substantial operational hours weekly, achieving {items}."
    ],
    projectDeliverablesTemplates: [
      "Constructed exploratory data analysis (EDA) and predictive project models encompassing {items}.",
      "Developed an interactive business intelligence project dashboard spanning {items}.",
      "Engineered automated ETL data pipeline project architectures focusing on {items}.",
      "Produced machine learning project evaluations and dataset classifications including {items}.",
      "Built a custom data analytics project solution incorporating {items}."
    ],
    projectToolkitTemplates: [
      "Built and executed data analysis project workflows leveraging {items}.",
      "Powered project data cleansing and statistical modeling using {items}.",
      "Driven by a data science project tech stack comprising {items}.",
      "Queried project datasets and published interactive dashboards with {items}."
    ],
    projectDutiesTemplates: [
      "Validated project statistical assumptions and data quality through {items}.",
      "Optimized database query performance for project reporting via {items}.",
      "Extracted key business correlation trends from project data by conducting {items}.",
      "Refined model hyper-parameters and feature engineering for this project via {items}."
    ],
    projectImpactTemplates: [
      "Successfully delivered actionable data project insights, achieving {items}.",
      "Achieved verified predictive accuracy scores for project models, successfully {items}.",
      "Published a live interactive data project dashboard, resulting in {items}.",
      "Hit major data intelligence benchmarks including {items}."
    ]
  },
  marketing: {
    category: 'marketing',
    deliverablesTemplates: [
      "Spearheaded high-converting growth channels and digital campaigns encompassing {items}.",
      "Orchestrated multi-channel user acquisition drives and marketing assets spanning {items}.",
      "Executed targeted growth initiatives and brand outreach focusing on {items}.",
      "Formulated performance marketing strategies and content campaigns including {items}.",
      "Designed outbound lead generation funnels and campaign structures around {items}.",
      "Driven organic search and paid ad campaign executions including {items}."
    ],
    toolkitTemplates: [
      "Driven by an analytical growth toolkit and ad platforms including {items}.",
      "Harnessed leading marketing tech and analytics platforms comprising {items}.",
      "Maximized campaign reach and conversion tracking utilizing {items}.",
      "Powered customer acquisition funnels leveraging {items}.",
      "Monitored campaign performance metrics and audience retargeting with {items}.",
      "Managed ad spend budgets and keyword optimization using {items}."
    ],
    dutiesTemplates: [
      "Optimized conversion funnels and ad creative performance through {items}.",
      "Maximized return on ad spend (ROAS) and brand presence by executing {items}.",
      "Refined lead acquisition pipelines and audience targeting via practices across {items}.",
      "Navigated market trends and campaign allocation by monitoring {items}.",
      "Conducting A/B split tests on landing pages and ad copy by managing {items}.",
      "Elevated organic search engine rankings and keyword authority by executing {items}."
    ],
    impactTemplates: [
      "Hit record user acquisition and revenue milestones, achieving {items}.",
      "Maximized marketing ROI and organic search visibility, successfully {items}.",
      "Drove explosive growth across target customer segments, resulting in {items}.",
      "Delivered measurable campaign performance including {items}.",
      "Lowered customer acquisition cost (CAC) significantly, achieving {items}.",
      "Generated high volumes of qualified business leads, successfully {items}."
    ],
    projectDeliverablesTemplates: [
      "Architected and launched digital growth project campaigns encompassing {items}.",
      "Designed and deployed multi-channel marketing project assets spanning {items}.",
      "Executed comprehensive promotional campaign project structures focusing on {items}.",
      "Constructed end-to-end user acquisition project funnels including {items}.",
      "Formulated performance marketing project blueprints incorporating {items}."
    ],
    projectToolkitTemplates: [
      "Executed campaign operations utilizing marketing tech platforms like {items}.",
      "Powered project analytics and ad tracking leveraging {items}.",
      "Driven by an integrated growth project toolkit comprising {items}.",
      "Built and monitored ad funnel metrics using platforms such as {items}."
    ],
    projectDutiesTemplates: [
      "Optimized project conversion funnels and ad copy variations through {items}.",
      "Managed daily campaign pacing and audience targeting by executing {items}.",
      "Refined ad acquisition workflows and channel distribution via {items}.",
      "Streamlined campaign asset delivery and budget allocation by conducting {items}."
    ],
    projectImpactTemplates: [
      "Exceeded campaign performance targets and audience growth benchmarks, achieving {items}.",
      "Delivered verified marketing project outcomes, successfully {items}.",
      "Drove measurable user acquisition and conversion lifts, resulting in {items}.",
      "Hit key campaign ROI milestones including {items}."
    ]
  },
  finance: {
    category: 'finance',
    deliverablesTemplates: [
      "Constructed robust financial models and compliance frameworks encompassing {items}.",
      "Formulated corporate valuation models and forecasting decks spanning {items}.",
      "Engineered quantitative financial analyses and statutory audit reports focusing on {items}.",
      "Spearheaded fiscal planning initiatives and budget reviews including {items}.",
      "Designed 3-statement financial evaluation models around {items}.",
      "Built automated financial reporting sheets including {items}."
    ],
    toolkitTemplates: [
      "Powered financial modeling and enterprise accounting utilizing {items}.",
      "Analyzed quantitative metrics and led ledger reconciliations with {items}.",
      "Utilized enterprise financial software suites comprising {items}.",
      "Leveraged high-precision financial systems including {items}.",
      "Managed corporate budgets and variance tracking using {items}.",
      "Constructed automated financial models leveraging {items}."
    ],
    dutiesTemplates: [
      "Guaranteed GAAP audit compliance and fiscal precision through {items}.",
      "Controlled operating overhead and variance margins by executing {items}.",
      "Maintained balance sheet accuracy and investment tracking via practices across {items}.",
      "Navigated regulatory requirements and capital allocation by conducting {items}.",
      "Audited departmental expense structures and procurement records by managing {items}.",
      "Streamlined monthly financial closing cycles by executing {items}."
    ],
    impactTemplates: [
      "Unlocked systemic financial value and overhead cost reductions, achieving {items}.",
      "Strengthened forecasting accuracy and audit compliance, successfully {items}.",
      "Drove measurable fiscal optimization across corporate accounts, resulting in {items}.",
      "Achieved key financial performance milestones including {items}.",
      "Secured 100% audit compliance pass rates, successfully {items}.",
      "Identified substantial operational savings, achieving {items}."
    ],
    projectDeliverablesTemplates: [
      "Constructed corporate valuation and financial modeling project files encompassing {items}.",
      "Developed operating budget variance and forecasting project models spanning {items}.",
      "Engineered financial KPI reporting dashboard project templates focusing on {items}.",
      "Produced statutory audit and tax compliance project binders including {items}.",
      "Built a custom corporate finance project evaluation model incorporating {items}."
    ],
    projectToolkitTemplates: [
      "Built and validated financial project formulas using tools like {items}.",
      "Powered project forecasting models and ledgers leveraging {items}.",
      "Driven by a financial analysis project software suite comprising {items}.",
      "Executed financial project evaluations utilizing platforms such as {items}."
    ],
    projectDutiesTemplates: [
      "Verified project financial formula accuracy and audit integrity through {items}.",
      "Streamlined project revenue forecasting and cost allocation via {items}.",
      "Analyzed financial risk factors for this project by conducting {items}.",
      "Controlled project CapEx and OpEx variance by executing {items}."
    ],
    projectImpactTemplates: [
      "Successfully delivered actionable financial project recommendations, achieving {items}.",
      "Guided M&A and investment decisions with verified models, successfully {items}.",
      "Hit target financial model precision scores, resulting in {items}.",
      "Highlighted substantial overhead savings including {items}."
    ]
  },
  law: {
    category: 'law',
    deliverablesTemplates: [
      "Drafted and negotiated complex commercial contracts and legal filings encompassing {items}.",
      "Formulated statutory compliance structures and agreement suites spanning {items}.",
      "Spearheaded legal due diligence, IP protection, and research binders focusing on {items}.",
      "Constructed regulatory risk assessment reports and legal documentation including {items}.",
      "Designed commercial SLA terms and corporate governance guidelines around {items}.",
      "Executed regulatory compliance audits including {items}."
    ],
    toolkitTemplates: [
      "Conducted statutory legal research and contract lifecycle management utilizing {items}.",
      "Leveraged specialized legal technology platforms comprising {items}.",
      "Executed regulatory compliance reviews using tools like {items}.",
      "Powered contract negotiation and legal research leveraging {items}.",
      "Managed legal document repositories and e-signatures with {items}.",
      "Audited regulatory privacy compliance using {items}."
    ],
    dutiesTemplates: [
      "Mitigated corporate legal exposure and verified statutory compliance through {items}.",
      "Navigated complex regulatory reviews and client negotiations by executing {items}.",
      "Safeguarded corporate intellectual property and contractual SLAs via practices across {items}.",
      "Evaluated case precedents and compliance documentation by conducting {items}.",
      "Standardized corporate contract risk templates by managing {items}.",
      "Resolved business litigation disputes and contract claims by executing {items}."
    ],
    impactTemplates: [
      "Safeguarded organizational integrity with zero regulatory violations, achieving {items}.",
      "Minimized legal liability and negotiated favorable commercial terms, successfully {items}.",
      "Drove strategic legal outcomes across high-stakes business initiatives, resulting in {items}.",
      "Secured 100% compliance audit clearance including {items}.",
      "Finalized extensive commercial vendor agreements, achieving {items}.",
      "Lowered contract review turnaround timelines, successfully {items}."
    ],
    projectDeliverablesTemplates: [
      "Compiled commercial contract template suites and legal project binders encompassing {items}.",
      "Developed data privacy compliance audit project documentation spanning {items}.",
      "Engineered litigation research binders and precedent analysis files focusing on {items}.",
      "Produced M&A due diligence review project packages including {items}.",
      "Built a standardized corporate legal risk project framework incorporating {items}."
    ],
    projectToolkitTemplates: [
      "Conducted legal research and project documentation utilizing {items}.",
      "Powered project contract management and statutory verification leveraging {items}.",
      "Driven by a legal operations project technology suite comprising {items}.",
      "Executed legal risk audits using specialized systems such as {items}."
    ],
    projectDutiesTemplates: [
      "Verified project contract term compliance and statutory risk through {items}.",
      "Streamlined legal research synthesis for this project via {items}.",
      "Mitigated legal exposure across project agreements by conducting {items}.",
      "Standardized legal clauses for project documentation by executing {items}."
    ],
    projectImpactTemplates: [
      "Successfully secured regulatory compliance clearance for project assets, achieving {items}.",
      "Delivered a standardized legal contract suite, successfully {items}.",
      "Hit 100% legal risk verification scores, resulting in {items}.",
      "Resolved complex business contract disputes including {items}."
    ]
  },
  hr: {
    category: 'hr',
    deliverablesTemplates: [
      "Championed end-to-end talent recruitment and people operations encompassing {items}.",
      "Orchestrated strategic workforce onboarding and retention initiatives spanning {items}.",
      "Steered organizational culture programs and HR policy frameworks focusing on {items}.",
      "Formulated talent acquisition strategies and employee management workflows including {items}.",
      "Designed compensation benchmarking and benefits administration programs around {items}.",
      "Executed technical candidate sourcing drives including {items}."
    ],
    toolkitTemplates: [
      "Streamlined talent pipelines and employee records utilizing systems like {items}.",
      "Leveraged enterprise HRIS platforms and ATS software comprising {items}.",
      "Managed candidate sourcing and performance evaluations using {items}.",
      "Powered workforce logistics leveraging tools such as {items}.",
      "Tracked recruitment pipelines and employee satisfaction metrics with {items}.",
      "Coordinated onboarding workflows using {items}."
    ],
    dutiesTemplates: [
      "Fostered employee retention and labor law compliance through {items}.",
      "Navigated workforce relations and candidate screening by executing {items}.",
      "Streamlined new-hire ramp times and performance reviews via practices across {items}.",
      "Elevated employee engagement and organizational alignment by managing {items}.",
      "Monitored payroll accuracy and HRIS database updates by conducting {items}.",
      "Organized corporate employer branding events by managing {items}."
    ],
    impactTemplates: [
      "Transformed organizational talent metrics and hiring speed, achieving {items}.",
      "Elevated workforce retention and employee satisfaction scores, successfully {items}.",
      "Drove measurable people operations milestones across enterprise squads, resulting in {items}.",
      "Reduced cost-per-hire and ramp timelines including {items}.",
      "Hired high volumes of technical candidates, successfully {items}.",
      "Lowered annual employee turnover metrics, achieving {items}."
    ],
    projectDeliverablesTemplates: [
      "Orchestrated technical sourcing recruitment project campaigns encompassing {items}.",
      "Developed automated employee onboarding workflow project frameworks spanning {items}.",
      "Engineered employee retention and pulse survey project modules focusing on {items}.",
      "Produced workforce policy manual project documentation suites including {items}.",
      "Built a comprehensive talent acquisition project framework incorporating {items}."
    ],
    projectToolkitTemplates: [
      "Executed project talent sourcing and candidate tracking utilizing {items}.",
      "Powered project onboarding workflows and surveys leveraging {items}.",
      "Driven by an HR project systems software suite comprising {items}.",
      "Managed workforce project data using platforms such as {items}."
    ],
    projectDutiesTemplates: [
      "Validated candidate qualification fit for project roles through {items}.",
      "Streamlined new-hire onboarding steps for this project via {items}.",
      "Evaluated employee feedback and survey metrics for this project by conducting {items}.",
      "Standardized job descriptions and compensation tiers by executing {items}."
    ],
    projectImpactTemplates: [
      "Successfully expanded qualified candidate pipelines, achieving {items}.",
      "Delivered an improved employee onboarding framework, successfully {items}.",
      "Hit target workforce satisfaction metrics, resulting in {items}.",
      "Reduced new-hire time-to-productivity benchmarks including {items}."
    ]
  },
  mba: {
    category: 'mba',
    deliverablesTemplates: [
      "Steered strategic product roadmaps and agile cross-functional execution encompassing {items}.",
      "Formulated Go-To-Market (GTM) launch strategies and sprint boards spanning {items}.",
      "Orchestrated business process optimizations and executive pitch decks focusing on {items}.",
      "Spearheaded strategic product initiatives and market expansion plans including {items}.",
      "Designed product requirements documents (PRDs) and features around {items}.",
      "Executed market competitive analyses and agile sprint frameworks including {items}."
    ],
    toolkitTemplates: [
      "Managed agile product delivery and sprint tracking using enterprise tools like {items}.",
      "Driven by strategic product planning and analytics platforms comprising {items}.",
      "Steered cross-functional alignment and roadmap visualization leveraging {items}.",
      "Utilized business intelligence and project management platforms such as {items}.",
      "Monitored product analytics and feature usage with {items}.",
      "Aligned stakeholder communications using {items}."
    ],
    dutiesTemplates: [
      "Accelerated feature velocity and market time-to-delivery through {items}.",
      "Aligned executive stakeholders and sprint engineering squads by executing {items}.",
      "Supervised product backlog prioritization and customer feedback via practices across {items}.",
      "Formulated strategic business requirement documents (PRDs) by managing {items}.",
      "Evaluated pricing strategies and user acquisition channels by conducting {items}.",
      "Navigated cross-functional sprint planning sessions by managing {items}."
    ],
    impactTemplates: [
      "Captured substantial market share and accelerated sprint delivery, achieving {items}.",
      "Exceeded corporate strategic targets and product adoption goals, successfully {items}.",
      "Drove measurable business expansion across core product lines, resulting in {items}.",
      "Delivered key executive milestones including {items}.",
      "Lowered user churn rates significantly, achieving {items}.",
      "Acquired thousands of initial product trial users, successfully {items}."
    ],
    projectDeliverablesTemplates: [
      "Formulated Product Launch GTM Strategy Blueprint project roadmaps encompassing {items}.",
      "Developed Market Expansion Feasibility Study project decks spanning {items}.",
      "Engineered Operations Optimization Workflow project architectures focusing on {items}.",
      "Produced comprehensive Product Requirements Document (PRD) project packages including {items}.",
      "Built a strategic business expansion project framework incorporating {items}."
    ],
    projectToolkitTemplates: [
      "Executed product management project tracking utilizing {items}.",
      "Powered project roadmap visualization and analytics leveraging {items}.",
      "Driven by an agile project leadership suite comprising {items}.",
      "Managed product sprint project backlog items using tools like {items}."
    ],
    projectDutiesTemplates: [
      "Validated project market feasibility and user demand through {items}.",
      "Streamlined cross-functional squad coordination for this project via {items}.",
      "Prioritized project feature requests based on RICE scoring by conducting {items}.",
      "Aligned project milestones with executive leadership expectations by executing {items}."
    ],
    projectImpactTemplates: [
      "Successfully secured executive leadership approval for project roadmaps, achieving {items}.",
      "Delivered product launch milestones ahead of schedule, successfully {items}.",
      "Hit key market penetration targets, resulting in {items}.",
      "Expanded strategic business reach metrics including {items}."
    ]
  },
  general: {
    category: 'general',
    deliverablesTemplates: [
      "Coordinated core operational workflows and organizational initiatives encompassing {items}.",
      "Formulated Standard Operating Procedures (SOPs) and status decks spanning {items}.",
      "Supervised project milestone tracking and client communication logs focusing on {items}.",
      "Executed cross-departmental coordination tasks including {items}.",
      "Organized corporate event logistics and inventory records around {items}.",
      "Built automated operational status trackers including {items}."
    ],
    toolkitTemplates: [
      "Maintained operational productivity using workspace platforms like {items}.",
      "Utilized enterprise office software and collaboration tools comprising {items}.",
      "Managed team schedules and project boards leveraging {items}.",
      "Powered daily operations using productivity platforms such as {items}.",
      "Tracked team deliverables using {items}.",
      "Coordinated client communications with {items}."
    ],
    dutiesTemplates: [
      "Maintained operational excellence and milestone alignment through {items}.",
      "Streamlined administrative workflows and support logistics by executing {items}.",
      "Enhanced client inquiry resolution and supplier records via practices across {items}.",
      "Sustained project schedules by actively managing {items}.",
      "Audited team scheduling accuracy by conducting {items}.",
      "Facilitated internal communication logs by maintaining {items}."
    ],
    impactTemplates: [
      "Elevated team operational efficiency and delivery speed, achieving {items}.",
      "Reduced administrative delays and improved customer satisfaction, successfully {items}.",
      "Drove measurable operational impact across daily team workflows, resulting in {items}.",
      "Achieved key organizational milestones including {items}.",
      "Saved hours weekly in manual reporting, successfully {items}.",
      "Elevated client satisfaction scores, achieving {items}."
    ],
    projectDeliverablesTemplates: [
      "Compiled Standard Operating Procedure (SOP) project documentation suites encompassing {items}.",
      "Developed Project Milestone Tracking Dashboard project templates spanning {items}.",
      "Engineered Client Support Knowledge Base File project archives focusing on {items}.",
      "Produced operational logistics project binders including {items}.",
      "Built a customized team coordination project framework incorporating {items}."
    ],
    projectToolkitTemplates: [
      "Executed project tracking and task organization utilizing {items}.",
      "Powered project documentation and team communication leveraging {items}.",
      "Driven by an operational project management software suite comprising {items}.",
      "Managed project schedules using productivity tools like {items}."
    ],
    projectDutiesTemplates: [
      "Verified project milestone completion and task accuracy through {items}.",
      "Streamlined administrative updates for this project via {items}.",
      "Resolved operational bottlenecks across project deliverables by conducting {items}.",
      "Maintained project documentation clarity by executing {items}."
    ],
    projectImpactTemplates: [
      "Successfully completed project milestones on schedule, achieving {items}.",
      "Delivered a streamlined operational workflow system, successfully {items}.",
      "Hit target internal team collaboration benchmarks, resulting in {items}.",
      "Improved operational output metrics including {items}."
    ]
  }
};

export function getWritingProfile(categoryKey: string): DomainWritingProfile {
  const key = (categoryKey || '').toLowerCase();
  return WRITING_PROFILES[key] || WRITING_PROFILES['general'];
}

export function formatItemList(items: string[]): string {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0].toLowerCase();
  if (items.length === 2) return `${items[0].toLowerCase()} and ${items[1].toLowerCase()}`;
  const head = items.slice(0, -1).map(i => i.toLowerCase()).join(', ');
  return `${head}, and ${items[items.length - 1].toLowerCase()}`;
}
