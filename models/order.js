'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Order.belongsTo(models.User)
      Order.belongsToMany(models.Course, {
        through: models.OrderCourse,
        foreignKey: 'OrderId',
        as: 'courses'
      })
    }
  }
  Order.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING
    },
    sn: {
      type: DataTypes.BIGINT
    },
    amount: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    paymentStatus: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: '0'
    },
    orderExpire: {
      allowNull: false,
      type: DataTypes.DATE
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
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
    modelName: 'Order'
  })
  return Order
}
