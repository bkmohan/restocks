const express = require('express')
const cors = require('cors')
const path = require('path');
const logger = require('./utils/logger')
const shoesRouter = require('./controllers/shoes')

const app = express()

app.use(cors())
app.use(express.json())

app.use((request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:', request.path)
    logger.info('Body:', request.body)
    logger.info('---')
    next()
})

app.use('/api/shoes', shoesRouter)


app.use((request, response) => {
    response.status(404).json({ 'error' : 'unknown endpoint' })
})

module.exports = app