const express = require('express')
const router = express.Router({ mergeParams: true })

// model
const { User, Order, Course } = require('../../models')

// middleware
const { protect } = require('../../middleware/auth')
const { ifExist, orderInfoExist, checkPhone, checkOrderAmount, checkOrderCourseInfoString, checkValidation } = require('../../middleware/validator')
const query = require('../../middleware/query')

// request handler
const { getOrders, getOrder, createOrder, cancelOrder } = require('../../controllers/orders')

// route
router.get('/', protect, ifExist(User), query(Order, {
  include: [
    { model: Course, as: 'courses', attributes: ['id', 'name'] }
  ]
}, 'byUser'), getOrders)
router.get('/:id', protect, ifExist(Order), getOrder)
router.post('/', protect,
  orderInfoExist, checkPhone, checkOrderAmount, checkOrderCourseInfoString, checkValidation,
  createOrder)
router.put('/:id/cancel', protect, ifExist(Order), cancelOrder)

module.exports = router
