const { body, validationResult } = require('express-validator')
const { Group, Follow } = require('../models')

const ErrorRes = require('../utils/ErrorRes')

// check the validation result
exports.checkValidation = (req, res, next) => {
  let errors = validationResult(req).errors
  errors = errors.map(error => error.msg)
  if (errors.length === 0) {
    next()
  } else {
    return next(new ErrorRes(400, errors))
  }
}

// check if the resource exists
exports.ifExist = model => async (req, res, next) => {
  if (!req.params.id) {
    return next()
  }
  const id = req.params.id
  const resource = await model.findByPk(id)
  if (!resource) {
    return next(new ErrorRes(404, `${model.name} with id ${id} does not exist`))
  }
  next()
}

/**
 * check if all needed fields exist
 */
exports.loginInfoExist = [
  body('email').exists().notEmpty().withMessage('Email is required'),
  body('password').exists().notEmpty().withMessage('Password is required')
]
exports.userInfoExist = [
  body('name').exists().notEmpty().withMessage('Name is required'),
  body('email').exists().notEmpty().withMessage('Email is required'),
  body('role').exists().notEmpty().withMessage('User role is required')
]
exports.passwordExist = [
  body('password').exists().notEmpty().withMessage('Password is required'),
  body('passwordConfirm').exists().notEmpty().withMessage('Password-confirmation is required')
]
exports.groupInfoExist = [
  body('name').exists().notEmpty().withMessage('Name is required'),
  body('description').exists().notEmpty().withMessage('Description is required'),
  body('phone').exists().notEmpty().withMessage('Phone is required'),
  body('email').exists().notEmpty().withMessage('Email is required'),
  body('address').exists().notEmpty().withMessage('Address is required')
]
exports.courseInfoExist = [
  body('name').exists().notEmpty().withMessage('Name is required'),
  body('description').exists().notEmpty().withMessage('Description is required'),
  body('hours').exists().notEmpty().withMessage('Course duration is required'),
  body('tuition').exists().notEmpty().withMessage('Tuition is required')
]
exports.reviewInfoExist = [
  body('title').exists().notEmpty().withMessage('Title is required'),
  body('rating').exists().notEmpty().withMessage('Rating is required')
]

/**
 * check updated fields
 */
exports.checkEmail = [
  body('email').trim()
    .optional()
    .isEmail().withMessage('Please add a valid email')
]
exports.checkUserName = [
  body('name').trim()
    .optional()
    .isLength({ min: 3, max: 50 }).withMessage('Name length should be between 3 and 50 characters')
]
exports.checkUserRole = [
  body('role').trim()
    .optional()
    .isIn(['user', 'publisher']).withMessage('User role can only be user or publisher')
]
exports.checkUserPassword = [
  body('password').trim()
    .optional()
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirm) {
        throw new ErrorRes(400, 'Password confirmation does not match password')
      }
      return true
    })
]
exports.checkGroupName = [
  body('name').trim()
    .optional()
    .isLength({ min: 3, max: 50 }).withMessage('Name length should be between 3 and 50 characters')
]
exports.checkGroupDescr = [
  body('description').trim()
    .optional()
    .isLength({ max: 250 }).withMessage('Description should not be longer than 250 characters')
]
exports.checkGroupWebsite = [
  body('website').trim()
    .optional()
    .matches(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)
    .withMessage('Please use a valid URL with HTTP or HTTPS')
]
exports.checkGroupPhone = [
  body('phone').trim()
    .optional()
    .matches(/^\(?([0-9]{2})\)?[-\s]?([0-9]{3})[-\s]?([0-9]{4,5})$/).withMessage('Phone format is not allowed')
]
exports.checkCourseName = [
  body('name').trim()
    .optional()
    .isLength({ min: 3, max: 50 }).withMessage('Name length should be between 3 and 50 characters')
]
exports.checkCourseDescr = [
  body('description').trim()
    .optional()
    .isLength({ max: 250 }).withMessage('Description should not be longer than 250 characters')
]
exports.checkCourseHours = [
  body('hours').trim()
    .optional()
    .isInt().withMessage('Course duration must be integer')
]
exports.checkCourseTuition = [
  body('tuition').trim()
    .optional()
    .isInt().withMessage('Tuition must be integer')
]
exports.checkReviewTitle = [
  body('title').trim()
    .optional()
    .isLength({ max: 100 }).withMessage('Title should not be longer than 100 characters')
]
exports.checkReviewText = [
  body('text').trim()
    .optional()
    .isLength({ max: 250 }).withMessage('Description should not be longer than 250 characters')
]
exports.checkReviewRating = [
  body('rating').trim()
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Please add a rating between 1 and 10')
]
exports.checkFollowSelf = async (req, res, next) => {
  const group = await Group.findByPk(req.params.id)
  if (req.user.id === group.UserId) {
    return next(new ErrorRes(400, 'User is not allowed to follow owned group'))
  }
  next()
}
exports.checkFollowDuplicate = async (req, res, next) => {
  const group = await Follow.findOne({
    where: {
      UserId: req.user.id,
      GroupId: req.params.id
    }
  })
  if (group) {
    return next(new ErrorRes(400, 'Duplicate follow to the same group'))
  }
  next()
}
exports.checkFollowExist = async (req, res, next) => {
  const group = await Follow.findOne({
    where: {
      UserId: req.user.id,
      GroupId: req.params.id
    }
  })
  if (!group) {
    return next(new ErrorRes(404, 'The follow record is not found'))
  }
  next()
}
