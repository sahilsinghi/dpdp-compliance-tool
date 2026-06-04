"use client"

import { useEffect, useReducer, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Save,
  Download,
  Upload,
  BarChart2,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import questionsRaw from "@/lib/questions.json"
import type { Question, AssessmentState, ResponseOption } from "@/lib/types"
import {
  loadAssessment,
  saveAssessment,
  createFreshState,
  updateAnswer,
  exportToJson,
  importFromJson,
} from "@/lib/storage"

const questions = questionsRaw as Question[]
const SECTIONS = [...new Set(questions.map((q) => q.sectionId))].map((id) => ({
  id,
  title: questions.find((q) => q.sectionId === id)!.sectionTitle,
}))

type Action =
  | { type: "SET_STATE"; payload: AssessmentState }
  | { type: "SET_ANSWER"; questionId: string; response: ResponseOption | null; evidenceNote?: string }
  | { type: "SET_SECTION"; index: number }
  | { type: "SET_COMPANY"; name: string }
  | { type: "SET_ASSESSOR"; name: string }

function reducer(state: AssessmentState, action: Action): AssessmentState {
  switch (action.type) {
    case "SET_STATE":
      return action.payload
    case "SET_ANSWER": {
      const next = updateAnswer(state, action.questionId, {
        response: action.response,
        evidenceNote: action.evidenceNote ?? state.answers[action.questionId]?.evidenceNote ?? "",
      })
      return next
    }
    case "SET_SECTION":
      return { ...state, currentSectionIndex: action.index }
    case "SET_COMPANY":
      return { ...state, companyName: action.name }
    case "SET_ASSESSOR":
      return { ...state, assessorName: action.name }
    default:
      return state
  }
}

export default function AssessmentPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [state, dispatch] = useReducer(reducer, createFreshState())
  const [ready, setReady] = useState(false)
  const [showInfo, setShowInfo] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadAssessment()
    if (saved) {
      dispatch({ type: "SET_STATE", payload: saved })
    }
    setReady(true)
  }, [])

  // Autosave on every state change
  useEffect(() => {
    if (ready) {
      saveAssessment(state)
    }
  }, [state, ready])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Shield className="h-8 w-8 text-blue-600 animate-pulse" />
      </div>
    )
  }

  const currentSection = SECTIONS[state.currentSectionIndex]
  const sectionQuestions = questions.filter((q) => q.sectionId === currentSection.id)
  const totalAnswered = questions.filter((q) => {
    const r = state.answers[q.id]?.response
    return r !== null && r !== undefined
  }).length
  const overallProgress = Math.round((totalAnswered / questions.length) * 100)

  const sectionAnswered = sectionQuestions.filter((q) => {
    const r = state.answers[q.id]?.response
    return r !== null && r !== undefined
  }).length

  function handleFinish() {
    saveAssessment({ ...state, completed: true })
    router.push("/results")
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const imported = await importFromJson(file)
      dispatch({ type: "SET_STATE", payload: imported })
    } catch (err) {
      alert((err as Error).message)
    }
    e.target.value = ""
  }

  const isLastSection = state.currentSectionIndex === SECTIONS.length - 1
  const isFirstSection = state.currentSectionIndex === 0

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Shield className="h-4 w-4 text-blue-700 flex-shrink-0" />
            <span className="text-sm font-medium text-slate-700 truncate hidden sm:block">DPDP Self-Check</span>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="flex items-center gap-2">
              <Progress value={overallProgress} className="h-1.5 flex-1" />
              <span className="text-xs text-slate-500 whitespace-nowrap">{totalAnswered}/{questions.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon-sm" title="Export JSON" onClick={() => exportToJson(state)}>
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Import JSON" onClick={() => fileRef.current?.click()}>
              <Upload className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" title="View Results" onClick={() => router.push("/results")}>
              <BarChart2 className="h-3.5 w-3.5" />
            </Button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* Section navigation sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Sections</p>
              <nav className="space-y-0.5">
                {SECTIONS.map((sec, idx) => {
                  const secQs = questions.filter((q) => q.sectionId === sec.id)
                  const answered = secQs.filter((q) => state.answers[q.id]?.response).length
                  const isActive = idx === state.currentSectionIndex
                  return (
                    <button
                      key={sec.id}
                      onClick={() => dispatch({ type: "SET_SECTION", index: idx })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate">{idx + 1}. {sec.title}</span>
                      {answered === secQs.length ? (
                        <span className="flex-shrink-0 text-green-600 font-bold">✓</span>
                      ) : answered > 0 ? (
                        <span className="flex-shrink-0 text-amber-600 text-[10px]">{answered}/{secQs.length}</span>
                      ) : null}
                    </button>
                  )
                })}
              </nav>

              <Separator className="my-4" />
              <div className="space-y-2 px-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Organisation</p>
                <input
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Company name"
                  value={state.companyName}
                  onChange={(e) => dispatch({ type: "SET_COMPANY", name: e.target.value })}
                />
                <input
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Assessor name"
                  value={state.assessorName}
                  onChange={(e) => dispatch({ type: "SET_ASSESSOR", name: e.target.value })}
                />
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0">
            {/* Section header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  Section {state.currentSectionIndex + 1} of {SECTIONS.length}
                </Badge>
                <span className="text-xs text-slate-500">{sectionAnswered}/{sectionQuestions.length} answered</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">{currentSection.title}</h1>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {sectionQuestions.map((q, qi) => {
                const answer = state.answers[q.id]
                const selected = answer?.response ?? null
                const evidence = answer?.evidenceNote ?? ""
                const isInfoOpen = showInfo === q.id

                return (
                  <Card key={q.id} className={`border transition-all ${selected ? "border-slate-200 shadow-none" : "border-slate-200 shadow-none"}`}>
                    <CardContent className="pt-4 pb-4">
                      <div className="space-y-3">
                        {/* Question header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs flex items-center justify-center font-medium mt-0.5">
                              {qi + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-800 leading-relaxed">{q.question}</p>
                              <button
                                onClick={() => setShowInfo(isInfoOpen ? null : q.id)}
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                              >
                                <Info className="h-3 w-3" />
                                {q.dpdpCitation}
                              </button>
                            </div>
                          </div>
                          {selected && (
                            <Badge
                              variant={
                                selected === "yes" ? "default" :
                                selected === "partial" ? "secondary" :
                                selected === "na" ? "outline" : "destructive"
                              }
                              className="flex-shrink-0 text-xs capitalize"
                            >
                              {selected === "na" ? "N/A" : selected}
                            </Badge>
                          )}
                        </div>

                        {/* Info panel */}
                        {isInfoOpen && (
                          <div className="ml-8 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 space-y-1">
                            <p className="font-medium">{q.dpdpCitation}</p>
                            <p className="leading-relaxed text-blue-700">{q.explanation}</p>
                            {q.penaltyExposure > 0 && (
                              <p className="text-amber-700 font-medium">
                                Penalty exposure: Up to INR {q.penaltyExposure} crore
                              </p>
                            )}
                          </div>
                        )}

                        {/* Radio options */}
                        <RadioGroup
                          value={selected ?? ""}
                          onValueChange={(val: string) =>
                            dispatch({
                              type: "SET_ANSWER",
                              questionId: q.id,
                              response: val as ResponseOption,
                            })
                          }
                          className="ml-8 grid grid-cols-2 sm:grid-cols-4 gap-2"
                        >
                          {(["yes", "partial", "no", "na"] as const).map((opt) => (
                            <label
                              key={opt}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-all ${
                                selected === opt
                                  ? opt === "yes"
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : opt === "partial"
                                    ? "border-amber-500 bg-amber-50 text-amber-700"
                                    : opt === "no"
                                    ? "border-red-400 bg-red-50 text-red-700"
                                    : "border-slate-400 bg-slate-100 text-slate-600"
                                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              <RadioGroupItem value={opt} />
                              <span className="font-medium text-xs capitalize">{opt === "na" ? "N/A" : opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                            </label>
                          ))}
                        </RadioGroup>

                        {/* Evidence note */}
                        {selected && selected !== "na" && (
                          <div className="ml-8">
                            <Textarea
                              placeholder="Optional: add evidence notes (e.g., policy name, document reference, implementation details)..."
                              value={evidence}
                              onChange={(e) =>
                                dispatch({
                                  type: "SET_ANSWER",
                                  questionId: q.id,
                                  response: selected,
                                  evidenceNote: e.target.value,
                                })
                              }
                              className="text-xs resize-none h-16 border-slate-200 focus:ring-blue-400"
                            />
                          </div>
                        )}

                        {/* Remediation hint for No */}
                        {selected === "no" && (
                          <div className="ml-8 bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-700">
                            <span className="font-medium">Remediation: </span>
                            {q.remediationGuidance}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => dispatch({ type: "SET_SECTION", index: state.currentSectionIndex - 1 })}
                disabled={isFirstSection}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => exportToJson(state)} className="hidden sm:flex">
                  <Save className="h-3.5 w-3.5 mr-1" /> Save JSON
                </Button>
                {isLastSection ? (
                  <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
                    View Results <BarChart2 className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={() => dispatch({ type: "SET_SECTION", index: state.currentSectionIndex + 1 })}>
                    Next Section <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
