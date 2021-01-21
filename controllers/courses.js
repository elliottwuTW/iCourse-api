const { Group, Course } = require('../models')

const asyncUtil = require('../middleware/asyncUtil')

const ErrorRes = require('../utils/ErrorRes')

// @desc      Create a new course
// @route     POST /api/v1/groups/:id/courses
// @access    Protect
exports.createCourse = asyncUtil(async (req, res, next) => {
  const group = await Group.findByPk(req.params.id)
  if (!group) {
    return next(new ErrorRes(404, `Group with id ${req.params.id} does not exist`))
  }
  if (req.user.id !== group.UserId && req.user.role !== 'admin') {
    return next(new ErrorRes(403, 'Not authorized to create this course'))
  }

  req.body.GroupId = group.id
  const course = await Course.create(req.body)

  return res.status(201).json({
    status: 'success',
    data: course
  })
})

// @desc      Delete a course
// @route     DELETE /api/v1/courses/:id
// @access    Protect
exports.deleteCourse = asyncUtil(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id, {
    include: { model: Group, attributes: ['UserId'] }
  })
  if (req.user.id !== course.Group.UserId && req.user.role !== 'admin') {
    return next(new ErrorRes(403, 'Not authorized to delete this course'))
  }

  await course.destroy()
  return res.status(200).json({
    status: 'success',
    data: {}
  })
})
