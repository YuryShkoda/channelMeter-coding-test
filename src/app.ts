import Express from 'express'
import { setupRoutes } from './routes/setupRoutes'
import { DataStorage } from './data/DataStorage'
import {
  StudentController,
  ExamController,
  LoggerController
} from './controllers'
import dotenv from 'dotenv'

export const dataStorage = new DataStorage()
export const studentController = new StudentController(dataStorage)
export const examController = new ExamController(dataStorage)

dotenv.config()

const app = Express()
const port = process.env.PORT || 5000

const loggerController = new LoggerController()
app.use(loggerController.expressLogger)

const server = app.listen(port, () => {
  const message = `⚡️ Server is running at http://localhost:${port}`

  process.logger.info(message)
  console.log(message)
})

export const stopServer = () => {
  server.close()
}

export default server
