import express from 'express'
const EventSource = require('../../eventsource/lib/eventsource.js')

const app = express()
const port = 5000

const server = app.listen(port, () => {
  console.log(`🤖 Server is running at http://localhost:${port}`)
})

const es = new EventSource('http://live-test-scores.herokuapp.com/scores')

es.addEventListener('score', (event: any) => {
  console.log(`🤖[event.data]🤖`, event.data)
})

app.get('/', (_, res) => {
  res.send('Welcome to this awesome API :)')
})

export default server
