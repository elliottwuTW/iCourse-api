/**
 * Middleware to do an advanced query to the model and find the result
 * @param {*} model : model to do findAndCountAll query
 * @param {*} include : other model to be included
 */
const asyncUtil = require('./asyncUtil')
const Op = require('sequelize').Op
const query = (model, include = []) => asyncUtil(async (req, res, next) => {
  let option = {}

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
  option = { ...option, where }

  // attributes
  // eg. attributes=name,phone
  if (req.query.attributes) {
    const attributes = req.query.attributes.split(',').map(item => item.trim())
    option = { ...option, attributes }
  }

  // order
  // eg. order=-createdAt,+averageCost
  if (!req.query.order) {
    option = { ...option, order: [['createdAt', 'DESC']] }
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
    option = { ...option, order }
  }

  // pagination
  // eg. page=2&limit=2
  const DEFAULT_PAGE_LIMIT = 2
  const limit = Number(req.query.limit) || DEFAULT_PAGE_LIMIT
  const page = Number(req.query.page) || 1
  const offset = (page - 1) * limit
  option = { ...option, offset, limit }

  // execute the finder
  const { count, rows } = await model.findAndCountAll({
    // get the result of "count" right
    distinct: true,
    include,
    // transform into nested object
    nest: (include.length !== 0),
    ...option
  })

  // page info
  const pagination = {}
  const totalPages = Math.ceil(count / limit)
  pagination.prev = (page - 1) >= 1 ? (page - 1) : null
  pagination.next = (page + 1) <= totalPages ? (page + 1) : null
  pagination.pages = totalPages

  // put into res.queryResult
  res.queryResult = {
    status: 'success',
    pagination,
    count,
    data: rows
  }

  next()
})

module.exports = query
