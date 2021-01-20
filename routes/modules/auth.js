const express = require('express')
const router = express.Router()

// request handlers
const { login, forgotPassword } = require('../../controllers/auth')

// middleware
const { loginInfoExist, checkEmail, checkValidation } = require('../../middleware/validator')

// routes
router.post('/login',
  loginInfoExist, checkEmail, checkValidation,
  login)

router.post('/forgotpassword', checkEmail, checkValidation, forgotPassword)

module.exports = router
