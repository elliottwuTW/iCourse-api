const express = require('express')
const router = express.Router()

// model
const { Group } = require('../../models')

// middleware
const { protect } = require('../../middleware/auth')
const { ifExist, checkFollowSelf, checkFollowDuplicate, checkFollowExist } = require('../../middleware/validator')

// request handler
const { createFollow, deleteFollow } = require('../../controllers/follows')

// route
router.post('/:id', protect, ifExist(Group), checkFollowSelf, checkFollowDuplicate, createFollow)
router.delete('/:id', protect, ifExist(Group), checkFollowExist, deleteFollow)

module.exports = router
