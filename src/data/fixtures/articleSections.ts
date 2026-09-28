/**
 * Section headings for the article reader's table of contents.
 * Drafted from each article's own paragraphs; editorial should review wording.
 * `start` = index into Article.body where the section begins.
 */
export interface ArticleSection {
  start: number
  title: string
}

export const ARTICLE_SECTIONS: Record<string, ArticleSection[]> = {
  "continuous-biomanufacturing-cdmo-scaleup-2026": [
    { start: 0, title: "Why CDMOs are building continuous capacity" },
    { start: 1, title: "Perfusion and footprint gains" },
    { start: 2, title: "Harmonizing validation standards" },
  ],
  "glp1-biosimilar-warchests-peptide-manufacturing": [
    { start: 0, title: "Preparing for patent expiries" },
    { start: 1, title: "Synthesis versus fermentation" },
    { start: 2, title: "Delivery devices as the moat" },
  ],
  "ai-generative-protein-design-regulatory": [
    { start: 0, title: "Compressed discovery timelines" },
    { start: 1, title: "Why wet-lab validation still matters" },
    { start: 2, title: "What IND reviewers now expect" },
  ],
  "cdsco-ai-diagnostics-framework-2026": [
    { start: 0, title: "What the revised guidelines change" },
    { start: 1, title: "New obligations for regulatory leads" },
    { start: 2, title: "Guarding against demographic bias" },
  ],
  "surgical-robotics-ip-licensing-apac": [
    { start: 0, title: "Adoption driving licensing deals" },
    { start: 1, title: "Innovators meet regional manufacturers" },
    { start: 2, title: "Structuring cross-border ventures" },
  ],
  "point-of-care-microfluidics-silicon-biochips": [
    { start: 0, title: "From bench assay to cartridge" },
    { start: 1, title: "EMS providers move into biochips" },
    { start: 2, title: "Rapid testing at rural clinics" },
  ],
  "federated-learning-radiology-privacy-models": [
    { start: 0, title: "Why centralized data lakes falter" },
    { start: 1, title: "How federated training works" },
    { start: 2, title: "Performance and data sovereignty" },
  ],
  "mrna-cold-chain-logistics-tier2": [
    { start: 0, title: "The ultracold stability problem" },
    { start: 1, title: "Telemetry and cold-chain hardware" },
    { start: 2, title: "Toward room-temperature formulations" },
  ],
  "cart-cell-therapy-manufacturing-apac": [
    { start: 0, title: "Limits of centralized manufacturing" },
    { start: 1, title: "Automated processing in hospital suites" },
    { start: 2, title: "Early evidence from Indian trials" },
  ],
  "wearable-continuous-biosensing-payer-reimbursement": [
    { start: 0, title: "Beyond diabetic care" },
    { start: 1, title: "The evidence payers need" },
    { start: 2, title: "Clarifying digital therapeutic pathways" },
  ],
  "autonomous-clinical-trial-protocol-llms": [
    { start: 0, title: "A labor-intensive drafting process" },
    { start: 1, title: "What fine-tuned models automate" },
    { start: 2, title: "Human review and amendment rates" },
  ],
  "adc-high-potency-containment-cdmo": [
    { start: 0, title: "A fast-growing oncology modality" },
    { start: 1, title: "Containing high-potency payloads" },
    { start: 2, title: "Integrated bioconjugation suites" },
  ],
  "targeted-alpha-therapeutics-actinium-theranostics": [
    { start: 0, title: "A new frontier in radiation oncology" },
    { start: 1, title: "How alpha particles target tumors" },
    { start: 2, title: "The half-life logistics bottleneck" },
  ],
  "enzymatic-biocatalysis-green-api-synthesis": [
    { start: 0, title: "Limits of conventional API chemistry" },
    { start: 1, title: "Engineered enzymes in mild conditions" },
    { start: 2, title: "Process and waste reductions" },
  ],
  "ai-pharmacovigilance-automated-signal-detection": [
    { start: 0, title: "Rising adverse event volumes" },
    { start: 1, title: "Automating case intake and coding" },
    { start: 2, title: "Detecting risk signals earlier" },
  ],
  "decentralized-clinical-trials-direct-to-patient-ip": [
    { start: 0, title: "From emergency measure to strategy" },
    { start: 1, title: "The direct-to-patient logistics challenge" },
    { start: 2, title: "What regulators now expect" },
  ],
}
