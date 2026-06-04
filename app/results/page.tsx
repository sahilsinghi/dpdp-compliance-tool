"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Shield,
  Download,
  FileText,
  RotateCcw,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Info,
} from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import questionsRaw from "@/lib/questions.json"
import type { Question, ScoreResult } from "@/lib/types"
import { loadAssessment, clearAssessment, exportToJson } from "@/lib/storage"
import { computeScore } from "@/lib/scoring"
import { generatePdfReport } from "@/lib/pdf-report"
import { useRouter } from "next/navigation"

const questions = questionsRaw as Question[]

const MATURITY_COLORS: Record<string, string> = {
  Optimized: "#22c55e",
  Mature: "#2563eb",
  Developing: "#f59e0b",
  Basic: "#ef4444",
}

const EFFORT_COLORS: Record<string, string> = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e",
}

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [confirmReset, setConfirmReset] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  useEffect(() => {
    const state = loadAssessment()
    if (!state) {
      router.push("/assessment")
      return
    }
    setCompanyName(state.companyName)
    setResult(computeScore(questions, state.answers))
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Shield className="h-8 w-8 text-blue-600 animate-pulse" />
      </div>
    )
  }

  const maturityOrder = ["Basic", "Developing", "Mature", "Optimized"]
  const overallMaturity =
    result.compositeScore >= 86 ? "Optimized" :
    result.compositeScore >= 66 ? "Mature" :
    result.compositeScore >= 41 ? "Developing" : "Basic"

  const radarData = result.sectionScores.map((ss) => ({
    subject: ss.sectionTitle.split(" ").slice(0, 2).join(" "),
    fullTitle: ss.sectionTitle,
    score: ss.score,
    maturity: ss.maturity,
  }))

  const maturityDistribution = maturityOrder.map((m) => ({
    name: m,
    count: result.sectionScores.filter((ss) => ss.maturity === m).length,
    color: MATURITY_COLORS[m],
  }))

  async function handleDownloadPdf() {
    setGeneratingPdf(true)
    try {
      const state = loadAssessment()
      if (!state) return
      await generatePdfReport(state, result!)
    } finally {
      setGeneratingPdf(false)
    }
  }

  function handleReset() {
    clearAssessment()
    router.push("/")
  }

  const scoreColor =
    result.compositeScore >= 86 ? "text-green-600" :
    result.compositeScore >= 66 ? "text-blue-600" :
    result.compositeScore >= 41 ? "text-amber-600" : "text-red-600"

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/assessment">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Assessment
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              const state = loadAssessment()
              if (state) exportToJson(state)
            }}>
              <Download className="h-3.5 w-3.5 mr-1" /> Export JSON
            </Button>
            <Button size="sm" onClick={handleDownloadPdf} disabled={generatingPdf}>
              <FileText className="h-3.5 w-3.5 mr-1" />
              {generatingPdf ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Score hero */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="sm:col-span-1 border-slate-200 text-center">
            <CardContent className="pt-8 pb-8">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Composite Score</p>
              <p className={`text-6xl font-bold ${scoreColor}`}>{result.compositeScore}</p>
              <p className="text-slate-400 text-sm">/100</p>
              <Badge
                className="mt-3 text-sm"
                style={{ backgroundColor: MATURITY_COLORS[overallMaturity], color: "white" }}
              >
                {overallMaturity}
              </Badge>
              <p className="text-xs text-slate-400 mt-3">
                {result.answeredQuestions}/{result.totalQuestions} questions answered
              </p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-sm">Maturity Distribution</CardTitle>
              <CardDescription className="text-xs">Count of sections at each maturity level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maturityDistribution} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip
                      formatter={(val) => [`${val} section(s)`, ""]}
                      contentStyle={{ fontSize: 11 }}
                    />
                    <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                      {maturityDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Radar chart */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm">Section Maturity Radar</CardTitle>
            <CardDescription className="text-xs">Score (0-100) across all 11 DPDP Act obligation areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#1d3a8a"
                    fill="#1d3a8a"
                    fillOpacity={0.15}
                  />
                  <Tooltip
                    formatter={(val, _, props) => [`${val}% (${props.payload?.maturity})`, props.payload?.fullTitle]}
                    contentStyle={{ fontSize: 11 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Section scores table */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm">Section-by-Section Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.sectionScores.map((ss, i) => (
                <div key={ss.sectionId} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <span className="text-xs text-slate-400 w-4 flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{ss.sectionTitle}</p>
                    <p className="text-xs text-slate-400">{ss.answeredCount}/{ss.totalCount} answered · {ss.naCount} N/A</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-20 bg-slate-100 rounded-full h-1.5 hidden sm:block">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${ss.score}%`,
                          backgroundColor: MATURITY_COLORS[ss.maturity],
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-10 text-right" style={{ color: MATURITY_COLORS[ss.maturity] }}>
                      {ss.score}%
                    </span>
                    <Badge
                      className="text-xs"
                      style={{ backgroundColor: MATURITY_COLORS[ss.maturity] + "20", color: MATURITY_COLORS[ss.maturity], border: `1px solid ${MATURITY_COLORS[ss.maturity]}40` }}
                    >
                      {ss.maturity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top gaps */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Top Priority Gaps & Remediation Roadmap
            </CardTitle>
            <CardDescription className="text-xs">
              Ranked by penalty exposure under the DPDP Schedule. Address High-effort gaps first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result.topGaps.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                <p className="font-medium text-slate-700">No high-priority gaps identified!</p>
                <p className="text-sm text-slate-400 mt-1">All assessed areas are at or above target.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {result.topGaps.map((gap, i) => (
                  <div key={gap.questionId} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs flex items-center justify-center font-medium">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800">{gap.question}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{gap.sectionTitle} · {gap.dpdpCitation}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Badge
                          variant={gap.response === "no" ? "destructive" : "secondary"}
                          className="text-xs capitalize"
                        >
                          {gap.response === "no" ? "Not Done" : "Partial"}
                        </Badge>
                        <span
                          className="text-xs font-medium"
                          style={{ color: EFFORT_COLORS[gap.effort] }}
                        >
                          {gap.effort} effort
                        </span>
                        {gap.penaltyExposure > 0 && (
                          <span className="text-xs text-amber-600">
                            ≤ INR {gap.penaltyExposure}Cr
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-7 bg-blue-50 border border-blue-100 rounded p-2.5 text-xs text-blue-800">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      <span className="font-medium">Action: </span>
                      {gap.remediationGuidance}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Methodology note */}
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-2">
              <Info className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-500 space-y-1">
                <p><span className="font-medium text-slate-600">Scoring: </span>Yes=100% · Partial=50% · No=0% · N/A excluded from denominator</p>
                <p><span className="font-medium text-slate-600">Maturity: </span>Basic (0-40%) · Developing (41-65%) · Mature (66-85%) · Optimized (86-100%)</p>
                <p><span className="font-medium text-slate-600">Composite: </span>Weighted average of section scores. Section weights reflect penalty exposure under the DPDP Schedule (3-10).</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleDownloadPdf} disabled={generatingPdf} className="flex-1 sm:flex-none">
            <FileText className="h-4 w-4 mr-2" />
            {generatingPdf ? "Generating PDF..." : "Download PDF Report"}
          </Button>
          <Button variant="outline" onClick={() => {
            const state = loadAssessment()
            if (state) exportToJson(state)
          }}>
            <Download className="h-4 w-4 mr-2" /> Export JSON
          </Button>
          <Button variant="outline" onClick={() => setConfirmReset(true)} className="text-red-600 border-red-200 hover:bg-red-50 sm:ml-auto">
            <RotateCcw className="h-4 w-4 mr-2" /> Start New Assessment
          </Button>
        </div>

        <p className="text-xs text-slate-400 text-center pb-8">
          This is a self-assessment aid. Not legal advice. Consult a qualified privacy lawyer for binding compliance decisions.
        </p>
      </div>

      {/* Reset confirmation dialog */}
      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a new assessment?</DialogTitle>
            <DialogDescription>
              This will permanently clear your current assessment data from the browser. Make sure to
              download the PDF or export JSON first if you want to keep a copy.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button variant="destructive" onClick={handleReset}>
              Yes, clear and restart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
