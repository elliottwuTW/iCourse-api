const express = require('express')
const router = express.Router()

// modules
const users = require('./modules/users')
const groups = require('./modules/groups')
const courses = require('./modules/courses')
const reviews = require('./modules/reviews')

router.use('/users', users)
router.use('/groups', groups)
router.use('/courses', courses)
router.use('/reviews', reviews)

module.exports = router
