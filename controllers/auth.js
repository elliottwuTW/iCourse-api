const jwt = require('jsonwebtoken')

const { User } = require('../models')
const asyncUtil = require('../middleware/asyncUtil')
const ErrorRes = require('../utils/ErrorRes')

// @desc      User login
// @route     POST /api/v1/auth/login
// @access    Public
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

  // login successfully, send response back with token
  const payload = { id: user.id }
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
  return res.status(200).json({
    status: 'success',
    token
  })
})

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncUtil(async (req, res, next) => {
  // find the current user based on email
  const user = await User.findOne({ where: { email: req.body.email } })
  if (!user) {
    return next(new ErrorRes(404, 'User not found'))
  }

  // get token and save token info into db
  const token = user.getResetPasswordToken()
  await user.save()

  return res.status(200).json({
    status: 'success',
    user
  })
})
