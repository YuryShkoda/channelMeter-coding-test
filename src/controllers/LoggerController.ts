import winston, { format } from 'winston'
import expressWinston from 'express-winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { name as appName } from '../../package.json'

export class LoggerController {
  private logFilePrefix = appName

  private transports = [
    new DailyRotateFile({
      zippedArchive: true,
      filename: `${this.logFilePrefix}.%DATE%.log`,
      dirname: './logs',
      maxSize: '512k'
    })
  ]

  constructor() {
    process.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'debug' : 'info',
      format: this.format,
      transports: this.transports
    })
  }

  private get format() {
    const { combine, timestamp, align, printf } = format

    return combine(
      timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
      align(),
      printf(
        (info) =>
          `${info.level.toUpperCase()} | ${this.logFilePrefix} | ${[
            info.timestamp
          ]}: ${info.message}`
      )
    )
  }

  public get expressLogger() {
    return expressWinston.logger({
      transports: this.transports,
      format: this.format,
      meta: false,
      msg: 'HTTP  ',
      expressFormat: true,
      colorize: false
    })
  }
}
