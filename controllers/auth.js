const { User } = require('../models')
const Op = require('sequelize').Op
const crypto = require('crypto')

const asyncUtil = require('../middleware/asyncUtil')
const ErrorRes = require('../utils/ErrorRes')
const sendEmail = require('../utils/sendEmail')

// @desc      User register
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncUtil(async (req, res, next) => {
  let user
  user = await User.findOne({ where: { email: req.body.email } })
  if (user) {
    return next(new ErrorRes(400, 'Email is in use'))
  }

  user = await User.create(req.body)
  responseWithToken(res, user)
})

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

  responseWithToken(res, user)
})

// @desc      Get current user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncUtil(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ['id', 'name', 'email']
  })

  return res.status(200).json({
    status: 'success',
    data: user
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

  // send email
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${token}`
    await sendEmail({
      email: user.email,
      subject: 'Reset password instructions for iCourse account',
      html: `
      <b> Someone has requested a link to change your password. <b>
      <br><br>
      You can do this by sending a PUT request to: ${resetURL}
      <br><br>
      The URL expires after 10 minutes.
      `
    })

    return res.status(200).json({
      status: 'success',
      data: 'Email sent'
    })
  } catch (err) {
    console.error(err)

    // reset token info in db
    user.resetPasswordToken = null
    user.resetPasswordExpire = null
    await user.save()

    return next(new ErrorRes(500, 'Email could not be sent'))
  }
})

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:token
// @access    Public
exports.resetPassword = asyncUtil(async (req, res, next) => {
  // find user by hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({
    where: {
      resetPasswordToken,
      resetPasswordExpire: { [Op.gt]: Date.now() }
    }
  })
  if (!user) {
    return next(new ErrorRes(401, 'Invalid token'))
  }

  // reset password and clear resetPasswordToken/Expire fields
  user.password = req.body.password
  user.resetPasswordToken = null
  user.resetPasswordExpire = null
  await user.save()

  responseWithToken(res, user)
})

// login successfully, send response back with token
function responseWithToken (res, user) {
  const token = user.getJwtToken()

  return res.status(200).json({
    status: 'success',
    token
  })
}
