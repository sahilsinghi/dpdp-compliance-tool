# Privacy-First Architecture

## Why Everything Lives in the Browser

The DPDP Act 2023 imposes obligations on all Data Fiduciaries, including obligations around data minimisation, purpose limitation, and security safeguards.

It would be paradoxical for a DPDP compliance tool to itself violate the principles it is designed to help organisations implement.

DPDP Self-Check is architected from first principles to model what DPDP-compliant data handling looks like:

| Principle | Implementation |
|-----------|---------------|
| Data Minimisation | No user data is collected by the tool. The tool has no user accounts, no backend, no analytics. |
| Purpose Limitation | Assessment data is used only to compute your compliance score — nothing else. |
| Storage Limitation | Assessment data is stored only in your browser's localStorage. It is deleted when you click "Start New Assessment" or clear your browser data. |
| Security Safeguards | No network transmission of personal data means no network-based attack surface. |

## What Data Is Collected

**None.**

- No personal information about you or your organisation is transmitted to any server.
- The tool has no backend API.
- The PDF report is generated entirely client-side using jsPDF; no PDF content is transmitted.
- There is no Google Analytics, Plausible, Mixpanel, or any other analytics or telemetry script.
- There are no third-party cookies or tracking pixels.

## Where Your Data Lives

Assessment answers (your responses and evidence notes) are stored in your browser's `localStorage` under the key `dpdp_assessment_v1`. This data:

- Lives exclusively on your device
- Is never sent to any server
- Can be exported as a JSON file for offline storage or sharing with your DPO
- Is cleared when you click "Start New Assessment" or clear your browser's site data

## localStorage Size Constraints

The current assessment scope is well within browser localStorage limits (~5 MB). If future versions add evidence file uploads, those will use IndexedDB to avoid size constraints.

## Self-Hosting

Because the application is 100% static (Next.js static export), you can self-host it on:

- **Vercel** (recommended): `vercel deploy`
- **Netlify**: Deploy from GitHub
- **Cloudflare Pages**: Deploy from GitHub
- **GitHub Pages**: Requires `next.config.ts` output: 'export' (already configured)
- **Any static host**: Run `pnpm build`, deploy the `.next` output

```bash
git clone https://github.com/sahilsinghi/dpdp-compliance-tool
cd dpdp-compliance-tool
pnpm install
pnpm build
pnpm start
```

## Threat Model

Since no data leaves the browser, the primary threat vectors are:

1. **Malicious browser extensions**: Could read localStorage. Mitigation: use a clean browser profile for assessments.
2. **Shared computer access**: If you use a shared device, clear the assessment after use, or export to JSON and delete from the browser.
3. **Screensharing**: If you share your screen while completing the assessment, others can see your answers. Complete the assessment offline or in a private session.

There is no server-side threat surface because there is no server.
