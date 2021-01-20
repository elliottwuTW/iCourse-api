'use strict'
const {
  Model
} = require('sequelize')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      User.hasMany(models.Review)
      User.belongsToMany(models.Course, {
        through: models.Enrollment,
        foreignKey: 'UserId',
        as: 'ownCourses'
      })
    }
  }
  User.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    role: {
      allowNull: false,
      type: DataTypes.ENUM('user', 'publisher')
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    resetPasswordToken: {
      type: DataTypes.STRING
    },
    resetPasswordExpire: {
      type: DataTypes.DATE
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
    modelName: 'User'
  })

  // hash the password
  User.beforeSave(async (user) => {
    // ignore unless the password is modified
    if (!user.changed('password')) {
      return
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
  })

  // compare the password
  User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
  }

  // get jwt token
  User.prototype.getJwtToken = function () {
    const payload = { id: this.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    })

    return token
  }

  // get reset token
  User.prototype.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex')

    // hash the token and store
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    // expires after 10 mins
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
  }

  return User
}
