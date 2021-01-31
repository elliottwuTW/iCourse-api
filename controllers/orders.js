const { Order, OrderCourse } = require('../models')

const asyncUtil = require('../middleware/asyncUtil')

const getPagination = require('../utils/getPagination')
const ErrorRes = require('../utils/ErrorRes')

// @desc      Get all orders / Get orders belongs to an user
// @route     GET /api/v1/orders
// @access    Protect - Admin Only
// @route     GET /api/v1/users/:id/orders
// @access    Protect
exports.getOrders = asyncUtil(async (req, res, next) => {
  // get all orders
  if (!req.params.id) {
    // admin only
    if (req.user.role !== 'admin') {
      return next(new ErrorRes(403, 'Not authorized to access this route'))
    }

    const result = res.queryResult
    return res.status(200).json(result)
  } else {
    // ownership
    if (String(req.user.id) !== String(req.params.id)) {
      return next(new ErrorRes(403, 'Not authorized to access this route'))
    }

    const query = res.query
    const { count, rows } = await Order.findAndCountAll({
      ...query.option,
      where: {
        ...query.option.where,
        UserId: req.params.id
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

// @desc      Create an order and all courses in the order
// @route     POST /api/v1/orders
// @access    Protect
exports.createOrder = asyncUtil(async (req, res, next) => {
  // order
  const order = await Order.create({
    ...req.body,
    orderExpire: Date.now() + 60 * 1000,
    UserId: req.user.id
  })

  // order items
  const coursesInfo = JSON.parse(req.body.courseInfoString)
  const orderCourses = await Promise.all(Object.keys(coursesInfo).map((key) => OrderCourse.create({
    price: coursesInfo[key],
    CourseId: key,
    OrderId: order.id
  })))

  return res.status(201).json({
    status: 'success',
    data: {
      order,
      courses: orderCourses
    }
  })
})

// @desc      Cancel an order
// @route     PUT /api/v1/orders/:id/cancel
// @access    Protect
exports.cancelOrder = asyncUtil(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id)
  if (req.user.id !== order.UserId && req.user.role !== 'admin') {
    return next(new ErrorRes(403, 'Not authorized to cancel this order'))
  }

  await order.update({ paymentStatus: '-1' })

  return res.status(200).json({
    status: 'success',
    data: order
  })
})
