import type { AssessmentState, QuestionAnswer } from "./types"

const STORAGE_KEY = "dpdp_assessment_v1"

export function saveAssessment(state: AssessmentState): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage may be unavailable in private browsing or quota exceeded
  }
}

export function loadAssessment(): AssessmentState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AssessmentState
    if (parsed.version !== "v1") return null
    return parsed
  } catch {
    return null
  }
}

export function clearAssessment(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function createFreshState(companyName = "", assessorName = ""): AssessmentState {
  return {
    version: "v1",
    companyName,
    assessorName,
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    answers: {},
    currentSectionIndex: 0,
    completed: false,
  }
}

export function updateAnswer(
  state: AssessmentState,
  questionId: string,
  answer: Partial<QuestionAnswer>
): AssessmentState {
  const existing = state.answers[questionId] ?? { questionId, response: null, evidenceNote: "" }
  return {
    ...state,
    lastUpdatedAt: new Date().toISOString(),
    answers: {
      ...state.answers,
      [questionId]: { ...existing, ...answer, questionId },
    },
  }
}

export function exportToJson(state: AssessmentState): void {
  const date = new Date().toISOString().split("T")[0]
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `dpdp-assessment-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importFromJson(file: File): Promise<AssessmentState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string) as AssessmentState
        if (parsed.version !== "v1") {
          reject(new Error("Incompatible assessment version"))
          return
        }
        resolve(parsed)
      } catch {
        reject(new Error("Invalid JSON file"))
      }
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsText(file)
  })
}
