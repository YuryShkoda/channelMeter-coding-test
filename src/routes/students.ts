import express from 'express'
import { studentController } from '../app'

const router = express.Router()

// INFO: lists all users that have received at least one test score
router.get('/', (_, res) => {
  res.json(studentController.getIds())
})

// INFO: lists the test results for the specified student, and provides the student's average score across all exams
router.get('/:id', (req, res) => {
  const { id } = req.params

  // TODO: implement validation
  // if (!id) res.status(400).send('Please provide valid student ID.')

  try {
    res.send(studentController.getStudentInfo(id))
  } catch (error: any) {
    res.status(404).send(error)
  }
})

export default router
