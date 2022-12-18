import { logBodyRegExp, stopServerAndDataStorage } from '../../spec/utils'
import winston from 'winston'
import { deleteFolder, readFile, createFile } from '@sasjs/utils'
import path from 'path'
import { name as appName } from '../../../package.json'
import { LoggerController } from '../'

describe('LoggerController', () => {
  const logFolder = './test-logs'
  const logFile: string = path.join(
    logFolder,
    `${appName}.${new Date().getUTCFullYear()}-${
      new Date().getUTCMonth() + 1
    }-${new Date().getUTCDate()}.log`
  )

  beforeAll(async () => {
    await deleteFolder(logFolder)
    await createFile(logFile, '')

    process.logger.configure({
      transports: [
        new winston.transports.File({
          filename: logFile
        })
      ]
    })

    process.logger.info('Initial log')
  })

  afterAll(async () => {
    stopServerAndDataStorage()

    await deleteFolder(logFolder)
  })

  it('should log Info level to file', () => {
    const testInfoLog = 'Test Info log'
    const testErrorLog = 'Test Error log'

    process.logger.on('finish', async () => {
      const log = await readFile(logFile)

      expect(log.length).toBeGreaterThan(0)

      const infoLogRegExp = new RegExp(
        `INFO${logBodyRegExp}${testInfoLog}$`,
        'gm'
      )
      const errorLogRegExp = new RegExp(
        `ERROR${logBodyRegExp}${testErrorLog}\\n$`,
        'g'
      )

      expect(log.match(infoLogRegExp)!.length).toEqual(1)
      expect(log.match(errorLogRegExp)!.length).toEqual(1)
    })
  })

  it(`should set log level to 'debug' in production environment`, () => {
    process.env.NODE_ENV = 'production'

    new LoggerController()

    expect(process.logger.level).toEqual('debug')
  })
})
