module.exports = (err, req, res, next) => {
  return res
    .status(err.statusCode || 500)
    .json({
      status: 'error',
      message: err.message || 'Internal Server Error'
    })
}
