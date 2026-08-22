import { useState, useEffect, useMemo } from "react"

/* ──────────────────────── TYPES & DATA ──────────────────────── */

export interface Article {
  id: number
  section: "Pharma" | "MedTech" | "AI-Health"
  category: string
  title: string
  byline: string
  authorRole: string
  date: string
  readTime: string
  audioTime: string
  audioDurationSec: number
  excerpt: string
  body: string[]
  pullQuote?: string
  hero?: boolean
  featured?: boolean
  cSuiteSummary: string[]
  keyMetrics?: { label: string; value: string }[]
}

const articles: Article[] = [
  {
    id: 1,
    section: "Pharma",
    category: "Cover Story",
    title: "FDA's Draft Guidance on AI-Enabled Diagnostics: What Every Regulatory Affairs Lead Needs to Know",
    byline: "Dr. Priya Nair",
    authorRole: "VP Regulatory Affairs, Pfizer",
    date: "Aug 12, 2026",
    readTime: "8 min",
    audioTime: "5 min 40s",
    audioDurationSec: 340,
    excerpt: "The agency's proposed framework shifts from device-centric oversight to algorithm-centric governance, fundamentally changing how your team files 510(k) submissions for software-based diagnostic tools.",
    body: [
      "The FDA's draft guidance on AI-enabled diagnostics, published in late July, represents the most significant regulatory realignment in the diagnostics space since CLIA 1988. For regulatory affairs teams across pharma and medtech, the implications extend well beyond a simple compliance update.",
      "At the core of the guidance is a fundamental shift in how the agency evaluates software-based diagnostic tools. The traditional 510(k) pathway — designed around static, device-centric review — is being supplemented by a new algorithm-centric governance framework that requires continuous performance monitoring, real-world validation datasets, and post-market surveillance obligations that did not exist under the previous paradigm.",
      "Three specific provisions demand immediate attention from regulatory leads. First, the requirement for predetermined change control plans (PCCPs) means your team must document not just what the algorithm does today, but how it is expected to evolve over time — including retraining triggers, performance degradation thresholds, and rollback procedures.",
      "Second, the guidance introduces a tiered risk classification system specifically for AI/ML-based SaMD (Software as a Medical Device). High-risk applications — those informing treatment decisions or operating in critical care contexts — will face substantially more rigorous pre-market evidence requirements than lower-risk screening or triage tools.",
      "Third, and perhaps most operationally disruptive, the FDA now expects manufacturers to establish real-world performance monitoring programs that continuously validate algorithm accuracy against diverse patient populations. This is not optional — it is a condition of market authorization.",
      "For most organizations, compliance will require cross-functional coordination between regulatory affairs, data science, quality assurance, and clinical operations that simply does not exist today. The comment window closes on October 15, 2026. Industry participation in shaping the final guidance is not just advisable — it is essential.",
    ],
    pullQuote: "The shift from device-centric to algorithm-centric oversight is the most significant regulatory realignment in diagnostics since CLIA 1988.",
    hero: true,
    cSuiteSummary: [
      "FDA moves from device-centric to algorithm-centric 510(k) submissions.",
      "Mandatory Predetermined Change Control Plans (PCCPs) required for algorithm updates.",
      "Oct 15, 2026 deadline for public industry comments."
    ],
    keyMetrics: [
      { label: "PCCP Mandate", value: "100% SaMD" },
      { label: "Comment Deadline", value: "Oct 15, 2026" },
      { label: "Risk Tier", value: "Tier 1 High-Risk" }
    ]
  },
  {
    id: 2,
    section: "Pharma",
    category: "IP & Strategy",
    title: "CRISPR Patent Landscape Q3 2026: Who Holds the Keys to the Next Wave",
    byline: "Marcus Osei-Bonsu",
    authorRole: "Senior Director BD, Medtronic",
    date: "Aug 8, 2026",
    readTime: "5 min",
    audioTime: "4 min 10s",
    audioDurationSec: 250,
    excerpt: "Three licensing pools are reshaping the competitive dynamics around base-editing IP. A structured breakdown of the Broad, UC Berkeley, and Intellia positions.",
    body: [
      "The CRISPR patent landscape has entered a new phase of complexity. As of Q3 2026, three distinct licensing pools have emerged, each controlling different slices of the gene-editing IP stack that will determine who can commercialize next-generation base-editing and prime-editing therapies.",
      "The Broad Institute's portfolio remains the largest single holder of foundational CRISPR-Cas9 patents in the US, but its dominance is increasingly qualified by UC Berkeley's strengthening position in base-editing applications and Intellia Therapeutics' growing in-vivo delivery IP.",
      "For BD teams evaluating licensing opportunities, the practical implication is that no single license provides freedom to operate across the full therapeutic pipeline. Base editing requires stacking licenses from at least two pools, and prime editing — increasingly seen as the more clinically viable approach for point mutations — adds a third layer of complexity.",
      "Three trends are worth tracking through Q4: the resolution of the ongoing EPO opposition proceedings that could reshape European IP boundaries, the anticipated licensing terms from Beam Therapeutics' expanded portfolio, and Verve Therapeutics' in-vivo cardiovascular programs that will stress-test the delivery IP landscape.",
    ],
    pullQuote: "No single license provides freedom to operate across the full therapeutic pipeline. Base editing requires stacking licenses from at least two pools.",
    cSuiteSummary: [
      "No single license grants total freedom to operate (FTO) for base editing.",
      "Stacking licenses across Broad, UC Berkeley, and Intellia is now standard.",
      "Watch EPO opposition outcomes in Q4 for European market clearance."
    ],
    keyMetrics: [
      { label: "IP Pools", value: "3 Primary" },
      { label: "Royalty Stack", value: "4.5% - 8.2%" },
      { label: "Primary Vector", value: "Base-Editing" }
    ]
  },
  {
    id: 3,
    section: "Pharma",
    category: "Commercial",
    title: "GLP-1 Pipeline Crowding: Differentiation Strategies for Late Entrants",
    byline: "Roshni Kapoor",
    authorRole: "Head of Market Access, Novo Nordisk India",
    date: "Jul 28, 2026",
    readTime: "7 min",
    audioTime: "5 min 15s",
    audioDurationSec: 315,
    excerpt: "With 40+ molecules now in Phase II, the commercial question is no longer efficacy — it is formulary access, dosing convenience, and co-morbidity labeling.",
    body: [
      "The GLP-1 receptor agonist space has crossed the inflection point from innovation to commoditization risk. With over 40 molecules now in Phase II clinical development, the commercial battleground has shifted from demonstrating efficacy — which most candidates will achieve — to the harder questions of formulary positioning, dosing convenience, and co-morbidity labeling advantages.",
      "For late entrants, the strategic window is narrowing but not closed. Three differentiation vectors remain viable: oral formulation (eliminating the injection barrier that still limits adoption in price-sensitive markets), multi-indication labeling (combining obesity with NASH, cardiovascular outcomes, or CKD), and manufacturing cost advantages that enable aggressive pricing in emerging markets.",
      "India represents a particularly interesting market for GLP-1 differentiation. With an estimated 101 million diabetics and rapidly adoption of GLP-1 therapies in the private sector, the market is large enough to support multiple entrants — but only for those who can navigate the pricing dynamics of a market where out-of-pocket spending dominates.",
    ],
    pullQuote: "With over 40 molecules in Phase II, the commercial battleground has shifted from efficacy to formulary positioning and dosing convenience.",
    cSuiteSummary: [
      "40+ Phase II molecules create high risk of product commoditization.",
      "Oral formulations & multi-indication labeling offer the strongest moat.",
      "India's 101M diabetic population represents a huge private out-of-pocket growth market."
    ],
    keyMetrics: [
      { label: "Phase II Pipeline", value: "42 Molecules" },
      { label: "Target Market (IN)", value: "101M Patients" },
      { label: "Format Focus", value: "Oral Small Mol" }
    ]
  },
  {
    id: 4,
    section: "Pharma",
    category: "Manufacturing",
    title: "mRNA Platform Scalability: Supply Chain Constraints Ahead of the 2027 Pandemic Preparedness Window",
    byline: "Ananya Krishnamurthy",
    authorRole: "Director Regulatory, AstraZeneca",
    date: "Aug 3, 2026",
    readTime: "6 min",
    audioTime: "4 min 30s",
    audioDurationSec: 270,
    excerpt: "LNP lipid shortages and fill-finish capacity constraints will affect all but the most vertically integrated manufacturers within 18 months.",
    body: [
      "The mRNA manufacturing supply chain faces a convergence of constraints that will test even the most well-capitalized producers. LNP (lipid nanoparticle) excipient supply — already tight following the pandemic-era scale-up — is approaching critical shortage levels as multiple companies simultaneously ramp pandemic preparedness stockpile programs.",
      "Three specific bottleneck points demand attention. First, ionizable lipid production capacity is concentrated in fewer than five global manufacturers, all of whom are operating at or near maximum throughput. Second, fill-finish capacity for mRNA products requires specialized aseptic lines that cannot be easily repurposed from traditional biologics manufacturing.",
      "Third, the analytical testing requirements for mRNA products — particularly regarding lipid nanoparticle characterization and mRNA integrity — create quality control bottlenecks that are as constraining as physical manufacturing capacity.",
      "For supply chain leaders, the implication is clear: vertical integration of at least one critical input (either LNP production or fill-finish) is transitioning from a strategic preference to an operational necessity. Companies that defer this decision through 2027 risk being unable to meet pandemic preparedness contract obligations.",
    ],
    cSuiteSummary: [
      "Ionizable lipid supply concentrated among under 5 global producers.",
      "Vertical integration of LNP or fill-finish lines is becoming mandatory.",
      "Preparedness contracts risk default without secured 18-month raw buffer."
    ],
    keyMetrics: [
      { label: "LNP Suppliers", value: "< 5 Global" },
      { label: "Lead Time", value: "14 Months" },
      { label: "Capacity Deficit", value: "35% by 2027" }
    ]
  },
  {
    id: 5,
    section: "MedTech",
    category: "Investment",
    title: "MedTech VC Deal Flow: $2.3B Deployed in Surgical Robotics Since January",
    byline: "Tanvir Hussain",
    authorRole: "Investment Manager, Sofinnova Partners",
    date: "Aug 5, 2026",
    readTime: "4 min",
    audioTime: "3 min 15s",
    audioDurationSec: 195,
    excerpt: "Laparoscopic autonomy and haptic-feedback systems dominated Q1-Q2 deployment. What the deal structures reveal about investor conviction.",
    body: [
      "Surgical robotics has absorbed $2.3 billion in venture capital deployment through the first seven months of 2026, making it the single largest MedTech investment category by a substantial margin. The concentration of capital in two sub-segments — laparoscopic autonomy and haptic feedback systems — reveals where sophisticated investors believe the next platform shifts will occur.",
      "Three deal structures from Q2 are worth dissecting for what they signal about investor conviction. First, the $180M Series C in a Bengaluru-based laparoscopic robotics company that priced at a $1.2B valuation — a clear bet that India's surgical infrastructure modernization will create a massive domestic market for cost-optimized robotic systems.",
      "Second, the $95M crossover round for a haptic feedback startup whose technology enables surgeons to feel tissue resistance through robotic instruments — a capability that addresses the single largest adoption barrier for robotic surgery among experienced surgeons who rely on tactile feedback.",
      "Third, a $60M strategic investment from a major medtech incumbent into an AI-guided surgical planning platform, structured as a convertible note with milestone-based triggers tied to FDA 510(k) clearance — a deal structure that protects downside while preserving upside in a regulatory-dependent asset.",
    ],
    cSuiteSummary: [
      "$2.3B deployed YTD across laparoscopic autonomy and tactile haptic feedback.",
      "Bengaluru startup hit $1.2B valuation catering to cost-optimized hospital systems.",
      "Strategic convertible notes are hedging regulatory clearance milestones."
    ],
    keyMetrics: [
      { label: "YTD Deployment", value: "$2.3 Billion" },
      { label: "Top Sub-sector", value: "Haptic Autonomy" },
      { label: "Avg Round Size", value: "$85 Million" }
    ]
  },
  {
    id: 6,
    section: "MedTech",
    category: "Policy",
    title: "EU AI Act Implications for In Vitro Diagnostics: A 12-Month Compliance Roadmap",
    byline: "Dr. Johan Van der Berg",
    authorRole: "VP Clinical Operations, IQVIA",
    date: "Jul 22, 2026",
    readTime: "9 min",
    audioTime: "6 min 50s",
    audioDurationSec: 410,
    excerpt: "High-risk AI system classifications under Annex III will capture most next-generation IVD platforms. The window for conformity assessment is narrowing.",
    body: [
      "The EU AI Act's high-risk classification framework, as detailed in Annex III, will capture the majority of next-generation in-vitro diagnostic (IVD) platforms that incorporate any form of AI or machine learning in their analytical pipeline. For IVD manufacturers targeting the European market, the 12-month compliance window is now active.",
      "The practical compliance burden breaks into four workstreams. First, establishing a quality management system that meets the Act's specific requirements for AI system development — this is not the same as your existing ISO 13485 QMS and cannot simply be bolted on.",
      "Second, implementing the mandatory human oversight mechanisms that the Act requires for all high-risk AI systems. For IVD platforms, this means documenting exactly how human review interacts with algorithmic output at every stage of the diagnostic workflow.",
      "Third, building the post-market monitoring infrastructure required to continuously assess AI system performance against the conformity assessment benchmarks. This includes drift detection, bias auditing across demographic subgroups, and incident reporting within prescribed timelines.",
      "Fourth, preparing technical documentation that meets the Act's transparency requirements — including the provision of clear, comprehensible explanations of how the AI system reaches its conclusions, written for both healthcare professionals and patients.",
    ],
    pullQuote: "Your existing ISO 13485 QMS cannot simply be bolted on to meet the AI Act's requirements. A parallel quality management workstream is required.",
    cSuiteSummary: [
      "Annex III captures most AI/ML IVD platforms as High-Risk AI systems.",
      "Parallel QMS required alongside standard ISO 13485.",
      "Continuous algorithmic drift detection & human oversight logs mandatory."
    ],
    keyMetrics: [
      { label: "Compliance Window", value: "12 Months" },
      { label: "QMS Requirement", value: "Annex III Dual" },
      { label: "Audit Threshold", value: "High Risk Tier" }
    ]
  },
  {
    id: 7,
    section: "AI-Health",
    category: "Deep Dive",
    title: "Foundation Models in Drug Discovery: Where Hype Ends and Real Value Begins",
    byline: "Dr. Vikram Malhotra",
    authorRole: "Chief Medical Officer, Sun Pharma",
    date: "Aug 10, 2026",
    readTime: "10 min",
    audioTime: "7 min 20s",
    audioDurationSec: 440,
    excerpt: "After two years of pilot programs, the pharma industry has enough data to separate foundation model applications that deliver real value from those that remain research curiosities.",
    body: [
      "Two years into the pharma industry's large-scale experimentation with foundation models for drug discovery, enough data now exists to draw meaningful distinctions between applications that deliver measurable value and those that remain in the realm of research curiosity. The picture is more nuanced than either the hype or the backlash suggests.",
      "Three applications have demonstrated clear, reproducible value. First, molecular property prediction — foundation models trained on large chemical corpora consistently outperform traditional QSAR methods in predicting ADMET properties, reducing the number of compounds that need to be synthesized and tested by 30-40%.",
      "Second, target identification through literature mining — foundation models that ingest the full biomedical literature can surface novel target-disease associations that human literature review misses, with several programs now in preclinical validation based entirely on AI-identified targets.",
      "Third, clinical trial design optimization — foundation models applied to historical trial data can predict enrollment challenges, protocol amendments, and site selection issues with sufficient accuracy to meaningfully reduce trial timelines.",
      "Two applications, however, have not yet delivered on their promises. De novo molecule generation — while scientifically impressive — has not yet produced a single candidate that has progressed beyond early preclinical stages, primarily because the generated molecules lack the developability properties that medicinal chemists intuitively incorporate. And toxicity prediction from molecular structure alone, despite impressive benchmark performance, has not reduced attrition rates in practice because in-vivo toxicity involves systemic interactions that no current model captures adequately.",
    ],
    pullQuote: "Foundation models for molecular property prediction consistently reduce the number of compounds needing synthesis by 30-40%. That is real value.",
    featured: true,
    cSuiteSummary: [
      "ADMET molecular property prediction reduces synthesis costs by 30-40%.",
      "Literature-mining foundation models successfully surfacing novel validated targets.",
      "De novo generation still lagging in developability & preclinical transition."
    ],
    keyMetrics: [
      { label: "Synthesis Reduction", value: "30-40%" },
      { label: "Proven ROI", value: "ADMET & Mining" },
      { label: "De Novo Attrition", value: "High Preclinical" }
    ]
  },
  {
    id: 8,
    section: "AI-Health",
    category: "Clinical",
    title: "Digital Therapeutics Reimbursement in India: The Policy Shift That Changes Everything",
    byline: "Dr. Leila Ahmadi",
    authorRole: "Head Medical Affairs, Roche Diagnostics India",
    date: "Aug 1, 2026",
    readTime: "6 min",
    audioTime: "4 min 45s",
    audioDurationSec: 285,
    excerpt: "IRDAI's draft framework for digital therapeutic reimbursement creates the first viable commercial pathway for prescription digital health interventions in India.",
    body: [
      "The Insurance Regulatory and Development Authority of India (IRDAI) has published a draft framework for the reimbursement of prescription digital therapeutics (DTx), creating — for the first time — a viable commercial pathway for evidence-based digital health interventions in the Indian market.",
      "The framework establishes three reimbursement tiers based on the level of clinical evidence supporting the DTx product. Tier 1 (highest reimbursement) requires randomized controlled trial evidence with clinically meaningful endpoints. Tier 2 accepts real-world evidence from prospective registries. Tier 3 covers wellness and behavioral interventions with lower evidence thresholds.",
      "For DTx developers, the framework's most consequential provision is the requirement for interoperability standards — all reimbursable DTx products must integrate with India's Ayushman Bharat Digital Mission (ABDM) health stack. This creates a structural advantage for companies that have already built on ABDM-compliant architectures.",
      "The market implications are significant. India's private health insurance market, covering approximately 500 million lives, represents the largest potential DTx reimbursement market in the world by covered population. The framework, if adopted substantially as drafted, will catalyze a wave of DTx investment and clinical validation programs through 2027-2028.",
    ],
    cSuiteSummary: [
      "IRDAI draft framework opens prescription reimbursement across 500M insured lives.",
      "3-Tier evidence structure (RCTs required for Tier 1 top reimbursement).",
      "Mandatory integration with Ayushman Bharat Digital Mission (ABDM) stack."
    ],
    keyMetrics: [
      { label: "Covered Population", value: "500 Million" },
      { label: "Reimb. Tiers", value: "3 Tiers (RCT focus)" },
      { label: "Tech Requirement", value: "ABDM Native" }
    ]
  },
  {
    id: 9,
    section: "AI-Health",
    category: "Data",
    title: "Synthetic Data for Clinical Trials: Regulatory Acceptance Is Closer Than You Think",
    byline: "Dr. Arun Sharma",
    authorRole: "Principal Scientist, Biocon Biologics",
    date: "Jul 18, 2026",
    readTime: "7 min",
    audioTime: "5 min 10s",
    audioDurationSec: 310,
    excerpt: "Both FDA and EMA have published draft positions on synthetic control arms. The convergence of their approaches signals imminent regulatory acceptance.",
    body: [
      "Synthetic data in clinical trials — particularly synthetic control arms (SCAs) — has crossed a critical threshold from theoretical discussion to active regulatory consideration. Both the FDA and EMA have published draft positions on the acceptable use of synthetic controls, and the convergence of their approaches signals that formal regulatory acceptance is closer than most industry participants expect.",
      "The FDA's position, articulated in a May 2026 discussion paper, accepts synthetic control arms for rare disease indications where traditional external controls are impractical, provided the synthetic data is generated from a clearly documented generative model trained on historical patient-level data with explicit provenance.",
      "The EMA's position, published in June 2026, goes further — accepting synthetic controls for orphan drug applications where patient populations are fewer than 5,000 globally, with the additional requirement that the synthetic model undergo independent validation by a qualified third party.",
      "For clinical operations teams, the practical next step is establishing the data governance infrastructure required to support synthetic data generation with full auditability. This means maintaining version-controlled training datasets, documented model architectures, and reproducible generation pipelines that regulators can inspect.",
    ],
    pullQuote: "Both FDA and EMA accept synthetic controls for rare diseases where traditional external controls are impractical. Regulatory convergence is accelerating.",
    cSuiteSummary: [
      "FDA & EMA converging on Synthetic Control Arm (SCA) approvals for rare diseases.",
      "EMA requires third-party validation for synthetic models under 5,000 global cases.",
      "Audit-ready data provenance pipeline required for submission."
    ],
    keyMetrics: [
      { label: "FDA/EMA Status", value: "Draft Harmonized" },
      { label: "Target Area", value: "Rare & Orphan" },
      { label: "Cost Saving", value: "45% Trial Arm" }
    ]
  },
  {
    id: 10,
    section: "MedTech",
    category: "Interview",
    title: "\"The Operating Room of 2030 Will Be Unrecognizable\" — A Conversation with Dr. Kavita Sharma",
    byline: "Meridian Editorial Team",
    authorRole: "Meridian Life Sciences",
    date: "Aug 14, 2026",
    readTime: "12 min",
    audioTime: "8 min 45s",
    audioDurationSec: 525,
    excerpt: "Dr. Kavita Sharma, Chief of Surgical Innovation at Apollo Hospitals, on why autonomous surgical systems are closer than the industry admits — and what that means for the medtech ecosystem.",
    body: [
      "Dr. Kavita Sharma has spent the last fifteen years at the intersection of surgical practice and technology adoption. As Chief of Surgical Innovation at Apollo Hospitals, she oversees one of Asia's largest surgical robotics programs and has personally performed over 800 robotic-assisted procedures.",
      "Meridian sat down with Dr. Sharma to discuss where surgical robotics is heading, why the operating room of 2030 will look fundamentally different, and what medtech companies need to understand about surgeon adoption dynamics.",
      "On the state of current surgical robotics: \"We're still in the teleoperation era. The surgeon is essentially a very expensive joystick operator. The robots are precise, yes, but they have no understanding of the surgical field. That changes with the next generation of systems that incorporate computer vision and real-time tissue characterization.\"",
      "On autonomous surgical capabilities: \"Level 3 autonomy — where the system performs specific surgical tasks under surgeon supervision — will be commercially available within four years. I've seen the prototypes. They can suture more consistently than any human surgeon, and they don't get tired during a 12-hour procedure. The regulatory pathway is the bottleneck, not the technology.\"",
      "On surgeon adoption: \"The biggest barrier isn't technology — it's identity. Surgeons define themselves by their manual skill. Asking them to supervise a robot instead of operating directly is an identity challenge, not a training challenge. The companies that solve this — that make surgeons feel like commanders rather than bystanders — will win the market.\"",
      "On the medtech ecosystem in India: \"India has a unique advantage. We have surgical volumes that no Western health system can match — which means more training data, more edge cases, more validation opportunities. The company that builds the best autonomous surgical system will likely be trained on Indian surgical data.\"",
    ],
    pullQuote: "Level 3 surgical autonomy will be commercially available within four years. The regulatory pathway is the bottleneck, not the technology.",
    cSuiteSummary: [
      "Level 3 autonomous surgical task completion expected commercially by 2030.",
      "Surgeon identity perception (commander vs operator) is the main adoption hurdle.",
      "India's surgical volume provides world-leading validation datasets for AI model training."
    ],
    keyMetrics: [
      { label: "Autonomy Forecast", value: "Level 3 by 2030" },
      { label: "Key Adoption Barrier", value: "Surgeon Identity" },
      { label: "Data Advantage", value: "High IN Volume" }
    ]
  },
]

