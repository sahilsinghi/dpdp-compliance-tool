import type { Question, QuestionAnswer, ResponseOption, SectionScore, ScoreResult, MaturityLevel, Gap } from "./types"

const RESPONSE_WEIGHTS: Record<ResponseOption, number> = {
  yes: 1.0,
  partial: 0.5,
  no: 0.0,
  na: -1, // sentinel: excluded from denominator
}

const SECTION_PENALTY_WEIGHTS: Record<string, number> = {
  s1: 3,
  s2: 7,
  s3: 4,
  s4: 7,
  s5: 9,
  s6: 8,
  s7: 5,
  s8: 9,
  s9: 6,
  s10: 4,
  s11: 10,
}

function getMaturity(score: number): MaturityLevel {
  if (score <= 40) return "Basic"
  if (score <= 65) return "Developing"
  if (score <= 85) return "Mature"
  return "Optimized"
}

function getEffortTag(question: Question): "Low" | "Medium" | "High" {
  if (question.penaltyExposure >= 200 || question.weight === 3) return "High"
  if (question.weight === 2) return "Medium"
  return "Low"
}

export function computeSectionScore(
  sectionId: string,
  sectionTitle: string,
  questions: Question[],
  answers: Record<string, QuestionAnswer>
): SectionScore {
  const sectionQuestions = questions.filter((q) => q.sectionId === sectionId)
  let weightedEarned = 0
  let weightedPossible = 0
  let naCount = 0

  for (const q of sectionQuestions) {
    const answer = answers[q.id]
    const response = answer?.response ?? null

    if (response === "na" || response === null) {
      naCount++
      continue
    }

    const responseWeight = RESPONSE_WEIGHTS[response]
    weightedEarned += responseWeight * q.weight
    weightedPossible += q.weight
  }

  const score = weightedPossible > 0 ? Math.round((weightedEarned / weightedPossible) * 100) : 0
  const answeredCount = sectionQuestions.filter((q) => {
    const r = answers[q.id]?.response
    return r !== null && r !== undefined
  }).length

  return {
    sectionId,
    sectionTitle,
    score,
    maturity: getMaturity(score),
    answeredCount,
    totalCount: sectionQuestions.length,
    naCount,
  }
}

export function computeScore(
  questions: Question[],
  answers: Record<string, QuestionAnswer>
): ScoreResult {
  const sectionIds = [...new Set(questions.map((q) => q.sectionId))]
  const sectionTitleMap = Object.fromEntries(questions.map((q) => [q.sectionId, q.sectionTitle]))

  const sectionScores: SectionScore[] = sectionIds.map((id) =>
    computeSectionScore(id, sectionTitleMap[id], questions, answers)
  )

  let weightedSum = 0
  let totalWeight = 0

  for (const ss of sectionScores) {
    const sectionWeight = SECTION_PENALTY_WEIGHTS[ss.sectionId] ?? 5
    const answeredNonNa = ss.answeredCount - ss.naCount
    if (answeredNonNa > 0 || ss.answeredCount > 0) {
      weightedSum += ss.score * sectionWeight
      totalWeight += sectionWeight
    }
  }

  const compositeScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0

  const topGaps = computeTopGaps(questions, answers, 10)

  const answeredQuestions = Object.values(answers).filter(
    (a) => a.response !== null && a.response !== undefined
  ).length

  return {
    compositeScore,
    sectionScores,
    topGaps,
    totalQuestions: questions.length,
    answeredQuestions,
  }
}

export function computeTopGaps(
  questions: Question[],
  answers: Record<string, QuestionAnswer>,
  limit: number
): Gap[] {
  const gaps: Gap[] = []

  for (const q of questions) {
    const answer = answers[q.id]
    const response = answer?.response ?? null

    if (response === "no" || response === "partial") {
      const partialPenalty = response === "partial" ? 0.5 : 1.0
      gaps.push({
        questionId: q.id,
        sectionId: q.sectionId,
        sectionTitle: q.sectionTitle,
        question: q.question,
        response,
        remediationGuidance: q.remediationGuidance,
        dpdpCitation: q.dpdpCitation,
        penaltyExposure: q.penaltyExposure,
        effort: getEffortTag(q),
        priority: q.penaltyExposure * partialPenalty * q.weight,
      })
    }
  }

  gaps.sort((a, b) => b.priority - a.priority || b.penaltyExposure - a.penaltyExposure)

  return gaps.slice(0, limit)
}

export function getSectionWeight(sectionId: string): number {
  return SECTION_PENALTY_WEIGHTS[sectionId] ?? 5
}
