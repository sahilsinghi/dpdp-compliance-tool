export type ResponseOption = "yes" | "partial" | "no" | "na"

export interface Question {
  id: string
  sectionId: string
  sectionTitle: string
  subsection: string
  question: string
  explanation: string
  dpdpCitation: string
  weight: number
  remediationGuidance: string
  penaltyExposure: number
}

export interface QuestionAnswer {
  questionId: string
  response: ResponseOption | null
  evidenceNote: string
}

export interface SectionAnswers {
  [questionId: string]: QuestionAnswer
}

export interface AssessmentState {
  version: "v1"
  companyName: string
  assessorName: string
  startedAt: string
  lastUpdatedAt: string
  answers: { [questionId: string]: QuestionAnswer }
  currentSectionIndex: number
  completed: boolean
}

export type MaturityLevel = "Basic" | "Developing" | "Mature" | "Optimized"

export interface SectionScore {
  sectionId: string
  sectionTitle: string
  score: number
  maturity: MaturityLevel
  answeredCount: number
  totalCount: number
  naCount: number
}

export interface Gap {
  questionId: string
  sectionId: string
  sectionTitle: string
  question: string
  response: ResponseOption
  remediationGuidance: string
  dpdpCitation: string
  penaltyExposure: number
  effort: "Low" | "Medium" | "High"
  priority: number
}

export interface ScoreResult {
  compositeScore: number
  sectionScores: SectionScore[]
  topGaps: Gap[]
  totalQuestions: number
  answeredQuestions: number
}
