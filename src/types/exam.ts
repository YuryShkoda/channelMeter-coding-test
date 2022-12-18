export interface ExamResult {
  studentId: string
  score: number
}

export interface ExamInfo {
  id: number
  results: ExamResult[]
  averageScore: number
}
