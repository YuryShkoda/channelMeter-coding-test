import { studentController, dataStorage } from '../../app'
import { stopServerAndDataStorage, getMockedDataItem } from '../../spec/utils'
import { DataItem, Student, StudentInfo, Exam } from '../../types'
import { getRandomFromArray } from '../../utils/utils'

describe('StudentController', () => {
  const dataItems: DataItem[] = []

  const sortByStudentId = (a: string, b: string) =>
    parseFloat(a.split('_').pop() as string) -
    parseFloat(b.split('_').pop() as string)

  beforeAll(() => {
    for (let i = 0; i < 5; i++) {
      const item = getMockedDataItem()

      dataItems.push(item)
      dataStorage.addItem(item)
    }
  })

  afterAll(() => {
    stopServerAndDataStorage()
  })

  it('should return all students', () => {
    const sortStudents = (students: Student[]) =>
      students.sort((a: Student, b: Student) => sortByStudentId(a.id, b.id))

    const students = studentController.getStudents()
    const expectedStudents: Student[] = dataItems.map((item) => ({
      id: item.studentId,
      exams: [{ id: item.exam, score: item.score }]
    }))

    expect(dataItems.length).toEqual(students.length)
    expect(sortStudents(students)).toEqual(sortStudents(expectedStudents))
  })

  it('should return student IDs', () => {
    const studentNames = studentController.getIds()
    const expectedStudentNames: string[] = dataItems.map(
      (item) => item.studentId
    )

    expect(studentNames.sort(sortByStudentId)).toEqual(
      expectedStudentNames.sort(sortByStudentId)
    )
  })

  it('should return student info', () => {
    const student = getRandomFromArray(studentController.getStudents())

    const randomScore = Math.random()

    dataStorage.addItem({
      studentId: student.id,
      exam: student.exams[0].id,
      score: randomScore
    })

    const sortExams = (exams: Exam[]) => exams.sort((a, b) => a.score - b.score)

    const expectedStudentInfo: StudentInfo = {
      id: student.id,
      exams: sortExams([
        ...student.exams,
        { id: student.exams[0].id, score: randomScore }
      ]),
      averageScore:
        (student.exams[0].score + randomScore) / (student.exams.length + 1)
    }

    const studentInfo = studentController.getStudentInfo(student.id)
    studentInfo.exams = sortExams(studentInfo.exams)

    expect(studentInfo).toEqual(expectedStudentInfo)
  })

  it('should return student info that has no exams', () => {
    const dataItem = getMockedDataItem()

    dataStorage.addItem({ studentId: dataItem.studentId } as DataItem)

    const expectedStudentInfo: StudentInfo = {
      id: dataItem.studentId,
      exams: [],
      averageScore: 0
    }

    const studentInfo = studentController.getStudentInfo(dataItem.studentId)

    expect(studentInfo).toEqual(expectedStudentInfo)
  })

  it('should throw an error if provided student ID was not found', () => {
    const studentId = 'DOES NOT EXIST'
    const expectedErr = new Error(
      `Student with id '${studentId}' wasn't found.`
    )

    expect(() => studentController.getStudentInfo(studentId)).toThrow(
      expectedErr
    )
  })
})
