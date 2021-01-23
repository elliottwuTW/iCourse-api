const express = require('express')
const router = express.Router()

// modules
const auth = require('./modules/auth')
const users = require('./modules/users')
const groups = require('./modules/groups')
const courses = require('./modules/courses')
const reviews = require('./modules/reviews')
const follows = require('./modules/follows')

router.use('/auth', auth)
router.use('/users', users)
router.use('/groups', groups)
router.use('/courses', courses)
router.use('/reviews', reviews)
router.use('/follows', follows)

module.exports = router
