const { User, Group, Course } = require('../models')

const asyncUtil = require('../middleware/asyncUtil')

const uploadImage = require('../utils/uploadImage')
const ErrorRes = require('../utils/ErrorRes')

// @desc      Get all groups
// @route     GET /api/v1/groups
// @access    Public
exports.getGroups = asyncUtil(async (req, res, next) => {
  const result = res.queryResult

  return res.status(200).json(result)
})

// @desc      Get groups within an radius
// @route     GET /api/v1/groups/radius/:lat/:long/:radius
// @access    Public
exports.getGroupsInRadius = asyncUtil(async (req, res, next) => {
  const result = res.queryResult

  return res.status(200).json(result)
})

// @desc      Get single group
// @route     GET /api/v1/groups/:id
// @access    Public
exports.getGroup = asyncUtil(async (req, res, next) => {
  const group = await Group.findByPk(req.params.id, {
    include: [
      { model: User, attributes: ['id', 'name', 'email'] },
      { model: Course, attributes: ['id', 'name', 'description', 'hours', 'tuition'] }
    ]
  })

  return res.status(200).json({
    status: 'success',
    data: group
  })
})

// @desc      Create a new group
// @route     POST /api/v1/groups
// @access    Protect
exports.createGroup = asyncUtil(async (req, res, next) => {
  // Only one group founded by one publisher account
  const publishedGroup = await Group.findOne({ where: { UserId: req.user.id } })
  if (publishedGroup && req.user.role !== 'admin') {
    return next(new ErrorRes(400, `User with id ${req.user.id} has already published a group '${publishedGroup.name}'`))
  }

  // upload file or not
  if (req.file) {
    const imgURL = await uploadImage(req.file)
    req.body.photo = imgURL.data.link
  } else {
    req.body.photo = null
  }
  req.body.UserId = req.user.id
  const group = await Group.create(req.body)

  return res.status(201).json({
    status: 'success',
    data: group
  })
})

// @desc      Update a group
// @route     PUT /api/v1/groups/:id
// @access    Protect
exports.updateGroup = asyncUtil(async (req, res, next) => {
  const group = await Group.findByPk(req.params.id)
  if (req.user.id !== group.UserId && req.user.role !== 'admin') {
    return next(new ErrorRes(401, 'Not authorized to update this group'))
  }

  // upload file or not
  if (req.file) {
    const imgURL = await uploadImage(req.file)
    req.body.photo = imgURL.data.link
  }
  // update the instance
  await group.update(req.body)

  return res.status(200).json({
    status: 'success',
    data: group
  })
})

// @desc      Delete a group
// @route     DELETE /api/v1/groups/:id
// @access    Protect
exports.deleteGroup = asyncUtil(async (req, res, next) => {
  const group = await Group.findByPk(req.params.id)
  if (req.user.id !== group.UserId && req.user.role !== 'admin') {
    return next(new ErrorRes(401, 'Not authorized to delete this group'))
  }

  // delete the instance
  await group.destroy()

  return res.status(200).json({
    status: 'success',
    data: {}
  })
})
