'use strict'
const {
  Model
} = require('sequelize')
const geocoder = require('../utils/geocoder')
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Group.hasMany(models.Course)
    }
  }
  Group.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING(150)
    },
    website: DataTypes.STRING,
    phone: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING
    },
    location: DataTypes.GEOMETRY('POINT', 4326),
    averageRating: DataTypes.FLOAT(4),
    averageCost: DataTypes.FLOAT(4),
    photo: DataTypes.STRING,
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      reference: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Group'
  })

  // generate the location field
  Group.beforeSave(async (group) => {
    const geoLocation = await geocoder.geocode(group.address)

    // reassign the address
    group.address = geoLocation[0].formattedAddress

    // location
    const lat = geoLocation[0].latitude
    const long = geoLocation[0].longitude
    group.location = sequelize.literal(`ST_GeomFromText('POINT(${lat} ${long})', 4326)`)
  })

  return Group
}
