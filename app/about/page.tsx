import Link from "next/link"
import { Shield, ArrowLeft, Lock, Scale, BarChart2, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const sectionWeights = [
    { id: "s11", title: "Security Safeguards", weight: 10, penalty: "Up to INR 250 crore", section: "Section 8(5)" },
    { id: "s8", title: "Breach Notification", weight: 9, penalty: "Up to INR 200 crore", section: "Section 8(6)" },
    { id: "s5", title: "Children's Data", weight: 9, penalty: "Up to INR 200 crore", section: "Section 9" },
    { id: "s6", title: "Significant Data Fiduciary", weight: 8, penalty: "Up to INR 150 crore", section: "Section 10" },
    { id: "s2", title: "Notice & Consent", weight: 7, penalty: "Up to INR 50 crore", section: "Sections 5-7" },
    { id: "s4", title: "Data Fiduciary Obligations", weight: 7, penalty: "Up to INR 50 crore", section: "Section 8" },
    { id: "s9", title: "Cross-Border Transfer", weight: 6, penalty: "Up to INR 50 crore", section: "Section 16" },
    { id: "s7", title: "Data Protection Officer", weight: 5, penalty: "Part of SDF obligations", section: "Section 10(2)(b)" },
    { id: "s3", title: "Data Principal Rights", weight: 4, penalty: "INR 10,000 per complaint", section: "Sections 11-14" },
    { id: "s10", title: "Grievance Redressal", weight: 4, penalty: "INR 10,000 per complaint", section: "Section 13" },
    { id: "s1", title: "Applicability & Scope", weight: 3, penalty: "Foundational — enables all other obligations", section: "Sections 2-3" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-700" />
            <span className="font-semibold text-slate-800 text-sm">DPDP Self-Check — Methodology</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Scoring Methodology</h1>
          <p className="text-slate-500 leading-relaxed">
            How DPDP Self-Check translates your answers into a compliance score, maturity rating, and gap analysis.
          </p>
        </div>

        {/* Question-level scoring */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart2 className="h-4 w-4 text-blue-600" />
              Question-Level Scoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <p>Each question has a <strong>weight (1–3)</strong> and a <strong>response multiplier</strong>:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Yes", value: "100%", color: "text-green-700 bg-green-50 border-green-200" },
                { label: "Partial", value: "50%", color: "text-amber-700 bg-amber-50 border-amber-200" },
                { label: "No", value: "0%", color: "text-red-700 bg-red-50 border-red-200" },
                { label: "N/A", value: "Excluded", color: "text-slate-600 bg-slate-50 border-slate-200" },
              ].map((r) => (
                <div key={r.label} className={`border rounded-lg p-3 text-center ${r.color}`}>
                  <p className="font-bold text-lg">{r.value}</p>
                  <p className="text-xs font-medium">{r.label}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600">
              Section score = <code className="bg-slate-100 px-1 rounded">Σ(response_multiplier × question_weight) / Σ(question_weight for non-N/A questions) × 100</code>.
              N/A answers are excluded from both numerator and denominator.
            </p>
          </CardContent>
        </Card>

        {/* Maturity levels */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Scale className="h-4 w-4 text-blue-600" />
              Maturity Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  level: "Basic",
                  range: "0–40%",
                  color: "bg-red-50 border-red-200 text-red-800",
                  dot: "bg-red-500",
                  desc: "Significant gaps. The organisation lacks fundamental controls for most obligations. Immediate action required. High regulatory risk.",
                },
                {
                  level: "Developing",
                  range: "41–65%",
                  color: "bg-amber-50 border-amber-200 text-amber-800",
                  dot: "bg-amber-500",
                  desc: "Some controls are in place but coverage is inconsistent. Key obligations are partially met. A structured remediation plan is needed.",
                },
                {
                  level: "Mature",
                  range: "66–85%",
                  color: "bg-blue-50 border-blue-200 text-blue-800",
                  dot: "bg-blue-500",
                  desc: "Most obligations are met with documented controls. Gaps are specific and addressable. Organisation can demonstrate compliance readiness to auditors.",
                },
                {
                  level: "Optimized",
                  range: "86–100%",
                  color: "bg-green-50 border-green-200 text-green-800",
                  dot: "bg-green-500",
                  desc: "Comprehensive compliance posture with proactive controls. Suitable for presenting to a DPO, external auditor, or the Data Protection Board.",
                },
              ].map((m) => (
                <div key={m.level} className={`border rounded-lg p-4 ${m.color}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${m.dot}`} />
                    <span className="font-semibold text-sm">{m.level}</span>
                    <span className="text-xs opacity-70">{m.range}</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-80">{m.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Composite score weights */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Scale className="h-4 w-4 text-blue-600" />
              Composite Score — Penalty-Weighted Sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              The composite score is a <strong>penalty-exposure weighted average</strong> of section scores.
              Sections that carry higher penalties under the DPDP Schedule have greater weight in the composite,
              so fixing the most consequential gaps has the most impact on your score.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-700">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-semibold text-slate-500">Section</th>
                    <th className="pb-2 font-semibold text-slate-500">DPDP Citation</th>
                    <th className="pb-2 font-semibold text-slate-500">Max Penalty</th>
                    <th className="pb-2 font-semibold text-slate-500 text-right">Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sectionWeights.map((sw) => (
                    <tr key={sw.id}>
                      <td className="py-2 font-medium">{sw.title}</td>
                      <td className="py-2 text-slate-500">{sw.section}</td>
                      <td className="py-2 text-amber-700">{sw.penalty}</td>
                      <td className="py-2 text-right font-semibold text-blue-700">{sw.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              <strong>Trade-off:</strong> Weighting by penalty exposure incentivises focus on high-risk areas but may
              understate breadth of compliance. An organisation could score well on Security Safeguards but poorly on
              Grievance Redressal and still get a high composite score. Review section-level scores independently.
            </p>
          </CardContent>
        </Card>

        {/* Privacy architecture */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="h-4 w-4 text-blue-600" />
              Privacy-First Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-3">
            <p>
              The DPDP Act imposes obligations on all Data Fiduciaries processing personal data. It would be
              paradoxical for a DPDP compliance tool to itself violate those principles. DPDP Self-Check is
              designed to model DPDP compliance at the architectural level:
            </p>
            <ul className="space-y-2 list-none">
              {[
                "All assessment data is stored exclusively in your browser's localStorage under the key dpdp_assessment_v1. Nothing is transmitted to any server.",
                "There is no backend, no database, and no API route that processes personal data.",
                "The PDF report is generated entirely client-side using jsPDF. No PDF data passes through a server.",
                "There is no Google Analytics, Plausible, or any other telemetry script loaded by this application.",
                "You can self-host this tool on any static hosting provider by forking the GitHub repo.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-slate-600 text-xs leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500">
              This design directly implements the <strong>data minimisation</strong> and <strong>purpose limitation</strong> principles
              of the DPDP Act — collecting no data beyond what is strictly necessary for the tool to function.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-2">
              <FileText className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Disclaimer & Limitations</p>
                <div className="text-xs text-amber-700 space-y-1.5 leading-relaxed">
                  <p>This tool is a self-assessment aid and does not constitute legal advice. It is not a substitute for a professional privacy audit or the advice of qualified privacy counsel.</p>
                  <p>The DPDP Rules 2025 are being notified in stages. This tool reflects the DPDP Act 2023 and Rules as available in June 2025. Some questions reference pending Rules provisions; compliance obligations in those areas will be confirmed once the Rules are fully notified.</p>
                  <p>This tool does not imply endorsement by MeitY, the Data Protection Board of India, or any government body. "DPDP Self-Check" is an independent third-party tool.</p>
                  <p>Always consult a qualified privacy lawyer before making binding compliance decisions.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center pb-8">
          <Link href="/assessment">
            <Button>Start Your Assessment</Button>
          </Link>
          <p className="text-xs text-slate-400 mt-3">Built by Sahil Singhi · MIT License · github.com/sahilsinghi/dpdp-compliance-tool</p>
        </div>
      </div>
    </div>
  )
}
