import { examController, dataStorage } from '../../app'
import {
  DataItem,
  Student,
  StudentInfo,
  Exam,
  ExamInfo,
  ExamResult
} from '../../types'
import { stopServerAndDataStorage, getMockedDataItem } from '../../spec/utils'
import { getRandomFromArray } from '../../utils/utils'

describe('ExamController', () => {
  const dataItems: DataItem[] = []

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

  it('should return all exam IDs', () => {
    const examIds = examController.getIds().sort((a, b) => a - b)

    const expectedExamIds: number[] = [
      ...new Set(dataItems.map((item) => item.exam))
    ].sort((a, b) => a - b)

    expect(examIds).toEqual(expectedExamIds)
  })

  it('should return exam info', () => {
    const sortResults = (results: ExamResult[]) =>
      results.sort((a, b) => a.score - b.score)

    const examId = getRandomFromArray(examController.getIds())
    const dataItem = getMockedDataItem()
    dataItem.exam = examId

    dataStorage.addItem(dataItem)
    dataItems.push(dataItem)

    const examInfo = examController.getExamInfo(examId)
    examInfo.results = sortResults(examInfo.results)

    const expectedResults: ExamResult[] = sortResults([
      ...dataItems
        .filter((item) => item.exam === examId)
        .map((item) => ({ studentId: item.studentId, score: item.score }))
    ])

    const expectedExamInfo: ExamInfo = {
      id: examId,
      results: expectedResults,
      averageScore:
        expectedResults.reduce(
          (acc: number, result: ExamResult) => acc + result.score,
          0
        ) / expectedResults.length
    }

    expect(examInfo).toEqual(expectedExamInfo)
  })

  it('should throw an error if provided exam ID was not found', () => {
    const examId =
      getRandomFromArray(examController.getIds()) +
      getRandomFromArray(examController.getIds())
    const expectedErr = new Error(`Exam with id '${examId}' wasn't found.`)

    expect(() => examController.getExamInfo(examId)).toThrow(expectedErr)
  })
})
