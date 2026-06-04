# Scoring Methodology

## Question-Level Scoring

Each question is answered with one of four options:

| Response | Score |
|----------|-------|
| Yes      | 100% of question weight |
| Partial  | 50% of question weight |
| No       | 0% of question weight |
| N/A      | Excluded from denominator |

**Section score formula:**

```
section_score = Σ(response_multiplier × question_weight) / Σ(question_weight for non-N/A questions) × 100
```

N/A questions are excluded from both numerator and denominator, so a section where all applicable questions are "yes" scores 100 even if several are "N/A".

## Section Maturity Levels

| Range     | Maturity    | Description |
|-----------|-------------|-------------|
| 0–40%     | Basic       | Significant gaps. Immediate action required. High regulatory risk. |
| 41–65%    | Developing  | Some controls in place. Structured remediation plan needed. |
| 66–85%    | Mature      | Most obligations met. Gaps are specific and addressable. |
| 86–100%   | Optimized   | Comprehensive compliance posture with proactive controls. |

## Composite Score

The composite score is a **penalty-exposure weighted average** of section scores:

```
composite_score = Σ(section_score × section_weight) / Σ(section_weight for assessed sections)
```

### Section Weights

Weights reflect maximum penalty exposure under the DPDP Schedule:

| Section | Weight | Basis |
|---------|--------|-------|
| Security Safeguards (s11) | 10 | Up to INR 250 crore |
| Breach Notification (s8) | 9 | Up to INR 200 crore |
| Children's Data (s5) | 9 | Up to INR 200 crore |
| Significant Data Fiduciary (s6) | 8 | Up to INR 150 crore |
| Notice & Consent (s2) | 7 | Up to INR 50 crore |
| Data Fiduciary Obligations (s4) | 7 | Up to INR 50 crore |
| Cross-Border Transfer (s9) | 6 | Up to INR 50 crore |
| Data Protection Officer (s7) | 5 | Part of SDF obligations |
| Data Principal Rights (s3) | 4 | INR 10,000 per complaint |
| Grievance Redressal (s10) | 4 | INR 10,000 per complaint |
| Applicability & Scope (s1) | 3 | Foundational |

### Trade-off

Weighting by penalty exposure incentivises focus on high-risk areas (Security, Breach, Children's Data) but may understate breadth of compliance. An organisation with perfect Security Safeguards can offset weak Data Principal Rights compliance in the composite score. Always review section-level scores individually alongside the composite.

## Gap Prioritisation

Gaps (No or Partial answers) are ranked by:

1. `penalty_exposure × response_penalty × question_weight`
   - No: full penalty factor (1.0)
   - Partial: half penalty factor (0.5)

The top 10 gaps are surfaced in the results dashboard and PDF report.

## Effort Tags

Each gap is tagged with an effort estimate:

| Effort | Criteria |
|--------|----------|
| High   | Penalty exposure ≥ INR 200 crore OR question weight = 3 |
| Medium | Question weight = 2 |
| Low    | Question weight = 1 |
