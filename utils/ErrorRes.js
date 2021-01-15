/**
 * Custom error class
 */
class ErrorRes extends Error {
  constructor (statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

module.exports = ErrorRes
