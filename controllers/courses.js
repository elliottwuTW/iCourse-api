const { Group, Course } = require('../models')

const asyncUtil = require('../middleware/asyncUtil')
const getPagination = require('../utils/getPagination')
const uploadImage = require('../utils/uploadImage')

const ErrorRes = require('../utils/ErrorRes')

// @desc      Get courses / Get courses belonging to a group
// @route     GET /api/v1/courses
// @route     GET /api/v1/groups/:id/courses
// @access    Public
exports.getCourses = asyncUtil(async (req, res, next) => {
  if (!req.params.id) {
    // get all courses
    return res.status(200).json(res.queryResult)
  } else {
    // get courses belonging to a group
    const query = res.query
    const { count, rows } = await Course.findAndCountAll({
      ...query.option,
      where: {
        ...query.option.where,
        GroupId: req.params.id
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

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncUtil(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id, {
    include: [
      { model: Group, attributes: ['id', 'name', 'description', 'UserId'] }
    ]
  })

  return res.status(200).json({
    status: 'success',
    data: course
  })
})

// @desc      Create a new course
// @route     POST /api/v1/groups/:id/courses
// @access    Protect
exports.createCourse = asyncUtil(async (req, res, next) => {
  const group = await Group.findByPk(req.params.id)
  if (req.user.id !== group.UserId && req.user.role !== 'admin') {
    return next(new ErrorRes(403, 'Not authorized to create this course'))
  }

  // upload file or not
  if (req.file) {
    const imgURL = await uploadImage(req.file)
    req.body.photo = imgURL.data.link
  } else {
    req.body.photo = null
  }
  req.body.GroupId = group.id
  const course = await Course.create(req.body)

  return res.status(201).json({
    status: 'success',
    data: course
  })
})

// @desc      Update a course
// @route     PUT /api/v1/courses/:id
// @access    Protect
exports.updateCourse = asyncUtil(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id, {
    include: { model: Group, attributes: ['UserId'] }
  })
  if (req.user.id !== course.Group.UserId && req.user.role !== 'admin') {
    return next(new ErrorRes(403, 'Not authorized to update this course'))
  }

  // upload file or not
  if (req.file) {
    const imgURL = await uploadImage(req.file)
    req.body.photo = imgURL.data.link
  }
  await course.update(req.body)

  return res.status(200).json({
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
