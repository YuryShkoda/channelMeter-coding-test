import request from 'supertest'
import app from '../app'
import { stopServerAndDataStorage } from './utils'

describe('app', () => {
  afterAll(() => {
    stopServerAndDataStorage()
  })

  it('should response with status 200 and welcome message on GET request to / route', async () => {
    const result = await request(app).get('/')

    expect(result.statusCode).toEqual(200)
    expect(result.text).toEqual('Welcome to this awesome API :)')
  })
})