const digests = [
  { label: "Gene Therapy Digest", date: "Aug 2026", unread: 3, items: 12 },
  { label: "AI in Drug Discovery", date: "Aug 2026", unread: 1, items: 8 },
  { label: "Regulatory Roundup", date: "Jul 2026", unread: 0, items: 15 },
  { label: "Clinical Ops Briefing", date: "Jul 2026", unread: 2, items: 9 },
  { label: "MedTech Investment", date: "Aug 2026", unread: 4, items: 11 },
  { label: "Digital Health Pulse", date: "Aug 2026", unread: 1, items: 7 },
]

const contributors = [
  { name: "Dr. Priya Nair", org: "Pfizer", topic: "Regulatory AI", articles: 4 },
  { name: "Marcus Osei-Bonsu", org: "Medtronic", topic: "IP Strategy", articles: 2 },
  { name: "Ananya Krishnamurthy", org: "AstraZeneca", topic: "mRNA Supply", articles: 3 },
  { name: "Roshni Kapoor", org: "Novo Nordisk", topic: "Commercial Strategy", articles: 5 },
  { name: "Dr. Vikram Malhotra", org: "Sun Pharma", topic: "AI Drug Discovery", articles: 6 },
  { name: "Dr. Johan Van der Berg", org: "IQVIA", topic: "Clinical Policy", articles: 2 },
]

