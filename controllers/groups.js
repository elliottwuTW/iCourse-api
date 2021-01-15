const { Group } = require('../models')

// @desc      Get all groups
// @route     GET /api/v1/groups
// @access    Public
exports.getGroups = async (req, res, next) => {
  const groups = await Group.findAll()

  return res.status(200).json({
    status: 'success',
    data: groups
  })
}

// @desc      Get single group
// @route     GET /api/v1/groups/:id
// @access    Public
exports.getGroup = async (req, res, next) => {
  const group = await Group.findByPk(req.params.id)

  return res.status(200).json({
    status: 'success',
    data: group
  })
}

// @desc      Create a new group
// @route     POST /api/v1/groups
// @access    Private
exports.createGroup = async (req, res, next) => {
  req.body.UserId = req.user.id
  const group = await Group.create(req.body)

  return res.status(201).json({
    status: 'success',
    data: group
  })
}

// @desc      Update a group
// @route     PUT /api/v1/groups/:id
// @access    Private
exports.updateGroup = async (req, res, next) => {
  const group = await Group.findByPk(req.params.id)

  // update the instance
  await group.update(req.body)

  return res.status(200).json({
    status: 'success',
    data: group
  })
}

// @desc      Delete a group
// @route     DELETE /api/v1/groups/:id
// @access    Private
exports.deleteGroup = async (req, res, next) => {
  const group = await Group.findByPk(req.params.id)

  // delete the instance
  await group.destroy()

  return res.status(200).json({
    status: 'success',
    data: {}
  })
}
