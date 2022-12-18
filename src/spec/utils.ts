import { name as appName } from '../../package.json'
import { DataItem } from '../types'
import { dataStorage, stopServer } from '../app'
import { getRandomFromArray } from '../utils/utils'
export const getMockedDataItem = (): DataItem => {
  const examIds = [1000, 1001, 1002, 1003, 10004]

  return {
    studentId: 'Rogers_Harvey_' + Math.random(),
    exam: getRandomFromArray(examIds),
    score: Math.random()
  }
}

export const stopServerAndDataStorage = () => {
  dataStorage.closeEventSource()

  stopServer()
}
