'use strict'
const {
  Model
} = require('sequelize')

const sendEmail = require('../utils/sendEmail')

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

  // notify user payment is finished
  Order.prototype.notifyUserPayment = async function () {
    await sendEmail({
      email: this.User.email,
      subject: 'Successful payment in iCourse',
      html: `
      <b> Welcome, ${this.User.name}! <b>
      <br><br>
      <b> You have successfully paid the order ${this.sn}. <b>
      <br><br>
      <b> Enjoy the course. <b>
      `
    })
  }

  // user enroll in the course
  Order.prototype.enrollUserCourse = async function () {
    // the courses contained in this order
    const courses = this.courses
    await Promise.all(courses.map(course => sequelize.models.Enrollment.create({
      UserId: this.UserId,
      CourseId: course.id
    })))
  }

  // hooks
  Order.afterSave(async (order) => {
    const orderPreStatus = order._previousDataValues.paymentStatus
    const orderPostStatus = order.paymentStatus
    // order has been paid
    if (orderPreStatus === '0' && orderPostStatus === '1') {
      await order.notifyUserPayment()
      await order.enrollUserCourse()
    }
  })

  return Order
}
