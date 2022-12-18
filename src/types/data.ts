export interface DataItem {
  studentId: string
  exam: number
  score: number
}

export interface Student {
  id: string
  exams: Exam[]
}

export interface Exam {
  id: number
  score: number
}
