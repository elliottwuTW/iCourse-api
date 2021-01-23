const { Follow } = require('../models')

const asyncUtil = require('../middleware/asyncUtil')

// @desc      Create a follow to group by user
// @route     POST /api/v1/follows/:id
// @access    Protect
exports.createFollow = asyncUtil(async (req, res, next) => {
  await Follow.create({
    UserId: req.user.id,
    GroupId: req.params.id
  })

  return res.status(201).json({
    status: 'success',
    data: {}
  })
})

// @desc      Delete a follow to group by user
// @route     DELETE /api/v1/follows/:id
// @access    Protect
exports.deleteFollow = asyncUtil(async (req, res, next) => {
  await Follow.destroy({
    where: {
      UserId: req.user.id,
      GroupId: req.params.id
    }
  })

  return res.status(200).json({
    status: 'success',
    data: {}
  })
})
