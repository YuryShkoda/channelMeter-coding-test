import { name as appName } from '../../package.json'
import { DataItem } from '../types'
import { dataStorage, stopServer } from '../app'
import { getRandomFromArray } from '../utils/utils'

// INFO: example of matching string: INFO | channelmeter-coding-test | 2022/12/18 15:31:06: 	⚡️ Server is running at http://localhost:5000
export const logBodyRegExp = `\\s\\|\\s${appName}\\s\\|\\s\\d{4}\\/\\d{2}\\/\\d{2}\\s\\d{2}:\\d{2}:\\d{2}:\\s*`

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
