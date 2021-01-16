const { Group, sequelize } = require('../models')

const asyncUtil = require('../middleware/asyncUtil')

const uploadImage = require('../utils/uploadImage')
const generateGeoPoint = require('../utils/generateGeoPoint')

// @desc      Get all groups
// @route     GET /api/v1/groups
// @access    Public
exports.getGroups = asyncUtil(async (req, res, next) => {
  const groups = await Group.findAll()

  return res.status(200).json({
    status: 'success',
    data: groups
  })
})

// @desc      Get single group
// @route     GET /api/v1/groups/:id
// @access    Public
exports.getGroup = asyncUtil(async (req, res, next) => {
  const group = await Group.findByPk(req.params.id)

  return res.status(200).json({
    status: 'success',
    data: group
  })
})

// @desc      Get groups within an radius
// @route     GET /api/v1/groups/radius/:lat/:long/:radius
// @access    Public
exports.getGroupsInRadius = asyncUtil(async (req, res, next) => {
  const distance = Number(req.params.radius) * 1000
  const currentLocation = generateGeoPoint(req.params.lat, req.params.long)
  const groups = await Group.findAll({
    where: sequelize.where(sequelize.fn('ST_Distance_Sphere', sequelize.col('location'), currentLocation), '<=', distance)
  })

  return res.status(200).json({
    status: 'success',
    data: groups
  })
})

// @desc      Create a new group
// @route     POST /api/v1/groups
// @access    Private
exports.createGroup = asyncUtil(async (req, res, next) => {
  req.body.UserId = req.user.id
  // upload file or not
  if (req.file) {
    const imgURL = await uploadImage(req.file)
    req.body.photo = imgURL.data.link
  } else {
    req.body.photo = null
  }
  const group = await Group.create(req.body)

  return res.status(201).json({
    status: 'success',
    data: group
  })
})

// @desc      Update a group
// @route     PUT /api/v1/groups/:id
// @access    Private
exports.updateGroup = asyncUtil(async (req, res, next) => {
  // upload file or not
  if (req.file) {
    const imgURL = await uploadImage(req.file)
    req.body.photo = imgURL.data.link
  }
  const group = await Group.findByPk(req.params.id)
  // update the instance
  await group.update(req.body)

  return res.status(200).json({
    status: 'success',
    data: group
  })
})

// @desc      Delete a group
// @route     DELETE /api/v1/groups/:id
// @access    Private
exports.deleteGroup = asyncUtil(async (req, res, next) => {
  const group = await Group.findByPk(req.params.id)

  // delete the instance
  await group.destroy()

  return res.status(200).json({
    status: 'success',
    data: {}
  })
})
