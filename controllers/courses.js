const { Group, Course } = require('../models')

const asyncUtil = require('../middleware/asyncUtil')
const getPagination = require('../utils/getPagination')

const ErrorRes = require('../utils/ErrorRes')

// @desc      Get courses / Get courses belonging to a group
// @route     GET /api/v1/courses
// @route     GET /api/v1/groups/:groupId/courses
// @access    Public
exports.getCourses = asyncUtil(async (req, res, next) => {
  if (!req.params.groupId) {
    // get all courses
    return res.status(200).json({
      status: 'success',
      data: res.queryResult
    })
  } else {
    // get courses belonging to a group
    const groupId = req.params.groupId
    const group = await Group.findByPk(groupId)
    if (!group) {
      return next(new ErrorRes(404, `Group with id ${groupId} does not exist`))
    }

    const query = res.query
    const { count, rows } = await Course.findAndCountAll({
      ...query.option,
      where: {
        ...query.option.where,
        GroupId: groupId
      }
    })
    return res.status(200).json({
      status: 'success',
      pagination: getPagination(query.page, query.limit, count),
      count,
      data: rows
    })
  }
})

// @desc      Create a new course
// @route     POST /api/v1/groups/:groupId/courses
// @access    Protect
exports.createCourse = asyncUtil(async (req, res, next) => {
  const groupId = req.params.groupId
  const group = await Group.findByPk(groupId)
  if (!group) {
    return next(new ErrorRes(404, `Group with id ${groupId} does not exist`))
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
