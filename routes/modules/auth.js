const express = require('express')
const router = express.Router()

const { login } = require('../../controllers/auth')

const validator = require('../../middleware/validator')

router.post('/login',
  validator.loginInfoExist,
  validator.userEmailCheck,
  validator.checkValidation,
  login)

module.exports = router
