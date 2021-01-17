const { body, validationResult } = require('express-validator')
const { User } = require('../models')

const ErrorRes = require('../utils/ErrorRes')

// check the validation result
exports.checkValidation = (req, res, next) => {
  let errors = validationResult(req).errors
  console.log('into check validation')
  console.log('errors: ', errors)
  errors = errors.map(error => error.msg)
  if (errors.length === 0) {
    next()
  } else {
    return next(new ErrorRes(400, errors))
  }
}

// check if the resource exists
exports.ifExist = model => async (req, res, next) => {
  const resource = await model.findByPk(req.params.id)
  if (!resource) {
    return next(new ErrorRes(404, `Resource with id ${req.params.id} does not exist`))
  }
  next()
}

// check if all needed fields of User exist
exports.loginInfoExist = [
  body('email').exists().withMessage('Email is required'),
  body('password').exists().withMessage('Password is required')
]

// check if all needed fields of User exist
exports.userInfoExist = [
  body('name').exists().withMessage('Name is required'),
  body('email').exists().withMessage('Email is required'),
  body('role').exists().withMessage('User role is required'),
  body('password').exists().withMessage('Password is required'),
  body('passwordConfirm').exists().withMessage('Password-confirmation is required')
]

// only check updated field of User
exports.userNameCheck = [
  body('name').trim()
    .optional()
    .isLength({ min: 3, max: 50 }).withMessage('Name length should be between 3 and 50 characters')
]
exports.userEmailCheck = [
  body('email').trim()
    .optional()
    .isEmail().withMessage('Please add a valid email')
]
exports.userEmailInUseCheck = [
  body('email').trim()
    .optional()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { email: value } })
      if (user) {
        throw new ErrorRes(400, 'Email is in use')
      }
      return true
    })
]
exports.userRoleCheck = [
  body('role').trim()
    .optional()
    .isIn(['user', 'publisher']).withMessage('User role can only be user or publisher')
]
exports.userPasswordCheck = [
  body('password').trim()
    .optional()
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirm) {
        throw new ErrorRes(400, 'Password confirmation does not match password')
      }
      return true
    })
]

// check if all needed fields of Group exist
exports.groupInfoExist = [
  body('name').exists().withMessage('Name is required'),
  body('description').exists().withMessage('Description is required'),
  body('website').exists().withMessage('Website is required'),
  body('phone').exists().withMessage('Phone is required'),
  body('email').exists().withMessage('Email is required'),
  body('address').exists().withMessage('Address is required')
]

// only check updated field of Group
exports.groupInfo = [
  body('name').trim()
    .optional()
    .isLength({ min: 3, max: 50 }).withMessage('Name length should be between 3 and 50 characters'),
  body('description').trim()
    .optional()
    .isLength({ max: 250 }).withMessage('Description should not be longer than 250 characters'),
  body('website').trim()
    .optional()
    .matches(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)
    .withMessage('Please use a valid URL with HTTP or HTTPS'),
  body('phone').trim()
    .optional()
    .matches(/^\(?([0-9]{2})\)?[-\s]?([0-9]{3})[-\s]?([0-9]{4,5})$/).withMessage('Phone format is not allowed'),
  body('email').trim()
    .optional()
    .isEmail().withMessage('Please add a valid email')
]

// check if all needed fields of Course exist
exports.courseInfoExist = [
  body('name').exists().withMessage('Name is required'),
  body('description').exists().withMessage('Description is required'),
  body('hours').exists().withMessage('Course duration is required'),
  body('tuition').exists().withMessage('Tuition is required')
]

// only check updated field of Course
exports.courseInfo = [
  body('name').trim()
    .optional()
    .isLength({ min: 3, max: 50 }).withMessage('Name length should be between 3 and 50 characters'),
  body('description').trim()
    .optional()
    .isLength({ max: 250 }).withMessage('Description should not be longer than 250 characters'),
  body('hours').trim()
    .optional()
    .isInt().withMessage('Course duration must be integer'),
  body('tuition').trim()
    .optional()
    .isInt().withMessage('Tuition must be integer')
]

// check if all needed fields of Review exist
exports.reviewInfoExist = [
  body('title').exists().withMessage('Title is required'),
  body('rating').exists().withMessage('Rating is required')
]

// only check updated field of Review
exports.reviewInfo = [
  body('title').trim()
    .optional()
    .isLength({ max: 100 }).withMessage('Title should not be longer than 100 characters'),
  body('text').trim()
    .optional()
    .isLength({ max: 250 }).withMessage('Description should not be longer than 250 characters'),
  body('rating').trim()
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Please add a rating between 1 and 10')
]
