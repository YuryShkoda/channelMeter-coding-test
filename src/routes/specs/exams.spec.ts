import request from 'supertest'
import app, { dataStorage, examController } from '../../app'
import { stopServerAndDataStorage, getMockedDataItem } from '../../spec/utils'
import { DataItem, Student, StudentInfo, Exam, ExamInfo } from '../../types'
import { getRandomFromArray } from '../../utils/utils'

describe('exams router', () => {
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

  describe('/', () => {
    it('should response with status 200 and list of exam IDs on GET request', async () => {
      const expectedResponseBody = [
        ...new Set(dataItems.map((item) => item.exam))
      ]

      const result = await request(app).get('/exams')

      expect(result.statusCode).toEqual(200)
      expect(result.body.sort((a: number, b: number) => a - b)).toEqual(
        expectedResponseBody.sort((a, b) => a - b)
      )
    })
  })

  describe('/:id', () => {
    it('should response with status 200 and exam info on GET request', async () => {
      const examId = getRandomFromArray(dataItems).exam

      const expectedResponseBody: ExamInfo = examController.getExamInfo(examId)

      const result = await request(app).get(`/exams/${examId}`)

      expect(result.statusCode).toEqual(200)
      expect(result.body).toEqual(expectedResponseBody)
    })

    it('should response with status 400 and error message on GET request if exam ID can not be parsed to integer', async () => {
      const result = await request(app).get(`/exams/NOT VALID`)

      expect(result.statusCode).toEqual(400)
      expect(result.text).toEqual('Please provide valid exam ID.')
    })

    it('should response with status 404 and error message on GET request if exam ID was not found', async () => {
      const examId =
        getRandomFromArray(dataItems).exam + getRandomFromArray(dataItems).exam

      let expectedResponseText: string = ''
      try {
        examController.getExamInfo(examId)
      } catch (error: any) {
        expectedResponseText = error
      }

      const result = await request(app).get(`/exams/${examId}`)

      expect(result.statusCode).toEqual(404)
      expect(result.text).toEqual(expectedResponseText)
    })
  })
})
