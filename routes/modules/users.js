const express = require('express')
const router = express.Router()

// model
const { User } = require('../../models')

// middleware
const { protect, permit } = require('../../middleware/auth')
const { ifExist, userInfoExist, passwordExist, checkEmail, checkUserName, checkUserPassword, checkUserRole, checkValidation } = require('../../middleware/validator')
const query = require('../../middleware/query')

// request handler
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../../controllers/users')

// all routes need protected and must be accessed by admin
router.use(protect, permit('admin'))

// route
router.get('/', query(User), getUsers)
router.get('/:id', ifExist(User), getUser)
router.post('/',
  userInfoExist, passwordExist, checkEmail, checkUserName, checkUserPassword, checkUserRole, checkValidation,
  createUser)
router.put('/:id',
  ifExist(User), checkEmail, checkUserName, checkUserPassword, checkUserRole, checkValidation,
  updateUser)
router.delete('/:id', ifExist(User), deleteUser)

module.exports = router
