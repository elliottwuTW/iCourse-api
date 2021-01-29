const express = require('express')
const router = express.Router({ mergeParams: true })

// model
const { User, Course, Review } = require('../../models')

// middleware
const { protect, permit } = require('../../middleware/auth')
const { ifExist, reviewInfoExist, checkReviewTitle, checkReviewText, checkReviewRating, checkValidation } = require('../../middleware/validator')
const query = require('../../middleware/query')

// request handler
const { getReviews, getReview, createReview, updateReview, deleteReview } = require('../../controllers/reviews')

// route
router.get('/', ifExist(Course),
  query(Review, {
    include: [
      { model: Course, attributes: ['name', 'description'] },
      { model: User, attributes: ['name'] }
    ]
  }, 'byCourse'),
  getReviews)

router.get('/:id', ifExist(Review), getReview)

router.post('/', protect, permit('user', 'admin'),
  ifExist(Course), reviewInfoExist, checkReviewTitle, checkReviewText, checkReviewRating, checkValidation,
  createReview)

router.put('/:id', protect, permit('user', 'admin'),
  ifExist(Review), checkReviewTitle, checkReviewText, checkReviewRating, checkValidation,
  updateReview)

router.delete('/:id', protect, permit('user', 'admin'),
  ifExist(Review),
  deleteReview)

module.exports = router
