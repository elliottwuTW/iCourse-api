const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
require('colors')
const cors = require('cors')

const routes = require('./routes/index')
const errorHandler = require('./middleware/error')

dotenv.config()

const app = express()
const PORT = process.env.PORT

// Develop logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Cors
app.use(cors())

// Parse data
app.use(express.json())

// Static data
app.use(express.static('public'))

// Route
app.use('/api/v1', routes)

// Error handler
app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})

// Unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection caught: ${err.message}`.red.bold)
  server.close(() => process.exit(1))
})
