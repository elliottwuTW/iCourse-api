'use strict'
const {
  Model
} = require('sequelize')
const geocoder = require('../utils/geocoder')
const generateGeoPoint = require('../utils/generateGeoPoint')
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Group.belongsTo(models.User)
      Group.hasMany(models.Course, { onDelete: 'CASCADE', hooks: true })
      Group.belongsToMany(models.User, {
        through: models.Follow,
        foreignKey: 'GroupId',
        as: 'followers'
      })
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

  // update location of this group
  Group.prototype.updateLocation = async function () {
    // ignore unless the address is modified
    if (!this.changed('address')) {
      return
    }
    const geoLocation = await geocoder.geocode(this.address)
    // reassign the address
    this.address = geoLocation[0].formattedAddress

    // location
    const lat = geoLocation[0].latitude
    const long = geoLocation[0].longitude
    this.location = generateGeoPoint(lat, long)
  }

  Group.beforeSave(async (group) => {
    await group.updateLocation()
  })

  return Group
}
