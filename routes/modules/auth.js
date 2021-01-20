const express = require('express')
const router = express.Router()

// request handlers
const { login, forgotPassword, resetPassword } = require('../../controllers/auth')

// middleware
const { loginInfoExist, passwordExist, checkEmail, checkUserPassword, checkValidation } = require('../../middleware/validator')

// routes
router.post('/login',
  loginInfoExist, checkEmail, checkValidation,
  login)

router.post('/forgotpassword', checkEmail, checkValidation, forgotPassword)
router.put('/resetpassword/:token', passwordExist, checkUserPassword, checkValidation, resetPassword)

module.exports = router
