const express = require('express')
const router = express.Router()

// model
const { Group } = require('../../models')

// middleware
const { protect } = require('../../middleware/auth')
const { ifExist, checkFollowSelf, checkFollowDuplicate, checkFollowExist, checkValidation } = require('../../middleware/validator')

// request handler
const { createFollow, deleteFollow } = require('../../controllers/follows')

// route
router.post('/:id', protect, ifExist(Group), checkFollowSelf, checkFollowDuplicate, checkValidation, createFollow)
router.delete('/:id', protect, ifExist(Group), checkFollowExist, checkValidation, deleteFollow)

module.exports = router
