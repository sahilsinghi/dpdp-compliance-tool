"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield, CheckCircle, FileText, Lock, ArrowRight, AlertCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { loadAssessment, clearAssessment } from "@/lib/storage"
import type { AssessmentState } from "@/lib/types"

export default function LandingPage() {
  const [existing, setExisting] = useState<AssessmentState | null>(null)

  useEffect(() => {
    setExisting(loadAssessment())
  }, [])

  function handleClear() {
    clearAssessment()
    setExisting(null)
  }

  const features = [
    {
      icon: <CheckCircle className="h-5 w-5 text-blue-600" />,
      title: "66 Questions, 11 Obligation Areas",
      desc: "Complete coverage of all substantive DPDP Act 2023 obligations, each cited to the exact Act section.",
    },
    {
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      title: "Privacy-First Architecture",
      desc: "All data stays in your browser via localStorage. Zero server-side storage. Zero analytics. Zero third-party scripts.",
    },
    {
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      title: "Downloadable PDF Report",
      desc: "Generate a polished executive compliance report client-side — maturity ratings, gap list, and remediation roadmap.",
    },
    {
      icon: <Lock className="h-5 w-5 text-blue-600" />,
      title: "Weighted by Penalty Exposure",
      desc: "Composite score is weighted by penalty exposure under the DPDP Schedule — up to INR 250 crore for security safeguards.",
    },
  ]

  const sections = [
    "Applicability & Scope",
    "Notice & Consent",
    "Data Principal Rights",
    "Data Fiduciary Obligations",
    "Children's Data",
    "Significant Data Fiduciary",
    "Data Protection Officer",
    "Breach Notification",
    "Cross-Border Transfer",
    "Grievance Redressal",
    "Security Safeguards",
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-700" />
            <span className="font-semibold text-slate-800 text-sm">DPDP Self-Check</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="/about" className="hover:text-blue-700 transition-colors hidden sm:block">Methodology</Link>
            <Link href="/assessment">
              <Button size="sm">Start Assessment</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {existing && (
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <div className="ml-2 flex items-center justify-between w-full flex-wrap gap-3">
              <div>
                <p className="font-medium text-blue-800 text-sm">You have an in-progress assessment</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  {existing.companyName && `${existing.companyName} · `}
                  Last updated {new Date(existing.lastUpdatedAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleClear} className="text-red-600 border-red-200 hover:bg-red-50">
                  <RotateCcw className="h-3.5 w-3.5 mr-1" /> Start fresh
                </Button>
                <Link href="/assessment">
                  <Button size="sm">Resume <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
                </Link>
              </div>
            </div>
          </Alert>
        )}

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200 mb-6">
            <Shield className="h-3.5 w-3.5" />
            India Digital Personal Data Protection Act 2023
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Is your organisation<br />
            <span className="text-blue-700">DPDP-compliant?</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
            A free, privacy-first self-assessment covering all 11 substantive obligation areas of
            India&apos;s Digital Personal Data Protection Act 2023. Get a scored compliance report in under 30 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/assessment">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Assessment <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                How scoring works
              </Button>
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-4">No account required · No data leaves your browser · 100% client-side</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {features.map((f) => (
            <Card key={f.title} className="border-slate-200 shadow-none hover:shadow-sm transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2.5">
                  {f.icon}
                  <CardTitle className="text-sm">{f.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{f.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-16">
          <h2 className="font-semibold text-slate-800 mb-1">What&apos;s covered</h2>
          <p className="text-sm text-slate-500 mb-5">66 questions mapped to all 11 substantive obligation areas of the DPDP Act 2023.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sections.map((s, i) => (
              <div key={s} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-medium">
                  {i + 1}
                </span>
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-semibold mb-1">Disclaimer</p>
          <p className="leading-relaxed text-xs">
            This tool is a self-assessment aid and does not constitute legal advice. It is not a substitute for
            a professional legal audit or advice of qualified privacy counsel. The DPDP Rules 2025 are being
            notified in stages; this tool reflects the DPDP Act 2023 as of June 2025. Always consult a privacy
            lawyer before making binding compliance decisions.
          </p>
        </div>
      </div>

      <footer className="border-t bg-slate-50 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© 2025 Sahil Singhi · MIT License · Last updated June 2025</span>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-slate-600">Methodology</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
