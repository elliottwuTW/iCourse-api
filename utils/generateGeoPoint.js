module.exports = (lat, long) => {
  const { sequelize } = require('../models')
  return sequelize.literal(`ST_GeomFromText('POINT(${lat} ${long})', 4326)`)
}
