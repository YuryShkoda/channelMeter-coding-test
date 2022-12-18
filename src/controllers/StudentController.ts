import { Student, StudentInfo, DataItem, Exam } from '../types'
import { DataStorage } from '../data/DataStorage'

export class StudentController {
  private storage

  constructor(storage: DataStorage) {
    this.storage = storage
  }

  private getData() {
    return this.storage.getItems()
  }

  public getStudents(): Student[] {
    const data = this.getData()

    const studentNames = data.map((item) => item.studentId)

    return studentNames.map((studentName) => ({
      id: studentName,
      exams: [
        ...new Set(
          data
            .filter(
              (item) =>
                item.studentId === studentName && item.score !== undefined
            )
            .map((item) => ({ id: item.exam, score: item.score }))
        )
      ]
    }))
  }

  public getIds() {
    return [...new Set(this.getData().map((item) => item.studentId))]
  }

  public getStudentInfo(id: string): StudentInfo {
    const student = this.getStudents().find((student) => student.id === id)

    if (!student) throw `Student with id '${id}' wasn't found.`

    const studentInfo: StudentInfo = {
      ...student,
      averageScore:
        student.exams.reduce((acc: number, exam: Exam) => acc + exam.score, 0) /
        (student.exams.length || 1)
    }

    return studentInfo
  }
}
