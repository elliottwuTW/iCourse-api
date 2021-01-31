const express = require('express')
const router = express.Router()

// model
const { User } = require('../../models')

// middleware
const { protect, permit } = require('../../middleware/auth')
const { ifExist, userInfoExist, passwordExist, checkEmail, checkUserName, checkUserPassword, checkUserRole, checkValidation } = require('../../middleware/validator')
const query = require('../../middleware/query')

// request handler
const { getUsers, getUser, getFollowGroups, createUser, updateUser, deleteUser } = require('../../controllers/users')

// all routes need protected
router.use(protect)

// other routes
const orderRouter = require('./orders')
// re-route
router.use('/:id/orders', orderRouter)

// route
router.get('/:id/follows', ifExist(User), getFollowGroups)
router.get('/:id', ifExist(User), getUser)
router.get('/', permit('admin'), query(User), getUsers)
router.post('/', permit('admin'),
  userInfoExist, passwordExist, checkEmail, checkUserName, checkUserPassword, checkUserRole, checkValidation,
  createUser)
router.put('/:id', permit('admin'),
  ifExist(User), checkEmail, checkUserName, checkUserPassword, checkUserRole, checkValidation,
  updateUser)
router.delete('/:id', permit('admin'), ifExist(User), deleteUser)

module.exports = router
