const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')

dotenv.config()

const app = express()
const PORT = process.env.PORT

// Develop logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// Unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection catched: ${err.message}`)
  server.close(() => process.exit(1))
})
