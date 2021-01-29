const express = require('express')
const router = express.Router({ mergeParams: true })

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// model
const { Group, Course } = require('../../models')

// request handler
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../../controllers/courses')

// middleware
const { protect, permit } = require('../../middleware/auth')
const { ifExist, courseInfoExist, checkCourseName, checkCourseDescr, checkCourseHours, checkCourseTuition, checkValidation } = require('../../middleware/validator')
const query = require('../../middleware/query')

// other routes
const reviewRouter = require('./reviews')
// re-route
router.use('/:id/reviews', reviewRouter)

// route
router.get('/', ifExist(Group), query(Course, {
  include: [{ model: Group, attributes: ['id', 'name', 'description'] }]
}, 'byGroup'), getCourses)

router.get('/:id', ifExist(Course), getCourse)

router.post('/', protect, permit('publisher', 'admin'),
  ifExist(Group), upload.single('photo'), courseInfoExist, checkCourseName, checkCourseDescr, checkCourseHours, checkCourseTuition, checkValidation,
  createCourse)

router.put('/:id', protect, permit('publisher', 'admin'),
  ifExist(Course), upload.single('photo'), checkCourseName, checkCourseDescr, checkCourseHours, checkCourseTuition, checkValidation,
  updateCourse)

router.delete('/:id', protect, permit('publisher', 'admin'),
  ifExist(Course),
  deleteCourse)

module.exports = router
