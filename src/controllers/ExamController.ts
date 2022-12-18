import { ExamInfo, ExamResult, Exam } from '../types'
import { DataStorage } from '../data/DataStorage'

export class ExamController {
  private storage

  constructor(storage: DataStorage) {
    this.storage = storage
  }

  private getData() {
    return this.storage.getItems()
  }

  public getIds() {
    return [...new Set(this.getData().map((item) => item.exam))]
  }

  public getExamInfo(id: number): ExamInfo {
    const results: ExamResult[] = this.getData()
      .filter((item) => item.exam === id)
      .map((item) => ({ studentId: item.studentId, score: item.score }))

    // TODO: create utility
    if (!results.length) throw `Exam with id '${id}' wasn't found.`

    const examInfo: ExamInfo = {
      id,
      results,
      averageScore:
        results.reduce(
          (acc: number, result: ExamResult) => acc + result.score,
          0
        ) / results.length
    }

    return examInfo
  }
}
