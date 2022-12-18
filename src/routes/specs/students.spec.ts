import request from 'supertest'
import app, { dataStorage, studentController } from '../../app'
import { stopServerAndDataStorage, getMockedDataItem } from '../../spec/utils'
import { DataItem, StudentInfo } from '../../types'
import { getRandomFromArray } from '../../utils/utils'

describe('students router', () => {
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
    it('should response with status 200 and list of student IDs on GET request', async () => {
      const sortById = (studentIds: string[]) => {
        studentIds.sort((a, b) => {
          const uniqPartA = a.split('_').pop() as string
          const uniqPartB = b.split('_').pop() as string

          return parseFloat(uniqPartA) - parseFloat(uniqPartB)
        })
      }

      const expectedResponseBody = dataItems.map((item) => item.studentId)

      const result = await request(app).get('/students')

      expect(result.statusCode).toEqual(200)
      expect(sortById(result.body)).toEqual(sortById(expectedResponseBody))
    })
  })

  describe('/:id', () => {
    it('should response with status 200 and student info on GET request', async () => {
      const studentId = getRandomFromArray(dataItems).studentId

      const expectedResponseBody: StudentInfo =
        studentController.getStudentInfo(studentId)

      const result = await request(app).get(`/students/${studentId}`)

      expect(result.statusCode).toEqual(200)
      expect(result.body).toEqual(expectedResponseBody)
    })

    it('should response with status 404 and error message on GET request if student ID was not found', async () => {
      const studentId =
        getRandomFromArray(dataItems).studentId + 'DOES NOT EXIST'

      let expectedResponseText: string = ''
      try {
        studentController.getStudentInfo(studentId)
      } catch (error: any) {
        expectedResponseText = error
      }

      const result = await request(app).get(`/students/${studentId}`)

      expect(result.statusCode).toEqual(404)
      expect(result.text).toEqual(expectedResponseText)
    })
  })
})
