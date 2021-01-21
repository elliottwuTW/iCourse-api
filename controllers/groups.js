const { User, Group, Course, sequelize } = require('../models')
const Op = require('sequelize').Op

const asyncUtil = require('../middleware/asyncUtil')

const generateGeoPoint = require('../utils/generateGeoPoint')
const uploadImage = require('../utils/uploadImage')
const getPagination = require('../utils/getPagination')

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
  const query = res.query

  // add geometry constraint
  const distance = Number(req.params.radius) * 1000
  const currentLocation = generateGeoPoint(req.params.lat, req.params.long)
  const option = {
    ...query.option,
    where: {
      [Op.and]: [
        query.option.where,
        sequelize.where(sequelize.fn('ST_Distance_Sphere', sequelize.col('location'), currentLocation), '<=', distance)
      ]
    }
  }

  const { count, rows } = await Group.findAndCountAll(option)

  return res.status(200).json({
    status: 'success',
    pagination: getPagination(query.page, query.limit, count),
    count,
    data: rows
  })
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
    return next(new ErrorRes(403, `User with id ${req.user.id} has already published a group '${publishedGroup.name}'`))
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
    return next(new ErrorRes(403, 'Not authorized to update this group'))
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
    return next(new ErrorRes(403, 'Not authorized to delete this group'))
  }

  // delete the instance
  await group.destroy()

  return res.status(200).json({
    status: 'success',
    data: {}
  })
})
