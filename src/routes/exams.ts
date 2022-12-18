import express from 'express'
import { examController } from '../app'

const router = express.Router()

// INFO: lists all the exams that have been recorded
router.get('/', (_, res) => {
  res.json(examController.getIds())
})

// INFO: lists all the results for the specified exam, and provides the average score across all students
router.get('/:id', (req, res) => {
  const { id } = req.params

  const examId = parseInt(id)

  if (!examId) res.status(400).send('Please provide valid exam ID.')

  try {
    res.json(examController.getExamInfo(examId))
  } catch (error) {
    res.status(404).send(error)
  }
})

export default router
