const { User } = require('../models')

const asyncUtil = require('../middleware/asyncUtil')
const ErrorRes = require('../utils/ErrorRes')

exports.login = asyncUtil(async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user) {
    return next(new ErrorRes(404, 'User not found'))
  }
  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return next(new ErrorRes(401, 'Please check your password'))
  }
})
