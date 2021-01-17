const jwt = require('jsonwebtoken')

const { User } = require('../models')
const asyncUtil = require('../middleware/asyncUtil')
const ErrorRes = require('../utils/ErrorRes')

exports.protect = asyncUtil(async (req, res, next) => {
  let token
  // parse the token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return next(new ErrorRes(401, 'No authorization to access'))
  }

  // verify
  // to catch the error if the token expires
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findByPk(payload.id)
    next()
  } catch (err) {
    return next(new ErrorRes(401, 'No authorization to access. Please login to get a new token!'))
  }
})
