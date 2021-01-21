const { User, Course, Review } = require('../models')

const asyncUtil = require('../middleware/asyncUtil')
const getPagination = require('../utils/getPagination')

const ErrorRes = require('../utils/ErrorRes')

// @desc      Get all reviews / Get reviews belonging to a course
// @route     GET /api/v1/reviews
// @route     GET /api/v1/courses/:id/reviews
// @access    Public
exports.getReviews = asyncUtil(async (req, res, next) => {
  if (!req.params.id) {
    // get all reviews
    return res.status(200).json(res.queryResult)
  } else {
    // get reviews belonging to a course
    const query = res.query
    const { count, rows } = await Review.findAndCountAll({
      ...query.option,
      where: {
        ...query.option.where,
        CourseId: req.params.id
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

// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = asyncUtil(async (req, res, next) => {
  const review = await Review.findByPk(req.params.id, {
    include: [
      { model: User, attributes: ['id', 'name'] },
      { model: Course, attributes: ['id', 'name', 'description'] }
    ]
  })

  return res.status(200).json({
    status: 'success',
    data: review
  })
})

// @desc      Create a new review
// @route     POST /api/v1/courses/:id/reviews
// @access    Protect
exports.createReview = asyncUtil(async (req, res, next) => {
  const courseId = req.params.id
  const userId = req.user.id
  const postedReview = await Review.findOne({
    where: {
      CourseId: courseId,
      UserId: userId
    }
  })
  if (postedReview) {
    return next(new ErrorRes(403, `User with id ${userId} has already posted an review with id '${postedReview.id}'`))
  }

  req.body.CourseId = courseId
  req.body.UserId = userId
  const review = await Review.create(req.body)

  return res.status(201).json({
    status: 'success',
    data: review
  })
})

// @desc      Update a review
// @route     PUT /api/v1/reviews/:id
// @access    Protect
exports.updateReview = asyncUtil(async (req, res, next) => {
  const review = await Review.findByPk(req.params.id)
  if (req.user.id !== review.UserId && req.user.role !== 'admin') {
    return next(new ErrorRes(403, 'Not authorized to update this review'))
  }

  await review.update(req.body)

  return res.status(200).json({
    status: 'success',
    data: review
  })
})

// @desc      Delete a review
// @route     DELETE /api/v1/reviews/:id
// @access    Protect
exports.deleteReview = asyncUtil(async (req, res, next) => {
  const review = await Review.findByPk(req.params.id)
  if (req.user.id !== review.UserId && req.user.role !== 'admin') {
    return next(new ErrorRes(403, 'Not authorized to delete this course'))
  }

  await review.destroy()
  return res.status(200).json({
    status: 'success',
    data: {}
  })
})
