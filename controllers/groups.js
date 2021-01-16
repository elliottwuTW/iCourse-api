const { Group } = require('../models')

const uploadImage = require('../utils/uploadImage')

// @desc      Get all groups
// @route     GET /api/v1/groups
// @access    Public
exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.findAll()

    return res.status(200).json({
      status: 'success',
      data: groups
    })
  } catch (err) {
    next(err)
  }
}

// @desc      Get single group
// @route     GET /api/v1/groups/:id
// @access    Public
exports.getGroup = async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)

    return res.status(200).json({
      status: 'success',
      data: group
    })
  } catch (err) {
    next(err)
  }
}

// @desc      Create a new group
// @route     POST /api/v1/groups
// @access    Private
exports.createGroup = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err)
  }
}

// @desc      Update a group
// @route     PUT /api/v1/groups/:id
// @access    Private
exports.updateGroup = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err)
  }
}

// @desc      Delete a group
// @route     DELETE /api/v1/groups/:id
// @access    Private
exports.deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)

    // delete the instance
    await group.destroy()

    return res.status(200).json({
      status: 'success',
      data: {}
    })
  } catch (err) {
    next(err)
  }
}
