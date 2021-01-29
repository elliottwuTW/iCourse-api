/**
 * Middleware to do an advanced query to the model and find the result
 * @param {*} model : model to do findAndCountAll query
 * @param {*} include : other model to be included
 * @param {*} flag : to indicate to pass query option out for further execution
 */
const asyncUtil = require('./asyncUtil')
const Op = require('sequelize').Op
const getPagination = require('../utils/getPagination')

const query = (model, include = [], ...flag) => asyncUtil(async (req, res, next) => {
  let queryOption = {}
  console.log('flag: ', flag)

  const reqQuery = { ...req.query }

  // remove fields that are not for where clause
  const removeFields = ['attributes', 'order', 'page', 'limit']
  removeFields.forEach(field => delete reqQuery[field])

  // generate the where object
  // e.g { name: 'abcd', averageCost: { gte: 10000 } }
  //     => { name: 'abcd', averageCost: { [Op.gte]: 10000 } }
  const where = {}
  Object.keys(reqQuery).forEach(queryKey => {
    const queryValue = reqQuery[queryKey]
    if (typeof queryValue !== 'object') {
      where[queryKey] = queryValue
    } else {
      // contains operator object field
      where[queryKey] = {}
      const fieldKeys = Object.keys(queryValue)
      fieldKeys.forEach(fieldKey => {
        const fieldValue = Number(queryValue[fieldKey])
        // handle operators
        switch (fieldKey) {
          case 'gte':
            where[queryKey] = { ...where[queryKey], [Op.gte]: fieldValue }
            break
          case 'gt':
            where[queryKey] = { ...where[queryKey], [Op.gt]: fieldValue }
            break
          case 'lte':
            where[queryKey] = { ...where[queryKey], [Op.lte]: fieldValue }
            break
          case 'lt':
            where[queryKey] = { ...where[queryKey], [Op.lt]: fieldValue }
            break
          default:
            break
        }
      })
    }
  })
  queryOption = { ...queryOption, where }

  // attributes
  // eg. attributes=name,phone
  if (req.query.attributes) {
    const attributes = req.query.attributes.split(',').map(item => item.trim())
    queryOption = { ...queryOption, attributes }
  }

  // order
  // eg. order=-createdAt,+averageCost
  if (!req.query.order) {
    queryOption = { ...queryOption, order: [['createdAt', 'DESC']] }
  } else {
    const orderStrArr = req.query.order.split(',').map(item => item.trim())
    const order = []
    orderStrArr.forEach(orderStr => {
      const isDesc = orderStr.startsWith('-')
      let orderItem
      // clear the sign
      if (isDesc) {
        orderItem = orderStr.substring(1)
      } else {
        orderItem = orderStr.startsWith('+') ? orderStr.substring(1) : orderStr
      }

      order.push((isDesc ? [orderItem, 'DESC'] : [orderItem, 'ASC']))
    })
    queryOption = { ...queryOption, order }
  }

  // pagination
  // eg. page=2&limit=2
  const DEFAULT_PAGE_LIMIT = 3
  const limit = Number(req.query.limit) || DEFAULT_PAGE_LIMIT
  const page = Number(req.query.page) || 1
  const offset = (page - 1) * limit
  queryOption = { ...queryOption, offset, limit }

  // handle the case of different query needs from the same route
  // like: api/v1/courses & api/v1/groups/:groupId/courses
  console.log('req.params: ', req.params)
  if (Object.keys(req.params).length === 0) {
    // reset passed conditions
    include = []
    flag = []
  }
  console.log('flag: ', flag)

  // conclude the option for finder
  const option = {
    // get the result of "count" right
    distinct: true,
    include,
    attributes: {
      exclude: (model.name === 'User') ? ['password'] : []
    },
    // transform into nested object
    nest: (include.length !== 0),
    ...queryOption
  }

  // Execute the finder or pass the query option out
  console.log('flag.length: ', flag.length)
  if (flag.length !== 0) {
    // option for further query
    // page info for pagination
    res.query = { option, page, limit }
    console.log('in query.js, res.query: ', res.query)
  } else {
    // execute the finder
    const { count, rows } = await model.findAndCountAll(option)

    // put into res.queryResult
    res.queryResult = {
      status: 'success',
      pagination: getPagination(page, limit, count),
      count,
      data: rows
    }
  }

  next()
})

module.exports = query
