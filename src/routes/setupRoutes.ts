import { Express } from 'express'
import studentsRouter from './students'
import examsRouter from './exams'
import { authenticate } from '../middleware'

export const setupRoutes = (app: Express) => {
  app.get('/', (_, res) => {
    res.send('Welcome to this awesome API :)')
  })
  app.use('/students', authenticate, studentsRouter) // INFO: just an example of using middleware
  app.use('/exams', examsRouter)
}
