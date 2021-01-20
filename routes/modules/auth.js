const express = require('express')
const router = express.Router()

// request handlers
const { register, login, getMe, forgotPassword, resetPassword } = require('../../controllers/auth')

// middleware
const { userInfoExist, loginInfoExist, passwordExist, checkEmail, checkUserPassword, checkValidation, checkUserName, checkUserRole } = require('../../middleware/validator')
const { protect } = require('../../middleware/auth')

// routes
router.get('/me', protect, getMe)
router.post('/register',
  userInfoExist, passwordExist, checkEmail, checkUserName, checkUserPassword, checkUserRole, checkValidation,
  register)
router.post('/login',
  loginInfoExist, checkEmail, checkValidation,
  login)
router.post('/forgotpassword',
  checkEmail, checkValidation,
  forgotPassword)
router.put('/resetpassword/:token',
  passwordExist, checkUserPassword, checkValidation,
  resetPassword)

module.exports = router
