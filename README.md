# DPDP Self-Check

**Live: https://dpdp-compliance-tool.vercel.app**

**India's Digital Personal Data Protection Act 2023 — Free Compliance Self-Assessment Tool**

An interactive Next.js web application that guides organisations through a structured self-assessment of all 11 substantive obligation areas of the DPDP Act 2023. Produces a weighted compliance score, per-section maturity ratings, a top-10 prioritised gap remediation roadmap, and a downloadable PDF executive report — entirely client-side, with no data leaving the browser.

Built by [Sahil Singhi](https://github.com/sahilsinghi).

---

## Definition of Done — Checklist

- [x] Questionnaire covers all 11 substantive sections of the DPDP Act 2023 (66 questions)
- [x] Every question cites the exact DPDP Act section number it derives from
- [x] Composite compliance score and per-section maturity rating compute correctly across edge cases (all yes, all no, mixed partials, N/As)
- [x] PDF report generates client-side without sending data to any server
- [x] Save-and-resume works via localStorage
- [x] JSON export and import works
- [x] Privacy-first: zero server-side storage, zero analytics, zero third-party scripts
- [x] 20 unit tests for scoring engine
- [x] Sample completed assessment for fictional company Acme Health in `/examples/`

---

## What It Does

1. **Multi-step questionnaire** — 66 questions across 11 DPDP Act obligation areas, each citing the exact Act section. Four-option response model: Yes / Partial / No / N/A, with optional evidence notes.

2. **Scoring engine** — Per-section scores with maturity ratings (Basic / Developing / Mature / Optimized). Composite 0-100 score weighted by penalty exposure under the DPDP Schedule.

3. **Gap analysis** — Top-10 highest-priority gaps ranked by penalty exposure (up to INR 250 crore), with remediation guidance and effort tags.

4. **PDF report** — Multi-page executive report generated client-side with cover page, maturity dashboard, gap list, and section-by-section detail.

5. **Save/Resume** — Answers persist in `localStorage`. Close the tab, come back later, pick up where you left off.

6. **JSON Export/Import** — Download your answers as JSON. Re-import on another device or share with your DPO.

---

## DPDP Act Sections Covered

| # | Section | DPDP Act Reference | Penalty Exposure |
|---|---------|-------------------|-----------------|
| 1 | Applicability & Scope | Sections 2, 3, 7, 17 | Foundational |
| 2 | Notice & Consent | Sections 5, 6, 7 | Up to INR 50 crore |
| 3 | Data Principal Rights | Sections 11, 12, 13, 14, 15 | INR 10,000 per complaint |
| 4 | Data Fiduciary Obligations | Section 8(1)–(7) | Up to INR 50 crore |
| 5 | Children's Data | Section 9 | Up to INR 200 crore |
| 6 | Significant Data Fiduciary | Section 10 | Up to INR 150 crore |
| 7 | Data Protection Officer | Section 10(2)(b) | Part of SDF obligations |
| 8 | Breach Notification | Section 8(6) | Up to INR 200 crore |
| 9 | Cross-Border Transfer | Section 16 | Up to INR 50 crore |
| 10 | Grievance Redressal | Section 13 | INR 10,000 per complaint |
| 11 | Security Safeguards | Section 8(5) | Up to INR 250 crore |

---

## Scoring Methodology

See [docs/scoring-methodology.md](docs/scoring-methodology.md) for full detail.

**Summary:**
- Yes = 100%, Partial = 50%, No = 0%, N/A = excluded from denominator
- Section maturity: Basic (0-40) / Developing (41-65) / Mature (66-85) / Optimized (86-100)
- Composite = penalty-exposure weighted average of section scores (weights 3-10)
- Gaps ranked by: penalty exposure × response penalty × question weight

---

## Privacy-First Architecture

See [docs/privacy-architecture.md](docs/privacy-architecture.md) for full detail.

**TL;DR:** All assessment data lives exclusively in your browser's `localStorage`. Nothing is transmitted to any server. No analytics. No telemetry. No third-party scripts. The PDF is generated client-side. This design directly implements the DPDP Act's own data minimisation and purpose limitation principles.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (base-ui v1) |
| Charts | Recharts |
| PDF Generation | jsPDF + jsPDF-AutoTable |
| State | React useReducer + localStorage |
| Testing | Vitest |
| Hosting | Vercel (free tier) |

---

## Local Development

```bash
git clone https://github.com/sahilsinghi/dpdp-compliance-tool
cd dpdp-compliance-tool
pnpm install
pnpm dev
```

Open http://localhost:3000.

```bash
# Run unit tests
pnpm test

# Production build
pnpm build
```

---

## Deployment

**Vercel (recommended):**

1. Fork this repo
2. Import into [vercel.com](https://vercel.com)
3. Deploy — no environment variables required

**Self-hosted static:**

```bash
pnpm build
# Deploy .next/static and out/ to any static host
```

---

## Sample Assessment

See `/examples/` for a completed sample assessment for fictional company **Acme Health Pvt Ltd** — a 2M-user health SaaS company. The JSON file can be imported directly into the tool via the Upload button on the assessment page.

---

## DPDP Rules 2025 Status

The DPDP Rules 2025 are being notified in stages. This tool reflects the DPDP Act 2023 and Rules as of **June 2025**. Questions referencing pending Rules provisions are marked accordingly. The `lib/questions.json` file is the single source of truth — update it as Rules are finalised.

**Last Updated:** June 2025

---

## Disclaimer

This tool is a self-assessment aid and does not constitute legal advice. It is not a substitute for a professional legal audit or advice of qualified privacy counsel. Always consult a qualified privacy lawyer before making binding compliance decisions. This tool is not affiliated with, endorsed by, or approved by MeitY, the Data Protection Board of India, or any government body.

---

## License

MIT © 2025 Sahil Singhi
