export interface RegulatoryPathway {
  id: string
  title: string
  authority: "CDSCO (India)" | "USFDA (USA)" | "EMA (Europe)" | "HSA (Singapore)"
  targetProduct: "Software-as-a-Medical-Device (SaMD)" | "Biosimilars & Biologics" | "Class C/D Medical Device" | "Oral Solid Formulations"
  averageTimelineMonths: string
  approvalDifficulty: "High (Multi-center Trial)" | "Medium (Equivalence)" | "Fast Track"
  summary: string
  keyMilestones: { step: string; timeline: string; documents: string }[]
  complianceChecklist: string[]
}

export const REGULATORY_PATHWAYS: RegulatoryPathway[] = [
  {
    id: "path-1",
    title: "CDSCO SaMD & Clinical AI Approval Pathway (Form MD-14/15)",
    authority: "CDSCO (India)",
    targetProduct: "Software-as-a-Medical-Device (SaMD)",
    averageTimelineMonths: "6–9 months",
    approvalDifficulty: "High (Multi-center Trial)",
    summary: "Standard regulatory clearance trajectory under the 2026 AI Radiology and Diagnostic Software Mandates. Requires dual-center retrospective validation and algorithm drift logging.",
    keyMilestones: [
      { step: "1. Algorithm Performance Validation", timeline: "Months 1–2", documents: "Sensitivity/specificity matrix on Indian ethnic demographics" },
      { step: "2. Ethics Committee & Clinical Trial Clearance", timeline: "Months 3–5", documents: "CT-06 clearance, clinical protocol, data privacy compliance" },
      { step: "3. Form MD-14 Submission & SEC Review", timeline: "Months 6–8", documents: "Technical dossier, cybersecurity audit, device master file" },
      { step: "4. Form MD-15 Import / Manufacturing License", timeline: "Month 9", documents: "Final commercial clearance" },
    ],
    complianceChecklist: [
      "ISO 13485:2016 Quality Management System certified",
      "IEC 62304 Medical device software life cycle compliance",
      "DPDP Act 2023 patient health data anonymization audit",
      "Continuous algorithm drift logging protocol established",
    ],
  },
  {
    id: "path-2",
    title: "Biosimilars & Similar Biologics Dossier Pathway (Form CT-23)",
    authority: "CDSCO (India)",
    targetProduct: "Biosimilars & Biologics",
    averageTimelineMonths: "12–18 months",
    approvalDifficulty: "High (Multi-center Trial)",
    summary: "Comprehensive regulatory filing process for recombinant DNA-derived therapeutics following Guidelines on Similar Biologics.",
    keyMilestones: [
      { step: "1. Pre-Clinical Physico-Chemical Characterization", timeline: "Months 1–4", documents: "High-resolution mass spec, biosimilar comparability matrix" },
      { step: "2. Animal Toxicity & Pharmacodynamics", timeline: "Months 5–8", documents: "Repeat-dose toxicity reports in relevant species" },
      { step: "3. Phase III Comparative Clinical Efficacy Trial", timeline: "Months 9–15", documents: "Multi-center randomized trial readout against reference biologic" },
      { step: "4. SEC Approval & Marketing Authorization", timeline: "Months 16–18", documents: "Commercial manufacturing clearance (Form 28-D)" },
    ],
    complianceChecklist: [
      "Head-to-head analytical comparability with reference product",
      "Post-market pharmacovigilance plan submitted",
      "Sterile injectable cGMP inspection readiness",
    ],
  },
  {
    id: "path-3",
    title: "Class C/D Precision Surgical Robotics Pathway",
    authority: "CDSCO (India)",
    targetProduct: "Class C/D Medical Device",
    averageTimelineMonths: "9–12 months",
    approvalDifficulty: "High (Multi-center Trial)",
    summary: "Clearance trajectory for active surgical instrumentation, robotic arms, and intraoperative optical navigation systems.",
    keyMilestones: [
      { step: "1. Bench Testing & Electrical Safety", timeline: "Months 1–3", documents: "IEC 60601-1 electrical & electromagnetic safety certification" },
      { step: "2. Pre-Clinical Cadaveric / Animal Usability Trial", timeline: "Months 4–6", documents: "Human factors usability engineering dossier (IEC 62366)" },
      { step: "3. SEC Clinical Evaluation Review", timeline: "Months 7–10", documents: "Clinical evaluation report & literature equivalence" },
      { step: "4. Medical Device Manufacturing License (MD-9)", timeline: "Months 11–12", documents: "State Licensing Authority & CDSCO joint inspection" },
    ],
    complianceChecklist: [
      "Sterility validation for end-effector patient contacting instruments",
      "Cybersecurity and firmware fail-safe redundancy testing",
      "Post-market clinical follow-up (PMCF) plan",
    ],
  },
]