const EDITORS_LETTER = {
  title: "The Intelligence Layer",
  body: "Welcome to Issue 24 of Meridian Life Sciences. This month, we examine the regulatory seismic shifts reshaping AI-enabled diagnostics, the converging patent landscapes in gene editing, and the emerging evidence on where foundation models deliver real value in drug discovery. Our cover story by Dr. Priya Nair dissects the FDA's draft guidance on AI diagnostics — required reading for every regulatory affairs team. We also feature a rare interview with Dr. Kavita Sharma on the future of autonomous surgery. As always, your matches drop on September 1.",
  signoff: "— The Meridian Editorial Team",
}

/* ──────────────────────── BESPOKE DYNAMIC GRAPHICS ──────────────────────── */

const DynamicArticleGraphic = ({ articleId }: { articleId: number }) => {
  const [activeStep, setActiveStep] = useState(0)

  // 1. FDA AI Diagnostic PCCP Lifecycle
  if (articleId === 1) {
    const steps = [
      { label: "1. 510(k) Submission", detail: "Initial baseline algorithm training & intended use bounds." },
      { label: "2. PCCP Protocol", detail: "Predetermined Change Control Plan defining retraining triggers." },
      { label: "3. Continuous Validation", detail: "Real-world dataset comparison & drift prevention." },
      { label: "4. Post-Market Audit", detail: "Mandatory FDA reporting log & safety thresholds." }
    ]
    return (
      <div className="bg-[#121417] p-5 rounded-sm text-white flex flex-col justify-between h-full relative overflow-hidden">
        <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#D4A373]">FDA AI Regulatory Flow</span>
          <span className="text-[10px] text-white/50">Interactive Lifecycle</span>
        </div>
        <div className="grid grid-cols-4 gap-2 my-2">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setActiveStep(idx); }}
              className={`p-2 rounded text-left transition-all border ${
                activeStep === idx
                  ? "bg-[#D4A373]/20 border-[#D4A373] text-[#D4A373]"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
              }`}
            >
              <div className="text-[10px] font-semibold">{step.label}</div>
            </button>
          ))}
        </div>
        <div className="bg-white/5 p-3 rounded border border-white/10 mt-2">
          <div className="text-[11px] font-semibold text-[#D4A373] mb-1">{steps[activeStep].label}</div>
          <div className="text-[11px] text-white/80 leading-relaxed">{steps[activeStep].detail}</div>
        </div>
      </div>
    )
  }

  // 2. CRISPR Patent License Stack Node Graph
  if (articleId === 2) {
    return (
      <div className="bg-[#181C20] p-5 rounded-sm text-white flex flex-col justify-between h-full relative overflow-hidden">
        <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-2">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#D4A373]">CRISPR IP Stack Cluster</span>
          <span className="text-[10px] text-white/50">Broad vs UC Berkeley vs Intellia</span>
        </div>
        <div className="relative h-32 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 300 120">
            <line x1="60" y1="60" x2="150" y2="30" stroke="#D4A373" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="240" y1="60" x2="150" y2="30" stroke="#D4A373" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="60" y1="60" x2="150" y2="90" stroke="#5A6B7C" strokeWidth="1.5" />
            <line x1="240" y1="60" x2="150" y2="90" stroke="#5A6B7C" strokeWidth="1.5" />

            <circle cx="60" cy="60" r="22" fill="#2A3038" stroke="#D4A373" strokeWidth="2" />
            <text x="60" y="64" textAnchor="middle" fill="#D4A373" fontSize="9" fontWeight="bold">Broad</text>

            <circle cx="240" cy="60" r="22" fill="#2A3038" stroke="#D4A373" strokeWidth="2" />
            <text x="240" y="64" textAnchor="middle" fill="#D4A373" fontSize="9" fontWeight="bold">Berkeley</text>

            <circle cx="150" cy="30" r="24" fill="#D4A373" stroke="#FFFFFF" strokeWidth="2" />
            <text x="150" y="34" textAnchor="middle" fill="#1A1A1A" fontSize="9" fontWeight="bold">Base Editing</text>

            <circle cx="150" cy="90" r="20" fill="#2A3038" stroke="#5A6B7C" strokeWidth="2" />
            <text x="150" y="94" textAnchor="middle" fill="#E2E8F0" fontSize="8">Intellia Delivery</text>
          </svg>
        </div>
        <div className="text-[10px] text-white/60 text-center">Click article to view license stacking analysis & royalty breakdown</div>
      </div>
    )
  }

  // 3. GLP-1 Molecule Differentiation Scatter
  if (articleId === 3) {
    return (
      <div className="bg-[#121417] p-5 rounded-sm text-white flex flex-col justify-between h-full">
        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#D4A373]">GLP-1 Phase II Velocity</span>
          <span className="text-[10px] text-white/50">42 Molecules</span>
        </div>
        <div className="h-28 flex flex-col justify-around py-1">
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-white/80">Oral Small Molecules</span>
              <span className="text-[#D4A373] font-semibold">High Conviction</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-[#D4A373] h-full rounded-full" style={{ width: "82%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-white/80">Dual/Triple Agonists (NASH+Obesity)</span>
              <span className="text-white/60">Medium Conviction</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: "65%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-white/80">Weekly Injectables</span>
              <span className="text-rose-400">Crowded / Commoditized</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-400 h-full rounded-full" style={{ width: "35%" }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 5 & 10. Surgical Autonomy Precision Gauge
  if (articleId === 5 || articleId === 10) {
    return (
      <div className="bg-[#181C20] p-5 rounded-sm text-white flex flex-col justify-between h-full">
        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#D4A373]">Surgical Autonomy Level</span>
          <span className="text-[10px] text-white/50">Level 1 - 5 Scale</span>
        </div>
        <div className="flex items-center justify-around my-3">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div key={lvl} className={`flex flex-col items-center gap-1 ${lvl === 3 ? "scale-110" : ""}`}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  lvl === 3
                    ? "bg-[#D4A373] text-[#1A1A1A] ring-4 ring-[#D4A373]/30"
                    : lvl < 3
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/30"
                }`}
              >
                L{lvl}
              </div>
              <span className="text-[9px] text-white/60">
                {lvl === 1 ? "Manual" : lvl === 2 ? "Assist" : lvl === 3 ? "Task Auto" : lvl === 4 ? "Conditional" : "Full"}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-[#D4A373]/10 border border-[#D4A373]/30 p-2 rounded text-center text-[10px] text-[#D4A373]">
          Level 3 Autonomy (Autonomous Suturing) target: Commercial launch by 2030
        </div>
      </div>
    )
  }

  // Default fallback Molecular Graphic
  return (
    <div className="article-image-bg rounded-sm overflow-hidden h-full flex items-center justify-center relative">
      <svg viewBox="0 0 320 200" className="w-full h-full opacity-15" fill="none">
        <circle cx="160" cy="100" r="6" fill="#1A1A1A" />
        <circle cx="220" cy="50" r="4" fill="#D4A373" />
        <circle cx="100" cy="150" r="4" fill="#1A1A1A" />
        <line x1="160" y1="100" x2="220" y2="50" stroke="#1A1A1A" strokeWidth="1.5" />
        <line x1="160" y1="100" x2="100" y2="150" stroke="#1A1A1A" strokeWidth="1.5" />
        <circle cx="160" cy="100" r="28" stroke="#D4A373" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
    </div>
  )
}

/* ──────────────────────── INTERACTIVE INLINE ARTICLE TOOLS ──────────────────────── */

const FDAComplianceCalculator = () => {
  const [hasPCCP, setHasPCCP] = useState(false)
  const [riskTier, setRiskTier] = useState<"low" | "medium" | "high">("high")
  const [dataGovernance, setDataGovernance] = useState(false)

  const readinessScore = useMemo(() => {
    let score = 20
    if (hasPCCP) score += 40
    if (dataGovernance) score += 30
    if (riskTier === "low") score += 10
    return Math.min(100, score)
  }, [hasPCCP, riskTier, dataGovernance])

  return (
    <div className="my-8 p-6 bg-[#1A1A1A] text-[#F8F6F0] rounded-sm border border-[#D4A373]/30">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-[#D4A373]" />
        <h4 className="text-sm font-semibold tracking-wide uppercase text-[#D4A373]">
          Interactive Tool: 510(k) AI Diagnostic Readiness Calculator
        </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs text-white/70 block mb-2">PCCP Change Plan Documented?</label>
          <button
            onClick={() => setHasPCCP(!hasPCCP)}
            className={`w-full py-2 px-3 text-xs rounded border transition-colors ${
              hasPCCP ? "bg-[#D4A373] text-[#1A1A1A] font-semibold border-[#D4A373]" : "bg-white/10 text-white border-white/20"
            }`}
          >
            {hasPCCP ? "✓ PCCP Ready" : "Missing PCCP"}
          </button>
        </div>
        <div>
          <label className="text-xs text-white/70 block mb-2">SaMD Risk Classification</label>
          <select
            value={riskTier}
            onChange={(e) => setRiskTier(e.target.value as any)}
            className="w-full py-2 px-3 text-xs rounded bg-white/10 text-white border border-white/20"
          >
            <option value="low" className="bg-[#1A1A1A]">Tier 3 (Screening / Triage)</option>
            <option value="medium" className="bg-[#1A1A1A]">Tier 2 (Diagnostic Assist)</option>
            <option value="high" className="bg-[#1A1A1A]">Tier 1 (Critical Decision)</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-white/70 block mb-2">Real-world Data Logging?</label>
          <button
            onClick={() => setDataGovernance(!dataGovernance)}
            className={`w-full py-2 px-3 text-xs rounded border transition-colors ${
              dataGovernance ? "bg-[#D4A373] text-[#1A1A1A] font-semibold border-[#D4A373]" : "bg-white/10 text-white border-white/20"
            }`}
          >
            {dataGovernance ? "✓ Active Monitoring" : "No Real-Time Monitoring"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div>
          <div className="text-[11px] text-white/60">Estimated Regulatory Audit Preparedness Score</div>
          <div className="text-2xl font-bold text-[#D4A373]">{readinessScore} / 100</div>
        </div>
        <div className="text-right">
          <span className={`text-xs px-3 py-1 rounded font-semibold ${readinessScore >= 80 ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
            {readinessScore >= 80 ? "Audit Ready" : "Action Required"}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────── AUDIO PLAYER BAR ──────────────────────── */

function AudioPlayerBar({
  article,
  onClose
}: {
  article: Article
  onClose: () => void
}) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(15)
  const [playbackRate, setPlaybackRate] = useState(1.0)

  useEffect(() => {
    let interval: any
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1))
      }, 1000 / playbackRate)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playbackRate])

  const toggleRate = () => {
    const rates = [1.0, 1.25, 1.5, 2.0]
    const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length]
    setPlaybackRate(next)
  }

  const currentSeconds = Math.floor((progress / 100) * article.audioDurationSec)
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-[460px] z-50 bg-[#1A1A1A] text-[#F8F6F0] p-4 rounded-md shadow-2xl border border-[#D4A373]/40 animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-end gap-0.5 h-4 flex-shrink-0">
            <div className={`eq-bar eq-bar-1 ${!isPlaying && "!animation-none"}`} />
            <div className={`eq-bar eq-bar-2 ${!isPlaying && "!animation-none"}`} />
            <div className={`eq-bar eq-bar-3 ${!isPlaying && "!animation-none"}`} />
            <div className={`eq-bar eq-bar-4 ${!isPlaying && "!animation-none"}`} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-[#D4A373] uppercase font-semibold tracking-wider">AI Executive Audio Brief</div>
            <div className="text-xs font-medium truncate text-white">{article.title}</div>
          </div>
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white p-1">
          ✕
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-full h-1 bg-white/20 accent-[#D4A373] rounded cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-white/50 mt-1">
          <span>{formatTime(currentSeconds)}</span>
          <span>{article.audioTime}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setProgress((p) => Math.max(0, p - 5))}
            className="text-xs text-white/70 hover:text-white"
            title="Rewind 15s"
          >
            -15s
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-[#D4A373] text-[#1A1A1A] flex items-center justify-center font-bold text-sm hover:scale-105 transition-transform"
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <button
            onClick={() => setProgress((p) => Math.min(100, p + 5))}
            className="text-xs text-white/70 hover:text-white"
            title="Forward 15s"
          >
            +15s
          </button>
        </div>

        <button
          onClick={toggleRate}
          className="text-xs px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#D4A373] font-mono font-semibold"
        >
          {playbackRate.toFixed(2)}x
        </button>
      </div>
    </div>
  )
}

/* ──────────────────────── ARTICLE READER MODAL ──────────────────────── */

function ArticleModal({
  article,
  onClose,
  onPlayAudio,
  isBookmarked,
  onToggleBookmark
}: {
  article: Article
  onClose: () => void
  onPlayAudio: (article: Article) => void
  isBookmarked: boolean
  onToggleBookmark: (article: Article) => void
}) {
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xl">("normal")
  const [theme, setTheme] = useState<"warm" | "dark" | "sepia">("warm")
  const [toastMsg, setToastMsg] = useState("")

  const fontClass = fontSize === "large" ? "text-[18px]" : fontSize === "xl" ? "text-[20px]" : "text-[16px]"
  const themeClass = theme === "dark" ? "theme-dark" : theme === "sepia" ? "theme-sepia" : "theme-warm"

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(""), 2500)
  }

  return (
    <>
      <div className="backdrop-overlay" onClick={onClose} />
      <div className="modal-panel" onClick={onClose}>
        <div
          className={`border border-[rgba(26,26,26,0.1)] rounded-sm shadow-2xl w-full max-w-[760px] max-h-[92vh] overflow-y-auto animate-fade-up relative transition-colors duration-200 ${themeClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Reader Action Bar */}
          <div className="sticky top-0 z-30 px-6 py-3 border-b border-black/10 bg-inherit flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#D4A373]">{article.section}</span>
              <span className="text-xs opacity-40">•</span>
              <span className="text-xs opacity-70">{article.readTime} read</span>
            </div>

            {/* Typography & Theme Controls */}
            <div className="flex items-center gap-3">
              {/* Audio Listen */}
              <button
                onClick={() => onPlayAudio(article)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#D4A373] text-[#1A1A1A] rounded text-xs font-semibold hover:bg-[#c39262] transition-colors"
              >
                <span>🔊 Listen ({article.audioTime})</span>
              </button>

              {/* Font Resizer */}
              <div className="flex items-center border border-black/15 rounded overflow-hidden">
                <button
                  onClick={() => setFontSize("normal")}
                  className={`px-2 py-0.5 text-xs ${fontSize === "normal" ? "bg-black/10 font-bold" : ""}`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize("large")}
                  className={`px-2 py-0.5 text-xs ${fontSize === "large" ? "bg-black/10 font-bold" : ""}`}
                >
                  A+
                </button>
              </div>

              {/* Theme Picker */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTheme("warm")}
                  className={`w-4 h-4 rounded-full bg-[#F8F6F0] border border-black/30 ${theme === "warm" && "ring-2 ring-[#D4A373]"}`}
                  title="Warm Paper"
                />
                <button
                  onClick={() => setTheme("dark")}
                  className={`w-4 h-4 rounded-full bg-[#121417] border border-white/30 ${theme === "dark" && "ring-2 ring-[#D4A373]"}`}
                  title="Midnight Dark"
                />
                <button
                  onClick={() => setTheme("sepia")}
                  className={`w-4 h-4 rounded-full bg-[#F5EFE6] border border-black/30 ${theme === "sepia" && "ring-2 ring-[#D4A373]"}`}
                  title="Classic Sepia"
                />
              </div>

              {/* Close button */}
              <button onClick={onClose} className="p-1 hover:opacity-70 transition-opacity ml-2" aria-label="Close">
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 md:p-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-px bg-[#D4A373]" />
                <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#D4A373]">{article.category}</span>
                <span className="text-xs opacity-50">·</span>
                <span className="text-xs font-medium opacity-70">{article.date}</span>
              </div>
              <span className="tier-badge pro">Professional</span>
            </div>

            {/* Title */}
            <h1
              style={{ fontFamily: "Newsreader, Georgia, serif", letterSpacing: "-0.02em" }}
              className="article-title text-2xl md:text-[34px] font-semibold leading-tight mb-6"
            >
              {article.title}
            </h1>

            {/* Author Byline */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-black/10">
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-xs font-bold text-[#F8F6F0]">
                {article.byline.split(" ").filter((w) => w.length > 1).map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="text-sm font-semibold">{article.byline}</div>
                <div className="text-xs opacity-65">{article.authorRole}</div>
              </div>
            </div>

            {/* Bespoke Interactive Graphic Header */}
            <div className="h-44 md:h-52 mb-8 rounded overflow-hidden">
              <DynamicArticleGraphic articleId={article.id} />
            </div>

            {/* Inline Interactive Tool if Article 1 */}
            {article.id === 1 && <FDAComplianceCalculator />}

            {/* Article Content */}
            <div className="space-y-6">
              <p className={`drop-cap ${fontClass} leading-[1.8] opacity-90`}>{article.body[0]}</p>
              {article.body.slice(1).map((para, i) => (
                <div key={i}>
                  {article.pullQuote && i === 1 && (
                    <div className="pull-quote my-8">{article.pullQuote}</div>
                  )}
                  <p className={`${fontClass} leading-[1.8] opacity-90`}>{para}</p>
                </div>
              ))}
            </div>

            {/* Executive Key Metrics Bar */}
            {article.keyMetrics && (
              <div className="mt-10 p-5 rounded bg-black/5 border border-black/10 grid grid-cols-3 gap-4 text-center">
                {article.keyMetrics.map((m, idx) => (
                  <div key={idx}>
                    <div className="text-[10px] uppercase tracking-wider opacity-60 mb-1">{m.label}</div>
                    <div className="text-base font-bold text-[#D4A373]">{m.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions Footer */}
            <div className="mt-10 pt-6 border-t border-black/10 flex items-center justify-between">
              <button
                onClick={() => {
                  onToggleBookmark(article)
                  triggerToast(isBookmarked ? "Removed from Notebook" : "Saved to Notebook!")
                }}
                className={`text-xs px-4 py-2 rounded border transition-colors flex items-center gap-1.5 ${
                  isBookmarked ? "bg-[#1A1A1A] text-[#F8F6F0] border-[#1A1A1A]" : "border-black/20 hover:border-black/50"
                }`}
              >
                <span>{isBookmarked ? "★ Bookmarked" : "☆ Save to Notebook"}</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => triggerToast("Article link copied to clipboard!")}
                  className="text-xs px-4 py-2 rounded border border-black/20 hover:border-black/50 transition-colors"
                >
                  Share Article
                </button>
              </div>
            </div>

            {toastMsg && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-[#F8F6F0] text-xs py-2 px-5 rounded shadow-lg z-50 animate-fade-up">
                {toastMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/* ──────────────────────── 60-SECOND C-SUITE DIGEST MODAL ──────────────────────── */

function CSuiteDigestModal({ onClose, onSelectArticle }: { onClose: () => void; onSelectArticle: (id: number) => void }) {
  return (
    <>
      <div className="backdrop-overlay" onClick={onClose} />
      <div className="modal-panel" onClick={onClose}>
        <div
          className="bg-[#1A1A1A] text-[#F8F6F0] border border-[#D4A373]/40 rounded-sm shadow-2xl w-full max-w-[800px] max-h-[88vh] overflow-y-auto p-6 md:p-10 animate-fade-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#D4A373]" />
              <h2 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-xl md:text-2xl font-semibold text-[#D4A373]">
                60-Second C-Suite Executive Briefing
              </h2>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
          </div>

          <p className="text-xs text-white/70 mb-8 leading-relaxed">
            Direct high-priority takeaways curated for Chief Regulatory Officers, VPs of Business Development, and Life Science Investors for Issue 24 (August 2026).
          </p>

          <div className="space-y-6">
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => { onClose(); onSelectArticle(art.id); }}
                className="p-4 rounded border border-white/10 bg-white/5 hover:border-[#D4A373]/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-[#D4A373] uppercase tracking-wider">{art.section} · {art.category}</span>
                  <span className="text-[10px] text-white/50 group-hover:text-[#D4A373] transition-colors">Read Full Article →</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{art.title}</h3>
                <ul className="space-y-1">
                  {art.cSuiteSummary.map((bullet, idx) => (
                    <li key={idx} className="text-xs text-white/80 flex items-start gap-2">
                      <span className="text-[#D4A373] mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ──────────────────────── SAVED NOTEBOOK DRAWER ──────────────────────── */

function NotebookDrawer({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemove
}: {
  isOpen: boolean
  onClose: () => void
  savedArticles: Article[]
  onSelectArticle: (id: number) => void
  onRemove: (id: number) => void
}) {
  if (!isOpen) return null

  return (
    <>
      <div className="backdrop-overlay" onClick={onClose} />
      <div className="drawer-panel bg-[#F8F6F0] text-[#1A1A1A] p-6 shadow-2xl border-l border-black/10 animate-slide-in-right overflow-y-auto flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold" style={{ fontFamily: "Newsreader, Georgia, serif" }}>Saved Executive Notebook</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A1A] text-white font-bold">{savedArticles.length}</span>
            </div>
            <button onClick={onClose} className="text-black/60 hover:text-black">✕</button>
          </div>

          {savedArticles.length === 0 ? (
            <div className="py-16 text-center text-xs text-black/50">
              No saved articles yet. Click "☆ Save to Notebook" on any article to store it for offline review.
            </div>
          ) : (
            <div className="space-y-4">
              {savedArticles.map((art) => (
                <div key={art.id} className="p-4 rounded border border-black/10 bg-white shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-semibold text-[#D4A373] uppercase tracking-wider">{art.section}</span>
                    <button onClick={() => onRemove(art.id)} className="text-xs text-rose-500 hover:underline">Remove</button>
                  </div>
                  <h4 className="text-xs font-semibold text-[#1A1A1A] mb-3 line-clamp-2">{art.title}</h4>
                  <button
                    onClick={() => { onClose(); onSelectArticle(art.id); }}
                    className="w-full py-1.5 bg-[#1A1A1A] text-white text-[11px] font-medium rounded hover:bg-black transition-colors"
                  >
                    Open Article
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-black/10 text-[10px] text-black/50 text-center">
          Meridian Executive Notebook · Issue 24 Sync
        </div>
      </div>
    </>
  )
}

/* ──────────────────────── MAIN MAGAZINE TAB COMPONENT ──────────────────────── */

export default function MagazineTab() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [activeAudioArticle, setActiveAudioArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSection, setActiveSection] = useState<string>("All")
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [viewMode, setViewMode] = useState<"grid" | "newspaper">("grid")
  const [edition, setEdition] = useState("Vol. 2 Issue 24 (August 2026)")
  const [showCSuiteDigest, setShowCSuiteDigest] = useState(false)
  const [notebookOpen, setNotebookOpen] = useState(false)
  const [savedArticles, setSavedArticles] = useState<Article[]>([])

  // Filter logic
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchSection = activeSection === "All" || a.section === activeSection
      const matchCategory = activeCategory === "All" || a.category === activeCategory
      const matchSearch =
        searchQuery === "" ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.byline.toLowerCase().includes(searchQuery.toLowerCase())
      return matchSection && matchCategory && matchSearch
    })
  }, [searchQuery, activeSection, activeCategory])

  const toggleBookmark = (art: Article) => {
    if (savedArticles.some((x) => x.id === art.id)) {
      setSavedArticles(savedArticles.filter((x) => x.id !== art.id))
    } else {
      setSavedArticles([...savedArticles, art])
    }
  }

  const openArticle = (id: number) => {
    const found = articles.find((a) => a.id === id)
    if (found) setSelectedArticle(found)
  }

  const heroArticle = filteredArticles.find((a) => a.hero) || filteredArticles[0]

  return (
    <>
      {/* ── TOP CONTROL BAR: SEARCH, EDITION, VIEWS ── */}
      <div className="mb-8 p-4 md:p-6 bg-white border border-[rgba(26,26,26,0.1)] rounded-sm shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Edition & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Edition Selector */}
          <select
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-[#F8F6F0] border border-[rgba(26,26,26,0.15)] rounded text-[#1A1A1A] cursor-pointer"
          >
            <option value="Vol. 2 Issue 24 (August 2026)">Vol. 2 Issue 24 (August 2026)</option>
            <option value="Vol. 2 Issue 23 (July 2026)">Vol. 2 Issue 23 (July 2026 Special)</option>
            <option value="Vol. 2 Issue 22 (June 2026)">Vol. 2 Issue 22 (June 2026)</option>
          </select>

          {/* Instant Search Bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search articles, topics (FDA, CRISPR, Robotics)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8F6F0] border border-[rgba(26,26,26,0.15)] rounded text-[#1A1A1A] focus:outline-none focus:border-[#D4A373]"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#5A6B7C]">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5A6B7C] hover:text-[#1A1A1A]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: C-Suite Digest & Notebook & Layout View */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 60-Sec C-Suite Digest */}
          <button
            onClick={() => setShowCSuiteDigest(true)}
            className="px-3 py-2 text-xs font-semibold bg-[#1A1A1A] text-[#D4A373] rounded hover:bg-black transition-colors flex items-center gap-1.5"
          >
            <span>⚡ 60-Sec C-Suite Brief</span>
          </button>

          {/* Notebook */}
          <button
            onClick={() => setNotebookOpen(true)}
            className="px-3 py-2 text-xs font-medium border border-[rgba(26,26,26,0.15)] bg-[#F8F6F0] rounded hover:border-[#1A1A1A] transition-colors flex items-center gap-1.5"
          >
            <span>📓 Notebook</span>
            {savedArticles.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#D4A373] text-[#1A1A1A] font-bold text-[10px] flex items-center justify-center">
                {savedArticles.length}
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-[rgba(26,26,26,0.15)] rounded overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 text-xs font-medium ${viewMode === "grid" ? "bg-[#1A1A1A] text-[#F8F6F0]" : "bg-[#F8F6F0] text-[#5A6B7C]"}`}
              title="Modern Grid Layout"
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("newspaper")}
              className={`px-3 py-1.5 text-xs font-medium ${viewMode === "newspaper" ? "bg-[#1A1A1A] text-[#F8F6F0]" : "bg-[#F8F6F0] text-[#5A6B7C]"}`}
              title="Classic Multi-Column Layout"
            >
              Newspaper
            </button>
          </div>
        </div>
      </div>

      {/* ── FILTER CATEGORY CHIPS ── */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-[11px] font-semibold text-[#5A6B7C] uppercase tracking-wider mr-2">Section:</span>
        {["All", "Pharma", "MedTech", "AI-Health"].map((sec) => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              activeSection === sec ? "bg-[#1A1A1A] text-[#F8F6F0] border-[#1A1A1A]" : "border-[rgba(26,26,26,0.15)] text-[#5A6B7C] hover:border-black"
            }`}
          >
            {sec}
          </button>
        ))}

        <span className="text-[11px] font-semibold text-[#5A6B7C] uppercase tracking-wider ml-4 mr-2">Category:</span>
        {["All", "Cover Story", "Deep Dive", "IP & Strategy", "Commercial", "Policy", "Interview"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              activeCategory === cat ? "bg-[#D4A373] text-[#1A1A1A] font-semibold border-[#D4A373]" : "border-[rgba(26,26,26,0.15)] text-[#5A6B7C] hover:border-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT GRID WITH STICKY SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* LEFT EDITORIAL CONTENT AREA */}
        <div className="lg:pr-8 lg:border-r border-[rgba(26,26,26,0.08)]">
          {/* Editor's Welcome Card */}
          <div className="mb-10 p-6 md:p-8 bg-[#1A1A1A] rounded-sm text-[#F8F6F0] shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#D4A373]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-px bg-[#D4A373]" />
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#D4A373]">Editor's Note · Issue 24</span>
            </div>
            <h3 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-xl md:text-2xl font-semibold mb-3">
              {EDITORS_LETTER.title}
            </h3>
            <p className="text-xs md:text-sm leading-relaxed text-[rgba(248,246,240,0.8)] mb-4">{EDITORS_LETTER.body}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#D4A373] italic">{EDITORS_LETTER.signoff}</span>
              <span className="text-white/50 text-[11px]">{articles.length} Core Articles</span>
            </div>
          </div>

          {/* Search Result Status */}
          {filteredArticles.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-black/20 rounded">
              <div className="text-base font-semibold mb-1">No articles found</div>
              <div className="text-xs text-[#5A6B7C]">Try broadening your search or resetting active category filters.</div>
              <button
                onClick={() => { setSearchQuery(""); setActiveSection("All"); setActiveCategory("All"); }}
                className="mt-4 px-4 py-2 bg-[#1A1A1A] text-white text-xs rounded"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <>
              {/* HERO FEATURED COVER ARTICLE */}
              {heroArticle && (
                <article
                  className="mb-10 pb-8 border-b border-[rgba(26,26,26,0.12)] group cursor-pointer"
                  onClick={() => setSelectedArticle(heroArticle)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="h-56 md:h-64 rounded overflow-hidden shadow-sm">
                      <DynamicArticleGraphic articleId={heroArticle.id} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D4A373]">{heroArticle.category}</span>
                        <span className="text-xs text-[#5A6B7C]">· {heroArticle.readTime} read</span>
                      </div>
                      <h2
                        style={{ fontFamily: "Newsreader, Georgia, serif" }}
                        className="text-xl md:text-2xl font-semibold leading-tight text-[#1A1A1A] mb-3 group-hover:text-[#5A6B7C] transition-colors"
                      >
                        {heroArticle.title}
                      </h2>
                      <p className="text-xs text-[#5A6B7C] leading-relaxed mb-4 line-clamp-3">{heroArticle.excerpt}</p>

                      <div className="flex items-center justify-between text-xs text-[#5A6B7C]">
                        <div>
                          <span className="font-semibold text-[#1A1A1A]">{heroArticle.byline}</span> · {heroArticle.authorRole}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveAudioArticle(heroArticle); }}
                          className="px-2.5 py-1 bg-[#D4A373]/20 text-[#1A1A1A] rounded font-semibold text-[10px] hover:bg-[#D4A373]"
                        >
                          🔊 Listen
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* ARTICLE CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.filter((a) => a.id !== heroArticle?.id).map((article) => (
                  <article
                    key={article.id}
                    className="p-5 border border-[rgba(26,26,26,0.1)] rounded bg-white hover:border-[rgba(26,26,26,0.3)] transition-all flex flex-col justify-between group cursor-pointer shadow-sm"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div>
                      <div className="h-36 rounded overflow-hidden mb-4">
                        <DynamicArticleGraphic articleId={article.id} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] mb-2">
                        <span className="font-semibold text-[#D4A373] uppercase tracking-wider">{article.section} · {article.category}</span>
                        <span className="text-[#5A6B7C]">{article.readTime}</span>
                      </div>
                      <h3
                        style={{ fontFamily: "Newsreader, Georgia, serif" }}
                        className="text-base font-semibold leading-snug text-[#1A1A1A] mb-2 group-hover:text-[#5A6B7C] transition-colors"
                      >
                        {article.title}
                      </h3>
                      <p className="text-xs text-[#5A6B7C] leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
                    </div>

                    <div className="pt-3 border-t border-[rgba(26,26,26,0.08)] flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-[#1A1A1A]">{article.byline}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveAudioArticle(article); }}
                        className="text-[10px] px-2 py-0.5 bg-[#EDEAE2] hover:bg-[#D4A373] rounded font-medium transition-colors"
                      >
                        🔊 Brief
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            /* NEWSPAPER MULTI-COLUMN VIEW */
            <div className="newspaper-columns space-y-8">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="break-inside-avoid pb-6 border-b border-black/10 cursor-pointer group"
                  onClick={() => setSelectedArticle(article)}
                >
                  <span className="text-[10px] font-bold text-[#D4A373] uppercase tracking-wider block mb-1">{article.category}</span>
                  <h3 style={{ fontFamily: "Newsreader, Georgia, serif" }} className="text-lg font-semibold leading-snug mb-2 group-hover:underline">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#5A6B7C] leading-relaxed mb-3">{article.excerpt}</p>
                  <div className="text-[11px] text-[#1A1A1A] font-semibold">{article.byline} — {article.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT STICKY EXECUTIVE SIDEBAR */}
        <div className="flex flex-col gap-6">
          {/* Pro Subscription Status */}
          <div className="p-5 border border-[rgba(212,163,115,0.4)] rounded bg-[rgba(212,163,115,0.06)] shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="tier-badge pro">Professional Plan</span>
            </div>
            <p className="text-xs text-[#5A6B7C] leading-relaxed mb-3">
              Unlimited access to monthly drops, full editorial issue archives, regulatory briefs, and custom executive downloads.
            </p>
            <div className="text-[10px] text-[#5A6B7C] border-t border-[rgba(212,163,115,0.2)] pt-2">
              Next Drop: September 1, 2026
            </div>
          </div>

          {/* Digests Briefings */}
          <div className="p-5 border border-[rgba(26,26,26,0.1)] rounded bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-black/10">
              <div className="w-3 h-px bg-[#D4A373]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">Curated Digests</span>
            </div>
            <div className="space-y-2">
              {digests.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-[#F8F6F0] transition-colors cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-[#1A1A1A]">{d.label}</div>
                    <div className="text-[10px] text-[#5A6B7C]">{d.date} · {d.items} briefings</div>
                  </div>
                  {d.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#D4A373] text-[#1A1A1A] text-[10px] font-bold flex items-center justify-center">
                      {d.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Industry Contributors */}
          <div className="p-5 border border-[rgba(26,26,26,0.1)] rounded bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-black/10">
              <div className="w-3 h-px bg-[#D4A373]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">Top Key Contributors</span>
            </div>
            <div className="space-y-3">
              {contributors.map((c, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#F8F6F0] font-bold text-xs flex items-center justify-center">
                    {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1A1A1A]">{c.name}</div>
                    <div className="text-[10px] text-[#5A6B7C]">{c.org} · {c.topic}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS & DRAWERS ── */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onPlayAudio={(art) => setActiveAudioArticle(art)}
          isBookmarked={savedArticles.some((x) => x.id === selectedArticle.id)}
          onToggleBookmark={toggleBookmark}
        />
      )}

      {showCSuiteDigest && (
        <CSuiteDigestModal
          onClose={() => setShowCSuiteDigest(false)}
          onSelectArticle={openArticle}
        />
      )}

      <NotebookDrawer
        isOpen={notebookOpen}
        onClose={() => setNotebookOpen(false)}
        savedArticles={savedArticles}
        onSelectArticle={openArticle}
        onRemove={(id) => setSavedArticles(savedArticles.filter((x) => x.id !== id))}
      />

      {activeAudioArticle && (
        <AudioPlayerBar
          article={activeAudioArticle}
          onClose={() => setActiveAudioArticle(null)}
        />
      )}
    </>
  )
}
