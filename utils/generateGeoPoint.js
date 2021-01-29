module.exports = (lat, long) => {
  const { sequelize } = require('../models')
  return sequelize.literal(`GeomFromText('POINT(${lat} ${long})', 4326)`)
}
