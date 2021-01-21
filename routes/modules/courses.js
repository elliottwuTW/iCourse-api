const express = require('express')
const router = express.Router({ mergeParams: true })

// model
const { Group, Course } = require('../../models')

// request handler
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../../controllers/courses')

// middleware
const { protect, permit } = require('../../middleware/auth')
const { ifExist, courseInfoExist, checkCourseName, checkCourseDescr, checkCourseHours, checkCourseTuition, checkValidation } = require('../../middleware/validator')
const query = require('../../middleware/query')

// route
router.get('/', ifExist(Group), query(Course, [{ model: Group, attributes: ['id', 'name', 'description'] }], 'byGroup'), getCourses)

router.get('/:id', ifExist(Course), getCourse)

router.post('/', protect, permit('publisher', 'admin'),
  courseInfoExist, checkCourseName, checkCourseDescr, checkCourseHours, checkCourseTuition, checkValidation,
  createCourse)

router.put('/:id', protect, permit('publisher', 'admin'),
  ifExist(Course), checkCourseName, checkCourseDescr, checkCourseHours, checkCourseTuition, checkValidation,
  updateCourse)

router.delete('/:id', protect, permit('publisher', 'admin'),
  ifExist(Course),
  deleteCourse)

module.exports = router
