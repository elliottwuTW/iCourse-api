const { User } = require('../models')

const asyncUtil = require('../middleware/asyncUtil')

const exclude = ['password']

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Protect - Only for admin
exports.getUsers = asyncUtil(async (req, res, next) => {
  return res.status(200).json(res.queryResult)
})

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Protect - Only for admin
exports.getUser = asyncUtil(async (req, res, next) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude }
  })

  return res.status(200).json({
    status: 'success',
    data: user
  })
})

// @desc      Create a new user
// @route     POST /api/v1/users
// @access    Protect - Only for admin
exports.createUser = asyncUtil(async (req, res, next) => {
  const user = await User.create(req.body, {
    attributes: { exclude }
  })

  return res.status(201).json({
    status: 'success',
    data: user
  })
})

// @desc      Update an user
// @route     PUT /api/v1/users/:id
// @access    Protect - Only for admin
exports.updateUser = asyncUtil(async (req, res, next) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude }
  })
  await user.update(req.body)

  return res.status(200).json({
    status: 'success',
    data: user
  })
})

// @desc      Delete an user
// @route     DELETE /api/v1/users/:id
// @access    Protect - Only for admin
exports.deleteUser = asyncUtil(async (req, res, next) => {
  await User.destroy({ where: { id: req.params.id } })
  return res.status(200).json({
    status: 'success',
    data: {}
  })
})
