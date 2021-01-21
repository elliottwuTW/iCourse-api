const express = require('express')
const router = express.Router({ mergeParams: true })

// model
const { Course } = require('../../models')

// request handler
const { createCourse, deleteCourse } = require('../../controllers/courses')

// middleware
const { protect, permit } = require('../../middleware/auth')
const { ifExist, courseInfoExist, checkCourseName, checkCourseDescr, checkCourseHours, checkCourseTuition, checkValidation } = require('../../middleware/validator')

// route
router.post('/', protect, permit('publisher', 'admin'),
  courseInfoExist, checkCourseName, checkCourseDescr, checkCourseHours, checkCourseTuition, checkValidation,
  createCourse)

router.delete('/:id', protect, permit('publisher', 'admin'),
  ifExist(Course),
  deleteCourse)

module.exports = router
